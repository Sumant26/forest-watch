import React, { useState } from 'react'
import {
  Sliders,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Radio,
  CloudRain,
  Wind,
  Flame,
  Music,
  Sparkles
} from 'lucide-react'
import { useAudioStore } from '../../stores/useAudioStore'
import { useTimeWeatherStore } from '../../stores/useTimeWeatherStore'

export function AudioMixerDrawer() {
  const [isOpen, setIsOpen] = useState(false)

  const masterVolume = useAudioStore((state) => state.masterVolume)
  const isMuted = useAudioStore((state) => state.isMuted)
  const tapeWarble = useAudioStore((state) => state.tapeWarble)
  const channels = useAudioStore((state) => state.channels)
  const setMasterVolume = useAudioStore((state) => state.setMasterVolume)
  const setChannelVolume = useAudioStore((state) => state.setChannelVolume)
  const toggleMute = useAudioStore((state) => state.toggleMute)
  const toggleTapeWarble = useAudioStore((state) => state.toggleTapeWarble)
  const initAudio = useAudioStore((state) => state.initAudio)
  const isAudioStarted = useAudioStore((state) => state.isAudioStarted)

  const setPreset = useTimeWeatherStore((state) => state.setPreset)
  const activePreset = useTimeWeatherStore((state) => state.preset)

  const channelList = [
    { key: 'rain', label: 'Tin Roof Rain', icon: CloudRain },
    { key: 'wind', label: 'Pine Wind', icon: Wind },
    { key: 'stove', label: 'Woodstove Fire', icon: Flame },
    { key: 'nature', label: 'Forest Birds / Crickets', icon: Sparkles },
    { key: 'music', label: 'Lo-Fi Acoustic Chords', icon: Music },
    { key: 'radio', label: 'Radio Squelch', icon: Radio }
  ]

  const moodPresets = [
    { id: 'golden_hour', label: '🌅 Golden Hour' },
    { id: 'misty_dawn', label: '🌫️ Misty Dawn' },
    { id: 'rainy_afternoon', label: '🌧️ Rainy Afternoon' },
    { id: 'thunderstorm_dusk', label: '⚡ Thunder Dusk' },
    { id: 'starry_night', label: '✨ Starry Midnight' }
  ]

  return (
    <div
      id="audio-mixer-drawer"
      className="fixed bottom-4 right-4 z-30 flex flex-col items-end pointer-events-none"
    >
      {/* Drawer Body */}
      {isOpen && (
        <div className="w-80 sm:w-96 glass-panel-warm rounded-3xl p-5 border border-amber-500/30 shadow-2xl mb-2 pointer-events-auto animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-amber-100 uppercase tracking-wider">
                Soundscape Mixer
              </h3>
            </div>

            {/* Vintage Tape Warble Button */}
            <button
              type="button"
              onClick={toggleTapeWarble}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all border ${
                tapeWarble
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-black/30 text-stone-400 border-white/10'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  tapeWarble ? 'bg-amber-400 animate-pulse' : 'bg-stone-500'
                }`}
              />
              <span>Tape Warble</span>
            </button>
          </div>

          {/* Master Volume */}
          <div className="bg-black/30 rounded-2xl p-3 mb-3 border border-white/5 flex items-center gap-3">
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 rounded-xl hover:bg-white/10 text-stone-300 hover:text-amber-300 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
            <div className="flex-1">
              <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono mb-1">
                <span>MASTER VOLUME</span>
                <span>{Math.round(masterVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={masterVolume}
                onChange={(e) => {
                  if (!isAudioStarted) initAudio()
                  setMasterVolume(parseFloat(e.target.value))
                }}
                className="w-full accent-amber-500 h-1.5 bg-stone-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Individual Channel Sliders */}
          <div className="space-y-2 mb-4">
            {channelList.map((ch) => {
              const Icon = ch.icon
              const val = channels[ch.key] ?? 0.5
              return (
                <div key={ch.key} className="flex items-center gap-2 text-xs">
                  <Icon className="w-3.5 h-3.5 text-amber-400/80" />
                  <span className="w-32 text-stone-300 text-[11px] truncate font-medium">
                    {ch.label}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={val}
                    onChange={(e) => {
                      if (!isAudioStarted) initAudio()
                      setChannelVolume(ch.key, parseFloat(e.target.value))
                    }}
                    className="flex-1 accent-amber-500 h-1 bg-stone-700/80 rounded cursor-pointer"
                  />
                  <span className="w-7 text-right text-[10px] text-stone-400 font-mono">
                    {Math.round(val * 100)}%
                  </span>
                </div>
              )
            })}
          </div>

          {/* Cozy Atmosphere Presets */}
          <div className="border-t border-amber-500/20 pt-3">
            <div className="text-[10px] font-mono text-amber-300/80 uppercase mb-2">
              Atmosphere Presets
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {moodPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setPreset(preset.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-medium text-left transition-all border ${
                    activePreset === preset.id
                      ? 'bg-amber-600/30 text-amber-200 border-amber-500/50'
                      : 'bg-black/20 text-stone-300 border-white/5 hover:bg-white/10'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto px-4 py-2.5 rounded-2xl glass-panel-warm flex items-center gap-2 text-xs font-semibold text-amber-200 hover:bg-amber-900/50 transition-all shadow-xl active:scale-95 border border-amber-500/30"
      >
        <Sliders className="w-4 h-4 text-amber-400" />
        <span>Soundscape & Moods</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </div>
  )
}
