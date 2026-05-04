import { describe, it, expect } from 'vitest'
import { distance, lerp, clamp, vecNormalize } from '@/utils/math'

describe('math utilities', () => {
  it('distance between (0,0) and (3,4) equals 5', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5)
  })

  it('lerp(0, 10, 0.5) equals 5', () => {
    expect(lerp(0, 10, 0.5)).toBe(5)
  })

  it('clamp below min returns min', () => {
    expect(clamp(-1, 0, 1)).toBe(0)
  })

  it('clamp above max returns max', () => {
    expect(clamp(2, 0, 1)).toBe(1)
  })

  it('clamp within range returns value', () => {
    expect(clamp(0.5, 0, 1)).toBe(0.5)
  })

  it('vecNormalize({x:3, y:4}).x is approximately 0.6', () => {
    const result = vecNormalize({ x: 3, y: 4 })
    expect(result.x).toBeCloseTo(0.6)
    expect(result.y).toBeCloseTo(0.8)
  })

  it('vecNormalize zero vector returns zero', () => {
    const result = vecNormalize({ x: 0, y: 0 })
    expect(result.x).toBe(0)
    expect(result.y).toBe(0)
  })
})
