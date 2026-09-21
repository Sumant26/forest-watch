/**
 * Procedural Web Audio API Sound Engine
 * Provides rich multi-channel nature loops, vintage lo-fi chord progressions,
 * radio walkie-talkie squelches, typewriter chirps, and analog tape warble filter.
 */

class SoundEngine {
  constructor() {
    this.ctx = null
    this.isInitialized = false
    this.masterGain = null
    this.warbleFilter = null
    this.warbleLfo = null
    this.warbleGain = null

    // Channel Gain Nodes
    this.channelGains = {
      rain: null,
      wind: null,
      stove: null,
      nature: null,
      music: null,
      radio: null
    }

    // Active Oscillators & Noise Nodes
    this.nodes = {}
    this.musicInterval = null
    this.natureInterval = null
  }

  init() {
    if (this.isInitialized) return
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return

    this.ctx = new AudioContext()
    
    // Master Chain
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime)

    // Vintage Tape Warble Low-Pass Filter
    this.warbleFilter = this.ctx.createBiquadFilter()
    this.warbleFilter.type = 'lowpass'
    this.warbleFilter.frequency.setValueAtTime(12000, this.ctx.currentTime) // default wide

    // LFO for Tape Flutter / Warble
    this.warbleLfo = this.ctx.createOscillator()
    this.warbleLfo.frequency.setValueAtTime(0.8, this.ctx.currentTime) // 0.8 Hz flutter
    this.warbleGain = this.ctx.createGain()
    this.warbleGain.gain.setValueAtTime(0, this.ctx.currentTime) // inactive by default

    this.warbleLfo.connect(this.warbleGain)
    this.warbleGain.connect(this.warbleFilter.frequency)
    this.warbleLfo.start()

    // Connect Master -> Warble Filter -> Destination
    this.masterGain.connect(this.warbleFilter)
    this.warbleFilter.connect(this.ctx.destination)

    // Setup Channels
    Object.keys(this.channelGains).forEach((key) => {
      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(0.5, this.ctx.currentTime)
      gain.connect(this.masterGain)
      this.channelGains[key] = gain
    })

    this.startRainSynthesis()
    this.startWindSynthesis()
    this.startWoodstoveSynthesis()
    this.startNatureSynthesis()
    this.startLoFiChords()

    this.isInitialized = true
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  // --- Rain Channel (Filtered Pink Noise with random droplet bursts) ---
  startRainSynthesis() {
    if (!this.ctx) return
    const bufferSize = this.ctx.sampleRate * 2
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04
      b6 = white * 0.115926
    }

