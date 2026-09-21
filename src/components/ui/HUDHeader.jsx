import React from 'react'
import {
  Sun,
  CloudRain,
  CloudFog,
  CloudLightning,
  Play,
  Pause,
  Radio,
  BookOpen,
  Sliders,
  Timer,
  Settings,
  Eye,
  User,
  Compass,
  Maximize2,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react'
import { useTimeWeatherStore } from '../../stores/useTimeWeatherStore'
import { useCameraStore, CAMERA_MODES } from '../../stores/useCameraStore'
import { useAudioStore } from '../../stores/useAudioStore'
import { useStoryStore } from '../../stores/useStoryStore'
import { useJournalStore } from '../../stores/useJournalStore'
import { useFocusStore } from '../../stores/useFocusStore'
import { useSettingsStore } from '../../stores/useSettingsStore'

export function HUDHeader() {
  const time = useTimeWeatherStore((state) => state.time)
  const timeSpeed = useTimeWeatherStore((state) => state.timeSpeed)
  const isPaused = useTimeWeatherStore((state) => state.isPaused)
  const weather = useTimeWeatherStore((state) => state.weather)
  const setTimeSpeed = useTimeWeatherStore((state) => state.setTimeSpeed)
  const togglePause = useTimeWeatherStore((state) => state.togglePause)
  const getFormattedTime = useTimeWeatherStore((state) => state.getFormattedTime)

  const cameraMode = useCameraStore((state) => state.mode)
  const setCameraMode = useCameraStore((state) => state.setMode)

  const isAudioStarted = useAudioStore((state) => state.isAudioStarted)
  const isMuted = useAudioStore((state) => state.isMuted)
  const toggleMute = useAudioStore((state) => state.toggleMute)
  const initAudio = useAudioStore((state) => state.initAudio)

  const currentChapter = useStoryStore((state) => state.getCurrentChapter())
  const completedObjectives = useStoryStore((state) => state.completedObjectives)
  const openRadio = useStoryStore((state) => state.openRadio)
  const openJournal = useJournalStore((state) => state.openJournal)
  const openFocusModal = useFocusStore((state) => state.openFocusModal)
  const openSettings = useSettingsStore((state) => state.openSettings)

  // Active objective text
  const activeObj = currentChapter.objectives.find(
    (obj) => !completedObjectives[`${currentChapter.id}_${obj.id}`]
  ) || currentChapter.objectives[currentChapter.objectives.length - 1]

  const renderWeatherIcon = () => {
    switch (weather) {
      case 'mist':
        return <CloudFog className="w-4 h-4 text-slate-300" />
      case 'rain':
        return <CloudRain className="w-4 h-4 text-blue-400" />
      case 'thunderstorm':
        return <CloudLightning className="w-4 h-4 text-amber-400" />
      case 'clear':
      default:
        return <Sun className="w-4 h-4 text-amber-500" />
    }
  }

  const cameraButtons = [
    { id: CAMERA_MODES.FIRST_PERSON, label: 'FPS (V)', icon: Eye, title: 'First-Person Lookout [V]' },
    { id: CAMERA_MODES.THIRD_PERSON, label: '3rd Person', icon: User, title: 'Third-Person Ranger [V]' },
    { id: CAMERA_MODES.CINEMATIC, label: 'Cinematic (C)', icon: Sparkles, title: 'Cinematic Scenic Drone [C]' },
    { id: CAMERA_MODES.DESK, label: 'Desk', icon: BookOpen, title: 'Desk & Radio' },
    { id: CAMERA_MODES.SCOPE, label: 'Scope', icon: Compass, title: 'Spotting Scope' },
    { id: CAMERA_MODES.BALCONY, label: 'Balcony', icon: Maximize2, title: 'Balcony Panorama' }
  ]

  return (
    <header
      id="main-hud-header"
      className="absolute top-0 left-0 right-0 z-30 p-3 sm:p-5 flex flex-wrap items-center justify-between gap-3 pointer-events-none"
    >
      {/* --- Left: Station Badge & Simulation Clock --- */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        <div className="fw-panel rounded-2xl px-4 py-2.5 flex items-center gap-3.5 shadow-xl">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🌲</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-sans">
                Two-Pines
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-tight">
                Lookout Station • 8,420 ft
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-white/10" />

          {/* Time & Weather */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-mono font-semibold text-slate-100">
              {renderWeatherIcon()}
              <span>{getFormattedTime()}</span>
            </div>

            {/* Speed Badges */}
            <div className="flex items-center gap-1 bg-black/40 rounded-lg p-0.5 border border-white/10">
              <button
                type="button"
                onClick={togglePause}
                title={isPaused ? 'Resume Time' : 'Pause Time'}
                className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-amber-400 transition-colors"
              >
                {isPaused ? <Play className="w-3 h-3 text-amber-400" /> : <Pause className="w-3 h-3" />}
              </button>
              {[1, 3, 5, 10].map((spd) => (
                <button
                  key={`spd-${spd}`}
                  type="button"
                  onClick={() => setTimeSpeed(spd)}
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold transition-all ${
                    timeSpeed === spd && !isPaused
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Story Objective Callout */}
        <div className="hidden xl:flex items-center gap-2.5 fw-panel rounded-2xl px-4 py-2.5 text-xs shadow-xl">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <div className="text-slate-200">
            <span className="text-amber-400 font-bold">Ch {currentChapter.number}:</span>{' '}
            <span className="text-slate-300 font-mono text-[11px]">{activeObj?.text}</span>
          </div>
        </div>
      </div>

      {/* --- Center: Camera Switcher (Clean, distinct tabs) --- */}
      <div className="pointer-events-auto flex items-center gap-1.5 fw-panel rounded-2xl p-1.5 shadow-xl">
        {cameraButtons.map((btn) => {
          const Icon = btn.icon
          const isActive = cameraMode === btn.id
          return (
            <button
              key={btn.id}
              type="button"
              title={btn.title}
              onClick={() => setCameraMode(btn.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-amber-600 text-white shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{btn.label}</span>
            </button>
          )
        })}
      </div>

      {/* --- Right: Quick Action Controls --- */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Audio Mute/Unmute */}
        <button
          type="button"
          onClick={() => {
            if (!isAudioStarted) initAudio()
            else toggleMute()
          }}
          title={isMuted ? 'Unmute Nature Soundscape' : 'Mute Soundscape'}
          className={`p-2.5 rounded-2xl fw-panel text-slate-300 hover:text-amber-400 transition-all shadow-xl ${
            isAudioStarted && !isMuted ? 'text-amber-400 border-amber-500/30' : ''
          }`}
        >
          {isMuted || !isAudioStarted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Radio Walkie-Talkie */}
        <button
          type="button"
          onClick={openRadio}
          title="Open Walkie-Talkie Radio"
          className="relative px-3.5 py-2.5 rounded-2xl fw-panel-amber flex items-center gap-2 text-xs font-bold text-amber-200 hover:bg-amber-900/60 transition-all shadow-xl active:scale-95"
        >
          <Radio className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Radio</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>

        {/* Topo Map & Compass */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-ranger-map'))}
          title="Open Topo Map & Compass (Press M)"
          className="px-3.5 py-2.5 rounded-2xl fw-panel flex items-center gap-2 text-xs font-bold text-slate-200 hover:bg-white/10 transition-all shadow-xl active:scale-95"
        >
          <Compass className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Map</span>
        </button>

        {/* Journal */}
        <button
          type="button"
          onClick={() => openJournal('sightings')}
          title="Open Leather Journal"
          className="px-3.5 py-2.5 rounded-2xl fw-panel flex items-center gap-2 text-xs font-bold text-slate-200 hover:bg-white/10 transition-all shadow-xl active:scale-95"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Journal</span>
        </button>

        {/* Focus Timer */}
        <button
          type="button"
          onClick={openFocusModal}
          title="Cozy Focus Timer"
          className="p-2.5 rounded-2xl fw-panel text-slate-300 hover:text-amber-400 hover:bg-white/10 transition-all shadow-xl active:scale-95"
        >
          <Timer className="w-4 h-4" />
        </button>

        {/* Settings */}
        <button
          type="button"
          onClick={openSettings}
          title="Preferences & Save Management"
          className="p-2.5 rounded-2xl fw-panel text-slate-300 hover:text-white hover:bg-white/10 transition-all shadow-xl active:scale-95"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
