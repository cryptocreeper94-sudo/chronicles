export type CharacterTrait = 'honorable' | 'greedy' | 'mysterious' | 'pragmatic' | 'idealistic' | 'ruthless' | 'charming' | 'stoic' | 'intellectual' | 'spiritual';

export type Era = 'modern' | 'medieval' | 'wildwest' | 'ancient' | 'future';

export interface CharacterProfession {
  era: Era;
  title: string;
  location: string;
}

export interface CharacterDefinition {
  id: string;
  name: string;
  avatarUrl?: string;
  emoji: string;
  baseTraits: CharacterTrait[];
  crossEraAvailable: boolean;
  primaryEra: Era;
  professions: CharacterProfession[];
  loreSnippet: string;
}

// The Foundational "Slate" of Ecosystem Characters
export const CHARACTER_ROSTER: CharacterDefinition[] = [
  {
    id: "ursula",
    name: "Ursula",
    emoji: "🔮",
    baseTraits: ["spiritual", "mysterious", "intellectual"],
    crossEraAvailable: true,
    primaryEra: "ancient",
    professions: [
      { era: "ancient", title: "Oracle", location: "Temple Ruins" },
      { era: "medieval", title: "Seer", location: "Church Catacombs" },
      { era: "wildwest", title: "Mystic", location: "Outskirts Tent" },
      { era: "modern", title: "Archivist", location: "City Library" }
    ],
    loreSnippet: "A timeless guide who remembers every timeline. She offers spiritual counsel and hints about the true nature of the portal."
  },
  {
    id: "elias",
    name: "Elias",
    emoji: "⚒️",
    baseTraits: ["pragmatic", "stoic", "honorable"],
    crossEraAvailable: true,
    primaryEra: "medieval",
    professions: [
      { era: "medieval", title: "Blacksmith", location: "Town Forge" },
      { era: "wildwest", title: "Gunsmith", location: "Main Street" },
      { era: "modern", title: "Lead Mechanic", location: "Garage" }
    ],
    loreSnippet: "A tradesman who believes in hard work and tangible results over abstract concepts. Always dependable, but skeptical of magic."
  },
  {
    id: "lyra",
    name: "Lyra",
    emoji: "🎭",
    baseTraits: ["charming", "greedy", "pragmatic"],
    crossEraAvailable: true,
    primaryEra: "modern",
    professions: [
      { era: "medieval", title: "Traveling Merchant", location: "Crossroads" },
      { era: "wildwest", title: "Saloon Informant", location: "The Gold Rush Saloon" },
      { era: "modern", title: "Angel Investor", location: "Downtown Heights" }
    ],
    loreSnippet: "Always looking for an angle. She knows everyone and everything, but her information and favors come at a steep price."
  },
  {
    id: "silas",
    name: "Silas",
    emoji: "⚖️",
    baseTraits: ["ruthless", "honorable", "stoic"],
    crossEraAvailable: true,
    primaryEra: "wildwest",
    professions: [
      { era: "medieval", title: "Captain of the Guard", location: "Keep Gates" },
      { era: "wildwest", title: "Sheriff", location: "Town Jail" },
      { era: "modern", title: "Security Chief", location: "Corporate HQ" }
    ],
    loreSnippet: "A man obsessed with order and the exact letter of the law. He struggles with nuance and will aggressively pursue what he views as justice."
  },
  {
    id: "kathy",
    name: "Kathy",
    emoji: "📦",
    baseTraits: ["idealistic", "pragmatic", "charming"],
    crossEraAvailable: true,
    primaryEra: "modern",
    professions: [
      { era: "medieval", title: "Quartermaster", location: "City Docks" },
      { era: "wildwest", title: "Supply Runner", location: "Train Depot" },
      { era: "modern", title: "Logistics Manager", location: "Distribution Center" }
    ],
    loreSnippet: "Determined that the world's supply chains must never fail. Efficient and kind, she is the backbone of whatever community she inhabits."
  }
];

export function getCharacter(id: string): CharacterDefinition | undefined {
  return CHARACTER_ROSTER.find(c => c.id === id);
}

export function getCharactersByEra(era: Era): CharacterDefinition[] {
  return CHARACTER_ROSTER.filter(c => c.crossEraAvailable || c.primaryEra === era);
}

export function getProfessionForEra(character: CharacterDefinition, era: Era): CharacterProfession | null {
  return character.professions.find(p => p.era === era) || null;
}
