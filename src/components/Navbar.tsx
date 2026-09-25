import React, { useState } from 'react';
import { Trophy, LogOut, Home, Sparkles } from 'lucide-react';
import { SoundToggle } from './SoundToggle';
import { MysticProfileDrawer } from './MysticProfileDrawer';
import { PlayerKeys } from '../types/game';
import { getCharacterById } from '../data/characters';
import lunaSvg from '../images/Luna.svg';
import { sound } from '../lib/audio';

interface NavbarProps {
  userName: string;
  totalScore: number;
  keys: PlayerKeys;
  totalKeys: number;
  completedStampsCount: number;
  currentCharacterId: string;
  onSelectCharacter: (characterId: string) => void;
  onLogout: () => void;
  onGoHome?: () => void;
  onNavigateToPassport?: () => void;
  onNavigateToJoin?: () => void;
  onNavigateToTheater?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userName,
  totalScore,
  keys,
  totalKeys,
  completedStampsCount,
  currentCharacterId,
  onSelectCharacter,
  onLogout,
  onGoHome,
  onNavigateToPassport,
  onNavigateToJoin,
  onNavigateToTheater
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const activeChar = getCharacterById(currentCharacterId);

  const handleOpenMenu = () => {
    sound.playClick();
    setIsDrawerOpen(true);
  };

  return (
    <>
      <header className="w-full max-w-3xl mx-auto flex items-center justify-between p-2.5 sm:p-3 z-40 select-none">
        {/* Perfil del Explorador y Personaje Activo (Clickeable para abrir menú) */}
        <button
          type="button"
          onClick={handleOpenMenu}
          title="Ver perfil y personajes"
          className="flex items-center gap-2.5 bg-gradient-to-r from-[#1c150c]/95 via-[#140e08]/95 to-[#0e0905]/95 backdrop-blur-md px-3 py-1.5 rounded-full border-2 border-gold/60 hover:border-gold shadow-[0_0_15px_rgba(206,136,34,0.25)] transition-all cursor-pointer group text-left"
        >
          {/* Insignia del Personaje Activo */}
          <div className="relative">
            <div className={`w-8 h-8 rounded-full ${activeChar.colorTheme.bg} border-2 border-gold/70 flex items-center justify-center text-amber-300 shadow-sm group-hover:scale-105 transition-transform overflow-hidden p-0.5 bg-black/70`}>
              {activeChar.avatarSvg ? (
                <img 
                  src={activeChar.avatarSvg} 
                  alt={activeChar.name} 
                  className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" 
                />
              ) : (
                <Sparkles size={14} className="text-amber-300" />
              )}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 text-[10px]">
              {keys.gold && keys.jade ? '⭐' : '🗝️'}
            </span>
          </div>

          <div className="flex flex-col text-left leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-[#FFF0C8] text-xs font-display font-bold truncate max-w-[100px] sm:max-w-[130px]">
                {userName}
              </span>
              <span className="text-[8px] font-mono px-1 rounded uppercase text-amber-300 bg-amber-950/80 border border-gold/40 hidden sm:inline-block font-bold">
                {activeChar.code}
              </span>
            </div>
            <span className="text-amber-300 text-[10px] font-display flex items-center gap-1 font-semibold">
              <Trophy size={11} className="text-gold" /> {totalScore} pts
            </span>
          </div>
        </button>

        {/* Controles de Navegación y Botón Estelar de la Luna */}
        <div className="flex items-center gap-2">
          {/* Botón de la Luna Maya (Disparador Principal del Menú Móvil Moderno) */}
          <button
            type="button"
            onClick={handleOpenMenu}
            aria-label="Abrir Menú de la Luna y Perfil"
            title="Círculo de la Luna: Perfil y Personajes"
            className="relative flex items-center gap-2 bg-gradient-to-r from-amber-950/70 via-[#1f150c] to-[#0e0a05] border-2 border-gold/70 hover:border-gold px-2.5 sm:px-3 py-1.5 rounded-full text-amber-200 shadow-[0_0_20px_rgba(206,136,34,0.35)] hover:shadow-[0_0_25px_rgba(206,136,34,0.55)] transition-all cursor-pointer group active:scale-95"
          >
            {/* Icono de la Luna Maya (Luna.svg) con Halo Místico */}
            <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden p-0.5 bg-gradient-to-b from-amber-500/30 via-black to-[#1c150c] border border-gold/70 flex items-center justify-center">
              <img 
                src={lunaSvg} 
                alt="Luna de las Leyendas" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_4px_rgba(252,207,101,0.6)] group-hover:rotate-12 transition-transform duration-300"
              />
            </div>
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider hidden xs:inline-block">
              LUNA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse hidden sm:block" />
          </button>

          {/* Botón rápido Volver al Portal */}
          {onGoHome && (
            <button
              type="button"
              onClick={onGoHome}
              title="Volver al Portal"
              aria-label="Volver al Portal"
              className="p-2 rounded-full bg-black/60 border border-gold/30 text-gold hover:text-cream hover:border-gold hover:bg-gold/10 transition-colors cursor-pointer"
            >
              <Home size={16} />
            </button>
          )}

          {/* Control de Audio y Sonido */}
          <SoundToggle />

          {/* Salir / Logout */}
          <button
            type="button"
            onClick={onLogout}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
            className="p-2 rounded-full bg-black/60 border border-maya-red/40 text-maya-red hover:bg-maya-red/20 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Menú Móvil / Drawer Místico de Perfil y Personajes */}
      <MysticProfileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        userName={userName}
        totalScore={totalScore}
        keys={keys}
        totalKeys={totalKeys}
        completedStampsCount={completedStampsCount}
        currentCharacterId={currentCharacterId}
        onSelectCharacter={onSelectCharacter}
        onNavigateToPassport={onNavigateToPassport}
        onNavigateToJoin={onNavigateToJoin}
        onNavigateToTheater={onNavigateToTheater}
        onLogout={onLogout}
      />
    </>
  );
};
