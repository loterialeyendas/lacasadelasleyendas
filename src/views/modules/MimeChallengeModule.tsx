import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Clock, ThumbsUp, ThumbsDown, Award, Sparkles } from 'lucide-react';
import { Legend } from '../../types/legend';
import { Button, Card } from '../../components/Theme';
import { sound } from '../../lib/audio';

interface MimeChallengeProps {
  legend: Legend;
  onComplete: (pointsWon: number) => void;
  onCancel: () => void;
}

export const MimeChallengeModule: React.FC<MimeChallengeProps> = ({ legend, onComplete, onCancel }) => {
  const challenge = legend.challenge || {
    title: 'Desafío del Espectro',
    instructions: `Actúa como ${legend.name} usando solo mímica y ademanes sin emitir palabras hasta que alguien descubra la leyenda.`,
    roleDescription: 'El jugador en turno debe actuar mientras los demás observan.',
    timeLimit: 40,
    points: legend.pointsReward
  };

  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit || 40);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [verdict, setVerdict] = useState<'success' | 'fail' | null>(null);

  // Temporizador puro sin efectos secundarios en el updater
  useEffect(() => {
    if (!isActive || isFinished) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isFinished]);

  // Efectos de audio y conclusión del tiempo
  useEffect(() => {
    if (!isActive || isFinished) return;
    if (timeLeft <= 0) {
      setIsFinished(true);
      sound.playError();
      return;
    }
    if (timeLeft <= 5) {
      sound.playTick();
    }
  }, [timeLeft, isActive, isFinished]);

  const handleStart = () => {
    sound.playMysticChime();
    setIsActive(true);
  };

  const handleVote = (success: boolean) => {
    setIsFinished(true);
    setVerdict(success ? 'success' : 'fail');
    if (success) {
      sound.playSuccess();
    } else {
      sound.playError();
    }
  };

  const handleClaim = () => {
    sound.playClick();
    const points = verdict === 'success' ? challenge.points : 50;
    onComplete(points);
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
          <Gamepad2 size={18} className="text-gold" />
          <span className="text-xs font-display text-cream tracking-wide">RETO & MÍMICA</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className={timeLeft <= 10 && isActive ? "text-maya-red animate-pulse" : "text-gold"} />
          <span className="font-display text-sm font-bold text-cream">
            {timeLeft}s
          </span>
        </div>
      </div>

      <Card className="space-y-6 text-center">
        <div className="space-y-2">
          <span className="text-[10px] font-display text-maya-red uppercase tracking-widest block">
            {legend.name} • {challenge.title}
          </span>
          <h2 className="text-xl font-display text-cream">
            ¡Hora de Actuar!
          </h2>
        </div>

        {/* Instrucciones del Reto */}
        <div className="p-4 bg-earth-brown/20 border border-gold/20 rounded-xl space-y-3 text-left">
          <p className="text-sm text-cream font-serif italic leading-relaxed">
            "{challenge.instructions}"
          </p>
          <div className="text-[11px] text-gold/80 font-display border-t border-gold/10 pt-2">
            🎭 {challenge.roleDescription}
          </div>
        </div>

        {!isActive && !isFinished && (
          <div className="space-y-3">
            <Button onClick={handleStart} className="w-full py-4 text-sm flex items-center justify-center gap-2">
              <Sparkles size={18} /> Iniciar Cronómetro
            </Button>
            <Button variant="outline" size="sm" onClick={onCancel} className="w-full text-xs">
              Cancelar
            </Button>
          </div>
        )}

        {isActive && !isFinished && (
          <div className="space-y-4">
            <p className="text-xs text-cream/70 font-display animate-pulse">
              ¿El participante logró completar el reto ante los demás?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleVote(true)}
                className="bg-emerald-900/80 hover:bg-emerald-800 border-emerald-500 text-emerald-100 flex items-center justify-center gap-2 py-3"
              >
                <ThumbsUp size={18} /> ¡Completado!
              </Button>
              <Button
                onClick={() => handleVote(false)}
                variant="secondary"
                className="flex items-center justify-center gap-2 py-3"
              >
                <ThumbsDown size={18} /> No lo logró
              </Button>
            </div>
          </div>
        )}

        {isFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 pt-2 border-t border-gold/20"
          >
            <div className="p-3 bg-black/40 rounded-lg border border-gold/20 flex items-center justify-center gap-2">
              <Award size={20} className="text-gold" />
              <span className="font-display text-sm text-cream">
                {verdict === 'success' ? `¡Victoria! +${challenge.points} pts` : '+50 pts por el intento'}
              </span>
            </div>
            <Button onClick={handleClaim} className="w-full py-3 text-xs">
              Guardar Resultado
            </Button>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};
