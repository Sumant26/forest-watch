import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Weather Modes: 'clear' | 'mist' | 'rain' | 'thunderstorm'
 * Time is represented in 24-hour decimal (e.g. 17.5 = 17:30 = 5:30 PM)
 * Default: 17.5 (Golden Hour Sunset over Two Pines)
 */
export const useTimeWeatherStore = create(
  persist(
    (set, get) => ({
      time: 18.2, // Golden Hour Sunset (6:12 PM)
      timeSpeed: 1, // 1x = 48 real minutes per full day (slow, cinematic progression)
      isPaused: false,
      weather: 'clear',
      preset: 'golden_hour',

      // Actions
      advanceTime: (deltaSeconds) => {
        const { isPaused, timeSpeed, time, weather, preset } = get()
        if (isPaused) return

        // 24 in-game hours / (48 * 60 seconds) = 1/120 in-game hours per real second at 1x
        const hoursToAdd = (deltaSeconds * timeSpeed) / 120
        let newTime = (time + hoursToAdd) % 24

        // Dynamic weather cycling only if on dynamic preset
        let newWeather = weather
        if (preset === 'dynamic') {
          if (newTime >= 12 && newTime < 14 && weather === 'clear' && Math.random() < 0.0005) {
            newWeather = 'mist'
          } else if (newTime >= 14 && newTime < 18 && weather === 'mist' && Math.random() < 0.0008) {
            newWeather = 'rain'
          } else if (newTime >= 18 && newTime < 21 && weather === 'rain' && Math.random() < 0.0005) {
            newWeather = 'thunderstorm'
          }
        }

        set({ time: newTime, weather: newWeather })
      },

      setTime: (newTime) => set({ time: Math.max(0, Math.min(24, newTime)) }),
      
      setTimeSpeed: (speed) => set({ timeSpeed: speed }),
      
      togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
      
      setWeather: (weather) => set({ weather, preset: 'custom' }),
      
      setPreset: (presetName) => {
        switch (presetName) {
          case 'golden_hour':
            set({ time: 18.0, weather: 'clear', preset: 'golden_hour' })
            break
          case 'misty_dawn':
            set({ time: 6.2, weather: 'mist', preset: 'misty_dawn' })
            break
          case 'rainy_afternoon':
            set({ time: 15.0, weather: 'rain', preset: 'rainy_afternoon' })
            break
          case 'thunderstorm_dusk':
            set({ time: 19.5, weather: 'thunderstorm', preset: 'thunderstorm_dusk' })
            break
          case 'starry_night':
            set({ time: 23.5, weather: 'clear', preset: 'starry_night' })
            break
          case 'dynamic':
          default:
            set({ preset: 'dynamic' })
            break
        }
      },

      // Helper to compute formatted time string (e.g., "05:45 PM")
      getFormattedTime: () => {
        const t = get().time
        const hours24 = Math.floor(t)
        const minutes = Math.floor((t - hours24) * 60)
        const period = hours24 >= 12 ? 'PM' : 'AM'
        const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12
        const paddedMin = minutes < 10 ? `0${minutes}` : minutes
        return `${hours12}:${paddedMin} ${period}`
      },

      // Atmospheric color & sun calculations for 3D shaders
      getAtmosphereParams: () => {
        const { time, weather } = get()
        
        // Sun elevation calculation (-1 at midnight to 1 at noon)
        // Peak sun at 12:00 (1.0), lowest at 00:00 (-1.0)
        const sunAngle = ((time - 6) / 12) * Math.PI
        const sunElevation = Math.sin(sunAngle)
        const sunAzimuth = ((time - 6) / 24) * Math.PI * 2

        // Sun position vector in 3D
        const distance = 120
        const sunX = Math.cos(sunAzimuth) * distance
        const sunY = Math.max(-10, Math.sin(sunAngle) * distance)
        const sunZ = Math.sin(sunAzimuth) * 40

        // Authentic Firewatch Multi-layer Sunset Palettes
        let skyTop = '#1c1132'
        let skyBottom = '#ffab2e'
        let fogColor = '#e86820'
        let ambientIntensity = 0.75
        let sunColor = '#ff9533'
        let sunIntensity = 2.2

        if (time >= 5 && time < 7.5) {
          // Dawn (Firewatch Misty Morning Rose/Peach)
          skyTop = '#2e1b4e'
          skyBottom = '#fca5a5'
          fogColor = '#c07281'
          ambientIntensity = 0.6
          sunColor = '#ffb399'
          sunIntensity = 1.4
        } else if (time >= 7.5 && time < 16.5) {
          // Bright Crisp Afternoon Sun
          skyTop = '#1e3a8a'
          skyBottom = '#38bdf8'
          fogColor = '#7dd3fc'
          ambientIntensity = 0.85
          sunColor = '#ffffff'
          sunIntensity = 2.2
        } else if (time >= 16.5 && time < 19.5) {
          // Signature Firewatch Sunset Orange / Amber
          skyTop = '#1e0c2b'
          skyBottom = '#ea580c'
          fogColor = '#f97316'
          ambientIntensity = 0.8
          sunColor = '#fb923c'
          sunIntensity = 2.5
        } else if (time >= 19.5 && time < 21.5) {
          // Twilight Purple / Magenta Horizon
          skyTop = '#090514'
          skyBottom = '#581c87'
          fogColor = '#3b0764'
          ambientIntensity = 0.4
          sunColor = '#c084fc'
          sunIntensity = 0.8
        } else {
          // Moonlit Starry Night
          skyTop = '#02040a'
          skyBottom = '#0b1329'
          fogColor = '#060a17'
          ambientIntensity = 0.25
          sunColor = '#93c5fd'
          sunIntensity = 0.5
        }

        // Weather modifiers
        if (weather === 'mist') {
          fogColor = '#64748b'
          ambientIntensity *= 0.8
          sunIntensity *= 0.5
        } else if (weather === 'rain') {
          skyTop = '#0f172a'
          skyBottom = '#334155'
          fogColor = '#1e293b'
          ambientIntensity *= 0.6
          sunIntensity *= 0.3
        } else if (weather === 'thunderstorm') {
          skyTop = '#05070d'
          skyBottom = '#0f172a'
          fogColor = '#0b1120'
          ambientIntensity *= 0.35
          sunIntensity *= 0.15
        }

        return {
          sunElevation,
          sunPosition: [sunX, sunY, sunZ],
          skyTop,
          skyBottom,
          fogColor,
          ambientIntensity,
          sunColor,
          sunIntensity,
          isNight: time < 5.5 || time >= 21.0
        }
      }
    }),
    {
      name: 'two-pines-time-weather',
      partialize: (state) => ({
        time: state.time,
        timeSpeed: state.timeSpeed,
        weather: state.weather,
        preset: state.preset
      })
    }
  )
)
