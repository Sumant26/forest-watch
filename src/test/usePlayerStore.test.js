import { describe, it, expect, beforeEach } from 'vitest'
import { usePlayerStore, MOVEMENT_MODES } from '../stores/usePlayerStore'

describe('usePlayerStore', () => {
  beforeEach(() => {
    usePlayerStore.getState().teleportToTrailhead()
  })

  it('should initialize at trailhead coordinates for the Prologue', () => {
    const pos = usePlayerStore.getState().position
    expect(pos[0]).toBe(-12)
    expect(pos[2]).toBe(48)
    expect(usePlayerStore.getState().currentSurface).toBe('dirt')
  })

  it('should teleport to tower cabin and update surface to wood', () => {
    const store = usePlayerStore.getState()
    store.teleportToTowerCabin()
    const pos = usePlayerStore.getState().position
    expect(pos[0]).toBe(0)
    expect(pos[1]).toBe(1.2)
    expect(usePlayerStore.getState().currentSurface).toBe('wood')
  })

  it('should update movement and sprinting state', () => {
    const store = usePlayerStore.getState()
    store.setMovementState(true, true)
    expect(usePlayerStore.getState().isMoving).toBe(true)
    expect(usePlayerStore.getState().isSprinting).toBe(true)
  })

  it('should change movement mode', () => {
    const store = usePlayerStore.getState()
    store.setMovementMode(MOVEMENT_MODES.THIRD_PERSON)
    expect(usePlayerStore.getState().movementMode).toBe(MOVEMENT_MODES.THIRD_PERSON)
  })
})
