const AudioContext = window.AudioContext || window.webkitAudioContext

function createClick() {
  const ctx = new AudioContext()
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.frequency.setValueAtTime(800, ctx.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1)

  gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.1)
}

function createBubble() {
  const ctx = new AudioContext()
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(300, ctx.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2)

  gainNode.gain.setValueAtTime(0.15, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.2)
}

function createWhoosh() {
  const ctx = new AudioContext()
  const bufferSize = ctx.sampleRate * 0.4
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)

  // white noise
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }

  const source = ctx.createBufferSource()
  source.buffer = buffer

  // bandpass filter to shape the noise into a whoosh
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(200, ctx.currentTime)
  filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2)
  filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.4)
  filter.Q.value = 0.8

  const gainNode = ctx.createGain()
  gainNode.gain.setValueAtTime(0, ctx.currentTime)
  gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.1)
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)

  source.connect(filter)
  filter.connect(gainNode)
  gainNode.connect(ctx.destination)

  source.start(ctx.currentTime)
  source.stop(ctx.currentTime + 0.4)
}

function createPiano() {
  const ctx = new AudioContext()

  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  
  // subtle second oscillator for very slight warmth
  const oscillator2 = ctx.createOscillator()
  const gainNode2 = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)
  oscillator2.connect(gainNode2)
  gainNode2.connect(ctx.destination)

  // single deep C3 note
  oscillator.type = 'triangle'
  oscillator.frequency.setValueAtTime(130.81, ctx.currentTime)
  gainNode.gain.setValueAtTime(0.4, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3)

  // very faint octave above for subtle resonance
  oscillator2.type = 'sine'
  oscillator2.frequency.setValueAtTime(261.63, ctx.currentTime)
  gainNode2.gain.setValueAtTime(0.06, ctx.currentTime)
  gainNode2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 3)
  oscillator2.start(ctx.currentTime)
  oscillator2.stop(ctx.currentTime + 3)
}

function createChime() {
  const ctx = new AudioContext()
  
  // high delicate frequencies for chime feel
  const frequencies = [1046.50, 1318.51, 1567.98] // C6, E6, G6
  const delays = [0, 0.08, 0.16]
  
  frequencies.forEach((freq, i) => {
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime + delays[i])
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime + delays[i])
    gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + delays[i] + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delays[i] + 1.8)
    
    oscillator.start(ctx.currentTime + delays[i])
    oscillator.stop(ctx.currentTime + delays[i] + 1.8)
  })
}

export const sounds = {
  click: createClick,
  bubble: createBubble,
  whoosh: createWhoosh,
  piano: createPiano,
  chime: createChime,
}