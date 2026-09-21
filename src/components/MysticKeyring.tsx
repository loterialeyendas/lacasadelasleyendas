import React from 'react';
import { motion } from 'motion/react';
import { PlayerKeys, KeyType } from '../types/game';
import { MysticKey } from './svgs/MysticKey';
import { Sparkles, Lock, Trophy } from 'lucide-react';

interface MysticKeyringProps {
  keys: PlayerKeys;
  compact?: boolean;
  className?: string;
  onKeyClick?: (type: KeyType) => void;
}

interface KeyConfig {
  type: KeyType;
  name: string;
  categoryName: string;
  colorBorder: string;
  colorBg: string;
  colorGlow: string;
  textColor: string;
}

const KEYS_INFO: KeyConfig[] = [
  {
    type: 'gold',
    name: 'Llave de Oro',
    categoryName: 'Trivia & Sabiduría',
    colorBorder: 'border-amber-400/50',
    colorBg: 'from-amber-950/60 to-black/80',
    colorGlow: 'shadow-[0_0_15px_rgba(251,191,36,0.35)]',
    textColor: 'text-amber-300'
  },
  {
    type: 'jade',
    name: 'Llave de Jade',
    categoryName: 'Adivina el Personaje',
    colorBorder: 'border-emerald-400/50',
    colorBg: 'from-emerald-950/60 to-black/80',
    colorGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.35)]',
    textColor: 'text-emerald-300'
  },
  {
    type: 'silver',
    name: 'Llave de Plata',
    categoryName: 'Mímica & Expresión',
    colorBorder: 'border-slate-300/50',
    colorBg: 'from-slate-900/60 to-black/80',
    colorGlow: 'shadow-[0_0_15px_rgba(203,213,225,0.35)]',
    textColor: 'text-slate-200'
  },
  {
    type: 'obsidian',
    name: 'Llave de Obsidiana',
    categoryName: 'Reto en Redes',
    colorBorder: 'border-fuchsia-500/50',
    colorBg: 'from-purple-950/60 to-black/80',
    colorGlow: 'shadow-[0_0_15px_rgba(217,70,239,0.35)]',
    textColor: 'text-fuchsia-300'
  }
];

export const MysticKeyring: React.FC<MysticKeyringProps> = ({
  keys,
  compact = false,
  className = '',
  onKeyClick
}) => {
  const earnedCount = [keys.gold, keys.jade, keys.silver, keys.obsidian].filter(Boolean).length;
  const isMasterKeyholder = earnedCount >= 4;

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 bg-black/70 border border-gold/40 px-2.5 py-1 rounded-full backdrop-blur-md ${className}`}>
        {KEYS_INFO.map((cfg) => {
          const unlocked = keys[cfg.type];
          return (
            <div
              key={cfg.type}
              title={`${cfg.name}: ${unlocked ? 'Obtenida' : 'Bloqueada'}`}
              className={`relative flex items-center justify-center transition-all ${
                unlocked ? 'opacity-100 scale-105' : 'opacity-30 grayscale'
              }`}
            >
              <MysticKey variant={cfg.type} size={18} />
            </div>
          );
        })}
        <span className="text-[11px] font-display font-bold text-gold ml-1">
          {earnedCount}/4
        </span>
      </div>
    );
  }

  return (
    <div className={`w-full rounded-2xl p-4 bg-gradient-to-b from-[#1c130d]/90 via-[#0d0a08]/90 to-black border ${
      isMasterKeyholder ? 'border-gold shadow-[0_0_30px_rgba(252,207,101,0.3)]' : 'border-gold/30'
    } backdrop-blur-md ${className}`}>
      {/* Cabecera del Llavero */}
      <div className="flex items-center justify-between mb-3 border-b border-gold/15 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
            {isMasterKeyholder ? <Trophy size={18} className="text-amber-400 animate-bounce" /> : <Sparkles size={16} />}
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest font-display text-gold font-bold flex items-center gap-1.5">
              Altar de las 4 Llaves
            </h3>
            <p className="text-[11px] text-cream/60">
              {isMasterKeyholder 
                ? '¡Has forjado todas las llaves del cofre supremo!' 
                : 'Resuelve los retos de las tarjetas para abrir el candado'}
            </p>
          </div>
        </div>

        {/* Contador */}
        <div className={`px-2.5 py-1 rounded-xl border text-xs font-display font-bold flex items-center gap-1 ${
          isMasterKeyholder 
            ? 'bg-gold/20 border-gold text-amber-300 shadow-[0_0_10px_rgba(252,207,101,0.5)]' 
            : 'bg-black/60 border-gold/20 text-cream/70'
        }`}>
          <span>{earnedCount}</span>
          <span className="text-cream/40">/</span>
          <span>4</span>
          <span className="text-[10px] uppercase ml-0.5">Llaves</span>
        </div>
      </div>

      {/* Grid de las 4 Llaves Sagradas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {KEYS_INFO.map((cfg) => {
          const unlocked = keys[cfg.type];

          return (
            <motion.div
              key={cfg.type}
              whileHover={unlocked ? { scale: 1.03 } : undefined}
              whileTap={unlocked ? { scale: 0.98 } : undefined}
              onClick={() => onKeyClick?.(cfg.type)}
              className={`relative flex flex-col items-center justify-between p-3 rounded-xl border transition-all ${
                unlocked
                  ? `bg-gradient-to-b ${cfg.colorBg} ${cfg.colorBorder} ${cfg.colorGlow}`
                  : 'bg-black/40 border-dashed border-white/10 opacity-50'
              }`}
            >
              {/* Icono de Llave o Candado */}
              <div className="my-1 flex items-center justify-center">
                {unlocked ? (
                  <motion.div
                    initial={{ scale: 0.8, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring' }}
                  >
                    <MysticKey variant={cfg.type} size={36} isTurned={true} />
                  </motion.div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30">
                    <Lock size={16} />
                  </div>
                )}
              </div>

              {/* Nombre y categoría */}
              <div className="text-center mt-1">
                <span className={`text-[11px] font-display font-bold block ${unlocked ? cfg.textColor : 'text-cream/40'}`}>
                  {cfg.name}
                </span>
                <span className="text-[9px] text-cream/50 uppercase tracking-wider block mt-0.5">
                  {cfg.categoryName}
                </span>
              </div>

              {/* Estado */}
              <div className="mt-2">
                {unlocked ? (
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.5 rounded-md">
                    ✓ Obtenida
                  </span>
                ) : (
                  <span className="inline-block text-[9px] uppercase tracking-wider text-cream/30 bg-black/50 px-1.5 py-0.5 rounded-md">
                    Bloqueada
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
