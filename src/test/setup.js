import '@testing-library/jest-dom'

// Mock HTML5 Canvas getContext
HTMLCanvasElement.prototype.getContext = () => ({
  fillRect: () => {},
  clearRect: () => {},
  getImageData: (x, y, w, h) => ({ data: new Array(w * h * 4) }),
  putImageData: () => {},
  createImageData: () => [],
  setTransform: () => {},
  drawImage: () => {},
  save: () => {},
  fillText: () => {},
  restore: () => {},
  beginPath: () => {},
  moveTo: () => {},
  lineTo: () => {},
  closePath: () => {},
  stroke: () => {},
  translate: () => {},
  scale: () => {},
  rotate: () => {},
  arc: () => {},
  fill: () => {},
  measureText: () => ({ width: 0 }),
  transform: () => {},
  rect: () => {},
  clip: () => {}
})

HTMLCanvasElement.prototype.toDataURL = () => 'data:image/jpeg;base64,mockImageData'

// Mock Web Audio API AudioContext
class MockAudioContext {
  constructor() {
    this.state = 'running'
    this.currentTime = 0
    this.sampleRate = 44100
    this.destination = {}
  }
  createGain() {
    return {
      gain: {
        value: 1,
        setValueAtTime: () => {},
        setTargetAtTime: () => {},
        linearRampToValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {}
      },
      connect: () => {}
    }
  }
  createBiquadFilter() {
    return {
      type: 'lowpass',
      frequency: {
        value: 12000,
        setValueAtTime: () => {},
        setTargetAtTime: () => {}
      },
      Q: { value: 1, setValueAtTime: () => {} },
      connect: () => {}
    }
  }
  createOscillator() {
    return {
      type: 'sine',
      frequency: {
        value: 440,
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {}
      },
      connect: () => {},
      start: () => {},
      stop: () => {}
    }
  }
  createBuffer(_channels, length, _sampleRate) {
    return {
      getChannelData: () => new Float32Array(length)
    }
  }
  createBufferSource() {
    return {
      buffer: null,
      loop: false,
      connect: () => {},
      start: () => {},
      stop: () => {}
    }
  }
  resume() {
    this.state = 'running'
    return Promise.resolve()
  }
}

global.AudioContext = MockAudioContext
global.webkitAudioContext = MockAudioContext
