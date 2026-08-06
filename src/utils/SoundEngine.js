class SoundEngineClass {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.ctx = new AudioContext();
    }
  }

  playTone(freq, type, duration, vol) {
    if (!this.enabled || !this.ctx) return;
    
    // Resume context if suspended (browser autoplay policy)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    // Quick attack, exponential decay
    gainNode.gain.setValueAtTime(vol, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // Hover: tiny glass click
  hover() {
    this.playTone(800, 'sine', 0.05, 0.05);
  }

  // Toggle: mechanical switch (two rapid tones)
  toggle() {
    this.playTone(400, 'square', 0.05, 0.05);
    setTimeout(() => {
      this.playTone(300, 'square', 0.05, 0.05);
    }, 50);
  }

  // Open modal: soft digital sound
  modalOpen() {
    this.playTone(300, 'triangle', 0.1, 0.1);
    setTimeout(() => {
      this.playTone(600, 'sine', 0.2, 0.1);
    }, 50);
  }

  // Success: synth confirmation
  success() {
    this.playTone(523.25, 'sine', 0.1, 0.1); // C5
    setTimeout(() => {
      this.playTone(659.25, 'sine', 0.1, 0.1); // E5
    }, 100);
    setTimeout(() => {
      this.playTone(783.99, 'sine', 0.3, 0.1); // G5
    }, 200);
  }

  // Error: low frequency glitch
  error() {
    this.playTone(150, 'sawtooth', 0.1, 0.2);
    setTimeout(() => {
      this.playTone(100, 'sawtooth', 0.2, 0.2);
    }, 100);
  }

  // Startup cinematic
  startup() {
    this.playTone(100, 'sine', 2.0, 0.3); // Deep drone
    setTimeout(() => {
      this.playTone(200, 'triangle', 1.5, 0.2);
    }, 500);
    setTimeout(() => {
      this.playTone(400, 'sine', 1.0, 0.1);
    }, 1000);
  }
}

export const SoundEngine = new SoundEngineClass();
