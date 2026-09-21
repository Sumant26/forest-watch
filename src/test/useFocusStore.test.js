import { describe, it, expect, beforeEach } from 'vitest'
import { useFocusStore } from '../stores/useFocusStore'

describe('useFocusStore', () => {
  beforeEach(() => {
    useFocusStore.setState({
      isOpen: false,
      mode: 'work',
      durationMinutes: 25,
      secondsLeft: 25 * 60,
      isRunning: false,
      completedSessions: 0
    })
  })

  it('should switch between focus modes and adjust duration', () => {
    const store = useFocusStore.getState()
    store.setMode('short_break')
    expect(useFocusStore.getState().mode).toBe('short_break')
    expect(useFocusStore.getState().secondsLeft).toBe(5 * 60)

    store.setMode('long_break')
    expect(useFocusStore.getState().mode).toBe('long_break')
    expect(useFocusStore.getState().secondsLeft).toBe(15 * 60)
  })

  it('should toggle running and handle tick countdown', () => {
    const store = useFocusStore.getState()
    store.toggleRunning()
    expect(useFocusStore.getState().isRunning).toBe(true)

    store.tick()
    expect(useFocusStore.getState().secondsLeft).toBe(25 * 60 - 1)
  })

  it('should reset timer properly', () => {
    const store = useFocusStore.getState()
    useFocusStore.setState({ secondsLeft: 100, isRunning: true })
    store.resetTimer()
    expect(useFocusStore.getState().secondsLeft).toBe(25 * 60)
    expect(useFocusStore.getState().isRunning).toBe(false)
  })
})
