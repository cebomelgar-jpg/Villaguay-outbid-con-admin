'use client';

import { useRef, useCallback } from 'react';

type SoundType = 'coin' | 'levelup' | 'click' | 'error';

export function useSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      } catch {
        return null;
      }
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback(
    (freq: number, duration: number, type: OscillatorType, volume: number, delay: number = 0) => {
      const ctx = getCtx();
      if (!ctx) return;

      const startTime = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    },
    [getCtx],
  );

  const play = useCallback(
    (sound: SoundType) => {
      const ctx = getCtx();
      if (!ctx) return;

      switch (sound) {
        case 'coin':
          playTone(988, 0.08, 'square', 0.12, 0);
          playTone(1319, 0.15, 'square', 0.12, 0.08);
          break;
        case 'levelup':
          playTone(523, 0.1, 'square', 0.1, 0);
          playTone(659, 0.1, 'square', 0.1, 0.1);
          playTone(784, 0.1, 'square', 0.1, 0.2);
          playTone(1047, 0.25, 'square', 0.12, 0.3);
          break;
        case 'click':
          playTone(440, 0.05, 'sine', 0.08, 0);
          break;
        case 'error':
          playTone(200, 0.15, 'sawtooth', 0.1, 0);
          playTone(150, 0.2, 'sawtooth', 0.1, 0.1);
          break;
      }
    },
    [getCtx, playTone],
  );

  return { play };
}
