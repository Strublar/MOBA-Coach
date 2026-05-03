export interface HeroTemplate {
  id: string
  name: string
  archetype: 'tank' | 'mage' | 'assassin' | 'support' | 'marksman'
  baseHp: number
  baseDamage: number
  moveSpeed: number
  skillId: string
  ultimateId: string
}

export const HERO_TEMPLATES: HeroTemplate[] = [
  {
    id: 'ironclad',
    name: 'Ironclad',
    archetype: 'tank',
    baseHp: 1200,
    baseDamage: 45,
    moveSpeed: 200,
    skillId: 'ironclad_skill',
    ultimateId: 'ironclad_ult',
  },
  {
    id: 'stormcaller',
    name: 'Stormcaller',
    archetype: 'mage',
    baseHp: 650,
    baseDamage: 85,
    moveSpeed: 260,
    skillId: 'stormcaller_skill',
    ultimateId: 'stormcaller_ult',
  },
  {
    id: 'phantom',
    name: 'Phantom',
    archetype: 'assassin',
    baseHp: 700,
    baseDamage: 95,
    moveSpeed: 340,
    skillId: 'phantom_skill',
    ultimateId: 'phantom_ult',
  },
  {
    id: 'warden',
    name: 'Warden',
    archetype: 'support',
    baseHp: 800,
    baseDamage: 40,
    moveSpeed: 240,
    skillId: 'warden_skill',
    ultimateId: 'warden_ult',
  },
  {
    id: 'hawkeye',
    name: 'Hawkeye',
    archetype: 'marksman',
    baseHp: 680,
    baseDamage: 80,
    moveSpeed: 290,
    skillId: 'hawkeye_skill',
    ultimateId: 'hawkeye_ult',
  },
]
