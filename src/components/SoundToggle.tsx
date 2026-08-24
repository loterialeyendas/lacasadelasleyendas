import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '../lib/audio';

export const SoundToggle: React.FC = () => {
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());

  const handleToggle = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playMysticChime();
    }
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
      className="p-2 rounded-full bg-black/60 border border-gold/30 text-gold hover:text-cream hover:border-gold/60 transition-colors"
    >
      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>
  );
};
