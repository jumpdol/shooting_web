class AudioService {
  constructor() {
    this.initialized = false;
    this.sounds = {
      attention: null,
      start: null,
      stop: null,
      rest: null
    };
  }

  init() {
    if (this.initialized) return;
    
    // Preload sounds
    this.sounds.attention = new Audio('/attention.mp3');
    this.sounds.start = new Audio('/start.mp3');
    this.sounds.stop = new Audio('/stop.mp3');
    this.sounds.rest = new Audio('/rest_loop.wav');
    this.sounds.rest.loop = true;

    this.initialized = true;
  }

  playAttention() {
    this.init();
    this.playSound(this.sounds.attention);
  }

  playStartCue() {
    this.init();
    this.playSound(this.sounds.start);
  }

  playStopCue() {
    this.init();
    this.playSound(this.sounds.stop);
  }

  // Internal helper for synthetic beep
  _playSyntheticBeep(freq = 880, dur = 0.2) {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const osc = context.createOscillator();
    const gain = context.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, context.currentTime);
    gain.gain.setValueAtTime(0.1, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + dur);

    osc.connect(gain);
    gain.connect(context.destination);

    osc.start();
    osc.stop(context.currentTime + dur);
  }

  playDoubleBeep() {
    this._playSyntheticBeep();
    setTimeout(() => this._playSyntheticBeep(), 200);
  }

  playSingleBeep() {
    this._playSyntheticBeep();
  }

   playRestAmbient() {
    this.init();
    // ambient sound is played for all but might be too much for simple cycle
    // we already handle stopping it in useTimerEngine
    this.sounds.rest.currentTime = 0;
    this.sounds.rest.play().catch(e => console.error("Error playing rest audio:", e));
    
    return {
      stop: () => {
        this.sounds.rest.pause();
        this.sounds.rest.currentTime = 0;
      }
    };
  }

  playSound(audio) {
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(e => console.error("Error playing audio:", e));
  }
}

const audioService = new AudioService();
export default audioService;
