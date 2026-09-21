import React from 'react'
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react'
import { useCameraStore, CAMERA_MODES } from '../../stores/useCameraStore'

export function MobileTouchControls() {
  const mode = useCameraStore((state) => state.mode)
  const azimuth = useCameraStore((state) => state.azimuth)
  const pitch = useCameraStore((state) => state.pitch)
  const setLookAngles = useCameraStore((state) => state.setLookAngles)

  // Only render on mobile / small touch screens or during Free Look / Scope
  if (mode !== CAMERA_MODES.FIRST_PERSON && mode !== CAMERA_MODES.SCOPE && mode !== CAMERA_MODES.BALCONY) {
    return null
  }

  const handlePan = (dAz, dPitch) => {
    setLookAngles(azimuth + dAz, pitch + dPitch)
  }

  return (
    <div
      id="mobile-touch-controls"
      className="sm:hidden fixed bottom-6 left-6 z-30 pointer-events-auto flex flex-col items-center select-none"
    >
      <div className="w-24 h-24 rounded-full glass-panel-warm border border-amber-500/30 shadow-2xl relative flex items-center justify-center p-1">
        {/* Up */}
        <button
          type="button"
          onClick={() => handlePan(0, 8)}
          className="absolute top-1 p-1 text-amber-300 hover:text-white active:scale-90"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        {/* Down */}
        <button
          type="button"
          onClick={() => handlePan(0, -8)}
          className="absolute bottom-1 p-1 text-amber-300 hover:text-white active:scale-90"
        >
          <ChevronDown className="w-5 h-5" />
        </button>

        {/* Left */}
        <button
          type="button"
          onClick={() => handlePan(-15, 0)}
          className="absolute left-1 p-1 text-amber-300 hover:text-white active:scale-90"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right */}
        <button
          type="button"
          onClick={() => handlePan(15, 0)}
          className="absolute right-1 p-1 text-amber-300 hover:text-white active:scale-90"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Center Indicator */}
        <div className="w-5 h-5 rounded-full bg-amber-500/30 border border-amber-400/50" />
      </div>
    </div>
  )
}
