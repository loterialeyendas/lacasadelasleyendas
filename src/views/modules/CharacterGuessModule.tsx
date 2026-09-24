import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Eye, CheckCircle2, XCircle, ChevronRight, Trophy, HelpCircle } from 'lucide-react';
import { Legend } from '../../types/legend';
import { Button, Card, MysticalTitle } from '../../components/Theme';
import { sound } from '../../lib/audio';

interface CharacterGuessProps {
  legend: Legend;
  onComplete: (pointsWon: number) => void;
  onCancel: () => void;
}

export const CharacterGuessModule: React.FC<CharacterGuessProps> = ({ legend, onComplete, onCancel }) => {
  const riddle = legend.riddle;
  const [hintIndex, setHintIndex] = useState(0);
  const [selectedGuess, setSelectedGuess] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!riddle) {
    return (
      <Card className="text-center space-y-4">
        <p className="text-cream">Esta leyenda no tiene acertijo disponible.</p>
        <Button onClick={onCancel}>Volver</Button>
      </Card>
    );
  }

  // Puntos calculados según la cantidad de pistas usadas
  // Pista 1: 100% de puntos, Pista 2: 70%, Pista 3: 40%
  const currentPoints = Math.round(legend.pointsReward * (1 - hintIndex * 0.3));

  const handleNextHint = () => {
    if (hintIndex < riddle.hints.length - 1) {
      sound.playClick();
      setHintIndex((prev) => prev + 1);
    }
  };

  const handleGuess = (option: string) => {
    if (isFinished) return;
    setSelectedGuess(option);
    setIsFinished(true);

    const correct = option.toLowerCase() === riddle.correctAnswer.toLowerCase();
    setIsSuccess(correct);

    if (correct) {
      sound.playSuccess();
    } else {
      sound.playError();
    }
  };

  const handleClaim = () => {
    sound.playClick();
    const finalPoints = isSuccess ? currentPoints : 50;
    onComplete(finalPoints);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-lg mx-auto px-2 space-y-4"
    >
      {/* Encabezado */}
      <div className="flex items-center justify-between bg-black/60 p-3 rounded-xl border border-gold/30">
        <div className="flex items-center gap-2">
          <Eye size={18} className="text-gold" />
          <span className="text-xs font-display text-cream tracking-wide">ADIVINA EL PERSONAJE</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-display text-gold">
          <Trophy size={14} />
          <span>Valor: {currentPoints} pts</span>
        </div>
      </div>

      <Card className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-display text-maya-red uppercase tracking-widest">
            Misterio Nocturno
          </span>
          <h2 className="text-lg font-display text-cream">
            ¿Quién es este ser de las sombras?
          </h2>
          <p className="text-xs text-cream/60 font-serif italic">
            Descubre su identidad usando la menor cantidad de pistas para obtener mayor recompensa.
          </p>
        </div>

        {/* Pistas Progresivas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-display text-gold/80 px-1">
            <span>PISTAS REVELADAS ({hintIndex + 1} de {riddle.hints.length})</span>
            <span>{hintIndex === 0 ? '¡Puntos Máximos!' : hintIndex === 1 ? 'Puntos Medios' : 'Última Oportunidad'}</span>
          </div>

          <div className="space-y-2">
            {riddle.hints.slice(0, hintIndex + 1).map((hint, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-earth-brown/20 border border-gold/20 rounded-lg flex items-start gap-3"
              >
                <span className="w-5 h-5 rounded-full bg-gold/20 text-gold text-[10px] font-display flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-cream font-serif italic leading-relaxed">
                  "{hint}"
                </p>
              </motion.div>
            ))}
          </div>

          {!isFinished && hintIndex < riddle.hints.length - 1 && (
            <button
              onClick={handleNextHint}
              className="text-xs text-gold hover:text-cream flex items-center gap-1 underline underline-offset-4 decoration-gold/30 mt-2 px-1 transition-colors"
            >
              <span>Revelar siguiente pista (-30% puntos)</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {/* Opciones de respuesta */}
        <div className="space-y-2 pt-2 border-t border-gold/20">
          <span className="text-[10px] font-display uppercase tracking-widest text-gold block text-center">
            Selecciona tu respuesta
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {riddle.options.map((opt, idx) => {
              let btnClass = "p-3 rounded-lg text-xs font-display border transition-all text-center ";

              if (!isFinished) {
                btnClass += "bg-black/40 border-gold/20 text-cream hover:border-gold/60 hover:bg-gold/10";
              } else {
                if (opt.toLowerCase() === riddle.correctAnswer.toLowerCase()) {
                  btnClass += "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]";
                } else if (opt === selectedGuess) {
                  btnClass += "bg-maya-red/40 border-maya-red text-red-200 font-semibold";
                } else {
                  btnClass += "bg-black/20 border-white/5 text-cream/30 opacity-40";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isFinished}
                  onClick={() => handleGuess(opt)}
                  className={btnClass}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Resultado Final */}
        <AnimatePresence>
          {isFinished && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 pt-3 border-t border-gold/20"
            >
              <div className="p-3 bg-black/40 rounded-lg border border-gold/20">
                <p className="text-xs text-cream/90 font-serif italic text-center">
                  {riddle.revealedInfo}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-display text-gold">
                  {isSuccess ? `+${currentPoints} Puntos ganados` : '+50 Puntos de aliento'}
                </span>
                <Button onClick={handleClaim} size="sm">
                  Continuar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};
