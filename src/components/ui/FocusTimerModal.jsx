import React, { useEffect } from 'react'
import { Timer, Play, Pause, RotateCcw, X, Coffee, Brain, Sparkles } from 'lucide-react'
import { useFocusStore } from '../../stores/useFocusStore'

export function FocusTimerModal() {
  const isOpen = useFocusStore((state) => state.isOpen)
  const closeFocusModal = useFocusStore((state) => state.closeFocusModal)
  const mode = useFocusStore((state) => state.mode)
  const setMode = useFocusStore((state) => state.setMode)
  const secondsLeft = useFocusStore((state) => state.secondsLeft)
  const isRunning = useFocusStore((state) => state.isRunning)
  const toggleRunning = useFocusStore((state) => state.toggleRunning)
  const resetTimer = useFocusStore((state) => state.resetTimer)
  const tick = useFocusStore((state) => state.tick)
  const completedSessions = useFocusStore((state) => state.completedSessions)
  const durationMinutes = useFocusStore((state) => state.durationMinutes)

  // 1-second interval tick
  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      tick()
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning, tick])

  if (!isOpen) return null

  // Format MM:SS
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const formattedTime = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`

  // Progress circle percentage
  const totalSeconds = durationMinutes * 60
  const progressPercent = ((totalSeconds - secondsLeft) / totalSeconds) * 100

  return (
    <div
      id="focus-timer-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-md glass-panel-warm rounded-3xl p-6 border border-amber-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Timer className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-amber-100 font-vintage uppercase tracking-wider">
                Lookout Focus Timer
              </h2>
              <p className="text-[11px] text-stone-300 font-mono">
                Wind-up Mechanical Desk Pomodoro
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeFocusModal}
            className="p-2 text-stone-300 hover:text-amber-200 hover:bg-white/10 rounded-xl transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-2xl mb-6 border border-white/5">
          {[
            { id: 'work', label: 'Deep Focus', icon: Brain, mins: 25 },
            { id: 'short_break', label: 'Short Break', icon: Coffee, mins: 5 },
            { id: 'long_break', label: 'Rest Shift', icon: Sparkles, mins: 15 }
          ].map((m) => {
            const Icon = m.icon
            const isActive = mode === m.id
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            )
          })}
        </div>

        {/* Wind-up Circular Dial Display */}
        <div className="relative w-52 h-52 mx-auto mb-6 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-amber-950/60"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Progress ring */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-amber-500 transition-all duration-500"
              strokeWidth="6"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Time text in center */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-mono font-bold text-amber-100 tracking-tight">
              {formattedTime}
            </span>
            <span className="text-[11px] text-amber-400/80 font-mono uppercase tracking-widest mt-1">
              {mode.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={resetTimer}
            title="Reset Timer"
            className="p-3.5 rounded-2xl bg-black/40 hover:bg-white/10 text-stone-300 hover:text-amber-200 border border-white/10 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleRunning}
            className="px-8 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm shadow-xl flex items-center gap-2 transition-all active:scale-95"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Start Shift</span>
              </>
            )}
          </button>
        </div>

        {/* Completed Sessions Footer */}
        <div className="mt-5 pt-3 border-t border-amber-500/20 text-center text-xs text-stone-300 font-typewriter">
          ✨ Completed Shifts Today: <strong className="text-amber-300">{completedSessions}</strong>
        </div>
      </div>
    </div>
  )
}
