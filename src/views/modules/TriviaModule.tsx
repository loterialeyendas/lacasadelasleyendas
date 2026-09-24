import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Clock, CheckCircle2, XCircle, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { Legend } from '../../types/legend';
import { Button, Card, MysticalTitle } from '../../components/Theme';
import { sound } from '../../lib/audio';

interface TriviaModuleProps {
  legend: Legend;
  onComplete: (pointsWon: number) => void;
  onCancel: () => void;
}

export const TriviaModule: React.FC<TriviaModuleProps> = ({ legend, onComplete, onCancel }) => {
  const trivia = legend.trivia;
  const timeLimit = trivia?.timeLimit || 20;

  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Puntos de consuelo proporcionales a la recompensa de la leyenda
  const consolationPoints = Math.round(legend.pointsReward * 0.2);

  // Temporizador: un solo intervalo estable, sin efectos dentro del updater
  useEffect(() => {
    if (isAnswered) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnswered]);

  // Efectos de sonido y fin de tiempo fuera del ciclo de actualización de estado
  useEffect(() => {
    if (isAnswered) return;
    if (timeLeft <= 0) {
      setIsAnswered(true);
      setIsCorrect(false);
      sound.playError();
      return;
    }
    if (timeLeft <= 5) {
      sound.playTick();
    }
  }, [timeLeft, isAnswered]);

  const handleSelectOption = (index: number) => {
    if (isAnswered || !trivia) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const correct = index === trivia.answer;
    setIsCorrect(correct);

    if (correct) {
      sound.playSuccess();
    } else {
      sound.playError();
    }
  };

  const handleFinish = () => {
    sound.playClick();
    const points = isCorrect ? legend.pointsReward : consolationPoints; // Pequeño consuelo por participar
    onComplete(points);
  };

  if (!trivia) {
    return (
      <Card className="text-center space-y-4">
        <p className="text-cream">Esta leyenda no cuenta con trivia activa.</p>
        <Button onClick={onCancel}>Volver</Button>
      </Card>
    );
  }

  const timePercentage = (timeLeft / timeLimit) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-lg mx-auto px-2 space-y-4"
    >
      {/* Encabezado con Temporizador */}
      <div className="flex items-center justify-between bg-black/60 p-3 rounded-xl border border-gold/30">
        <div className="flex items-center gap-2">
          <HelpCircle size={18} className="text-gold" />
          <span className="text-xs font-display text-cream tracking-wide">TRIVIA MÍSTICA</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className={timeLeft <= 5 ? "text-maya-red animate-pulse" : "text-gold"} />
          <span className={`font-display text-sm font-bold ${timeLeft <= 5 ? "text-maya-red" : "text-cream"}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Barra de progreso de tiempo */}
      <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-gold/20">
        <motion.div
          className={`h-full transition-all duration-1000 ${
            timePercentage > 40 ? 'bg-gold' : timePercentage > 15 ? 'bg-amber-500' : 'bg-maya-red'
          }`}
          style={{ width: `${timePercentage}%` }}
        />
      </div>

      {/* Pregunta */}
      <Card className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-display text-maya-red uppercase tracking-widest block">
            {legend.name} • {legend.title}
          </span>
          <h2 className="text-lg md:text-xl font-display text-cream leading-snug">
            {trivia.question}
          </h2>
        </div>

        {/* Opciones */}
        <div className="space-y-3">
          {trivia.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-xl text-sm font-sans flex items-center justify-between border transition-all ";
            
            if (!isAnswered) {
              btnClass += "bg-black/40 border-gold/20 text-cream hover:border-gold/60 hover:bg-gold/10";
            } else {
              if (idx === trivia.answer) {
                btnClass += "bg-emerald-950/70 border-emerald-500 text-emerald-200 font-semibold shadow-[0_0_15px_rgba(16,185,129,0.3)]";
              } else if (idx === selectedOption) {
                btnClass += "bg-maya-red/40 border-maya-red text-red-200 font-semibold";
              } else {
                btnClass += "bg-black/20 border-white/5 text-cream/40 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={btnClass}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full border border-gold/30 flex items-center justify-center font-display text-xs text-gold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>

                {isAnswered && idx === trivia.answer && (
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                )}
                {isAnswered && idx === selectedOption && idx !== trivia.answer && (
                  <XCircle size={18} className="text-maya-red shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explicación Cultural y Botón Siguiente */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 pt-2 border-t border-gold/20"
            >
              <div className="p-3 bg-earth-brown/20 rounded-lg border border-gold/20 flex gap-3 text-left">
                <BookOpen size={20} className="text-gold shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-display uppercase tracking-widest text-gold block">
                    Sabiduría de los Ancestros
                  </span>
                  <p className="text-xs text-cream/90 font-serif italic leading-relaxed">
                    {trivia.explanation}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-display text-gold">
                  {isCorrect ? `+${legend.pointsReward} Pts` : `+${consolationPoints} Pts (Consuelo)`}
                </span>
                <Button onClick={handleFinish} className="flex items-center gap-2">
                  <span>Reclamar Sello</span>
                  <ArrowRight size={16} />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};
