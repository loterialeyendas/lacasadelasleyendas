import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Trophy, 
  Key, 
  Check, 
  Sparkles, 
  Music, 
  Shield, 
  Ghost, 
  Sailboat, 
  Moon, 
  Flame, 
  BookOpen, 
  Users, 
  MapPin, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import lunaSvg from '../images/Luna.svg';
import { LEGEND_CHARACTERS, getCharacterById, getPlayerCeremonialRank, LegendCharacter } from '../data/characters';
import { PlayerKeys } from '../types/game';
import { sound } from '../lib/audio';

// Mapa de iconos dinámicos para los personajes
const ICON_COMPONENTS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Music: ({ size = 20, className }) => <Music size={size} className={className} />,
  Shield: ({ size = 20, className }) => <Shield size={size} className={className} />,
  Ghost: ({ size = 20, className }) => <Ghost size={size} className={className} />,
  Sparkles: ({ size = 20, className }) => <Sparkles size={size} className={className} />,
  Sailboat: ({ size = 20, className }) => <Sailboat size={size} className={className} />,
  Moon: ({ size = 20, className }) => <Moon size={size} className={className} />,
  Flame: ({ size = 20, className }) => <Flame size={size} className={className} />
};

interface MysticProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  totalScore: number;
  keys: PlayerKeys;
  totalKeys: number;
  completedStampsCount: number;
  currentCharacterId: string;
  onSelectCharacter: (characterId: string) => void;
  onNavigateToPassport?: () => void;
  onNavigateToJoin?: () => void;
  onNavigateToTheater?: () => void;
  onLogout: () => void;
}

