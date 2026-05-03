import type { Vec2 } from '@/utils/math'

export const LANE_PATHS: Record<'top' | 'mid' | 'bot', { blue: Vec2[]; red: Vec2[] }> = {
  top: {
    blue: [
      { x: 120, y: 150 },
      { x: 400, y: 150 },
      { x: 700, y: 150 },
      { x: 1000, y: 150 },
      { x: 1300, y: 150 },
      { x: 1480, y: 150 },
    ],
    red: [
      { x: 1480, y: 150 },
      { x: 1300, y: 150 },
      { x: 1000, y: 150 },
      { x: 700, y: 150 },
      { x: 400, y: 150 },
      { x: 120, y: 150 },
    ],
  },
  mid: {
    blue: [
      { x: 120, y: 450 },
      { x: 400, y: 400 },
      { x: 700, y: 450 },
      { x: 1000, y: 450 },
      { x: 1300, y: 450 },
      { x: 1480, y: 450 },
    ],
    red: [
      { x: 1480, y: 450 },
      { x: 1300, y: 450 },
      { x: 1000, y: 450 },
      { x: 700, y: 450 },
      { x: 400, y: 400 },
      { x: 120, y: 450 },
    ],
  },
  bot: {
    blue: [
      { x: 120, y: 750 },
      { x: 400, y: 750 },
      { x: 700, y: 750 },
      { x: 1000, y: 750 },
      { x: 1300, y: 750 },
      { x: 1480, y: 750 },
    ],
    red: [
      { x: 1480, y: 750 },
      { x: 1300, y: 750 },
      { x: 1000, y: 750 },
      { x: 700, y: 750 },
      { x: 400, y: 750 },
      { x: 120, y: 750 },
    ],
  },
}

export const TOWER_POSITIONS: Record<'top' | 'mid' | 'bot', { blue: Vec2[]; red: Vec2[] }> = {
  top: {
    blue: [
      { x: 350, y: 150 },
      { x: 600, y: 150 },
    ],
    red: [
      { x: 1000, y: 150 },
      { x: 1250, y: 150 },
    ],
  },
  mid: {
    blue: [
      { x: 350, y: 450 },
      { x: 600, y: 450 },
    ],
    red: [
      { x: 1000, y: 450 },
      { x: 1250, y: 450 },
    ],
  },
  bot: {
    blue: [
      { x: 350, y: 750 },
      { x: 600, y: 750 },
    ],
    red: [
      { x: 1000, y: 750 },
      { x: 1250, y: 750 },
    ],
  },
}

export const BASE_POSITIONS: { blue: Vec2; red: Vec2 } = {
  blue: { x: 120, y: 450 },
  red: { x: 1480, y: 450 },
}

export const JUNGLE_CAMPS: Array<{ id: string; position: Vec2; team: 'neutral' }> = [
  { id: 'blue_top', position: { x: 350, y: 300 }, team: 'neutral' },
  { id: 'blue_bot', position: { x: 350, y: 600 }, team: 'neutral' },
  { id: 'red_top', position: { x: 1250, y: 300 }, team: 'neutral' },
  { id: 'red_bot', position: { x: 1250, y: 600 }, team: 'neutral' },
]

export const RIVER_BOUNDS: { minY: number; maxY: number } = {
  minY: 400,
  maxY: 500,
}
