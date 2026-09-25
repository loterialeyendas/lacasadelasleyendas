import React, { useState } from 'react';
import { Trophy, Sparkles } from 'lucide-react';
import { MysticProfileDrawer } from './MysticProfileDrawer';
import { PlayerKeys } from '../types/game';
import { getCharacterById } from '../data/characters';
import logoPng from '../images/logo.png';
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
  onNavigateToPassport,
  onNavigateToJoin,
  onNavigateToTheater
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerInitialTab, setDrawerInitialTab] = useState<'characters' | 'profile' | 'menu'>('characters');
  const activeChar = getCharacterById(currentCharacterId);

  const handleOpenMenu = (tab: 'characters' | 'profile' | 'menu' = 'characters') => {
    sound.playClick();
    setDrawerInitialTab(tab);
    setIsDrawerOpen(true);
  };

  return (
    <>
      <header className="w-full max-w-3xl mx-auto flex items-center justify-between p-2.5 sm:p-3 z-40 select-none">
        {/* Identidad del Explorador en Juego (Toca para ver perfil ceremonial) */}
        <button
          type="button"
          onClick={() => handleOpenMenu('profile')}
          title="Ver perfil ceremonial y estadísticas"
          className="flex items-center gap-2.5 bg-gradient-to-r from-[#1c150c]/95 via-[#140e08]/95 to-[#0e0905]/95 backdrop-blur-md px-3 py-1.5 rounded-full border-2 border-gold/60 hover:border-gold shadow-[0_0_15px_rgba(206,136,34,0.25)] transition-all cursor-pointer group text-left active:scale-[0.98]"
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
              <span className="text-[#FFF0C8] text-xs font-display font-bold truncate max-w-[110px] sm:max-w-[140px]">
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

        {/* Botón Principal Unificado del Menú con el Logo Oficial de La Casa de las Leyendas */}
        <button
          type="button"
          onClick={() => handleOpenMenu('characters')}
          aria-label="Abrir Menú de La Casa de las Leyendas"
          title="Menú Principal: Personajes, Perfil y Ajustes"
          className="relative flex items-center gap-2 sm:gap-2.5 bg-gradient-to-r from-amber-950/85 via-[#22170d] to-[#120b06] border-2 border-gold/80 hover:border-gold px-3 sm:px-3.5 py-1.5 rounded-full text-amber-200 shadow-[0_0_20px_rgba(206,136,34,0.35)] hover:shadow-[0_0_25px_rgba(206,136,34,0.55)] transition-all cursor-pointer group active:scale-95"
        >
          {/* Logo Circular Emblemático */}
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden p-0.5 bg-black border border-gold shadow-sm flex items-center justify-center shrink-0">
            <img 
              src={logoPng} 
              alt="Logo La Casa de las Leyendas" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="flex flex-col text-left leading-none">
            <span className="text-[9px] font-mono uppercase tracking-widest text-amber-300/80 hidden xs:inline-block font-bold">
              PORTAL
            </span>
            <span className="text-xs sm:text-sm font-display font-black tracking-wide text-amber-200 group-hover:text-gold transition-colors">
              MENÚ
            </span>
          </div>

          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse hidden sm:block ml-0.5" />
        </button>
      </header>

      {/* Menú Móvil / Drawer Místico de Perfil y Personajes */}
      <MysticProfileDrawer
        key={drawerInitialTab}
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
        initialTab={drawerInitialTab}
      />
    </>
  );
};
