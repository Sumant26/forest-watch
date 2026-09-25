import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { soundEngine } from '../audio/SoundEngine'

export const useFocusStore = create(
  persist(
    (set, get) => ({
      isOpen: false,
      mode: 'work', // 'work' | 'short_break' | 'long_break'
      durationMinutes: 25,
      secondsLeft: 25 * 60,
      isRunning: false,
      completedSessions: 0,

      // Actions
      openFocusModal: () => set({ isOpen: true }),
      closeFocusModal: () => set({ isOpen: false }),

      setMode: (mode) => {
        let mins = 25
        if (mode === 'short_break') mins = 5
        if (mode === 'long_break') mins = 15

        set({
          mode,
          durationMinutes: mins,
          secondsLeft: mins * 60,
          isRunning: false
        })
      },

      setCustomDuration: (minutes) => {
        const clamped = Math.max(1, Math.min(120, minutes))
        set({
          durationMinutes: clamped,
          secondsLeft: clamped * 60,
          isRunning: false
        })
      },

      toggleRunning: () => {
        set((state) => ({ isRunning: !state.isRunning }))
      },

      resetTimer: () => {
        const { durationMinutes } = get()
        set({
          secondsLeft: durationMinutes * 60,
          isRunning: false
        })
      },

      tick: () => {
        const { isRunning, secondsLeft, mode, completedSessions } = get()
        if (!isRunning) return

        if (secondsLeft > 1) {
          set({ secondsLeft: secondsLeft - 1 })
        } else {
          // Timer finished!
          soundEngine.playRadioSquelch(true)
          const nextMode = mode === 'work' ? 'short_break' : 'work'
          const nextDuration = nextMode === 'work' ? 25 : 5
          set({
            isRunning: false,
            mode: nextMode,
            durationMinutes: nextDuration,
            secondsLeft: nextDuration * 60,
            completedSessions: mode === 'work' ? completedSessions + 1 : completedSessions
          })
        }
      }
    }),
    {
      name: 'two-pines-focus-timer',
      partialize: (state) => ({
        completedSessions: state.completedSessions,
        durationMinutes: state.durationMinutes,
        mode: state.mode
      })
    }
  )
)
