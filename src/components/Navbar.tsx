import React from 'react';
import { User, Trophy, LogOut, Home } from 'lucide-react';
import { SoundToggle } from './SoundToggle';

interface NavbarProps {
  userName: string;
  totalScore: number;
  onLogout: () => void;
  onGoHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ userName, totalScore, onLogout, onGoHome }) => {
  return (
    <header className="w-full max-w-2xl mx-auto flex items-center justify-between p-3 z-50">
      {/* Perfil y Puntos */}
      <div className="flex items-center gap-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-gold/30">
        <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center text-gold border border-gold/40">
          <User size={14} />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-cream text-[11px] font-display font-semibold leading-tight truncate max-w-[110px]">
            {userName}
          </span>
          <span className="text-gold text-[9px] font-display flex items-center gap-1">
            <Trophy size={10} /> {totalScore} pts
          </span>
        </div>
      </div>

      {/* Controles: Portal, Sonido y Salir */}
      <div className="flex items-center gap-2">
        {onGoHome && (
          <button
            onClick={onGoHome}
            title="Volver al Portal"
            aria-label="Volver al Portal"
            className="p-2 rounded-full bg-black/60 border border-gold/30 text-gold hover:text-cream hover:border-gold transition-colors"
          >
            <Home size={16} />
          </button>
        )}
        <SoundToggle />
        <button
          onClick={onLogout}
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
          className="p-2 rounded-full bg-black/60 border border-maya-red/40 text-maya-red hover:bg-maya-red/20 transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};
