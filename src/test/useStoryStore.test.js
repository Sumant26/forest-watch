import { describe, it, expect, beforeEach } from 'vitest'
import { useStoryStore } from '../stores/useStoryStore'

describe('useStoryStore', () => {
  beforeEach(() => {
    useStoryStore.getState().resetProgress()
  })

  it('should initialize at Chapter 0 Prologue with radio closed', () => {
    const store = useStoryStore.getState()
    expect(store.currentChapterIndex).toBe(0)
    expect(store.isRadioOpen).toBe(false)
    expect(store.getCurrentChapter().number).toBe(0)
    expect(store.getCurrentChapter().title).toBe('The Hike to Two-Pines')
  })

  it('should open and close walkie-talkie radio', () => {
    const store = useStoryStore.getState()
    store.openRadio()
    expect(useStoryStore.getState().isRadioOpen).toBe(true)

    store.closeRadio()
    expect(useStoryStore.getState().isRadioOpen).toBe(false)
  })

  it('should complete story objectives when triggered', () => {
    const store = useStoryStore.getState()
    store.completeObjective('reach_bridge')
    expect(useStoryStore.getState().completedObjectives['ch0_ch0_obj1']).toBe(true)
  })

  it('should advance chapter on manual jump', () => {
    const store = useStoryStore.getState()
    store.setChapter(1) // Chapter 1: First Morning at Two-Pines
    expect(useStoryStore.getState().currentChapterIndex).toBe(1)
    expect(useStoryStore.getState().getCurrentChapter().title).toBe('First Morning at Two-Pines')

    store.setChapter(2) // Chapter 2: Smoke or Steam?
    expect(useStoryStore.getState().currentChapterIndex).toBe(2)
    expect(useStoryStore.getState().getCurrentChapter().title).toBe('Smoke or Steam?')
  })
})
