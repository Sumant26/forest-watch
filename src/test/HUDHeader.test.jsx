import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { HUDHeader } from '../components/ui/HUDHeader'
import { useTimeWeatherStore } from '../stores/useTimeWeatherStore'
import { useStoryStore } from '../stores/useStoryStore'
import { useCameraStore, CAMERA_MODES } from '../stores/useCameraStore'

describe('HUDHeader Component', () => {
  beforeEach(() => {
    useTimeWeatherStore.setState({
      time: 17.5,
      weather: 'clear',
      timeSpeed: 1,
      isPaused: false
    })
    useStoryStore.getState().resetProgress()
    useCameraStore.setState({ mode: CAMERA_MODES.FIRST_PERSON })
  })

  it('renders Two-Pines lookout brand and time display', () => {
    useTimeWeatherStore.setState({ time: 17.5 })
    render(<HUDHeader />)
    const elements = screen.getAllByText(/Two-Pines/i)
    expect(elements.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Lookout Station/i)).toBeInTheDocument()
    expect(screen.getByText(/5:30 PM/i)).toBeInTheDocument()
  })

  it('allows clicking camera mode buttons to switch viewpoint', () => {
    render(<HUDHeader />)
    const scopeBtn = screen.getByTitle(/Spotting Scope/i)
    fireEvent.click(scopeBtn)
    expect(useCameraStore.getState().mode).toBe(CAMERA_MODES.SCOPE)
  })

  it('allows opening the walkie-talkie radio modal', () => {
    render(<HUDHeader />)
    const radioBtn = screen.getByTitle(/Open Walkie-Talkie Radio/i)
    fireEvent.click(radioBtn)
    expect(useStoryStore.getState().isRadioOpen).toBe(true)
  })
})
