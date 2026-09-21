import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useTimeWeatherStore } from './useTimeWeatherStore'
import { useAudioStore } from './useAudioStore'
import { useStoryStore } from './useStoryStore'
import { useJournalStore } from './useJournalStore'
import { useFocusStore } from './useFocusStore'

export const QUALITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  ULTRA: 'ultra'
}

export const QUALITY_CONFIGS = {
  [QUALITY_LEVELS.LOW]: {
    shadows: false,
    particles: 150,
    bloom: false,
    treeCount: 200,
    dpr: 1
  },
  [QUALITY_LEVELS.MEDIUM]: {
    shadows: true,
    shadowMapSize: 512,
    particles: 400,
    bloom: false,
    treeCount: 500,
    dpr: 1.2
  },
  [QUALITY_LEVELS.HIGH]: {
    shadows: true,
    shadowMapSize: 1024,
    particles: 800,
    bloom: true,
    treeCount: 900,
    dpr: 1.5
  },
  [QUALITY_LEVELS.ULTRA]: {
    shadows: true,
    shadowMapSize: 2048,
    particles: 1400,
    bloom: true,
    treeCount: 1400,
    dpr: 2
  }
}

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      isOpen: false,
      quality: QUALITY_LEVELS.HIGH,
      showHelp: false,
      controlMode: 'auto', // 'auto' | 'mouse' | 'touch'

      // Actions
      openSettings: () => set({ isOpen: true }),
      closeSettings: () => set({ isOpen: false }),
      toggleHelp: () => set((state) => ({ showHelp: !state.showHelp })),

      setQuality: (quality) => {
        if (Object.values(QUALITY_LEVELS).includes(quality)) {
          set({ quality })
        }
      },

      setControlMode: (mode) => set({ controlMode: mode }),

      // JSON Save Profile Export
      exportSaveData: () => {
        const payload = {
          version: '1.0.0',
          exportedAt: new Date().toISOString(),
          timeWeather: {
            time: useTimeWeatherStore.getState().time,
            weather: useTimeWeatherStore.getState().weather,
            preset: useTimeWeatherStore.getState().preset
          },
          audio: {
            masterVolume: useAudioStore.getState().masterVolume,
            tapeWarble: useAudioStore.getState().tapeWarble,
            channels: useAudioStore.getState().channels
          },
          story: {
            currentChapterIndex: useStoryStore.getState().currentChapterIndex,
            completedObjectives: useStoryStore.getState().completedObjectives,
            dialogueHistory: useStoryStore.getState().dialogueHistory
          },
          journal: {
            discoveredSightings: useJournalStore.getState().discoveredSightings,
            weatherLogs: useJournalStore.getState().weatherLogs,
            personalNotes: useJournalStore.getState().personalNotes,
            polaroids: useJournalStore.getState().polaroids
          },
          focus: {
            completedSessions: useFocusStore.getState().completedSessions
          },
          settings: {
            quality: get().quality
          }
        }
        return JSON.stringify(payload, null, 2)
      },

      // JSON Save Profile Import
      importSaveData: (jsonString) => {
        try {
          const data = JSON.parse(jsonString)
          if (!data || !data.version) {
            throw new Error('Invalid save file format')
          }

          if (data.timeWeather) {
            useTimeWeatherStore.setState({
              time: data.timeWeather.time ?? 17.5,
              weather: data.timeWeather.weather ?? 'clear',
              preset: data.timeWeather.preset ?? 'dynamic'
            })
          }

          if (data.audio) {
            useAudioStore.setState({
              masterVolume: data.audio.masterVolume ?? 0.8,
              tapeWarble: data.audio.tapeWarble ?? true,
              channels: data.audio.channels ?? useAudioStore.getState().channels
            })
          }

          if (data.story) {
            useStoryStore.setState({
              currentChapterIndex: data.story.currentChapterIndex ?? 0,
              completedObjectives: data.story.completedObjectives ?? {},
              dialogueHistory: data.story.dialogueHistory ?? []
            })
          }

          if (data.journal) {
            useJournalStore.setState({
              discoveredSightings: data.journal.discoveredSightings ?? ['spot_thorofare'],
              weatherLogs: data.journal.weatherLogs ?? [],
              personalNotes: data.journal.personalNotes ?? '',
              polaroids: data.journal.polaroids ?? []
            })
          }

          if (data.focus) {
            useFocusStore.setState({
              completedSessions: data.focus.completedSessions ?? 0
            })
          }

          if (data.settings?.quality) {
            set({ quality: data.settings.quality })
          }

          return { success: true }
        } catch (err) {
          return { success: false, error: err.message }
        }
      }
    }),
    {
      name: 'two-pines-app-settings',
      partialize: (state) => ({
        quality: state.quality,
        controlMode: state.controlMode
      })
    }
  )
)
