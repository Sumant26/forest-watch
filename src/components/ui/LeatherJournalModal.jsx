import React from 'react'
import {
  BookOpen,
  X,
  Compass,
  CloudSun,
  Edit3,
  Image as ImageIcon,
  CheckSquare,
  Plus,
  Download
} from 'lucide-react'
import { useJournalStore } from '../../stores/useJournalStore'
import { useTimeWeatherStore } from '../../stores/useTimeWeatherStore'
import { useStoryStore } from '../../stores/useStoryStore'
import { SIGHTINGS_DATA } from '../../data/sightingsData'
import { STORY_CHAPTERS } from '../../data/storyChapters'

export function LeatherJournalModal() {
  const isOpen = useJournalStore((state) => state.isOpen)
  const closeJournal = useJournalStore((state) => state.closeJournal)
  const activeTab = useJournalStore((state) => state.activeTab)
  const setTab = useJournalStore((state) => state.setTab)

  const discoveredSightings = useJournalStore((state) => state.discoveredSightings)
  const weatherLogs = useJournalStore((state) => state.weatherLogs)
  const addWeatherLog = useJournalStore((state) => state.addWeatherLog)
  const personalNotes = useJournalStore((state) => state.personalNotes)
  const updateNotes = useJournalStore((state) => state.updateNotes)
  const polaroids = useJournalStore((state) => state.polaroids)

  const weather = useTimeWeatherStore((state) => state.weather)
  const getFormattedTime = useTimeWeatherStore((state) => state.getFormattedTime)

  const currentChapterIndex = useStoryStore((state) => state.currentChapterIndex)
  const completedObjectives = useStoryStore((state) => state.completedObjectives)
  const currentChapter = STORY_CHAPTERS[currentChapterIndex] || STORY_CHAPTERS[0]

  if (!isOpen) return null

  // Log current weather button handler
  const handleLogCurrentWeather = () => {
    let temp = '62°F / 17°C'
    let baro = '29.98 inHg'
    let wind = '5 mph W'

    if (weather === 'rain') {
      temp = '50°F / 10°C'
      baro = '29.74 inHg'
      wind = '12 mph NW'
    } else if (weather === 'thunderstorm') {
      temp = '46°F / 8°C'
      baro = '29.58 inHg'
      wind = '22 mph SW'
    } else if (weather === 'mist') {
      temp = '54°F / 12°C'
      baro = '29.88 inHg'
      wind = '3 mph N'
    }

    addWeatherLog({
      timestamp: `Day ${currentChapter.number} - ${getFormattedTime()}`,
      weather: weather.toUpperCase(),
      barometer: baro,
      temperature: temp,
      wind: wind
    })
  }

  return (
    <div
      id="leather-journal-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#2a170f] rounded-3xl border-2 border-[#5c361e] shadow-2xl overflow-hidden">
        {/* Leather Journal Spine & Header */}
        <div className="bg-[#1c0e09] px-6 py-4 border-b border-[#472814] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-amber-100 font-vintage tracking-wider">
                Official Ranger Field Log
              </h2>
              <p className="text-[11px] text-stone-300 font-mono">
                Two-Pines Station • Shoshone District
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeJournal}
            title="Close Journal"
            className="p-2 text-stone-300 hover:text-amber-200 hover:bg-white/10 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 py-2 bg-[#22120a] border-b border-[#472814] overflow-x-auto">
          {[
            { id: 'sightings', label: 'Sightings', icon: Compass, count: discoveredSightings.length },
            { id: 'weather', label: 'Weather Logs', icon: CloudSun, count: weatherLogs.length },
            { id: 'objectives', label: 'Objectives', icon: CheckSquare },
            { id: 'notes', label: 'Field Notes', icon: Edit3 },
            { id: 'polaroids', label: 'Polaroids', icon: ImageIcon, count: polaroids.length }
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#f6eedb] text-[#2a170f] shadow-md font-bold'
                    : 'text-stone-300 hover:text-amber-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-[#2a170f] text-[#f6eedb]' : 'bg-black/40 text-stone-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Journal Paper Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 bg-[#f6eedb] text-[#2a170f]">
          {/* TAB 1: SIGHTINGS */}
          {activeTab === 'sightings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#2a170f]/20 pb-3">
                <div>
                  <h3 className="text-base font-bold font-vintage text-[#2a170f]">
                    Horizon Sightings & Landmarks
                  </h3>
                  <p className="text-xs text-[#543622] font-typewriter">
                    Discovered landmarks verified through the spotting scope
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-[#e8dac0] px-2.5 py-1 rounded-lg border border-[#c4af89]">
                  {discoveredSightings.length} / {SIGHTINGS_DATA.length} Unlocked
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {SIGHTINGS_DATA.map((item) => {
                  const isDiscovered = discoveredSightings.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isDiscovered
                          ? 'bg-[#ede0c5] border-[#c4af89] shadow-sm'
                          : 'bg-[#e2d3b5]/60 border-[#c4af89]/40 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{isDiscovered ? item.icon : '❓'}</span>
                          <div>
                            <h4 className="text-xs font-bold font-vintage">
                              {isDiscovered ? item.name : 'Unknown Sighting'}
                            </h4>
                            <div className="text-[10px] text-[#543622] font-mono">
                              Bearing {item.azimuth}° • {item.distance}
                            </div>
                          </div>
                        </div>
                        {isDiscovered && (
                          <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded bg-[#204030] text-[#f6eedb] uppercase">
                            STAMPED
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#3b2416] font-typewriter mt-2 leading-relaxed">
                        {isDiscovered
                          ? item.description
                          : 'Scan the horizon through your spotting scope to identify this location.'}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* TAB 2: WEATHER LOGS */}
          {activeTab === 'weather' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#2a170f]/20 pb-3">
                <div>
                  <h3 className="text-base font-bold font-vintage">Daily Weather Log</h3>
                  <p className="text-xs text-[#543622] font-typewriter">
                    Atmospheric pressure, wind speed, and temperature recordings
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLogCurrentWeather}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a170f] hover:bg-[#472814] text-[#f6eedb] text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Current Weather</span>
                </button>
              </div>

              <div className="space-y-2">
                {weatherLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-[#ede0c5] rounded-xl border border-[#c4af89] flex flex-wrap items-center justify-between gap-3 text-xs font-typewriter"
                  >
                    <div>
                      <strong className="text-sm font-vintage block text-[#2a170f]">
                        {log.timestamp}
                      </strong>
                      <span className="text-[#543622]">{log.weather}</span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] font-mono">
                      <div>🌡️ {log.temperature}</div>
                      <div>🧭 {log.wind}</div>
                      <div>⏲️ {log.barometer}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: OBJECTIVES */}
          {activeTab === 'objectives' && (
            <div className="space-y-4">
              <div className="border-b border-[#2a170f]/20 pb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7a4828]">
                  Chapter {currentChapter.number}
                </span>
                <h3 className="text-base font-bold font-vintage">{currentChapter.title}</h3>
                <p className="text-xs text-[#543622] font-typewriter">{currentChapter.subtitle}</p>
              </div>

              <div className="space-y-2.5">
                {currentChapter.objectives.map((obj) => {
                  const isDone = completedObjectives[`${currentChapter.id}_${obj.id}`]
                  return (
                    <div
                      key={obj.id}
                      className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                        isDone
                          ? 'bg-[#d8e6d2] border-[#a0c498] text-[#1c381c]'
                          : 'bg-[#ede0c5] border-[#c4af89] text-[#2a170f]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!isDone}
                        readOnly
                        className="w-4 h-4 rounded text-emerald-700 pointer-events-none"
                      />
                      <span
                        className={`text-xs font-typewriter flex-1 ${
                          isDone ? 'line-through opacity-80' : 'font-medium'
                        }`}
                      >
                        {obj.text}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* TAB 4: FIELD NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-3">
              <div className="border-b border-[#2a170f]/20 pb-2">
                <h3 className="text-base font-bold font-vintage">Lookout Diary & Field Notes</h3>
                <p className="text-xs text-[#543622] font-typewriter">
                  Personal thoughts, sketches, and notes from your shift
                </p>
              </div>

              <textarea
                value={personalNotes}
                onChange={(e) => updateNotes(e.target.value)}
                rows={10}
                placeholder="Type your ranger thoughts, observations, or poetry here..."
                className="w-full p-4 rounded-2xl bg-[#ede0c5] border border-[#c4af89] text-[#2a170f] font-typewriter text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#5c361e] resize-none"
              />
            </div>
          )}

          {/* TAB 5: POLAROIDS */}
          {activeTab === 'polaroids' && (
            <div className="space-y-4">
              <div className="border-b border-[#2a170f]/20 pb-3">
                <h3 className="text-base font-bold font-vintage">Polaroid Photo Album</h3>
                <p className="text-xs text-[#543622] font-typewriter">
                  Instant snapshots captured through the spotting scope and balcony
                </p>
              </div>

              {polaroids.length === 0 ? (
                <div className="text-center py-10 text-stone-500 font-typewriter text-xs">
                  📷 No snapshots taken yet. Open the Spotting Scope or Balcony and click "Snap Polaroid"!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {polaroids.map((photo) => (
                    <div
                      key={photo.id}
                      className="bg-white p-3 pb-4 rounded-lg shadow-md border border-stone-300 transform rotate-1 hover:rotate-0 transition-transform"
                    >
                      <img
                        src={photo.dataUrl}
                        alt={photo.caption}
                        className="w-full h-44 object-cover rounded bg-stone-900"
                      />
                      <div className="mt-2.5 flex items-center justify-between text-[#2a170f]">
                        <div>
                          <div className="text-xs font-vintage font-bold">{photo.caption}</div>
                          <div className="text-[10px] text-stone-500 font-mono">{photo.timestamp}</div>
                        </div>
                        <a
                          href={photo.dataUrl}
                          download={`two-pines-photo-${photo.id}.jpg`}
                          className="p-1.5 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 transition-colors"
                          title="Download Snapshot"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
