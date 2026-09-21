import { describe, it, expect, beforeEach } from 'vitest'
import { useAudioStore } from '../stores/useAudioStore'

describe('useAudioStore', () => {
  beforeEach(() => {
    useAudioStore.setState({
      masterVolume: 0.75,
      isMuted: false,
      tapeWarble: true,
      channels: {
        rain: 0.65,
        wind: 0.45,
        stove: 0.55,
        nature: 0.50,
        music: 0.40,
        radio: 0.75
      }
    })
  })

  it('should update master volume and clamp boundaries', () => {
    const store = useAudioStore.getState()
    store.setMasterVolume(0.9)
    expect(useAudioStore.getState().masterVolume).toBe(0.9)

    store.setMasterVolume(1.5)
    expect(useAudioStore.getState().masterVolume).toBe(1.0)
  })

  it('should update individual channel volumes', () => {
    const store = useAudioStore.getState()
    store.setChannelVolume('rain', 0.85)
    expect(useAudioStore.getState().channels.rain).toBe(0.85)
  })

  it('should toggle mute state and tape warble filter', () => {
    const store = useAudioStore.getState()
    store.toggleMute()
    expect(useAudioStore.getState().isMuted).toBe(true)

    store.toggleTapeWarble()
    expect(useAudioStore.getState().tapeWarble).toBe(false)
  })
})
