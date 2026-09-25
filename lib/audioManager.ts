// Lightweight audio system using Web Audio API (no external files needed)

class AudioManager {
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = false;
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Load mute state from localStorage
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('villaguay-audio-muted');
      this.isMuted = savedMute === 'true';
    }
  }

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3): void {
    if (this.isMuted) return;

    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
      console.error('Audio error:', error);
    }
  }

  // Outbid / Destronar - Victory sound with metallic impact
  playOutbid(): void {
    if (this.isMuted) return;

    try {
      const ctx = this.getContext();
      
      // Main victory chord
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 0.4, 'triangle', 0.2);
        }, i * 50);
      });

      // Metallic impact
      setTimeout(() => {
        this.playTone(880, 0.15, 'square', 0.15);
      }, 100);
    } catch (error) {
      console.error('Audio error:', error);
    }
  }

  // Alert / Warning - Subtle warning tone
  playAlert(): void {
    if (this.isMuted) return;

    try {
      const ctx = this.getContext();
      
      // Warning beeps
      this.playTone(440, 0.1, 'sine', 0.15);
      setTimeout(() => {
        this.playTone(440, 0.1, 'sine', 0.15);
      }, 150);
    } catch (error) {
      console.error('Audio error:', error);
    }
  }

  // Competitive Click - Arcade chasm/click sound
  playClick(): void {
    if (this.isMuted) return;

    try {
      const ctx = this.getContext();
      
      // Sharp click
      this.playTone(1200, 0.05, 'square', 0.1);
      
      // Subtle high-frequency click
      setTimeout(() => {
        this.playTone(2000, 0.03, 'sine', 0.05);
      }, 10);
    } catch (error) {
      console.error('Audio error:', error);
    }
  }

  // Victory / Season Close - Celebration effect
  playVictory(): void {
    if (this.isMuted) return;

    try {
      const ctx = this.getContext();
      
      // Victory fanfare
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 0.3, 'triangle', 0.2);
        }, i * 100);
      });

      // Celebration sparkle
      setTimeout(() => {
        [1318.51, 1567.98, 2093.00].forEach((freq, i) => {
          setTimeout(() => {
            this.playTone(freq, 0.2, 'sine', 0.1);
          }, i * 50);
        });
      }, 400);
    } catch (error) {
      console.error('Audio error:', error);
    }
  }

  // Soft notification sound
  playNotification(): void {
    if (this.isMuted) return;

    try {
      this.playTone(880, 0.15, 'sine', 0.1);
    } catch (error) {
      console.error('Audio error:', error);
    }
  }

  // Error sound
  playError(): void {
    if (this.isMuted) return;

    try {
      this.playTone(200, 0.2, 'sawtooth', 0.15);
    } catch (error) {
      console.error('Audio error:', error);
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('villaguay-audio-muted', this.isMuted.toString());
    }
    
    // Notify listeners
    this.listeners.forEach(listener => listener());
    
    return this.isMuted;
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  onMuteChange(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Resume audio context (required by browsers after user interaction)
  resume(): void {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}

// Singleton instance
export const audioManager = new AudioManager();

// For non-React contexts
export const { playOutbid, playAlert, playClick, playVictory, playNotification, playError } = audioManager;
