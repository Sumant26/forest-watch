import React from 'react'
import { Camera, BookmarkCheck, CheckCircle2, Compass } from 'lucide-react'
import { useCameraStore, CAMERA_MODES } from '../../stores/useCameraStore'
import { useJournalStore } from '../../stores/useJournalStore'
import { SIGHTINGS_DATA } from '../../data/sightingsData'

export function SpottingScopeOverlay() {
  const mode = useCameraStore((state) => state.mode)
  const zoom = useCameraStore((state) => state.zoom)
  const setZoom = useCameraStore((state) => state.setZoom)
  const azimuth = useCameraStore((state) => state.azimuth)
  const pitch = useCameraStore((state) => state.pitch)
  const setMode = useCameraStore((state) => state.setMode)

  const discoveredSightings = useJournalStore((state) => state.discoveredSightings)
  const discoverSighting = useJournalStore((state) => state.discoverSighting)
  const addPolaroid = useJournalStore((state) => state.addPolaroid)

  if (mode !== CAMERA_MODES.SCOPE) return null

  // Find if looking at any sighting landmark
  const matchedSighting = SIGHTINGS_DATA.find((item) => {
    // Angular difference calculation with 360 wrap
    let azDiff = Math.abs(item.azimuth - azimuth)
    if (azDiff > 180) azDiff = 360 - azDiff
    const pitchDiff = Math.abs(item.pitch - pitch)
    return azDiff < 12 && pitchDiff < 9
  })

  const isAlreadyDiscovered = matchedSighting
    ? discoveredSightings.includes(matchedSighting.id)
    : false

  // Capture canvas image for Polaroid snapshot
  const handleSnapPolaroid = () => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
      addPolaroid({
        caption: matchedSighting
          ? `${matchedSighting.name} (Azimuth ${Math.round(azimuth)}°)`
          : `Horizon View (Bearing ${Math.round(azimuth)}°)`,
        dataUrl
      })
    }
  }

  return (
    <div
      id="spotting-scope-hud"
      className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 sm:p-6 select-none"
    >
      {/* Scope Vignette Mask */}
      <div className="absolute inset-0 scope-mask pointer-events-none" />

      {/* Top: Compass Azimuth Tape */}
      <div className="relative w-full max-w-md mx-auto pointer-events-auto flex flex-col items-center">
        <div className="glass-panel-warm rounded-2xl px-5 py-2 flex items-center gap-3 border-amber-500/30 shadow-2xl">
          <Compass className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />
          <div className="text-center font-typewriter">
            <span className="text-lg font-bold text-amber-200">
              {Math.round(azimuth)}°
            </span>
            <span className="text-xs text-stone-300 ml-1.5 uppercase font-medium">
              {azimuth >= 337.5 || azimuth < 22.5
                ? 'N'
                : azimuth >= 22.5 && azimuth < 67.5
                ? 'NE'
                : azimuth >= 67.5 && azimuth < 112.5
                ? 'E'
                : azimuth >= 112.5 && azimuth < 157.5
                ? 'SE'
                : azimuth >= 157.5 && azimuth < 202.5
                ? 'S'
                : azimuth >= 202.5 && azimuth < 247.5
                ? 'SW'
                : azimuth >= 247.5 && azimuth < 292.5
                ? 'W'
                : 'NW'}
            </span>
          </div>
          <div className="text-[11px] text-amber-400/80 font-mono">
            Pitch: {Math.round(pitch)}°
          </div>
        </div>
      </div>

      {/* Center: Optics Crosshair Reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
        <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-amber-400/25 relative flex items-center justify-center">
          {/* Crosshair lines */}
          <div className="absolute w-full h-px bg-amber-400/30" />
          <div className="absolute h-full w-px bg-amber-400/30" />
          <div className="w-4 h-4 rounded-full border border-amber-400/60" />
        </div>
      </div>

      {/* Sighting Inspection Notification Card */}
      {matchedSighting && (
        <div className="relative mx-auto pointer-events-auto max-w-sm w-full glass-panel-warm rounded-2xl p-4 border border-amber-500/40 shadow-2xl animate-warm-pulse">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold tracking-wide uppercase">
                <span>{matchedSighting.icon}</span>
                <span>{matchedSighting.category}</span>
                <span className="text-stone-400">• {matchedSighting.distance}</span>
              </div>
              <h3 className="text-base font-bold text-amber-100 mt-0.5">
                {matchedSighting.name}
              </h3>
            </div>
            {isAlreadyDiscovered ? (
              <span className="flex items-center gap-1 text-[11px] bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                <CheckCircle2 className="w-3 h-3" /> Logged
              </span>
            ) : (
              <span className="text-[11px] bg-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded-full animate-bounce">
                NEW SIGHTING
              </span>
            )}
          </div>

          <p className="text-xs text-stone-300 mt-2 font-typewriter line-clamp-2">
            {matchedSighting.description}
          </p>

          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-amber-500/20">
            <button
              type="button"
              onClick={() => discoverSighting(matchedSighting.id)}
              className="flex-1 py-1.5 px-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              {isAlreadyDiscovered ? 'Review in Journal' : 'Stamp to Journal'}
            </button>
            <button
              type="button"
              onClick={handleSnapPolaroid}
              title="Snap Polaroid Photo"
              className="p-2 bg-stone-800/80 hover:bg-stone-700 text-amber-300 rounded-xl transition-all border border-amber-500/30 active:scale-95"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Controls: Zoom & Exit Scope */}
      <div className="relative pointer-events-auto flex items-center justify-between gap-3 max-w-xl mx-auto w-full">
        {/* Zoom Selector */}
        <div className="flex items-center gap-1.5 glass-panel rounded-2xl p-1 bg-black/60">
          <span className="text-[11px] font-mono text-stone-400 px-2">ZOOM:</span>
          {[1.0, 2.0, 4.0].map((z) => (
            <button
              key={`zoom-${z}`}
              type="button"
              onClick={() => setZoom(z)}
              className={`text-xs px-2.5 py-1 rounded-xl font-mono font-bold transition-all ${
                zoom === z
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-stone-300 hover:bg-white/10'
              }`}
            >
              {z}x
            </button>
          ))}
        </div>

        {/* Snap Photo & Exit Scope */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSnapPolaroid}
            className="flex items-center gap-1.5 px-3.5 py-2 glass-panel-warm rounded-2xl text-xs font-semibold text-amber-200 hover:bg-amber-900/40 transition-all active:scale-95"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>Snap Polaroid</span>
          </button>
          <button
            type="button"
            onClick={() => setMode(CAMERA_MODES.FIRST_PERSON)}
            className="px-3.5 py-2 glass-panel rounded-2xl text-xs font-medium text-stone-300 hover:text-white hover:bg-white/10 transition-all active:scale-95"
          >
            Exit Scope
          </button>
        </div>
      </div>
    </div>
  )
}
