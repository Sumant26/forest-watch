import React from 'react'
import { Footprints, Radio, Compass, BookOpen, Key } from 'lucide-react'
import { usePlayerStore } from '../../stores/usePlayerStore'
import { useCameraStore, CAMERA_MODES } from '../../stores/useCameraStore'
import { useStoryStore } from '../../stores/useStoryStore'

export function InteractionPrompt() {
  const cameraMode = useCameraStore((state) => state.mode)
  const position = usePlayerStore((state) => state.position)
  const isMoving = usePlayerStore((state) => state.isMoving)
  const currentChapter = useStoryStore((state) => state.getCurrentChapter())
  const completedObjectives = useStoryStore((state) => state.completedObjectives)

  // Show only in FPS or 3rd Person view
  if (cameraMode !== CAMERA_MODES.FIRST_PERSON && cameraMode !== CAMERA_MODES.THIRD_PERSON) {
    return null
  }

  // Determine contextual guide based on player position & active chapter
  let promptText = 'WASD Move • Drag Look • [V] 3rd Person / FPS • [C] Cinematic'
  let Icon = Footprints

  if (currentChapter.number === 0) {
    if (position[2] > 26) {
      promptText = 'Follow the trail & cross Meadow Creek Bridge • [V] Toggle View'
      Icon = Footprints
    } else if (position[2] > 5) {
      promptText = 'Head towards Two-Pines Lookout • Press [E] at Stairs to Ascend'
      Icon = Footprints
    } else if (position[1] < -5.0 && position[2] <= 5.5) {
      promptText = 'Press [E] to Ascend Wooden Stairs to Lookout Deck'
      Icon = Key
    } else if (position[1] >= -1.0 && position[2] >= 1.5 && Math.abs(position[0]) <= 2.8) {
      promptText = 'Press [E] to Descend Stairs to Trail Ground'
      Icon = Key
    } else {
      promptText = 'Step inside the cabin & press [E] to pick up Desk Radio'
      Icon = Radio
    }
  } else {
    // Inside or around the tower
    if (position[1] >= -1.0 && position[2] >= 1.5 && Math.abs(position[0]) <= 2.8) {
      promptText = 'Press [E] to Descend Stairs to Canyon Trail'
      Icon = Key
    } else if (Math.abs(position[0] - 0.4) < 1.2 && Math.abs(position[2] - (-1.35)) < 1.2) {
      promptText = 'Ranger Work Desk • Press [E] to use Radio & Field Log'
      Icon = BookOpen
    } else if (Math.abs(position[2] - (-1.85)) < 1.0) {
      promptText = 'Spotting Scope • Look out across the Shoshone valley'
      Icon = Compass
    } else if (position[0] > 1.8) {
      promptText = 'Balcony Overlook • Panoramic Horizon View'
      Icon = Compass
    }
  }

  return (
    <div
      id="interaction-hud-prompt"
      className="absolute bottom-16 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none flex flex-col items-center gap-3 animate-fadeIn"
    >
      {/* Center FPS crosshair dot */}
      {cameraMode === CAMERA_MODES.FIRST_PERSON && (
        <div className="w-1.5 h-1.5 rounded-full bg-white/70 shadow-sm" />
      )}

      {/* Contextual navigation banner */}
      <div className="fw-panel-amber rounded-full px-4 py-2 flex items-center gap-2.5 shadow-2xl border border-amber-500/40">
        <Icon className="w-4 h-4 text-amber-400 animate-pulse" />
        <span className="text-xs sm:text-sm font-medium text-amber-100 tracking-wide font-sans">
          {promptText}
        </span>
      </div>
    </div>
  )
}
