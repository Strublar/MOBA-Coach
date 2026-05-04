import { describe, it, expect } from 'vitest'
import { LANE_PATHS, JUNGLE_CAMPS, BASE_POSITIONS, TOWER_POSITIONS } from '@/map/MapLayout'

describe('MapLayout', () => {
  it('each lane path has at least 5 waypoints', () => {
    for (const lane of ['top', 'mid', 'bot'] as const) {
      expect(LANE_PATHS[lane].blue.length).toBeGreaterThanOrEqual(5)
      expect(LANE_PATHS[lane].red.length).toBeGreaterThanOrEqual(5)
    }
  })

  it('JUNGLE_CAMPS has exactly 4 entries', () => {
    expect(JUNGLE_CAMPS.length).toBe(4)
  })

  it('BASE_POSITIONS blue.x is less than red.x', () => {
    expect(BASE_POSITIONS.blue.x).toBeLessThan(BASE_POSITIONS.red.x)
  })

  it('all jungle camps have team neutral', () => {
    for (const camp of JUNGLE_CAMPS) {
      expect(camp.team).toBe('neutral')
    }
  })

  it('each lane has 2 towers per team', () => {
    for (const lane of ['top', 'mid', 'bot'] as const) {
      expect(TOWER_POSITIONS[lane].blue.length).toBe(2)
      expect(TOWER_POSITIONS[lane].red.length).toBe(2)
    }
  })

  it('blue lane paths go left to right', () => {
    for (const lane of ['top', 'mid', 'bot'] as const) {
      const path = LANE_PATHS[lane].blue
      expect(path[0].x).toBeLessThan(path[path.length - 1].x)
    }
  })

  it('red lane paths go right to left', () => {
    for (const lane of ['top', 'mid', 'bot'] as const) {
      const path = LANE_PATHS[lane].red
      expect(path[0].x).toBeGreaterThan(path[path.length - 1].x)
    }
  })
})