export const MysticProfileDrawer: React.FC<MysticProfileDrawerProps> = ({
  isOpen,
  onClose,
  userName,
  totalScore,
  keys,
  totalKeys,
  completedStampsCount,
  currentCharacterId,
  onSelectCharacter,
  onNavigateToPassport,
  onNavigateToJoin,
  onNavigateToTheater,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'characters' | 'menu'>('characters');
  const activeChar = getCharacterById(currentCharacterId);
  const rank = getPlayerCeremonialRank(totalScore, totalKeys);

  const handleEquip = (char: LegendCharacter) => {
    sound.playClick();
    onSelectCharacter(char.id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Fondo desenfocado oscuro con halo sutil y cierre al tocar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
            aria-hidden="true"
          />

          {/* Panel Lateral Drawer Desplegable con Estética de Obsidiana Sagrada y Oro */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 230 }}
            className="relative w-full max-w-md h-full bg-gradient-to-b from-[#1c150c] via-[#140e08] to-[#0d0905] border-l-2 border-gold/70 shadow-[-15px_0_50px_rgba(0,0,0,0.95),0_0_40px_rgba(206,136,34,0.25)] text-[#FFF0C8] flex flex-col z-10 overflow-hidden"
          >
            {/* Halo áureo superior para luminosidad celestial */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-64 rounded-full bg-gradient-to-b from-amber-400/25 via-gold/15 to-transparent blur-3xl pointer-events-none" />

            {/* Cabecera Ceremonial con la Luna Maya (Luna.svg) */}
            <div className="relative p-4 sm:p-5 border-b border-gold/40 bg-gradient-to-b from-[#261b0e]/95 via-[#1c140b]/95 to-[#140e08]/95 flex items-center justify-between select-none shadow-md">
              <div className="flex items-center gap-3">
                <div 
                  className="relative group cursor-pointer" 
                  onClick={() => setActiveTab('profile')}
                  title="Toca para ver tu perfil ceremonial"
                >
                  {/* Marco circular de oro con pedestal para la Luna */}
                  <div className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-full p-1 bg-gradient-to-b from-amber-500/30 via-black to-[#1c150c] border-2 border-gold shadow-[0_0_20px_rgba(252,207,101,0.5)] flex items-center justify-center overflow-hidden">
                    <img 
                      src={lunaSvg} 
                      alt="Luna de las Leyendas" 
                      className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(252,207,101,0.7)] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-105" 
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#1a1208] border border-gold/80 rounded-full p-0.5 shadow-md">
                    <Sparkles size={11} className="text-gold animate-spin" />
                  </div>
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300 font-bold">
                      Círculo de la Luna
                    </span>
                    <span className="text-[9px] px-2 py-0.2 rounded-full bg-amber-950/80 text-amber-200 border border-gold/60 font-mono font-bold shadow-sm">
                      Guatemala
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-display font-extrabold text-[#FFF0C8] tracking-wide drop-shadow-sm truncate max-w-[200px]">
                    {userName}
                  </h2>
                </div>
              </div>

              {/* Botón de Cierre Ceremonial */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar menú místico"
                className="w-9 h-9 rounded-full bg-[#1b140b] border border-gold/60 text-amber-200 hover:text-white hover:border-gold hover:bg-gold/25 flex items-center justify-center transition-all cursor-pointer shadow-md"
              >
                <X size={18} />
              </button>
            </div>

            {/* Pestañas de Navegación del Drawer */}
            <div className="grid grid-cols-3 border-b border-gold/30 bg-[#120d07] text-xs font-mono select-none">
              <button
                type="button"
                onClick={() => { sound.playClick(); setActiveTab('characters'); }}
                className={`py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'characters'
                    ? 'border-gold text-amber-200 font-bold bg-gradient-to-b from-amber-900/40 via-gold/15 to-transparent shadow-inner'
                    : 'border-transparent text-[#F5EDE0]/60 hover:text-amber-200 hover:bg-[#1a1309]'
                }`}
              >
                <span>🎭</span>
                <span>Personajes</span>
              </button>

              <button
                type="button"
                onClick={() => { sound.playClick(); setActiveTab('profile'); }}
                className={`py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'border-gold text-amber-200 font-bold bg-gradient-to-b from-amber-900/40 via-gold/15 to-transparent shadow-inner'
                    : 'border-transparent text-[#F5EDE0]/60 hover:text-amber-200 hover:bg-[#1a1309]'
                }`}
              >
                <span>📜</span>
                <span>Mi Perfil</span>
              </button>

              <button
                type="button"
                onClick={() => { sound.playClick(); setActiveTab('menu'); }}
                className={`py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'menu'
                    ? 'border-gold text-amber-200 font-bold bg-gradient-to-b from-amber-900/40 via-gold/15 to-transparent shadow-inner'
                    : 'border-transparent text-[#F5EDE0]/60 hover:text-amber-200 hover:bg-[#1a1309]'
                }`}
              >
                <span>🧭</span>
                <span>Atajos</span>
              </button>
            </div>

            {/* Contenido Dinámico con Scroll Suave */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* PESTAÑA 1: SELECTOR DE PERSONAJES */}
              {activeTab === 'characters' && (
                <div className="space-y-4">
                  {/* Banner del Personaje Equipado Actualmente - Estilo Ceremonial */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#261b0e] via-[#1c140b] to-[#120d07] border-2 border-gold/70 relative overflow-hidden shadow-[0_0_25px_rgba(206,136,34,0.3)]">
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gold/10 blur-2xl pointer-events-none" />

                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-13 h-13 rounded-2xl bg-black/70 border-2 border-gold/60 flex items-center justify-center text-amber-300 shadow-md">
                        {ICON_COMPONENTS[activeChar.iconName] 
                          ? React.createElement(ICON_COMPONENTS[activeChar.iconName], { size: 26, className: 'text-amber-300' }) 
                          : <Sparkles size={26} className="text-amber-300" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-amber-300 font-bold">
                          <Check size={12} className="text-gold" />
                          <span>Espíritu Equipado</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-display font-extrabold text-[#FFF0C8] truncate">
                          {activeChar.name}
                        </h3>
                        <p className="text-xs text-amber-200/80 italic font-serif truncate">
                          {activeChar.title}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-amber-100/90 font-serif italic border-t border-gold/20 pt-2.5 leading-relaxed relative z-10">
                      "{activeChar.quote}"
                    </p>
                  </div>

                  {/* Instrucción */}
                  <div className="text-left px-1">
                    <h4 className="text-xs uppercase font-mono tracking-wider text-amber-300 flex items-center gap-1.5 font-bold">
                      <Sparkles size={13} className="text-gold" />
                      <span>Selecciona tu Personaje de Leyenda</span>
                    </h4>
                    <p className="text-[11px] text-[#F5EDE0]/70 font-serif">
                      Tu espíritu te representará en salas multijugador y en tu pasaporte
                    </p>
                  </div>

                  {/* Lista de Personajes de Guatemala Estilizada */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {LEGEND_CHARACTERS.map((char) => {
                      const isEquipped = char.id === currentCharacterId;
                      const IconComp = ICON_COMPONENTS[char.iconName] || Sparkles;

                      return (
                        <div
                          key={char.id}
                          className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                            isEquipped
                              ? 'border-2 border-gold bg-gradient-to-r from-amber-950/70 via-[#23180d] to-amber-950/40 shadow-[0_0_20px_rgba(206,136,34,0.35)] ring-1 ring-gold/60'
                              : 'border-gold/30 hover:border-gold/70 bg-[#161008]/90 hover:bg-[#20160c] shadow-sm'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                              isEquipped 
                                ? 'border-gold bg-black/80 shadow-md text-amber-300' 
                                : 'border-gold/30 bg-[#120d07] text-amber-200/70'
                            }`}>
                              <IconComp size={20} className={isEquipped ? 'text-amber-300' : 'text-amber-200/80'} />
                            </div>

                            <div className="min-w-0 text-left">
                              <div className="flex items-center gap-1.5">
                                <span className="font-display text-sm font-bold text-[#FFF0C8] truncate">
                                  {char.name}
                                </span>
                                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-bold text-amber-300 bg-amber-950/80 border border-gold/40">
                                  {char.code}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#F5EDE0]/70 truncate font-serif">
                                {char.title}
                              </p>
                            </div>
                          </div>

                          {/* Botón de Selección o Estado Equipado */}
                          {isEquipped ? (
                            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gold/25 text-amber-200 border border-gold text-[10px] font-mono font-bold whitespace-nowrap shadow-sm">
                              <Check size={12} className="text-gold" />
                              <span>ACTIVO</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleEquip(char)}
                              className="px-3.5 py-1.5 rounded-lg border border-gold/70 bg-gold/15 hover:bg-gold hover:text-black font-mono font-bold text-amber-200 text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
                            >
                              Equipar
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PESTAÑA 2: MI PERFIL Y RANGO */}
              {activeTab === 'profile' && (
                <div className="space-y-4 text-left">
                  {/* Tarjeta de Rango Ceremonial */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#251a0d] via-[#1a1209] to-[#0f0a05] border-2 border-gold/70 space-y-3.5 shadow-[0_0_30px_rgba(206,136,34,0.3)] relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />

                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{rank.badge}</span>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-amber-300 tracking-widest block leading-none font-bold">
                            Rango Ceremonial
                          </span>
                          <h3 className="text-base sm:text-lg font-display font-extrabold text-amber-200 drop-shadow-sm">
                            {rank.title}
                          </h3>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold/20 text-amber-200 border border-gold/50 font-mono font-bold shadow-sm">
                        Nivel {rank.level}
                      </span>
                    </div>

                    <p className="text-xs text-amber-100/80 font-serif leading-relaxed relative z-10">
                      {rank.desc}
                    </p>

                    {/* Estadísticas Clave en Pedestales de Obsidiana */}
                    <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-gold/30 text-center font-mono relative z-10">
                      <div className="bg-[#130d07] p-2.5 rounded-xl border border-gold/40 shadow-inner">
                        <span className="text-[10px] text-amber-300/80 block font-bold">PUNTOS</span>
                        <span className="text-sm font-bold text-amber-200 flex items-center justify-center gap-1 mt-0.5">
                          <Trophy size={13} className="text-gold" /> {totalScore}
                        </span>
                      </div>
                      <div className="bg-[#130d07] p-2.5 rounded-xl border border-gold/40 shadow-inner">
                        <span className="text-[10px] text-amber-300/80 block font-bold">LLAVES</span>
                        <span className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                          <Key size={13} className="text-emerald-400" /> {totalKeys}/4
                        </span>
                      </div>
                      <div className="bg-[#130d07] p-2.5 rounded-xl border border-gold/40 shadow-inner">
                        <span className="text-[10px] text-amber-300/80 block font-bold">SELLOS</span>
                        <span className="text-sm font-bold text-[#FFF0C8] flex items-center justify-center gap-1 mt-0.5">
                          📜 {completedStampsCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Estado de las 4 Llaves Sagradas */}
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase font-mono tracking-wider text-amber-300 font-bold px-1 flex items-center gap-1.5">
                      <Key size={13} className="text-gold" />
                      <span>Las 4 Llaves Sagradas</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                        keys.gold 
                          ? 'border-gold bg-gradient-to-b from-amber-950/60 to-[#191108] text-amber-200 shadow-[0_0_12px_rgba(206,136,34,0.3)]' 
                          : 'border-gold/20 bg-[#120d07]/70 text-[#F5EDE0]/30'
                      }`}>
                        <span className="text-xl">🗝️</span>
                        <div>
                          <span className="font-bold block leading-none">Llave de Oro</span>
                          <span className="text-[9px] uppercase font-bold text-amber-300/90">{keys.gold ? 'Forjada' : 'Bloqueada'}</span>
                        </div>
                      </div>

                      <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                        keys.jade 
                          ? 'border-emerald-500/70 bg-gradient-to-b from-emerald-950/60 to-[#0e1610] text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]' 
                          : 'border-gold/20 bg-[#120d07]/70 text-[#F5EDE0]/30'
                      }`}>
                        <span className="text-xl">🗝️</span>
                        <div>
                          <span className="font-bold block leading-none">Llave de Jade</span>
                          <span className="text-[9px] uppercase font-bold text-emerald-400">{keys.jade ? 'Forjada' : 'Bloqueada'}</span>
                        </div>
                      </div>

                      <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                        keys.silver 
                          ? 'border-slate-300/70 bg-gradient-to-b from-slate-900/60 to-[#10141a] text-slate-200 shadow-[0_0_12px_rgba(203,213,225,0.25)]' 
                          : 'border-gold/20 bg-[#120d07]/70 text-[#F5EDE0]/30'
                      }`}>
                        <span className="text-xl">🗝️</span>
                        <div>
                          <span className="font-bold block leading-none">Llave de Plata</span>
                          <span className="text-[9px] uppercase font-bold text-slate-300">{keys.silver ? 'Forjada' : 'Bloqueada'}</span>
                        </div>
                      </div>

                      <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                        keys.obsidian 
                          ? 'border-rose-500/70 bg-gradient-to-b from-rose-950/60 to-[#190e10] text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.25)]' 
                          : 'border-gold/20 bg-[#120d07]/70 text-[#F5EDE0]/30'
                      }`}>
                        <span className="text-xl">🗝️</span>
                        <div>
                          <span className="font-bold block leading-none">Obsidiana</span>
                          <span className="text-[9px] uppercase font-bold text-rose-400">{keys.obsidian ? 'Forjada' : 'Bloqueada'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acceso Directo al Pasaporte Completo */}
                  {onNavigateToPassport && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateToPassport();
                      }}
                      className="w-full p-3.5 rounded-xl bg-gradient-to-r from-gold/20 via-amber-800/30 to-gold/20 border-2 border-gold/80 text-amber-200 hover:bg-gold/30 hover:text-white font-mono text-xs flex items-center justify-between transition-all cursor-pointer shadow-[0_0_20px_rgba(206,136,34,0.3)] active:scale-[0.99]"
                    >
                      <span className="flex items-center gap-2 font-bold tracking-wide">
                        <BookOpen size={17} className="text-gold" /> Ver Pasaporte Completo
                      </span>
                      <ChevronRight size={17} className="text-gold" />
                    </button>
                  )}
                </div>
              )}

              {/* PESTAÑA 3: ATAJOS DE NAVEGACIÓN */}
              {activeTab === 'menu' && (
                <div className="space-y-2.5 text-left font-mono text-xs">
                  {onNavigateToPassport && (
                    <button
                      type="button"
                      onClick={() => { onClose(); onNavigateToPassport(); }}
                      className="w-full p-3.5 rounded-xl bg-[#161008]/90 border border-gold/35 hover:border-gold hover:bg-[#20160c] flex items-center justify-between text-[#FFF0C8] transition-all cursor-pointer shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-black/60 border border-gold/40 flex items-center justify-center text-lg text-gold">
                          📜
                        </div>
                        <div>
                          <span className="font-bold block text-sm font-sans text-[#FFF0C8]">Pasaporte de Leyendas</span>
                          <span className="text-[10px] text-[#F5EDE0]/65">Explora tus sellos y misterios</span>
                        </div>
                      </div>
                      <ChevronRight size={17} className="text-gold" />
                    </button>
                  )}

                  {onNavigateToJoin && (
                    <button
                      type="button"
                      onClick={() => { onClose(); onNavigateToJoin(); }}
                      className="w-full p-3.5 rounded-xl bg-[#161008]/90 border border-gold/35 hover:border-gold hover:bg-[#20160c] flex items-center justify-between text-[#FFF0C8] transition-all cursor-pointer shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-black/60 border border-gold/40 flex items-center justify-center text-lg text-gold">
                          👥
                        </div>
                        <div>
                          <span className="font-bold block text-sm font-sans text-[#FFF0C8]">Unirse a Sala Multijugador</span>
                          <span className="text-[10px] text-[#F5EDE0]/65">Ingresa con código PIN o QR</span>
                        </div>
                      </div>
                      <ChevronRight size={17} className="text-gold" />
                    </button>
                  )}

                  {onNavigateToTheater && (
                    <button
                      type="button"
                      onClick={() => { onClose(); onNavigateToTheater(); }}
                      className="w-full p-3.5 rounded-xl bg-[#161008]/90 border border-gold/35 hover:border-gold hover:bg-[#20160c] flex items-center justify-between text-[#FFF0C8] transition-all cursor-pointer shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-black/60 border border-gold/40 flex items-center justify-center text-lg text-gold">
                          🎭
                        </div>
                        <div>
                          <span className="font-bold block text-sm font-sans text-[#FFF0C8]">Ruta de Leyendas en Vivo</span>
                          <span className="text-[10px] text-[#F5EDE0]/65">Teatro inmersivo y experiencias</span>
                        </div>
                      </div>
                      <ChevronRight size={17} className="text-gold" />
                    </button>
                  )}

                  {/* Cerrar Sesión Ceremonial */}
                  <div className="pt-4 border-t border-gold/20">
                    <button
                      type="button"
                      onClick={() => { onClose(); onLogout(); }}
                      className="w-full p-3.5 rounded-xl bg-gradient-to-r from-rose-950/50 via-red-950/60 to-rose-950/50 border border-rose-500/60 hover:bg-rose-900/40 text-rose-200 flex items-center justify-center gap-2 transition-all cursor-pointer font-bold shadow-md"
                    >
                      <LogOut size={16} />
                      <span>Cerrar Sesión Ceremonial</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Pie Ceremonial con Ilustración Sutil */}
            <div className="p-3 border-t border-gold/30 bg-[#0d0905] flex items-center justify-between text-[11px] text-amber-200/70 font-serif">
              <span>La Casa de las Leyendas</span>
              <span className="text-gold font-bold tracking-wider">Guatemala Mística</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
