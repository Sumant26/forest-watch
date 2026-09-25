import React from 'react'
import { Map, X, Navigation } from 'lucide-react'
import { usePlayerStore } from '../../stores/usePlayerStore'
import { useCameraStore } from '../../stores/useCameraStore'

export function RangerMapOverlay({ isOpen, onClose }) {
  const position = usePlayerStore((state) => state.position)
  const azimuth = useCameraStore((state) => state.azimuth)

  if (!isOpen) return null

  // Map world bounds mapping:
  // x: -60 to 60 -> 0% to 100%
  // z: 60 to -60 -> 0% to 100% (South to North)
  const mapX = Math.min(95, Math.max(5, ((position[0] + 60) / 120) * 100))
  const mapY = Math.min(95, Math.max(5, ((-position[2] + 60) / 120) * 100))

  return (
    <div
      id="ranger-map-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-2xl bg-[#ede0c5] rounded-3xl p-5 sm:p-7 border-4 border-[#5c361e] shadow-2xl flex flex-col text-[#2a170f]">
        {/* Map Header */}
        <div className="flex items-center justify-between border-b-2 border-[#5c361e]/30 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <Map className="w-5 h-5 text-[#8b4513]" />
            <div>
              <h2 className="text-base font-bold font-vintage tracking-wider text-[#2a170f]">
                Shoshone National Forest • Section 4
              </h2>
              <p className="text-[10px] text-[#6b4226] font-mono">
                Topographical Trail Map & Fire Lookout Quadrant
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-black/10 text-[#5c361e] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Canvas Visual Body */}
        <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-[#f6eedb] border-2 border-[#c4af89] overflow-hidden p-4 flex items-center justify-center shadow-inner">
          {/* Topographical Contour Lines SVG Background */}
          <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50%" cy="50%" r="38%" fill="none" stroke="#7a5230" strokeWidth="1" strokeDasharray="4 2" />
            <circle cx="50%" cy="50%" r="28%" fill="none" stroke="#7a5230" strokeWidth="1" />
            <circle cx="50%" cy="50%" r="18%" fill="none" stroke="#7a5230" strokeWidth="1.5" />
            <circle cx="20%" cy="25%" r="14%" fill="none" stroke="#7a5230" strokeWidth="1" />
            <circle cx="80%" cy="80%" r="16%" fill="none" stroke="#7a5230" strokeWidth="1" />
            <path d="M 0 200 Q 150 160 300 220 T 600 180" fill="none" stroke="#3b82f6" strokeWidth="4" opacity="0.6" />
          </svg>

          {/* Landmarks on Map */}
          {/* 1. Two-Pines Lookout (Center) */}
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <span className="text-xl">🌲</span>
            <span className="text-[10px] font-bold font-vintage bg-[#ede0c5] px-1.5 py-0.5 rounded border border-[#5c361e] shadow">
              Two-Pines Tower
            </span>
          </div>

          {/* 2. Thorofare Lookout (North-West) */}
          <div className="absolute top-[18%] left-[22%] flex flex-col items-center">
            <span className="text-base">🗼</span>
            <span className="text-[9px] font-mono text-[#5c361e] font-bold">
              Thorofare Post (Willow)
            </span>
          </div>

          {/* 3. West Geyser Basin (West) */}
          <div className="absolute top-[52%] left-[12%] flex flex-col items-center">
            <span className="text-base">💨</span>
            <span className="text-[9px] font-mono text-[#5c361e] font-bold">
              West Geyser Basin
            </span>
          </div>

          {/* 4. Meadow Creek & Bridge */}
          <div className="absolute top-[68%] left-[45%] flex flex-col items-center">
            <span className="text-xs">🌉</span>
            <span className="text-[9px] font-mono text-blue-800 font-bold">
              Meadow Creek Bridge
            </span>
          </div>

          {/* 5. Canyon Trailhead (South) */}
          <div className="absolute top-[86%] left-[42%] flex flex-col items-center">
            <span className="text-xs">🥾</span>
            <span className="text-[9px] font-mono text-[#5c361e] font-bold bg-[#ede0c5]/80 px-1 rounded">
              Canyon Trailhead
            </span>
          </div>

          {/* 6. Granite Peak (South) */}
          <div className="absolute top-[82%] left-[75%] flex flex-col items-center">
            <span className="text-base">⛰️</span>
            <span className="text-[9px] font-mono text-[#5c361e] font-bold">
              Granite Peak (11,400 ft)
            </span>
          </div>

          {/* Player Live Location Pin */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10 flex flex-col items-center"
            style={{
              left: `${mapX}%`,
              top: `${mapY}%`
            }}
          >
            <div
              className="w-7 h-7 rounded-full bg-amber-600 border-2 border-white shadow-lg flex items-center justify-center text-white transform"
              style={{ transform: `rotate(${azimuth}deg)` }}
            >
              <Navigation className="w-4 h-4 fill-white" />
            </div>
            <span className="text-[9px] font-bold bg-amber-600 text-white px-1.5 py-0.5 rounded shadow mt-0.5 whitespace-nowrap">
              YOU ARE HERE
            </span>
          </div>

          {/* Rotating Brass Handheld Compass (Bottom-Right) */}
          <div className="absolute bottom-4 right-4 bg-[#2a170f] p-2.5 rounded-2xl shadow-xl border-2 border-[#d4a359] flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-full border border-amber-400/50 flex items-center justify-center relative transition-transform duration-200"
              style={{ transform: `rotate(${-azimuth}deg)` }}
            >
              <div className="w-1 h-8 bg-gradient-to-b from-red-500 via-white to-stone-400 rounded-full shadow" />
            </div>
            <div className="text-white font-typewriter">
              <div className="text-xs font-bold text-amber-300">{Math.round(azimuth)}°</div>
              <div className="text-[9px] text-stone-300 uppercase">
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
              </div>
            </div>
          </div>
        </div>

        {/* Map Legend */}
        <div className="mt-3 flex items-center justify-between text-xs font-mono text-[#5c361e] border-t border-[#5c361e]/20 pt-2.5">
          <span>Legend: 🌲 Lookout • 🌉 Bridge • ⛰️ Summit • 💨 Thermal Basin</span>
          <span className="font-bold">Scale: 1 in = 2.5 mi</span>
        </div>
      </div>
    </div>
  )
}
