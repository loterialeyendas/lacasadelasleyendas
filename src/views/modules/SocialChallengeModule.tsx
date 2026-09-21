import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Camera, Copy, Check, ThumbsUp, ThumbsDown, Sparkles, ExternalLink, ArrowLeft } from 'lucide-react';
import { Legend } from '../../types/legend';
import { Button, Card } from '../../components/Theme';
import { MysticKey } from '../../components/svgs/MysticKey';
import { sound } from '../../lib/audio';

interface SocialChallengeModuleProps {
  legend: Legend;
  onComplete: (pointsEarned: number) => void;
  onCancel: () => void;
}

export const SocialChallengeModule: React.FC<SocialChallengeModuleProps> = ({
  legend,
  onComplete,
  onCancel
}) => {
  const [copied, setCopied] = useState(false);
  const [hasShared, setHasShared] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const challenge = legend.socialChallenge || {
    title: `El Desafío de ${legend.name}`,
    instructions: `Tómate una foto o video corto recreando la pose clásica de ${legend.name}. Compártelo en tus historias o con tu grupo con el hashtag oficial.`,
    poseDescription: 'Posar con expresión mística evocando el misterio de la leyenda.',
    suggestedHashtag: '#CasaDeLasLeyendasGT',
    shareQuote: `¡Enfrentando el misterio de ${legend.name} en La Casa de las Leyendas! 🗝️✨`,
    points: legend.pointsReward || 350
  };

  const handleCopyText = async () => {
    try {
      const fullText = `${challenge.shareQuote} ${challenge.suggestedHashtag} @lacasadelasleyendas`;
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      sound.playSuccess();
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    sound.playClick();
    const shareData = {
      title: 'La Casa de las Leyendas',
      text: `${challenge.shareQuote} ${challenge.suggestedHashtag}`,
      url: window.location.origin
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        setHasShared(true);
        setIsEvaluating(true);
      } catch (err) {
        // Compartir cancelado por el usuario
      }
    } else {
      // Si no soporta Web Share, copiar texto y abrir Instagram web o alertar
      handleCopyText();
      window.open('https://www.instagram.com/', '_blank');
      setHasShared(true);
      setIsEvaluating(true);
    }
  };

  const handleGroupVerdict = (approved: boolean) => {
    if (approved) {
      sound.playSuccess();
      onComplete(challenge.points);
    } else {
      sound.playError();
      onCancel();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-lg mx-auto space-y-4 px-2 pb-8"
    >
      {/* Barra Superior */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={onCancel} className="p-2 h-auto text-xs">
          <ArrowLeft size={16} />
        </Button>
        <div className="flex items-center gap-1.5 bg-fuchsia-950/80 border border-fuchsia-500/40 px-3 py-1 rounded-full text-fuchsia-300 text-xs font-display font-bold">
          <MysticKey variant="obsidian" size={16} />
          <span>Por la Llave de Obsidiana</span>
        </div>
        <div className="w-8" />
      </div>

      {/* Tarjeta de Reto */}
      <Card className="border-fuchsia-500/40 bg-gradient-to-b from-[#1c0b24]/95 via-[#100716]/95 to-black/95 p-5 shadow-[0_0_30px_rgba(217,70,239,0.15)] relative overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Encabezado del Reto */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-fuchsia-950 border border-fuchsia-500/50 flex items-center justify-center shrink-0 shadow-inner">
            <Camera size={24} className="text-fuchsia-400" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-fuchsia-400 font-display font-bold block">
              Reto de Redes Sociales • {legend.name}
            </span>
            <h2 className="text-lg font-display text-cream font-bold leading-tight mt-0.5">
              {challenge.title}
            </h2>
          </div>
        </div>

        {/* Instrucciones del Desafío */}
        <div className="bg-black/60 rounded-xl p-4 border border-fuchsia-500/20 mb-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-display text-fuchsia-300 font-bold">
            <Sparkles size={14} />
            <span>Misión para el jugador en turno:</span>
          </div>
          <p className="text-sm text-cream/90 leading-relaxed">
            {challenge.instructions}
          </p>
          <div className="bg-fuchsia-950/40 border border-fuchsia-500/20 rounded-lg p-2.5 mt-2">
            <p className="text-xs text-fuchsia-200/90 italic">
              <strong>Pose sugerida:</strong> {challenge.poseDescription}
            </p>
          </div>
        </div>

        {/* Frase y Hashtag para Compartir */}
        <div className="bg-black/40 border border-white/10 rounded-xl p-3 mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-display text-cream/60">Frase & Hashtags Oficiales:</span>
            <button
              onClick={handleCopyText}
              className="text-[11px] font-display text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1 transition-colors"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copied ? '¡Copiado!' : 'Copiar texto'}</span>
            </button>
          </div>
          <p className="text-xs text-cream/80 bg-black/60 p-2 rounded-lg border border-white/5 font-mono">
            {challenge.shareQuote} <span className="text-fuchsia-400 font-bold">{challenge.suggestedHashtag}</span>
          </p>
        </div>

        {/* Botones de Acción para Compartir */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
          <Button
            variant="primary"
            onClick={handleNativeShare}
            className="w-full justify-center gap-2 bg-gradient-to-r from-fuchsia-600 to-purple-700 hover:from-fuchsia-500 hover:to-purple-600 border-fuchsia-400 text-xs py-2.5"
          >
            <Share2 size={16} />
            <span>Abrir Redes / Compartir</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              handleCopyText();
              window.open('https://instagram.com', '_blank');
              setHasShared(true);
              setIsEvaluating(true);
            }}
            className="w-full justify-center gap-2 border-fuchsia-500/40 text-fuchsia-300 hover:bg-fuchsia-950/40 text-xs py-2.5"
          >
            <ExternalLink size={14} />
            <span>Ir a Instagram</span>
          </Button>
        </div>

        {/* Validación del Grupo en la Mesa */}
        <div className="border-t border-fuchsia-500/20 pt-4 mt-2">
          <div className="text-center mb-3">
            <h4 className="text-xs uppercase font-display tracking-widest text-gold font-bold">
              Veredicto del Tablero
            </h4>
            <p className="text-[11px] text-cream/60 mt-0.5">
              ¿Los demás jugadores confirman que la foto o video fue publicado o realizado?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleGroupVerdict(false)}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl border border-red-500/30 bg-red-950/30 hover:bg-red-950/60 text-red-300 text-xs font-display font-bold transition-all"
            >
              <ThumbsDown size={16} />
              <span>No cumplido</span>
            </button>

            <button
              onClick={() => handleGroupVerdict(true)}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/70 to-emerald-900/80 hover:from-emerald-900 hover:to-emerald-800 text-emerald-200 text-xs font-display font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
            >
              <ThumbsUp size={16} className="text-emerald-400" />
              <span>¡Reto Cumplido!</span>
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
