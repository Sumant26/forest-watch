import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SIGHTINGS_DATA } from '../data/sightingsData'
import { useStoryStore } from './useStoryStore'

export const useJournalStore = create(
  persist(
    (set, get) => ({
      isOpen: false,
      activeTab: 'sightings', // 'sightings' | 'weather' | 'notes' | 'polaroids' | 'objectives'
      discoveredSightings: ['spot_thorofare'], // Initial unlocked sighting
      weatherLogs: [
        {
          id: 'log_init',
          timestamp: 'Day 1 - 07:30 AM',
          weather: 'Crisp Morning Mist',
          barometer: '29.94 inHg',
          temperature: '54°F / 12°C',
          wind: '4 mph NW'
        }
      ],
      personalNotes: 'First day stationed at Two-Pines. The smell of cedar and pine needles is incredible. Willow over at Thorofare is friendly on the radio.',
      polaroids: [],

      // Actions
      openJournal: (tab = 'sightings') => {
        set({ isOpen: true, activeTab: tab })
        useStoryStore.getState().completeObjective('open_journal')
      },

      closeJournal: () => set({ isOpen: false }),

      setTab: (tab) => set({ activeTab: tab }),

      discoverSighting: (sightingId) => {
        const { discoveredSightings } = get()
        if (!discoveredSightings.includes(sightingId)) {
          set({
            discoveredSightings: [...discoveredSightings, sightingId]
          })
          // Trigger story objective if applicable
          useStoryStore.getState().completeObjective(sightingId)
        }
      },

      addWeatherLog: (entry) => {
        set((state) => ({
          weatherLogs: [
            {
              id: `log_${Date.now()}`,
              timestamp: entry.timestamp,
              weather: entry.weather,
              barometer: entry.barometer,
              temperature: entry.temperature,
              wind: entry.wind
            },
            ...state.weatherLogs
          ]
        }))
      },

      updateNotes: (notes) => set({ personalNotes: notes }),

      addPolaroid: (polaroid) => {
        set((state) => ({
          polaroids: [
            {
              id: `polaroid_${Date.now()}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              caption: polaroid.caption || 'Lookout Horizon View',
              dataUrl: polaroid.dataUrl
            },
            ...state.polaroids
          ]
        }))
        useStoryStore.getState().completeObjective('take_polaroid')
      },

      getDiscoveredDetails: () => {
        const { discoveredSightings } = get()
        return SIGHTINGS_DATA.map((item) => ({
          ...item,
          isDiscovered: discoveredSightings.includes(item.id)
        }))
      }
    }),
    {
      name: 'two-pines-journal-data',
      partialize: (state) => ({
        discoveredSightings: state.discoveredSightings,
        weatherLogs: state.weatherLogs,
        personalNotes: state.personalNotes,
        polaroids: state.polaroids
      })
    }
  )
)
