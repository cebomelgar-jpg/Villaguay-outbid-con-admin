'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioManager } from '@/lib/audioManager';

export default function AudioMuteButton() {
  const [isMuted, setIsMuted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMuted(audioManager.getMuted());
    
    const unsubscribe = audioManager.onMuteChange(() => {
      setIsMuted(audioManager.getMuted());
    });
    
    return unsubscribe;
  }, []);

  const handleToggle = () => {
    audioManager.resume();
    audioManager.toggleMute();
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-panel border border-white/10 flex items-center justify-center">
        <Volume2 className="h-5 w-5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className="w-10 h-10 rounded-lg bg-panel border border-white/10 flex items-center justify-center hover:border-neon-green/50 transition-all group"
      title={isMuted ? 'Activar sonido' : 'Desactivar sonido'}
    >
      {isMuted ? (
        <VolumeX className="h-5 w-5 text-muted-foreground group-hover:text-neon-green transition-colors" />
      ) : (
        <Volume2 className="h-5 w-5 text-muted-foreground group-hover:text-neon-green transition-colors" />
      )}
    </button>
  );
}
