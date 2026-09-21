import { describe, it, expect, beforeEach } from 'vitest'
import { useSettingsStore, QUALITY_LEVELS } from '../stores/useSettingsStore'
import { useTimeWeatherStore } from '../stores/useTimeWeatherStore'
import { useStoryStore } from '../stores/useStoryStore'

describe('useSettingsStore', () => {
  beforeEach(() => {
    useSettingsStore.setState({
      isOpen: false,
      quality: QUALITY_LEVELS.HIGH,
      showHelp: false
    })
  })

  it('should switch quality levels', () => {
    const store = useSettingsStore.getState()
    store.setQuality(QUALITY_LEVELS.LOW)
    expect(useSettingsStore.getState().quality).toBe(QUALITY_LEVELS.LOW)

    store.setQuality(QUALITY_LEVELS.ULTRA)
    expect(useSettingsStore.getState().quality).toBe(QUALITY_LEVELS.ULTRA)
  })

  it('should export valid JSON save profile', () => {
    useTimeWeatherStore.setState({ time: 19.5, weather: 'thunderstorm' })
    const store = useSettingsStore.getState()
    const jsonStr = store.exportSaveData()

    const parsed = JSON.parse(jsonStr)
    expect(parsed.version).toBe('1.0.0')
    expect(parsed.timeWeather.weather).toBe('thunderstorm')
  })

  it('should import and restore save profile data', () => {
    const testSave = JSON.stringify({
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      timeWeather: {
        time: 6.5,
        weather: 'mist',
        preset: 'misty_dawn'
      },
      story: {
        currentChapterIndex: 2
      },
      settings: {
        quality: QUALITY_LEVELS.MEDIUM
      }
    })

    const store = useSettingsStore.getState()
    const result = store.importSaveData(testSave)

    expect(result.success).toBe(true)
    expect(useTimeWeatherStore.getState().time).toBe(6.5)
    expect(useTimeWeatherStore.getState().weather).toBe('mist')
    expect(useStoryStore.getState().currentChapterIndex).toBe(2)
    expect(useSettingsStore.getState().quality).toBe(QUALITY_LEVELS.MEDIUM)
  })
})
