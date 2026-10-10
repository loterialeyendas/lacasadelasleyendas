import React, { useState } from 'react';
import { Trophy, Sparkles, Menu } from 'lucide-react';
import { MysticProfileDrawer } from './MysticProfileDrawer';
import { PlayerKeys } from '../types/game';
import { getCharacterById } from '../data/characters';
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
      <header className="w-full max-w-lg mx-auto flex items-center justify-center px-2 py-1 sm:py-1.5 z-40 select-none">
        {/* Ficha Ceremonial Unificada: Perfil del Explorador + Portal del Menú */}
        <button
          type="button"
          onClick={() => handleOpenMenu('characters')}
          aria-label="Abrir Perfil y Menú de La Casa de las Leyendas"
          title="Toca para ver tus Tzipitíos, perfil y menú"
          className="w-full flex items-center justify-between gap-2.5 sm:gap-3 bg-[#fbf7ee] border-2 border-gold rounded-full px-2.5 sm:px-3.5 py-1.5 sm:py-2 shadow-[0_6px_20px_rgba(0,0,0,0.55)] hover:border-gold hover:shadow-[0_6px_25px_rgba(206,136,34,0.35)] transition-all cursor-pointer group active:scale-[0.98] text-[#1f1309]"
        >
          {/* Lado Izquierdo: Avatar en Pedestal Blanco con Borde de Oro */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-gold flex items-center justify-center p-0.5 shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
                {activeChar.avatarSvg ? (
                  <img 
                    src={activeChar.avatarSvg} 
                    alt={activeChar.name} 
                    className="w-full h-full object-contain filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]" 
                  />
                ) : (
                  <Sparkles size={15} className="text-amber-600" />
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 text-[9px] bg-white rounded-full px-0.5 border border-gold/70 shadow-xs leading-none">
                {keys.gold && keys.jade ? '⭐' : '🗝️'}
              </span>
            </div>

            {/* Identidad del Explorador */}
            <div className="flex flex-col text-left leading-tight min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-display font-black text-[#1f1309] truncate max-w-[120px] sm:max-w-[170px]">
                  {userName}
                </span>
                <span className="text-[8px] sm:text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase text-amber-950 bg-amber-200/90 border border-gold/60 shadow-xs hidden xs:inline-block">
                  {activeChar.name}
                </span>
              </div>
              <span className="text-amber-900 text-[10px] font-display flex items-center gap-1 font-bold">
                <Trophy size={11} className="text-amber-700" /> {totalScore} pts
              </span>
            </div>
          </div>

          {/* Lado Derecho: Pastilla de Menú / Portal */}
          <div className="flex items-center gap-1.5 bg-[#ede1c7] border border-[#d6be96] group-hover:border-gold group-hover:bg-[#e4d3b4] px-2.5 sm:px-3 py-1 rounded-full shadow-xs transition-colors shrink-0">
            <Menu size={13} className="text-amber-950" />
            <span className="text-[10px] sm:text-[11px] font-mono font-black tracking-wider uppercase text-amber-950">
              MENÚ
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          </div>
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
