import React, { useEffect, useState } from 'react'
import { LookoutCanvas } from './components/canvas/LookoutCanvas'
import { HUDHeader } from './components/ui/HUDHeader'
import { InteractionPrompt } from './components/ui/InteractionPrompt'
import { SpottingScopeOverlay } from './components/ui/SpottingScopeOverlay'
import { RadioDialogueModal } from './components/ui/RadioDialogueModal'
import { LeatherJournalModal } from './components/ui/LeatherJournalModal'
import { RangerMapOverlay } from './components/ui/RangerMapOverlay'
import { AudioMixerDrawer } from './components/ui/AudioMixerDrawer'
import { FocusTimerModal } from './components/ui/FocusTimerModal'
import { SettingsModal } from './components/ui/SettingsModal'
import { VirtualJoystick } from './components/ui/VirtualJoystick'
import { PrologueIntroModal } from './components/ui/PrologueIntroModal'

import { useTimeWeatherStore } from './stores/useTimeWeatherStore'

function App() {
  const advanceTime = useTimeWeatherStore((state) => state.advanceTime)
  const [isMapOpen, setIsMapOpen] = useState(false)

  // In-game accelerated time loop
  useEffect(() => {
    let lastTime = performance.now()
    const loop = (now) => {
      const deltaSeconds = (now - lastTime) / 1000
      lastTime = now
      if (deltaSeconds > 0 && deltaSeconds < 2) {
        advanceTime(deltaSeconds)
      }
      requestAnimationFrame(loop)
    }

    const frameId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameId)
  }, [advanceTime])

  // KeyM / Custom Event listener for Topo Map
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return
      if (e.code === 'KeyM') {
        setIsMapOpen((prev) => !prev)
      }
    }

    const handleToggleMap = () => setIsMapOpen((prev) => !prev)

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('toggle-ranger-map', handleToggleMap)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('toggle-ranger-map', handleToggleMap)
    }
  }, [])

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0a0c10]">
      {/* 3D WebGL Canvas Layer */}
      <LookoutCanvas />

      {/* FPS & 3rd Person Contextual Navigation Banner */}
      <InteractionPrompt />

      {/* Spotting Scope Vignette & Optics Reticle */}
      <SpottingScopeOverlay />

      {/* Main UI Header Status & Controls */}
      <HUDHeader />

      {/* Walkie-Talkie Radio Dialogue Modal */}
      <RadioDialogueModal />

      {/* Leather Journal & Field Log Modal */}
      <LeatherJournalModal />

      {/* Handheld Shoshone Topo Map & Compass */}
      <RangerMapOverlay isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />

      {/* Soundscape Mixer & Mood Presets Drawer */}
      <AudioMixerDrawer />

      {/* Wind-up Focus / Pomodoro Timer Modal */}
      <FocusTimerModal />

      {/* Ranger Preferences & Settings Modal */}
      <SettingsModal />

      {/* Mobile Virtual Touch Joystick */}
      <VirtualJoystick />

      {/* Prologue Story Intro & Mode Chooser */}
      <PrologueIntroModal />
    </main>
  )
}

export default App
