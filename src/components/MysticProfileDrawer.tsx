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
          {/* Fondo desenfocado oscuro con cierre al tocar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
            aria-hidden="true"
          />

          {/* Panel Lateral Drawer Desplegable */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md h-full bg-neutral-950/95 border-l border-gold/40 shadow-[-10px_0_40px_rgba(0,0,0,0.9)] text-cream flex flex-col z-10 overflow-hidden"
          >
            {/* Cabecera Mística con la Luna Maya (Luna.svg) */}
            <div className="relative p-4 sm:p-5 border-b border-gold/30 bg-gradient-to-b from-black via-neutral-950 to-neutral-900/90 flex items-center justify-between select-none">
              <div className="flex items-center gap-3">
                <div className="relative group cursor-pointer" onClick={() => setActiveTab('profile')}>
                  <div className="w-12 h-12 rounded-full border border-gold/50 p-1 bg-black/80 shadow-[0_0_15px_rgba(252,207,101,0.35)] flex items-center justify-center overflow-hidden">
                    <img 
                      src={lunaSvg} 
                      alt="Luna de las Leyendas" 
                      className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(252,207,101,0.5)] transition-transform duration-500 group-hover:rotate-12" 
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 text-xs">🌙</span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-gold/90 font-bold">
                      Círculo de la Luna
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30 font-mono">
                      Guatemala
                    </span>
                  </div>
                  <h2 className="text-base font-display font-bold text-cream tracking-wide">
                    {userName}
                  </h2>
                </div>
              </div>

              {/* Botón de Cierre */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar menú místico"
                className="w-9 h-9 rounded-full bg-black/60 border border-white/20 text-cream/70 hover:text-cream hover:border-gold hover:bg-gold/10 flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Pestañas de Navegación del Drawer */}
            <div className="grid grid-cols-3 border-b border-white/10 bg-black/50 text-xs font-mono select-none">
              <button
                type="button"
                onClick={() => { sound.playClick(); setActiveTab('characters'); }}
                className={`py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'characters'
                    ? 'border-gold text-gold font-bold bg-gold/10'
                    : 'border-transparent text-cream/60 hover:text-cream'
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
                    ? 'border-gold text-gold font-bold bg-gold/10'
                    : 'border-transparent text-cream/60 hover:text-cream'
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
                    ? 'border-gold text-gold font-bold bg-gold/10'
                    : 'border-transparent text-cream/60 hover:text-cream'
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
                  {/* Banner del Personaje Equipado Actualmente */}
                  <div className={`p-4 rounded-2xl border ${activeChar.colorTheme.border} ${activeChar.colorTheme.bg} relative overflow-hidden shadow-lg`}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-black/60 border border-gold/40 flex items-center justify-center text-gold shadow-md">
                        {ICON_COMPONENTS[activeChar.iconName] 
                          ? React.createElement(ICON_COMPONENTS[activeChar.iconName], { size: 24, className: activeChar.colorTheme.text }) 
                          : <Sparkles size={24} className="text-gold" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-gold font-semibold">
                          <Check size={12} className="text-gold" />
                          <span>Espíritu Equipado</span>
                        </div>
                        <h3 className="text-base font-display font-bold text-cream truncate">
                          {activeChar.name}
                        </h3>
                        <p className="text-xs text-cream/70 italic font-serif truncate">
                          {activeChar.title}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2.5 text-xs text-cream/80 font-serif italic border-t border-white/10 pt-2 leading-relaxed">
                      "{activeChar.quote}"
                    </p>
                  </div>

                  {/* Instrucción */}
                  <div className="text-left">
                    <h4 className="text-xs uppercase font-mono tracking-wider text-gold/90 flex items-center gap-1.5 font-bold">
                      <span>Selecciona tu Personaje de Leyenda</span>
                    </h4>
                    <p className="text-[11px] text-cream/60 font-serif">
                      Tu personaje te representará en salas multijugador y en tu pasaporte
                    </p>
                  </div>

                  {/* Lista de Personajes de Guatemala */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {LEGEND_CHARACTERS.map((char) => {
                      const isEquipped = char.id === currentCharacterId;
                      const IconComp = ICON_COMPONENTS[char.iconName] || Sparkles;

                      return (
                        <div
                          key={char.id}
                          className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                            isEquipped
                              ? `${char.colorTheme.border} ${char.colorTheme.bg} shadow-[0_0_15px_rgba(252,207,101,0.25)] ring-1 ring-gold/40`
                              : 'border-white/10 hover:border-white/25 bg-black/40 hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                              isEquipped 
                                ? 'border-gold bg-black/80 shadow-sm' 
                                : 'border-white/15 bg-black/50'
                            }`}>
                              <IconComp size={20} className={char.colorTheme.text} />
                            </div>

                            <div className="min-w-0 text-left">
                              <div className="flex items-center gap-1.5">
                                <span className="font-display text-sm font-bold text-cream truncate">
                                  {char.name}
                                </span>
                                <span className={`text-[9px] uppercase px-1 rounded font-mono ${char.colorTheme.text} bg-black/60 border border-white/10`}>
                                  {char.code}
                                </span>
                              </div>
                              <p className="text-[11px] text-cream/60 truncate font-serif">
                                {char.title}
                              </p>
                            </div>
                          </div>

                          {/* Botón de Selección o Estado Equipado */}
                          {isEquipped ? (
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold/20 text-gold border border-gold/40 text-[10px] font-mono font-bold whitespace-nowrap shadow-sm">
                              <Check size={12} />
                              <span>ACTIVO</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleEquip(char)}
                              className="px-3 py-1.5 rounded-lg border border-gold/40 text-gold hover:bg-gold hover:text-black transition-all text-xs font-mono font-medium whitespace-nowrap cursor-pointer active:scale-95"
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
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-black to-neutral-900 border border-gold/40 space-y-3 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{rank.badge}</span>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-gold/80 tracking-widest block leading-none">
                            Rango Ceremonial
                          </span>
                          <h3 className="text-base font-display font-bold text-gold">
                            {rank.title}
                          </h3>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 font-mono">
                        Nivel {rank.level}
                      </span>
                    </div>

                    <p className="text-xs text-cream/70 font-serif leading-relaxed">
                      {rank.desc}
                    </p>

                    {/* Estadísticas Clave */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center font-mono">
                      <div className="bg-black/60 p-2 rounded-lg border border-white/10">
                        <span className="text-[10px] text-cream/50 block">PUNTOS</span>
                        <span className="text-sm font-bold text-gold flex items-center justify-center gap-1">
                          <Trophy size={12} /> {totalScore}
                        </span>
                      </div>
                      <div className="bg-black/60 p-2 rounded-lg border border-white/10">
                        <span className="text-[10px] text-cream/50 block">LLAVES</span>
                        <span className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1">
                          <Key size={12} /> {totalKeys}/4
                        </span>
                      </div>
                      <div className="bg-black/60 p-2 rounded-lg border border-white/10">
                        <span className="text-[10px] text-cream/50 block">SELLOS</span>
                        <span className="text-sm font-bold text-cream flex items-center justify-center gap-1">
                          📜 {completedStampsCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Estado de las 4 Llaves Sagradas */}
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase font-mono tracking-wider text-gold/90 font-bold px-1">
                      Las 4 Llaves Sagradas
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                        keys.gold 
                          ? 'border-gold/60 bg-amber-950/40 text-gold' 
                          : 'border-white/10 bg-black/40 text-cream/35'
                      }`}>
                        <span className="text-lg">🗝️</span>
                        <div>
                          <span className="font-bold block leading-none">Llave de Oro</span>
                          <span className="text-[9px] uppercase">{keys.gold ? 'Forjada' : 'Bloqueada'}</span>
                        </div>
                      </div>

                      <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                        keys.jade 
                          ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300' 
                          : 'border-white/10 bg-black/40 text-cream/35'
                      }`}>
                        <span className="text-lg">🗝️</span>
                        <div>
                          <span className="font-bold block leading-none">Llave de Jade</span>
                          <span className="text-[9px] uppercase">{keys.jade ? 'Forjada' : 'Bloqueada'}</span>
                        </div>
                      </div>

                      <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                        keys.silver 
                          ? 'border-slate-300/60 bg-slate-900/50 text-slate-200' 
                          : 'border-white/10 bg-black/40 text-cream/35'
                      }`}>
                        <span className="text-lg">🗝️</span>
                        <div>
                          <span className="font-bold block leading-none">Llave de Plata</span>
                          <span className="text-[9px] uppercase">{keys.silver ? 'Forjada' : 'Bloqueada'}</span>
                        </div>
                      </div>

                      <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                        keys.obsidian 
                          ? 'border-rose-500/60 bg-rose-950/40 text-rose-300' 
                          : 'border-white/10 bg-black/40 text-cream/35'
                      }`}>
                        <span className="text-lg">🗝️</span>
                        <div>
                          <span className="font-bold block leading-none">Obsidiana</span>
                          <span className="text-[9px] uppercase">{keys.obsidian ? 'Forjada' : 'Bloqueada'}</span>
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
                      className="w-full p-3 rounded-xl bg-gold/15 border border-gold/40 text-gold hover:bg-gold/25 font-mono text-xs flex items-center justify-between transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-bold">
                        <BookOpen size={16} /> Ver Pasaporte Completo
                      </span>
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              )}

              {/* PESTAÑA 3: ATAJOS DE NAVEGACIÓN */}
              {activeTab === 'menu' && (
                <div className="space-y-2 text-left font-mono text-xs">
                  {onNavigateToPassport && (
                    <button
                      type="button"
                      onClick={() => { onClose(); onNavigateToPassport(); }}
                      className="w-full p-3 rounded-xl bg-black/60 border border-white/15 hover:border-gold/50 hover:bg-white/5 flex items-center justify-between text-cream transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base text-gold">📜</span>
                        <div>
                          <span className="font-bold block text-sm font-sans">Pasaporte de Leyendas</span>
                          <span className="text-[10px] text-cream/50">Explora tus sellos y misterios</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gold/60" />
                    </button>
                  )}

                  {onNavigateToJoin && (
                    <button
                      type="button"
                      onClick={() => { onClose(); onNavigateToJoin(); }}
                      className="w-full p-3 rounded-xl bg-black/60 border border-white/15 hover:border-gold/50 hover:bg-white/5 flex items-center justify-between text-cream transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base text-gold">👥</span>
                        <div>
                          <span className="font-bold block text-sm font-sans">Unirse a Sala Multijugador</span>
                          <span className="text-[10px] text-cream/50">Ingresa con código PIN o QR</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gold/60" />
                    </button>
                  )}

                  {onNavigateToTheater && (
                    <button
                      type="button"
                      onClick={() => { onClose(); onNavigateToTheater(); }}
                      className="w-full p-3 rounded-xl bg-black/60 border border-white/15 hover:border-gold/50 hover:bg-white/5 flex items-center justify-between text-cream transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base text-gold">🎭</span>
                        <div>
                          <span className="font-bold block text-sm font-sans">Ruta de Leyendas en Vivo</span>
                          <span className="text-[10px] text-cream/50">Teatro inmersivo y experiencias</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gold/60" />
                    </button>
                  )}

                  {/* Cerrar Sesión */}
                  <div className="pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => { onClose(); onLogout(); }}
                      className="w-full p-3 rounded-xl bg-maya-red/15 border border-maya-red/40 hover:bg-maya-red/25 text-rose-300 flex items-center justify-center gap-2 transition-all cursor-pointer font-bold"
                    >
                      <LogOut size={16} />
                      <span>Cerrar Sesión Ceremonial</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Pie con ilustración sutil */}
            <div className="p-3 border-t border-white/10 bg-black/70 flex items-center justify-between text-[10px] text-cream/40 font-serif">
              <span>La Casa de las Leyendas</span>
              <span className="text-gold/70">Guatemala Mística</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
