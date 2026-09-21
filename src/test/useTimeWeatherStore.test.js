import { describe, it, expect, beforeEach } from 'vitest'
import { useTimeWeatherStore } from '../stores/useTimeWeatherStore'

describe('useTimeWeatherStore', () => {
  beforeEach(() => {
    useTimeWeatherStore.setState({
      time: 17.5,
      timeSpeed: 1,
      isPaused: false,
      weather: 'clear',
      preset: 'dynamic'
    })
  })

  it('should advance time correctly when not paused', () => {
    const store = useTimeWeatherStore.getState()
    store.advanceTime(30) // 30 seconds at 1x = 0.25 in-game hours (48 min day cycle)
    expect(useTimeWeatherStore.getState().time).toBeCloseTo(17.75, 2)
  })

  it('should not advance time when paused', () => {
    const store = useTimeWeatherStore.getState()
    store.togglePause()
    store.advanceTime(30)
    expect(useTimeWeatherStore.getState().time).toBe(17.5)
  })

  it('should format in-game time properly into 12-hour period', () => {
    useTimeWeatherStore.setState({ time: 7.5 })
    expect(useTimeWeatherStore.getState().getFormattedTime()).toBe('7:30 AM')

    useTimeWeatherStore.setState({ time: 18.0 })
    expect(useTimeWeatherStore.getState().getFormattedTime()).toBe('6:00 PM')
  })

  it('should apply weather presets accurately', () => {
    const store = useTimeWeatherStore.getState()
    store.setPreset('misty_dawn')
    expect(useTimeWeatherStore.getState().weather).toBe('mist')
    expect(useTimeWeatherStore.getState().time).toBe(6.2)

    store.setPreset('thunderstorm_dusk')
    expect(useTimeWeatherStore.getState().weather).toBe('thunderstorm')
    expect(useTimeWeatherStore.getState().time).toBe(19.5)
  })

  it('should calculate valid 3D atmosphere parameters', () => {
    useTimeWeatherStore.setState({ time: 18.0, weather: 'clear' })
    const params = useTimeWeatherStore.getState().getAtmosphereParams()
    expect(params.sunPosition).toHaveLength(3)
    expect(params.skyTop).toBeDefined()
    expect(params.fogColor).toBeDefined()
    expect(params.isNight).toBe(false)
  })
})
