import React, { useState, useEffect } from 'react'
import { Radio, X, Volume2, Mic, ArrowRight } from 'lucide-react'
import { useStoryStore } from '../../stores/useStoryStore'
import { useAudioStore } from '../../stores/useAudioStore'
import { STORY_CHAPTERS } from '../../data/storyChapters'

export function RadioDialogueModal() {
  const isRadioOpen = useStoryStore((state) => state.isRadioOpen)
  const closeRadio = useStoryStore((state) => state.closeRadio)
  const currentChapterIndex = useStoryStore((state) => state.currentChapterIndex)
  const dialogueIndex = useStoryStore((state) => state.dialogueIndex)
  const selectResponse = useStoryStore((state) => state.selectResponse)

  const triggerDialogueChirp = useAudioStore((state) => state.triggerDialogueChirp)

  const chapter = STORY_CHAPTERS[currentChapterIndex] || STORY_CHAPTERS[0]
  const currentDialogue = chapter.dialogue[dialogueIndex] || chapter.dialogue[0]

  // Typewriter effect
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!isRadioOpen || !currentDialogue) return

    setDisplayedText('')
    setIsTyping(true)

    let idx = 0
    const fullText = currentDialogue.text

    const timer = setInterval(() => {
      if (idx < fullText.length) {
        const char = fullText.charAt(idx)
        setDisplayedText((prev) => prev + char)
        if (idx % 2 === 0) {
          triggerDialogueChirp(char)
        }
        idx++
      } else {
        setIsTyping(false)
        clearInterval(timer)
      }
    }, 28)

    return () => clearInterval(timer)
  }, [isRadioOpen, currentDialogue, triggerDialogueChirp])

  if (!isRadioOpen || !currentDialogue) return null

  return (
    <div
      id="radio-dialogue-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-lg glass-panel-warm rounded-3xl p-6 border border-amber-500/30 shadow-2xl overflow-hidden">
        {/* Vintage Top Radio Bezel */}
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-amber-200 uppercase tracking-wider">
                  Two-Way Transceiver
                </h2>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-[11px] text-stone-300 font-mono">
                CH 4 • 154.280 MHz • Shoshone Dispatch
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeRadio}
            title="Close Radio"
            className="p-2 text-stone-300 hover:text-amber-300 hover:bg-white/10 rounded-xl transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Incoming Transmission Speaker Box */}
        <div className="bg-stone-950/70 rounded-2xl p-4 border border-amber-500/20 shadow-inner mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">{currentDialogue.portrait || '🌲'}</span>
              <span className="text-xs font-bold text-amber-300 tracking-wide">
                {currentDialogue.speaker}
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <Volume2 className="w-3 h-3" /> INCOMING
            </span>
          </div>

          <div className="min-h-[70px] font-typewriter text-sm sm:text-base text-amber-50 leading-relaxed">
            {displayedText}
            {isTyping && <span className="inline-block w-2 h-4 bg-amber-400 ml-1 animate-pulse" />}
          </div>
        </div>

        {/* Response Choices */}
        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-amber-400" />
            <span>Push-To-Talk Response:</span>
          </div>

          {currentDialogue.responses.map((resp, idx) => (
            <button
              key={`resp-${idx}`}
              type="button"
              disabled={isTyping}
              onClick={() => selectResponse(resp)}
              className="w-full text-left p-3 rounded-2xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/20 hover:border-amber-400/50 text-amber-100 text-xs sm:text-sm font-medium transition-all flex items-center justify-between group active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="font-typewriter">"{resp.text}"</span>
              <ArrowRight className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
