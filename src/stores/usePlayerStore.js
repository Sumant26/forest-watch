import { create } from 'zustand'

export const MOVEMENT_MODES = {
  FPS: 'fps',
  THIRD_PERSON: 'third_person',
  CINEMATIC: 'cinematic',
  DESK: 'desk',
  SCOPE: 'scope'
}

export const usePlayerStore = create((set) => ({
  // Position in world space
  // Prologue starts at the trailhead: [-12, -8.2, 48]
  position: [-12, -8.2, 48],
  rotation: [0, Math.PI * 0.9, 0], // Facing towards the mountain trail and tower
  velocity: [0, 0, 0],
  isMoving: false,
  isSprinting: false,
  movementMode: MOVEMENT_MODES.FPS,
  
  // Interaction target detection
  nearbyInteractable: null, // { id, label, action, distance }

  // Footstep audio trigger timer
  lastFootstepTime: 0,
  currentSurface: 'dirt', // 'dirt' | 'wood'

  // Actions
  setPosition: (pos) => set({ position: pos }),
  setRotation: (rot) => set({ rotation: rot }),
  setMovementState: (isMoving, isSprinting = false) => set({ isMoving, isSprinting }),
  setMovementMode: (mode) => set({ movementMode: mode }),
  setNearbyInteractable: (target) => set({ nearbyInteractable: target }),
  setCurrentSurface: (surface) => set({ currentSurface: surface }),

  // Teleport to landmarks (for instant navigation / chapter jumps)
  teleportTo: (pos, rot = [0, 0, 0]) => {
    set({ position: pos, rotation: rot, velocity: [0, 0, 0] })
  },

  // Teleport presets
  teleportToTrailhead: () => {
    set({
      position: [-12, -8.2, 48],
      rotation: [0, Math.PI * 0.9, 0],
      currentSurface: 'dirt'
    })
  },

  teleportToTowerCabin: () => {
    set({
      position: [0, 1.2, 0.2],
      rotation: [0, 0, 0],
      currentSurface: 'wood'
    })
  },

  teleportToBalcony: () => {
    set({
      position: [2.5, 1.2, -1.2],
      rotation: [0, -Math.PI / 2, 0],
      currentSurface: 'wood'
    })
  }
}))
