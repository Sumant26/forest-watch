import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORY_CHAPTERS } from '../data/storyChapters'
import { useTimeWeatherStore } from './useTimeWeatherStore'
import { useAudioStore } from './useAudioStore'

export const useStoryStore = create(
  persist(
    (set, get) => ({
      currentChapterIndex: 0,
      isRadioOpen: false,
      dialogueIndex: 0,
      dialogueHistory: [],
      completedObjectives: {},

      // Actions
      openRadio: () => {
        useAudioStore.getState().triggerRadioSquelch(true)
        set({ isRadioOpen: true })
      },

      closeRadio: () => {
        useAudioStore.getState().triggerRadioSquelch(false)
        set({ isRadioOpen: false })
      },

      selectResponse: (response) => {
        const { currentChapterIndex, dialogueIndex } = get()
        const chapter = STORY_CHAPTERS[currentChapterIndex]
        if (!chapter) return

        const currentLine = chapter.dialogue[dialogueIndex]
        if (!currentLine) return

        // Log to dialogue history
        set((state) => ({
          dialogueHistory: [
            ...state.dialogueHistory,
            { speaker: currentLine.speaker, text: currentLine.text },
            { speaker: 'You (Two-Pines)', text: response.text }
          ]
        }))

        // Play transmission squelch
        useAudioStore.getState().triggerRadioSquelch(true)

        if (response.nextIndex === -1) {
          // End of conversation branch
          set({ isRadioOpen: false, dialogueIndex: 0 })
          // Check if opening radio completes an objective
          get().completeObjective('open_radio')
        } else {
          set({ dialogueIndex: response.nextIndex })
        }
      },

      completeObjective: (actionId) => {
        const { currentChapterIndex, completedObjectives } = get()
        const chapter = STORY_CHAPTERS[currentChapterIndex]
        if (!chapter) return

        const matchingObj = chapter.objectives.find((obj) => obj.action === actionId)
        if (matchingObj) {
          const updatedKey = `${chapter.id}_${matchingObj.id}`
          if (!completedObjectives[updatedKey]) {
            set((state) => ({
              completedObjectives: {
                ...state.completedObjectives,
                [updatedKey]: true
              }
            }))

            // Check if all objectives in current chapter are complete
            const allComplete = chapter.objectives.every(
              (obj) => completedObjectives[`${chapter.id}_${obj.id}`] || obj.id === matchingObj.id
            )

            if (allComplete && currentChapterIndex < STORY_CHAPTERS.length - 1) {
              // Auto unlock next chapter notification
              setTimeout(() => {
                get().setChapter(currentChapterIndex + 1)
              }, 1200)
            }
          }
        }
      },

      setChapter: (index) => {
        if (index >= 0 && index < STORY_CHAPTERS.length) {
          const newChapter = STORY_CHAPTERS[index]
          set({ currentChapterIndex: index, dialogueIndex: 0 })

          // Apply chapter atmosphere
          if (newChapter.weatherPreset) {
            useTimeWeatherStore.getState().setPreset(newChapter.weatherPreset)
          }
          if (newChapter.initialTime) {
            useTimeWeatherStore.getState().setTime(newChapter.initialTime)
          }
        }
      },

      getCurrentChapter: () => {
        return STORY_CHAPTERS[get().currentChapterIndex] || STORY_CHAPTERS[0]
      },

      resetProgress: () => {
        set({
          currentChapterIndex: 0,
          dialogueIndex: 0,
          dialogueHistory: [],
          completedObjectives: {}
        })
        const firstCh = STORY_CHAPTERS[0]
        useTimeWeatherStore.getState().setPreset(firstCh.weatherPreset)
        useTimeWeatherStore.getState().setTime(firstCh.initialTime)
      }
    }),
    {
      name: 'two-pines-story-progress',
      partialize: (state) => ({
        currentChapterIndex: state.currentChapterIndex,
        completedObjectives: state.completedObjectives,
        dialogueHistory: state.dialogueHistory
      })
    }
  )
)
