import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KeyType } from '../types/game';
import { MysticKey } from './svgs/MysticKey';
import { MysticLock } from './svgs/MysticLock';
import { Button } from './Theme';
import { Sparkles, Trophy, CheckCircle2 } from 'lucide-react';

interface KeyUnlockModalProps {
  isOpen: boolean;
  keyType: KeyType;
  legendName: string;
  totalKeys: number;
  hasWon: boolean;
  onClose: () => void;
}

const KEY_DETAILS: Record<KeyType, { title: string; desc: string; color: string; bgGlow: string }> = {
  gold: {
    title: 'Llave de Oro',
    desc: 'Has demostrado la sabiduría de las crónicas coloniales y mayas.',
    color: 'text-amber-300',
    bgGlow: 'bg-amber-500/20 shadow-[0_0_50px_rgba(251,191,36,0.4)]'
  },
  jade: {
    title: 'Llave de Jade',
    desc: 'Tu astucia e instinto descubrieron al espíritu entre las sombras.',
    color: 'text-emerald-300',
    bgGlow: 'bg-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.4)]'
  },
  silver: {
    title: 'Llave de Plata',
    desc: 'Tu destreza gestual encarnó el misterio de las leyendas.',
    color: 'text-slate-200',
    bgGlow: 'bg-slate-400/20 shadow-[0_0_50px_rgba(203,213,225,0.4)]'
  },
  obsidian: {
    title: 'Llave de Obsidiana',
    desc: 'Tu audacia en las redes difundió la magia de nuestras tradiciones.',
    color: 'text-fuchsia-300',
    bgGlow: 'bg-fuchsia-500/20 shadow-[0_0_50px_rgba(217,70,239,0.4)]'
  }
};

export const KeyUnlockModal: React.FC<KeyUnlockModalProps> = ({
  isOpen,
  keyType,
  legendName,
  totalKeys,
  hasWon,
  onClose
}) => {
  if (!isOpen) return null;

  const details = KEY_DETAILS[keyType] || KEY_DETAILS.gold;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          className={`relative w-full max-w-sm rounded-3xl p-6 bg-gradient-to-b from-[#22170f] via-[#140e09] to-black border-2 border-gold text-center overflow-hidden ${details.bgGlow}`}
        >
          {/* Destellos de fondo */}
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-gold/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-gold/20 rounded-full blur-2xl pointer-events-none" />

          {/* Animación Candado & Llave */}
          <div className="flex items-center justify-center gap-4 my-4">
            <motion.div
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            >
              <MysticLock isUnlocked={true} size={48} />
            </motion.div>

            <motion.div
              initial={{ scale: 0.2, rotate: -90, x: -20 }}
              animate={{ scale: 1.2, rotate: 0, x: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 220 }}
              className="drop-shadow-[0_0_15px_rgba(252,207,101,0.8)]"
            >
              <MysticKey variant={keyType} size={54} isTurned={true} />
            </motion.div>
          </div>

          {/* Encabezado */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-1.5"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-gold/40 text-gold text-xs font-display uppercase tracking-widest font-bold">
              <Sparkles size={13} className="text-amber-400" />
              <span>{legendName}</span>
            </div>

            <h2 className={`text-2xl font-display font-bold ${details.color}`}>
              ¡{details.title} Forjada!
            </h2>

            <p className="text-xs text-cream/80 px-2 leading-relaxed">
              {details.desc}
            </p>
          </motion.div>

          {/* Contador de Llaves */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="my-5 p-3 rounded-2xl bg-black/60 border border-gold/30 flex items-center justify-between px-4"
          >
            <div className="flex items-center gap-2 text-left">
              {hasWon ? (
                <Trophy size={20} className="text-amber-400 animate-pulse" />
              ) : (
                <CheckCircle2 size={18} className="text-emerald-400" />
              )}
              <div>
                <span className="text-xs font-display font-bold text-cream block">
                  {hasWon ? '¡Victoria Absoluta!' : 'Tu Llavero Místico'}
                </span>
                <span className="text-[10px] text-cream/50">
                  {hasWon ? 'Has desbloqueado el Cofre Supremo' : 'Reúne las 4 para abrir el cofre'}
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-1 text-gold font-display font-bold">
              <span className="text-xl">{totalKeys}</span>
              <span className="text-xs text-cream/40">/</span>
              <span className="text-sm">4</span>
            </div>
          </motion.div>

          {/* Botón de cierre */}
          <Button
            variant="primary"
            onClick={onClose}
            className="w-full justify-center text-sm py-3 font-display tracking-wider"
          >
            {hasWon ? '🏆 Reclamar Victoria' : 'Continuar en el Tablero'}
          </Button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
