import React, { useRef, useState } from 'react'
import {
  Settings,
  X,
  Monitor,
  Download,
  Upload,
  Lamp,
  HelpCircle,
  RotateCcw,
  Check,
  AlertCircle
} from 'lucide-react'
import { useSettingsStore, QUALITY_LEVELS } from '../../stores/useSettingsStore'
import { useCameraStore } from '../../stores/useCameraStore'
import { useStoryStore } from '../../stores/useStoryStore'

export function SettingsModal() {
  const isOpen = useSettingsStore((state) => state.isOpen)
  const closeSettings = useSettingsStore((state) => state.closeSettings)
  const quality = useSettingsStore((state) => state.quality)
  const setQuality = useSettingsStore((state) => state.setQuality)
  const exportSaveData = useSettingsStore((state) => state.exportSaveData)
  const importSaveData = useSettingsStore((state) => state.importSaveData)

  const deskLampOn = useCameraStore((state) => state.deskLampOn)
  const toggleDeskLamp = useCameraStore((state) => state.toggleDeskLamp)

  const resetStoryProgress = useStoryStore((state) => state.resetProgress)

  const [importStatus, setImportStatus] = useState(null)
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  // Handle Export Download
  const handleExport = () => {
    const json = exportSaveData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `two-pines-save-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Handle File Upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result
      if (typeof content === 'string') {
        const res = importSaveData(content)
        if (res.success) {
          setImportStatus({ type: 'success', msg: 'Save profile restored successfully!' })
        } else {
          setImportStatus({ type: 'error', msg: res.error || 'Failed to import save profile' })
        }
      }
    }
    reader.readAsText(file)
  }

  return (
    <div
      id="settings-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-lg fw-panel rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Lookout Settings
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Graphics Quality & Save Profiles
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeSettings}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {/* 1. Graphics Quality Preset */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
              <Monitor className="w-4 h-4" />
              <span>3D Graphics Preset</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: QUALITY_LEVELS.LOW, label: 'Low', desc: '60fps Mobile' },
                { id: QUALITY_LEVELS.MEDIUM, label: 'Medium', desc: 'Soft shadows' },
                { id: QUALITY_LEVELS.HIGH, label: 'High', desc: 'Full Bloom & Fog' },
                { id: QUALITY_LEVELS.ULTRA, label: 'Ultra', desc: 'Max Fidelity' }
              ].map((q) => {
                const isActive = quality === q.id
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setQuality(q.id)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      isActive
                        ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                        : 'bg-black/30 border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="text-xs font-bold font-mono">{q.label}</div>
                    <div className="text-[10px] opacity-80 mt-1">{q.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 2. Cabin Gooseneck Lamp */}
          <div className="flex items-center justify-between p-4 bg-black/30 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
              <Lamp className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-sm font-semibold text-slate-100">Desk Lamp Light</div>
                <div className="text-xs text-slate-400 font-mono">Warm brass reading glow</div>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleDeskLamp}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                deskLampOn
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-slate-800 text-slate-400 border border-white/10'
              }`}
            >
              {deskLampOn ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* 3. Save Profile Management */}
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
              Save Profile Management
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleExport}
                className="p-3.5 bg-black/30 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Export Save JSON</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3.5 bg-black/30 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Import Save JSON</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {importStatus && (
              <div
                className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2.5 ${
                  importStatus.type === 'success'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                    : 'bg-red-950/80 text-red-300 border border-red-500/40'
                }`}
              >
                {importStatus.type === 'success' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                )}
                <span>{importStatus.msg}</span>
              </div>
            )}
          </div>

          {/* 4. Controls Guide */}
          <div className="p-4 bg-black/30 rounded-2xl border border-white/10 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-400 mb-2">
              <HelpCircle className="w-4 h-4" />
              <span>Ranger Controls & Guidance</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 font-mono text-[11px]">
              <li>• <strong>Look Around</strong>: Click and drag anywhere to look around</li>
              <li>• <strong>Scope</strong>: Click 'Scope' to zoom and inspect horizon coordinates</li>
              <li>• <strong>Radio</strong>: Talk with Ranger Willow to progress through chapters</li>
              <li>• <strong>Journal</strong>: Stamp verified landmarks and snap Polaroids</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400 font-mono">Reset story progress?</span>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Restart ranger journey from Chapter 1?')) {
                resetStoryProgress()
                closeSettings()
              }
            }}
            className="px-3.5 py-2 bg-red-950/50 hover:bg-red-900/70 text-red-300 border border-red-500/30 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Chapter Progress</span>
          </button>
        </div>
      </div>
    </div>
  )
}
