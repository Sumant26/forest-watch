import React, { useState } from 'react'
import { Footprints, Home, Volume2, ArrowRight } from 'lucide-react'
import { useStoryStore } from '../../stores/useStoryStore'
import { usePlayerStore } from '../../stores/usePlayerStore'
import { useCameraStore, CAMERA_MODES } from '../../stores/useCameraStore'
import { useAudioStore } from '../../stores/useAudioStore'

export function PrologueIntroModal() {
  const [isDismissed, setIsDismissed] = useState(false)
  
  const setChapter = useStoryStore((state) => state.setChapter)
  const teleportToTrailhead = usePlayerStore((state) => state.teleportToTrailhead)
  const teleportToTowerCabin = usePlayerStore((state) => state.teleportToTowerCabin)
  const setCameraMode = useCameraStore((state) => state.setMode)
  const initAudio = useAudioStore((state) => state.initAudio)

  if (isDismissed) return null

  const handleStartPrologueHike = () => {
    initAudio()
    setChapter(0)
    teleportToTrailhead()
    setCameraMode(CAMERA_MODES.FIRST_PERSON)
    setIsDismissed(true)
  }

  const handleStartAtTower = () => {
    initAudio()
    setChapter(1)
    teleportToTowerCabin()
    setCameraMode(CAMERA_MODES.FIRST_PERSON)
    setIsDismissed(true)
  }

  return (
    <div
      id="prologue-intro-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fadeIn select-none"
    >
      <div className="relative w-full max-w-xl fw-panel rounded-3xl p-7 sm:p-9 shadow-2xl border border-amber-500/30 text-center flex flex-col items-center">
        {/* Title & Badge */}
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-3xl mb-4 shadow-inner">
          🌲
        </div>

        <div className="text-xs font-bold uppercase tracking-widest text-amber-400 font-mono mb-1">
          Shoshone National Forest • Wyoming • 1989
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold font-vintage text-white tracking-wide mb-3">
          Two-Pines Fire Watch
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-md leading-relaxed mb-6">
          You took a job as a fire lookout to escape into the calm wilderness. 
          Your only connection to the outside world is the voice of <strong>Ranger Willow</strong> on your handheld radio.
        </p>

        {/* Action Choice Cards */}
        <div className="w-full space-y-3 mb-4">
          <button
            type="button"
            onClick={handleStartPrologueHike}
            className="w-full p-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm shadow-xl flex items-center justify-between transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center gap-3">
              <Footprints className="w-5 h-5 text-stone-950" />
              <div className="text-left">
                <div className="text-sm font-bold">Start Story: Hike to Two-Pines (Prologue)</div>
                <div className="text-[11px] font-normal opacity-90">Begin on the canyon trail and hike up to the tower</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={handleStartAtTower}
            className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold flex items-center justify-between transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <Home className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <div className="font-bold">Jump Directly to Lookout Tower Cabin</div>
                <div className="text-[10px] text-slate-400 font-mono">Start inside the observation tower with telescope & radio</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Includes procedural nature soundscapes & vintage walkie-talkie audio</span>
        </div>
      </div>
    </div>
  )
}