    const rainSource = this.ctx.createBufferSource()
    rainSource.buffer = buffer
    rainSource.loop = true

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime)

    rainSource.connect(filter)
    filter.connect(this.channelGains.rain)
    rainSource.start()
    this.nodes.rain = rainSource
  }

  // --- Wind Channel (Resonant Low-pass noise with slow frequency modulation) ---
  startWindSynthesis() {
    if (!this.ctx) return
    const bufferSize = this.ctx.sampleRate * 2
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.06
    }

    const windSource = this.ctx.createBufferSource()
    windSource.buffer = buffer
    windSource.loop = true

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime)
    filter.frequency.setValueAtTime(320, this.ctx.currentTime)

    // LFO to sweep wind pitch
    const windLfo = this.ctx.createOscillator()
    windLfo.frequency.setValueAtTime(0.15, this.ctx.currentTime)
    const windLfoGain = this.ctx.createGain()
    windLfoGain.gain.setValueAtTime(180, this.ctx.currentTime)
    windLfo.connect(windLfoGain)
    windLfoGain.connect(filter.frequency)
    windLfo.start()

    windSource.connect(filter)
    filter.connect(this.channelGains.wind)
    windSource.start()
    this.nodes.wind = windSource
  }

  // --- Woodstove Crackle (Random impulse pops and warm low drone) ---
  startWoodstoveSynthesis() {
    if (!this.ctx) return
    const bufferSize = this.ctx.sampleRate * 2
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      if (Math.random() < 0.003) {
        data[i] = (Math.random() * 2 - 1) * 0.4
      } else {
        data[i] = (Math.random() * 2 - 1) * 0.005
      }
    }

    const stoveSource = this.ctx.createBufferSource()
    stoveSource.buffer = buffer
    stoveSource.loop = true

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(3500, this.ctx.currentTime)

    stoveSource.connect(filter)
    filter.connect(this.channelGains.stove)
    stoveSource.start()
    this.nodes.stove = stoveSource
  }

  // --- Nature Channel (Procedural Bird Chirps & Evening Crickets) ---
  startNatureSynthesis() {
    if (!this.ctx) return
    this.natureInterval = setInterval(() => {
      if (!this.ctx || this.channelGains.nature.gain.value < 0.05) return

      // Play soft bird or cricket tweet
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      const baseFreq = 2200 + Math.random() * 800
      osc.type = 'sine'
      osc.frequency.setValueAtTime(baseFreq, now)
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 400, now + 0.08)
      osc.frequency.exponentialRampToValueAtTime(baseFreq - 200, now + 0.16)

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(0.08, now + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)

      osc.connect(gain)
      gain.connect(this.channelGains.nature)
      osc.start(now)
      osc.stop(now + 0.25)
    }, 4500)
  }

  // --- Lo-Fi Cozy Chords (Ethereal Warm Electric Piano) ---
  startLoFiChords() {
    if (!this.ctx) return

    // Cozy Chord Progression: Dmaj7 -> Bm7 -> Gmaj7 -> A7sus4
    const chordProgression = [
      [146.83, 220.00, 277.18, 369.99], // D3, A3, C#4, F#4
      [123.47, 185.00, 220.00, 293.66], // B2, F#3, A3, D4
      [98.00, 146.83, 196.00, 246.94],  // G2, D3, G3, B3
      [110.00, 164.81, 220.00, 293.66]  // A2, E3, A3, D4
    ]

    let step = 0
    this.musicInterval = setInterval(() => {
      if (!this.ctx || this.channelGains.music.gain.value < 0.05) return

      const now = this.ctx.currentTime
      const chord = chordProgression[step % chordProgression.length]
      step++

      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        const filter = this.ctx.createBiquadFilter()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now)

        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(600, now)

        const noteDelay = idx * 0.04
        gain.gain.setValueAtTime(0.0001, now + noteDelay)
        gain.gain.linearRampToValueAtTime(0.06 / (idx + 1), now + noteDelay + 0.15)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + noteDelay + 3.8)

        osc.connect(filter)
        filter.connect(gain)
        gain.connect(this.channelGains.music)

        osc.start(now + noteDelay)
        osc.stop(now + noteDelay + 4.0)
      })
    }, 4000)
  }

  // --- Walkie-Talkie Click & Radio Squelch ---
  playRadioSquelch(isOpening = true) {
    if (!this.ctx) return
    const now = this.ctx.currentTime

    // Heavy mechanical switch click
    const clickOsc = this.ctx.createOscillator()
    const clickGain = this.ctx.createGain()
    clickOsc.type = 'square'
    clickOsc.frequency.setValueAtTime(isOpening ? 180 : 120, now)
    clickGain.gain.setValueAtTime(0.12, now)
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

    clickOsc.connect(clickGain)
    clickGain.connect(this.channelGains.radio)
    clickOsc.start(now)
    clickOsc.stop(now + 0.05)

    // Squelch burst (filtered white noise)
    const bufferSize = this.ctx.sampleRate * 0.12
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const bandpass = this.ctx.createBiquadFilter()
    bandpass.type = 'bandpass'
    bandpass.frequency.setValueAtTime(2400, now)
    bandpass.Q.setValueAtTime(4.0, now)

    const squelchGain = this.ctx.createGain()
    squelchGain.gain.setValueAtTime(0.18, now + 0.01)
    squelchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    noise.connect(bandpass)
    bandpass.connect(squelchGain)
    squelchGain.connect(this.channelGains.radio)

    noise.start(now + 0.01)
  }

  // --- Typewriter / Melodic Radio Dialogue Chirp ---
  playDialogueChirp(char) {
    if (!this.ctx || !char || char === ' ') return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    // Map character code to cozy warm pitch (300-600 Hz)
    const pitch = 350 + (char.charCodeAt(0) % 18) * 14
    osc.type = 'sine'
    osc.frequency.setValueAtTime(pitch, now)

    gain.gain.setValueAtTime(0.04, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)

    osc.connect(gain)
    gain.connect(this.channelGains.radio)
    osc.start(now)
    osc.stop(now + 0.06)
  }

  // --- Vintage Tape Warble Filter Toggle ---
  setTapeWarble(enabled) {
    if (!this.ctx || !this.warbleFilter || !this.warbleGain) return
    const now = this.ctx.currentTime
    if (enabled) {
      // Warm low-pass cutoff + gentle frequency modulation
      this.warbleFilter.frequency.setTargetAtTime(3200, now, 0.4)
      this.warbleGain.gain.setTargetAtTime(140, now, 0.4)
    } else {
      // Full fidelity
      this.warbleFilter.frequency.setTargetAtTime(16000, now, 0.4)
      this.warbleGain.gain.setTargetAtTime(0, now, 0.4)
    }
  }

  // --- Procedural Footstep Sounds (Dirt vs Wooden Stairs/Floor) ---
  playFootstep(surface = 'dirt') {
    if (!this.ctx) return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    if (surface === 'wood') {
      // Resonant hollow wood plank tap
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(140 + Math.random() * 30, now)
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(320, now)
      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
    } else {
      // Soft dirt/gravel step crunch
      osc.type = 'sine'
      osc.frequency.setValueAtTime(85 + Math.random() * 20, now)
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(450, now)
      gain.gain.setValueAtTime(0.06, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
    }

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.12)
  }

  // --- Volume Controls ---
  setMasterVolume(vol) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime, 0.05)
    }
  }

  setChannelVolume(channel, vol) {
    if (this.channelGains[channel] && this.ctx) {
      this.channelGains[channel].gain.setTargetAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime, 0.05)
    }
  }
}

export const soundEngine = new SoundEngine()
