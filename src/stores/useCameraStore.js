import { create } from 'zustand'

export const CAMERA_MODES = {
  FIRST_PERSON: 'first_person',
  THIRD_PERSON: 'third_person',
  CINEMATIC: 'cinematic',
  DESK: 'desk',
  SCOPE: 'scope',
  BALCONY: 'balcony'
}

export const CAMERA_PRESETS = {
  [CAMERA_MODES.FIRST_PERSON]: {
    position: [0, 1.6, 0.4],
    target: [0, 1.45, -3.5],
    fov: 62,
    minDistance: 0.1,
    maxDistance: 6
  },
  [CAMERA_MODES.THIRD_PERSON]: {
    position: [-1.7, 2.0, 1.9],
    target: [0.1, 1.15, -0.2],
    fov: 52,
    minDistance: 1.5,
    maxDistance: 5
  },
  [CAMERA_MODES.CINEMATIC]: {
    position: [-14, 3.5, 16],
    target: [0, 1.2, 0],
    fov: 46,
    minDistance: 8,
    maxDistance: 45
  },
  [CAMERA_MODES.DESK]: {
    position: [0.2, 1.45, -0.4],
    target: [0.2, 0.9, -1.3],
    fov: 46,
    minDistance: 0.5,
    maxDistance: 2
  },
  [CAMERA_MODES.SCOPE]: {
    position: [0, 1.52, -1.6],
    target: [0, 1.5, -60],
    fov: 24, // Zoomed in for spotting optics
    minDistance: 0.1,
    maxDistance: 100
  },
  [CAMERA_MODES.BALCONY]: {
    position: [2.5, 1.65, -1.2],
    target: [-6, 1.1, -40],
    fov: 58,
    minDistance: 1,
    maxDistance: 8
  }
}

export const useCameraStore = create((set, get) => ({
  mode: CAMERA_MODES.FIRST_PERSON,
  zoom: 1.0, // 1.0x to 4.0x
  azimuth: 315, // Compass bearing in degrees (0 = North, 90 = East, 180 = South, 270 = West)
  pitch: 0, // Vertical angle in degrees (-45 to 45)
  isTransitioning: false,
  deskLampOn: true,
  
  // Actions
  setMode: (mode) => {
    if (Object.values(CAMERA_MODES).includes(mode)) {
      set({ mode, isTransitioning: true })
      // Reset transition lock after smooth tween
      setTimeout(() => set({ isTransitioning: false }), 800)
    }
  },

  setZoom: (zoom) => set({ zoom: Math.max(1.0, Math.min(4.0, zoom)) }),

  setLookAngles: (azimuth, pitch) => {
    // Keep azimuth 0..360
    const normalizedAzimuth = ((azimuth % 360) + 360) % 360
    const clampedPitch = Math.max(-60, Math.min(60, pitch))
    set({ azimuth: normalizedAzimuth, pitch: clampedPitch })
  },

  toggleDeskLamp: () => set((state) => ({ deskLampOn: !state.deskLampOn })),

  // Helper to get active camera config with dynamic zoom
  getActivePreset: () => {
    const { mode, zoom } = get()
    const preset = CAMERA_PRESETS[mode] || CAMERA_PRESETS[CAMERA_MODES.FIRST_PERSON]
    if (mode === CAMERA_MODES.SCOPE) {
      return {
        ...preset,
        fov: 24 / zoom
      }
    }
    return preset
  }
}))
