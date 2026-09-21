# 🤖 AGENTS.md: AI Assistant Development Guide

## 🌲 Project Overview
**Two-Pines** is a comforting, Firewatch-inspired 3D lookout simulator and cozy focus tool built with **React 18, Three.js (React Three Fiber), Web Audio API, and Tailwind CSS**.

---

## 🏛️ Codebase Map

```
forest-fire-watch/
├── src/
│   ├── audio/
│   │   └── SoundEngine.js          # Procedural Web Audio synthesizer (zero audio files)
│   ├── components/
│   │   ├── canvas/                 # React Three Fiber 3D world components
│   │   │   ├── AtmosphericSky.jsx  # Dynamic skybox with sun/fog transitions
│   │   │   ├── CabinModel.jsx      # Wooden lookout cabin interior & furniture
│   │   │   ├── CameraRig.jsx       # Multi-view camera controller
│   │   │   ├── LookoutCanvas.jsx   # Main R3F canvas wrapper & light rigs
│   │   │   ├── PlayerController.jsx# Locomotion & collision controller
│   │   │   ├── RangerCharacter.jsx # 3D low-poly ranger mesh
│   │   │   ├── TerrainEnvironment.jsx # Instanced pine forest & distant mountains
│   │   │   ├── TowerStairsAndDeck.jsx # Ascent staircase & deck railing
│   │   │   └── TrailEnvironment.jsx  # Shoshone trail markers & creek bridge
│   │   └── ui/                     # Glassmorphic Tailwind UI overlays
│   │       ├── AudioMixerDrawer.jsx# Procedural lo-fi audio sliders
│   │       ├── FocusTimerModal.jsx # Mechanical Pomodoro wind-up timer
│   │       ├── HUDHeader.jsx       # Day-night clock, weather badge, quick tools
│   │       ├── LeatherJournalModal.jsx # Discovery stamps & ranger notes
│   │       ├── MobileTouchControls.jsx # Dual virtual joystick for mobile
│   │       ├── RadioDialogueModal.jsx # Walkie-talkie narrative typewriter
│   │       ├── RangerMapOverlay.jsx   # Topographic contour map overlay
│   │       └── SpottingScopeOverlay.jsx# Horizon 360° azimuth optics reticle
│   ├── data/
│   │   ├── sightingsData.js        # Landmark bearings and discovery stamps
│   │   └── storyChapters.js        # Narrative radio chapters and dialogue trees
│   ├── stores/                     # Zustand state management slices
│   └── test/                       # Vitest + React Testing Library test suite
```

---

## 📐 Architecture Guidelines for AI Agents

1. **State Management**:
   - Keep all global state strictly within Zustand slices in `src/stores/`.
   - **Performance Critical**: Never trigger Zustand updates or allocate temporary objects inside `useFrame` loops unless explicitly intended (use refs and mutate matrix/vector values in-place).
2. **Procedural Audio First**:
   - Audio is generated procedurally via `src/audio/SoundEngine.js`.
   - Never load large uncompressed audio files; rely on procedural synthesis and Web Audio gain/filter nodes.
3. **Automated Testing Gates**:
   - Every new feature, store action, or math helper must include an accompanying test in `src/test/`.
   - Always run `npm run test:run && npm run lint` before finishing any task.
4. **Responsive UI**:
   - All UI panels and modals must function seamlessly on both small mobile touchscreens (360px+) and ultra-wide desktop monitors (1920px+).
5. **No External Asset Dependencies**:
   - 3D models and terrain features must use Three.js procedural geometries or lightweight SVG/canvas textures.
