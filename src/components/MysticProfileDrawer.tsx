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
  Moon, 
  Flame, 
  BookOpen, 
  LogOut,
  ChevronRight,
  Volume2,
  VolumeX,
  Sliders,
  Sparkle
} from 'lucide-react';
import logoPng from '../images/logo.png';
import { LEGEND_CHARACTERS, getCharacterById, getPlayerCeremonialRank, LegendCharacter } from '../data/characters';
import { PlayerKeys } from '../types/game';
import { sound } from '../lib/audio';

// Mapa de iconos dinámicos para los personajes
const ICON_COMPONENTS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Music: ({ size = 20, className }) => <Music size={size} className={className} />,
  Shield: ({ size = 20, className }) => <Shield size={size} className={className} />,
  Ghost: ({ size = 20, className }) => <Ghost size={size} className={className} />,
  Sparkles: ({ size = 20, className }) => <Sparkles size={size} className={className} />,
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
  initialTab?: 'characters' | 'profile' | 'menu';
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
  onLogout,
  initialTab = 'characters'
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'characters' | 'menu'>(initialTab);
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const activeChar = getCharacterById(currentCharacterId);
  const rank = getPlayerCeremonialRank(totalScore, totalKeys);

  const handleEquip = (char: LegendCharacter) => {
    sound.playClick();
    onSelectCharacter(char.id);
  };

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playMysticChime();
    }
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

            {/* Cabecera Ceremonial con el Logo Oficial de La Casa de las Leyendas */}
            <div className="relative p-4 sm:p-5 border-b border-gold/40 bg-gradient-to-b from-[#281c0f]/95 via-[#1d140a]/95 to-[#140e08]/95 flex items-center justify-between select-none shadow-md">
              <div className="flex items-center gap-3 min-w-0">
                {/* Marco circular de oro con el logo oficial de La Casa de las Leyendas */}
                <div 
                  className="relative group cursor-pointer shrink-0" 
                  onClick={() => setActiveTab('profile')}
                  title="La Casa de las Leyendas - Toca para ver tu perfil"
                >
                  <div className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-full p-0.5 bg-gradient-to-b from-amber-500/50 via-black to-[#1c150c] border-2 border-gold shadow-[0_0_20px_rgba(252,207,101,0.5)] flex items-center justify-center overflow-hidden">
                    <img 
                      src={logoPng} 
                      alt="La Casa de las Leyendas" 
                      className="w-full h-full object-cover filter drop-shadow-[0_0_6px_rgba(252,207,101,0.6)] group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#1a1208] border border-gold/80 rounded-full p-0.5 shadow-md">
                    <Sparkle size={10} className="text-gold fill-gold" />
                  </div>
                </div>

                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300 font-extrabold truncate">
                      LA CASA DE LAS LEYENDAS
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-950/80 text-amber-200 border border-gold/60 font-mono font-bold shadow-sm">
                      GT
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-display font-extrabold text-[#FFF0C8] tracking-wide drop-shadow-sm truncate">
                    {userName}
                  </h2>
                </div>
              </div>

              {/* Botón de Cierre Ceremonial */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar menú místico"
                className="w-9 h-9 rounded-full bg-[#1b140b] border border-gold/60 text-amber-200 hover:text-white hover:border-gold hover:bg-gold/25 flex items-center justify-center transition-all cursor-pointer shadow-md shrink-0 ml-2"
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
                <span>Tzipitíos</span>
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
                <span>⚙️</span>
                <span>Ajustes</span>
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

                    <div className="flex items-center gap-3.5 relative z-10">
                      {/* Pedestal Ceremonial con la ilustración SVG del Tzipitío equipado */}
                      <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-b from-black via-[#1a1208] to-black border-2 border-gold flex items-center justify-center p-1 shadow-[0_0_20px_rgba(206,136,34,0.45)] shrink-0 overflow-hidden group">
                        {activeChar.avatarSvg ? (
                          <img 
                            src={activeChar.avatarSvg} 
                            alt={activeChar.name} 
                            className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)] transition-transform duration-300 group-hover:scale-110" 
                          />
                        ) : (
                          <Sparkles size={26} className="text-amber-300" />
                        )}
                        <div className="absolute bottom-0 inset-x-0 h-1 bg-gold/60" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-amber-300 font-bold">
                          <Check size={12} className="text-gold" />
                          <span>Tzipitío Equipado</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-display font-extrabold text-[#FFF0C8] truncate">
                          {activeChar.name}
                        </h3>
                        <p className="text-xs text-amber-200/80 italic font-serif truncate">
                          {activeChar.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-bold text-amber-300 bg-amber-950/80 border border-gold/40">
                            {activeChar.code}
                          </span>
                          <span className="text-[10px] text-amber-100/70 font-mono">
                            {activeChar.element}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-amber-100/90 font-serif italic border-t border-gold/20 pt-2.5 leading-relaxed relative z-10">
                      "{activeChar.quote}"
                    </p>
                  </div>

                  {/* Instrucción */}
                  <div className="text-left px-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs uppercase font-mono tracking-wider text-amber-300 flex items-center gap-1.5 font-bold">
                        <Sparkles size={13} className="text-gold" />
                        <span>Los 6 Tzipitíos del Juego</span>
                      </h4>
                      <span className="text-[10px] font-mono text-gold font-bold px-2 py-0.5 rounded-full bg-gold/15 border border-gold/40">
                        1 a la vez
                      </span>
                    </div>
                    <p className="text-[11px] text-[#F5EDE0]/70 font-serif mt-0.5">
                      Escoge a tu personaje favorito para identificarte en salas multijugador y en tu pasaporte
                    </p>
                  </div>

                  {/* Lista de los 6 Tzipitíos con sus ilustraciones SVG */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {LEGEND_CHARACTERS.map((char) => {
                      const isEquipped = char.id === currentCharacterId;

                      return (
                        <div
                          key={char.id}
                          className={`p-2.5 sm:p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                            isEquipped
                              ? 'border-2 border-gold bg-gradient-to-r from-amber-950/70 via-[#23180d] to-amber-950/40 shadow-[0_0_20px_rgba(206,136,34,0.35)] ring-1 ring-gold/60'
                              : 'border-gold/30 hover:border-gold/70 bg-[#161008]/90 hover:bg-[#20160c] shadow-sm'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Ilustración SVG del Tzipitío */}
                            <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center p-1 shrink-0 overflow-hidden border ${
                              isEquipped 
                                ? 'border-2 border-gold bg-black/85 shadow-[0_0_12px_rgba(206,136,34,0.5)]' 
                                : 'border-gold/35 bg-[#120d07]'
                            }`}>
                              {char.avatarSvg ? (
                                <img 
                                  src={char.avatarSvg} 
                                  alt={char.name} 
                                  className="w-full h-full object-contain filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]" 
                                />
                              ) : (
                                <Sparkles size={20} className={isEquipped ? 'text-amber-300' : 'text-amber-200/80'} />
                              )}
                            </div>

                            <div className="min-w-0 text-left">
                              <div className="flex items-center gap-1.5 flex-wrap">
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
                              <p className="text-[10px] text-amber-200/60 truncate font-mono">
                                ⚡ {char.perk}
                              </p>
                            </div>
                          </div>

                          {/* Botón de Selección o Estado Equipado */}
                          {isEquipped ? (
                            <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gold/25 text-amber-200 border border-gold text-[10px] font-mono font-bold whitespace-nowrap shadow-sm shrink-0">
                              <Check size={12} className="text-gold" />
                              <span>ACTIVO</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleEquip(char)}
                              className="px-3.5 py-1.5 rounded-lg border border-gold/70 bg-gold/15 hover:bg-gold hover:text-black font-mono font-bold text-amber-200 text-xs transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
                            >
                              Escoger
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

              {/* PESTAÑA 3: AJUSTES Y ATAJOS DE NAVEGACIÓN */}
              {activeTab === 'menu' && (
                <div className="space-y-4 text-left font-mono text-xs">
                  {/* SECCIÓN 1: AJUSTES DE AMBIENTE Y AUDIO */}
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase font-mono tracking-wider text-amber-300 font-bold px-1 flex items-center gap-1.5">
                      <Sliders size={13} className="text-gold" />
                      <span>Configuración del Ritual</span>
                    </h4>

                    {/* Módulo de Audio y Sonido */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#1d140a] via-[#160f07] to-[#120b05] border-2 border-gold/50 flex items-center justify-between shadow-md">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                          !isMuted 
                            ? 'border-gold bg-gold/20 text-gold shadow-[0_0_12px_rgba(206,136,34,0.4)]' 
                            : 'border-gold/30 bg-black/60 text-[#F5EDE0]/40'
                        }`}>
                          {!isMuted ? <Volume2 size={20} className="text-gold" /> : <VolumeX size={20} />}
                        </div>
                        <div>
                          <span className="font-bold block text-sm font-sans text-[#FFF0C8]">
                            Efectos y Campanas Místicas
                          </span>
                          <span className="text-[11px] text-amber-200/70 font-serif">
                            {!isMuted ? 'Sonido celestial activado' : 'Sonido silenciado'}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleToggleSound}
                        className={`px-3 py-1.5 rounded-lg border font-mono font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95 ${
                          !isMuted
                            ? 'border-gold bg-gold text-[#140e08] shadow-[0_0_12px_rgba(206,136,34,0.4)]'
                            : 'border-gold/50 bg-black/70 text-amber-300 hover:border-gold'
                        }`}
                      >
                        {!isMuted ? 'ACTIVADO' : 'ACTIVAR'}
                      </button>
                    </div>
                  </div>

                  {/* SECCIÓN 2: PORTALES Y ATAJOS */}
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase font-mono tracking-wider text-amber-300 font-bold px-1 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-gold" />
                      <span>Portales Rápidos</span>
                    </h4>

                    {onNavigateToPassport && (
                      <button
                        type="button"
                        onClick={() => { onClose(); onNavigateToPassport(); }}
                        className="w-full p-3.5 rounded-xl bg-[#161008]/90 border border-gold/35 hover:border-gold hover:bg-[#20160c] flex items-center justify-between text-[#FFF0C8] transition-all cursor-pointer shadow-sm group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-black/60 border border-gold/40 flex items-center justify-center text-lg text-gold group-hover:scale-105 transition-transform">
                            📜
                          </div>
                          <div>
                            <span className="font-bold block text-sm font-sans text-[#FFF0C8]">Pasaporte de Leyendas</span>
                            <span className="text-[10px] text-[#F5EDE0]/65">Explora tus sellos y misterios de Guatemala</span>
                          </div>
                        </div>
                        <ChevronRight size={17} className="text-gold group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}

                    {onNavigateToJoin && (
                      <button
                        type="button"
                        onClick={() => { onClose(); onNavigateToJoin(); }}
                        className="w-full p-3.5 rounded-xl bg-[#161008]/90 border border-gold/35 hover:border-gold hover:bg-[#20160c] flex items-center justify-between text-[#FFF0C8] transition-all cursor-pointer shadow-sm group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-black/60 border border-gold/40 flex items-center justify-center text-lg text-gold group-hover:scale-105 transition-transform">
                            👥
                          </div>
                          <div>
                            <span className="font-bold block text-sm font-sans text-[#FFF0C8]">Unirse a Sala Multijugador</span>
                            <span className="text-[10px] text-[#F5EDE0]/65">Ingresa con código PIN o QR de sala</span>
                          </div>
                        </div>
                        <ChevronRight size={17} className="text-gold group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}

                    {onNavigateToTheater && (
                      <button
                        type="button"
                        onClick={() => { onClose(); onNavigateToTheater(); }}
                        className="w-full p-3.5 rounded-xl bg-[#161008]/90 border border-gold/35 hover:border-gold hover:bg-[#20160c] flex items-center justify-between text-[#FFF0C8] transition-all cursor-pointer shadow-sm group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-black/60 border border-gold/40 flex items-center justify-center text-lg text-gold group-hover:scale-105 transition-transform">
                            🎭
                          </div>
                          <div>
                            <span className="font-bold block text-sm font-sans text-[#FFF0C8]">Ruta de Leyendas en Vivo</span>
                            <span className="text-[10px] text-[#F5EDE0]/65">Teatro inmersivo y experiencias presenciales</span>
                          </div>
                        </div>
                        <ChevronRight size={17} className="text-gold group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}
                  </div>

                  {/* SECCIÓN 3: CERRAR SESIÓN */}
                  <div className="pt-3 border-t border-gold/25">
                    <button
                      type="button"
                      onClick={() => { onClose(); onLogout(); }}
                      className="w-full p-3.5 rounded-xl bg-gradient-to-r from-rose-950/60 via-red-950/70 to-rose-950/60 border-2 border-rose-500/60 hover:border-rose-400 hover:bg-rose-900/50 text-rose-200 flex items-center justify-center gap-2 transition-all cursor-pointer font-bold shadow-md active:scale-[0.99]"
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
