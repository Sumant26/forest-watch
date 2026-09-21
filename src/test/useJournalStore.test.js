import { describe, it, expect, beforeEach } from 'vitest'
import { useJournalStore } from '../stores/useJournalStore'

describe('useJournalStore', () => {
  beforeEach(() => {
    useJournalStore.setState({
      isOpen: false,
      activeTab: 'sightings',
      discoveredSightings: ['spot_thorofare'],
      weatherLogs: [],
      personalNotes: 'Test field notes',
      polaroids: []
    })
  })

  it('should discover new sightings and avoid duplicates', () => {
    const store = useJournalStore.getState()
    store.discoverSighting('spot_geyser')
    expect(useJournalStore.getState().discoveredSightings).toContain('spot_geyser')

    // Adding same id again
    store.discoverSighting('spot_geyser')
    expect(
      useJournalStore.getState().discoveredSightings.filter((id) => id === 'spot_geyser')
    ).toHaveLength(1)
  })

  it('should record weather logs', () => {
    const store = useJournalStore.getState()
    store.addWeatherLog({
      timestamp: 'Day 1 - 08:00 AM',
      weather: 'CLEAR',
      barometer: '29.98 inHg',
      temperature: '65°F',
      wind: '5 mph W'
    })
    expect(useJournalStore.getState().weatherLogs).toHaveLength(1)
    expect(useJournalStore.getState().weatherLogs[0].weather).toBe('CLEAR')
  })

  it('should update field notes', () => {
    const store = useJournalStore.getState()
    store.updateNotes('Saw an eagle flying above Granite Peak.')
    expect(useJournalStore.getState().personalNotes).toBe('Saw an eagle flying above Granite Peak.')
  })

  it('should save polaroid photos', () => {
    const store = useJournalStore.getState()
    store.addPolaroid({
      caption: 'Meadow Creek Sunset',
      dataUrl: 'data:image/jpeg;base64,sample'
    })
    expect(useJournalStore.getState().polaroids).toHaveLength(1)
    expect(useJournalStore.getState().polaroids[0].caption).toBe('Meadow Creek Sunset')
  })
})
