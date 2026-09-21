import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { soundEngine } from '../audio/SoundEngine'

export const useAudioStore = create(
  persist(
    (set, get) => ({
      masterVolume: 0.75,
      isMuted: false,
      isAudioStarted: false,
      tapeWarble: true,
      channels: {
        rain: 0.65,
        wind: 0.45,
        stove: 0.55,
        nature: 0.50,
        music: 0.40,
        radio: 0.75
      },
      currentLoFiTitle: 'Two Pines Sunset Session - Track 1',

      // Actions
      initAudio: () => {
        const { isAudioStarted, masterVolume, isMuted, tapeWarble, channels } = get()
        if (!isAudioStarted) {
          soundEngine.init()
          soundEngine.resume()
          soundEngine.setMasterVolume(isMuted ? 0 : masterVolume)
          soundEngine.setTapeWarble(tapeWarble)
          Object.keys(channels).forEach((ch) => {
            soundEngine.setChannelVolume(ch, channels[ch])
          })
          set({ isAudioStarted: true })
        } else {
          soundEngine.resume()
        }
      },

      setMasterVolume: (vol) => {
        const clamped = Math.max(0, Math.min(1, vol))
        soundEngine.setMasterVolume(get().isMuted ? 0 : clamped)
        set({ masterVolume: clamped })
      },

      setChannelVolume: (channel, vol) => {
        const clamped = Math.max(0, Math.min(1, vol))
        soundEngine.setChannelVolume(channel, clamped)
        set((state) => ({
          channels: {
            ...state.channels,
            [channel]: clamped
          }
        }))
      },

      toggleMute: () => {
        const nextMuted = !get().isMuted
        soundEngine.setMasterVolume(nextMuted ? 0 : get().masterVolume)
        set({ isMuted: nextMuted })
      },

      toggleTapeWarble: () => {
        const nextState = !get().tapeWarble
        soundEngine.setTapeWarble(nextState)
        set({ tapeWarble: nextState })
      },

      triggerRadioSquelch: (isOpening = true) => {
        soundEngine.playRadioSquelch(isOpening)
      },

      triggerDialogueChirp: (char) => {
        soundEngine.playDialogueChirp(char)
      }
    }),
    {
      name: 'two-pines-audio-settings',
      partialize: (state) => ({
        masterVolume: state.masterVolume,
        isMuted: state.isMuted,
        tapeWarble: state.tapeWarble,
        channels: state.channels
      })
    }
  )
)
