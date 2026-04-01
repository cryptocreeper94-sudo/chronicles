import { CharacterDefinition, Era, CHARACTER_ROSTER } from "./roster";

export interface CharacterRelationship {
  characterId: string;
  trustLevel: number; // -100 to 100
  affinity: number; // -100 to 100 (hostile to romantic/best friend)
  interactionsCount: number;
  lastInteractionDate?: string;
  knownLoreUnlocked: number; // Percentage 0-100
  isSpouse?: boolean;
}

export class CharacterEngine {
  private relationships: Record<string, CharacterRelationship> = {};

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const stored = localStorage.getItem("chronicles_relationships");
      if (stored) {
        this.relationships = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not load relationships slate");
    }
  }

  private saveState() {
    try {
      localStorage.setItem("chronicles_relationships", JSON.stringify(this.relationships));
    } catch (e) {
      console.warn("Could not save relationships slate");
    }
  }

  public getRelationship(characterId: string): CharacterRelationship {
    if (!this.relationships[characterId]) {
      this.relationships[characterId] = {
        characterId,
        trustLevel: 0,
        affinity: 0,
        interactionsCount: 0,
        knownLoreUnlocked: 0
      };
      this.saveState();
    }
    return this.relationships[characterId];
  }

  public getAllRelationships(): CharacterRelationship[] {
    return Object.values(this.relationships);
  }

  public updateRelationship(characterId: string, trustDelta: number, affinityDelta: number) {
    const rel = this.getRelationship(characterId);
    rel.trustLevel = Math.max(-100, Math.min(100, rel.trustLevel + trustDelta));
    rel.affinity = Math.max(-100, Math.min(100, rel.affinity + affinityDelta));
    rel.interactionsCount += 1;
    rel.lastInteractionDate = new Date().toISOString();
    
    // Unlock lore as trust builds
    if (rel.trustLevel > 20 && rel.knownLoreUnlocked < 25) rel.knownLoreUnlocked = 25;
    if (rel.trustLevel > 50 && rel.knownLoreUnlocked < 50) rel.knownLoreUnlocked = 50;
    if (rel.trustLevel > 80 && rel.knownLoreUnlocked < 100) rel.knownLoreUnlocked = 100;
    
    this.saveState();
    return rel;
  }

  public getStatusText(trustLevel: number): string {
    if (trustLevel >= 80) return "Ally";
    if (trustLevel >= 40) return "Friend";
    if (trustLevel >= 10) return "Acquaintance";
    if (trustLevel > -10) return "Neutral";
    if (trustLevel > -40) return "Distrustful";
    if (trustLevel > -80) return "Hostile";
    return "Nemesis";
  }

  public generateDailyRumors(era: Era): string[] {
    // Generate a quick rumor about one of the slate characters active in this era
    const activeCharacters = CHARACTER_ROSTER.filter(c => c.crossEraAvailable || c.primaryEra === era);
    if (activeCharacters.length === 0) return [];
    
    const char = activeCharacters[Math.floor(Math.random() * activeCharacters.length)];
    const profession = char.professions.find(p => p.era === era)?.title || "wanderer";
    
    const templates = [
      `I heard ${char.name} the ${profession} is looking for something special.`,
      `People say ${char.name} has been acting strange lately.`,
      `If you need help, ${char.name} might be the one to talk to.`,
      `Watch your back around ${char.name}, always an angle to play.`,
    ];
    
    return [templates[Math.floor(Math.random() * templates.length)]];
  }

  public generateCharacterSituation(era: Era): any | null {
    const activeCharacters = CHARACTER_ROSTER.filter(c => c.crossEraAvailable || c.primaryEra === era);
    if (activeCharacters.length === 0) return null;
    
    const char = activeCharacters[Math.floor(Math.random() * activeCharacters.length)];
    const profession = char.professions.find(p => p.era === era)?.title || "wanderer";
    const rel = this.getRelationship(char.id);

    return {
      id: `char_event_${char.id}_${Date.now()}`,
      title: `${char.name} approaches you`,
      description: `You spot ${char.name}, the local ${profession}. ${
        rel.trustLevel > 20 ? "They wave you over, looking like they trust you with something important." : 
        rel.trustLevel < -20 ? "They glare at you, clearly remembering your past interactions." :
        "They seem to need a hand with something."
      } What do you do?`,
      difficulty: "medium",
      xpReward: Math.floor(Math.random() * 20) + 10,
      shellsReward: Math.floor(Math.random() * 10) + 5,
      educationalNote: "Building relationships with the Key Figures shapes your standing in the era.",
      isCharacterEvent: true,
      characterId: char.id,
      choices: [
        { id: "help", text: "Offer your assistance unconditionally", hint: "Builds trust but might take time" },
        { id: "business", text: "Ask if there is a profit to be made", hint: "Might secure an immediate reward" },
        { id: "ignore", text: "Nod and keep walking", hint: "Avoid entanglement" }
      ]
    };
  }

  public resolveCharacterDecision(choiceId: string, charId: string): any {
    const char = CHARACTER_ROSTER.find(c => c.id === charId);
    let trustDelta = 0;
    let affinityDelta = 0;
    let narrative = "";

    if (choiceId === "help") {
      trustDelta = 5; affinityDelta = 2;
      narrative = `${char?.name} appreciates your selfless help. They will remember this.`;
    } else if (choiceId === "business") {
      trustDelta = -2; affinityDelta = 0;
      narrative = `${char?.name} sighs and tosses you a few coins for your trouble. It was transactional.`;
    } else {
      trustDelta = -5; affinityDelta = -5;
      narrative = `You walked away. ${char?.name} watched you go with narrowed eyes.`;
    }

    this.updateRelationship(charId, trustDelta, affinityDelta);

    return {
      consequences: narrative,
      xpEarned: choiceId !== "ignore" ? 25 : 5,
      shellsEarned: choiceId === "business" ? 15 : choiceId === "help" ? 5 : 0,
      statChanges: { influence: choiceId === "help" ? 1 : 0 },
      npcRelChanges: { [char?.name || "Unknown"]: trustDelta },
      educationalInsight: "Characters in the Roster have long memories. Your reputation precedes you."
    };
  }

  public getSpouse(): CharacterRelationship | null {
    if (!this.relationships) return null;
    return Object.values(this.relationships).find(r => r.isSpouse) || null;
  }

  public proposeMarriage(charId: string): boolean {
    const rel = this.getRelationship(charId);
    if (rel.affinity >= 80 && !this.getSpouse()) {
      if (!this.relationships) this.relationships = {};
      this.relationships[charId] = {
        ...rel,
        isSpouse: true
      };
      this.saveState();
      return true;
    }
    return false;
  }

  public generateRomanceSituation(era: Era): any | null {
    const spouse = this.getSpouse();
    if (!spouse) return null;

    const char = CHARACTER_ROSTER.find(c => c.id === spouse.characterId);
    if (!char) return null;

    const profession = char.professions.find(p => p.era === era)?.title || "wanderer";

    return {
      id: `romance_event_${char.id}_${Date.now()}`,
      title: `A Moment with ${char.name}`,
      description: `Your spouse, ${char.name}, approaches you warmly. Despite the chaos of the ${era} era, they have secured a rare moment of peace for the two of you.\n\n"I brought you something from my work as a ${profession}," they smile, holding out a small token.`,
      difficulty: "easy",
      xpReward: Math.floor(Math.random() * 50) + 20,
      shellsReward: Math.floor(Math.random() * 30) + 15,
      educationalNote: "Building deep relationships yields passive benefits and specialized moments of respite.",
      isRomanceEvent: true,
      characterId: char.id,
      choices: [
        { id: "accept_gift", text: "Accept the gift and spend time together", hint: "Deepens your bond" },
        { id: "rush", text: "Take the gift but explain you are too busy to stay", hint: "Gains the reward but hurts their feelings" }
      ]
    };
  }

  public resolveRomanceDecision(choiceId: string, charId: string): any {
    const char = CHARACTER_ROSTER.find(c => c.id === charId);
    let affinityDelta = 0;
    let narrative = "";

    if (choiceId === "accept_gift") {
      affinityDelta = 2;
      narrative = `You spent a quiet, restorative hour with ${char?.name}. Your Shared Estate flourishes.`;
    } else {
      affinityDelta = -5;
      narrative = `${char?.name} looks disappointed as you rush off, but they understand your ambitions.`;
    }

    this.updateRelationship(charId, 0, affinityDelta);

    return {
      consequences: narrative,
      xpEarned: choiceId === "accept_gift" ? 75 : 25,
      shellsEarned: 25,
      statChanges: { compassion: choiceId === "accept_gift" ? 1 : -1 },
      npcRelChanges: { [char?.name || "Spouse"]: affinityDelta },
      educationalInsight: "Neglecting your spouse for the sake of progression will eventually erode the relationship."
    };
  }
}

export const characterEngine = new CharacterEngine();
