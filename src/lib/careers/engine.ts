import { Era } from "../characters/roster";

export interface PlayerStats {
  wisdom: number;
  courage: number;
  compassion: number;
  cunning: number;
  influence: number;
  level: number;
}

export interface FactionIdentity {
  id: string;
  name: string;
  dominantStat: keyof PlayerStats;
  titles: { [era in Era]?: string[] };
  worldView: string;
  emoji: string;
}

export const FACTIONS: FactionIdentity[] = [
  {
    id: "vanguard",
    name: "The Vanguard",
    dominantStat: "courage",
    emoji: "⚔️",
    worldView: "To them, you are a shield against the chaos. A warrior who steps up when others step back.",
    titles: {
      modern: ["Rookie Enforcer", "Security Specialist", "Vanguard Captain", "Apex Protector"],
      medieval: ["Militia Recruit", "Town Guard", "Knight Commander", "Champion of the Realm"],
      wildwest: ["Deputy", "Bounty Hunter", "Gunslinger", "Legend of the West"]
    }
  },
  {
    id: "syndicate",
    name: "The Syndicate",
    dominantStat: "cunning",
    emoji: "🎭",
    worldView: "To them, you are an operator. Someone who sees the angles, bends the rules, and always comes out ahead.",
    titles: {
      modern: ["Street Hustler", "Fixer", "Syndicate Operator", "Ghost"],
      medieval: ["Pickpocket", "Smuggler", "Master Thief", "Shadow Broker"],
      wildwest: ["Card Sharp", "Outlaw", "Train Robber", "Baron of the Badlands"]
    }
  },
  {
    id: "order",
    name: "The Order of Truth",
    dominantStat: "wisdom",
    emoji: "🦉",
    worldView: "To them, you are a seeker of the hidden logic. One who values knowledge above brute force or momentary wealth.",
    titles: {
      modern: ["Research Assistant", "Analyst", "Lead Investigator", "Architect of systems"],
      medieval: ["Acolyte", "Scholar", "Alchemist", "Grand Sage"],
      wildwest: ["Tutor", "Inventor", "Surveyor", "Pioneer of Progress"]
    }
  },
  {
    id: "covenant",
    name: "The Covenant",
    dominantStat: "compassion",
    emoji: "🕊️",
    worldView: "To them, you are the glue that holds society together. You sacrifice your own advantage for the betterment of all.",
    titles: {
      modern: ["Volunteer", "Social Worker", "Community Leader", "Beacon of Hope"],
      medieval: ["Novice Healer", "Cleric", "High Priest", "Saint of the Commons"],
      wildwest: ["Town Doctor", "Preacher", "Peacemaker", "Soul of the Frontier"]
    }
  },
  {
    id: "aristocracy",
    name: "The Aristocracy",
    dominantStat: "influence",
    emoji: "👑",
    worldView: "To them, you are a natural leader. People listen to you, follow you, and throw their lot in with your vision.",
    titles: {
      modern: ["Junior Executive", "Director", "CEO", "Global Visionary"],
      medieval: ["Squire", "Baron", "Duke", "Regent"],
      wildwest: ["Mayor", "Railroad Tycoon", "Governor", "Kingmaker"]
    }
  }
];

export class IdentityEngine {
  /**
   * Derives the player's core identity based on their highest stat.
   * If choices are evenly distributed, defaults to the 'Wanderer' fallback.
   */
  public getIdentity(stats: PlayerStats, era: Era) {
    // Determine the highest stat
    const statKeys: (keyof PlayerStats)[] = ["wisdom", "courage", "compassion", "cunning", "influence"];
    
    let highestStat: keyof PlayerStats = "courage";
    let highestValue = -1;

    // To prevent immediate pigeonholing, we only define a faction if a stat is strongly favored (>12 if base is 10)
    let isDifferentiated = false;

    statKeys.forEach(key => {
      const val = stats[key] || 10;
      if (val > highestValue) {
        highestValue = val;
        highestStat = key;
      }
      if (val > 12) isDifferentiated = true;
    });

    if (!isDifferentiated) {
      return {
        faction: null,
        title: "The Wanderer",
        worldView: "You have yet to define yourself in this world. Your actions have been balanced, offering no clear allegiances.",
        dominantStat: null,
        emoji: "🚶",
        rank: 0,
        nextRankXP: 15
      };
    }

    const faction = FACTIONS.find(f => f.dominantStat === highestStat)!;
    
    // Compute Rank based on the absolute value of the dominant stat
    // 10 is baseline.
    let rankIndex = 0;
    if (highestValue >= 30) rankIndex = 3;
    else if (highestValue >= 22) rankIndex = 2;
    else if (highestValue >= 15) rankIndex = 1;

    const titles = faction.titles[era] || faction.titles.modern!;
    const title = titles[rankIndex];

    // Determine what's needed for the next rank
    const thresholds = [15, 22, 30];
    const nextRankXP = rankIndex < 3 ? thresholds[rankIndex] : null;

    return {
      faction,
      title,
      worldView: faction.worldView,
      dominantStat: highestStat,
      emoji: faction.emoji,
      rank: rankIndex + 1,
      currentStatValue: highestValue,
      nextRankXP
    };
  }

  /**
   * Occasionally a faction will attempt to test the player via a dynamic event if their stat aligns.
   */
  public generateFactionSituation(stats: PlayerStats, era: Era): any | null {
    const identity = this.getIdentity(stats, era);
    if (!identity.faction || identity.rank < 2) return null; // Only established players get faction events

    const f = identity.faction;

    return {
      id: `faction_event_${f.id}_${Date.now()}`,
      title: `${f.name} Requires Your Expertise`,
      description: `A representative of ${f.name} approaches you from the shadows. "We know who you are. ${f.worldView} We have a situation that demands your particular... talent."\n\nThey outline a high-risk task perfectly suited to your "${f.dominantStat}". Do you accept the job?`,
      difficulty: "hard",
      xpReward: Math.floor(Math.random() * 30) + 20,
      shellsReward: Math.floor(Math.random() * 50) + 25,
      educationalNote: "Faction invitations are earned organically based on the trajectory of your choices over time.",
      isFactionEvent: true,
      factionId: f.id,
      choices: [
        { id: "accept", text: "Accept the assignment", hint: `Embrace your identity as a ${identity.title}` },
        { id: "reject", text: "Turn them down", hint: "Maintains independence but forfeits the reward" }
      ]
    };
  }

  public resolveFactionDecision(choiceId: string, factionId: string, stats: PlayerStats): any {
    const f = FACTIONS.find(fac => fac.id === factionId);
    let narrative = "";
    
    // We heavily boost the correlated stat to reinforce the identity loop
    const statChanges: any = {};

    if (choiceId === "accept") {
      narrative = `You completed the task for ${f?.name}. They are pleased, and your standing among them grows. You are truly becoming what they believe you are.`;
      if (f) statChanges[f.dominantStat] = 3; // Massive boost
    } else {
      narrative = `You rejected the offer. The representative nods, disappointed but respectful. "A shame. You were made for this."`;
    }

    return {
      consequences: narrative,
      xpEarned: choiceId === "accept" ? 50 : 10,
      shellsEarned: choiceId === "accept" ? 75 : 0,
      statChanges,
      npcRelChanges: {},
      educationalInsight: "Accepting faction missions solidifies your standing and rapidly accelerates your stat growth in that field."
    };
  }
}

export const identityEngine = new IdentityEngine();
