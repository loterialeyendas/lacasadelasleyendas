import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Ghost, BookOpen, Sparkles, Award, MapPin, Lightbulb } from 'lucide-react';
import { Legend } from '../../types/legend';
import { Button, Card, MysticalTitle } from '../../components/Theme';
import { sound } from '../../lib/audio';

interface StoryApparitionProps {
  legend: Legend;
  onComplete: (pointsWon: number) => void;
  onCancel: () => void;
}

export const StoryApparitionModule: React.FC<StoryApparitionProps> = ({ legend, onComplete, onCancel }) => {
  const [tab, setTab] = useState<'story' | 'history'>('story');

  const handleClaim = () => {
    sound.playMysticChime();
    onComplete(legend.pointsReward);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-lg mx-auto px-2 space-y-4"
    >
      {/* Encabezado */}
      <div className="flex items-center justify-between bg-black/60 p-3 rounded-xl border border-maya-red/40">
        <div className="flex items-center gap-2">
          <Ghost size={18} className="text-maya-red animate-pulse" />
          <span className="text-xs font-display text-cream tracking-wide">APARICIÓN MÍSTICA</span>
        </div>
        <div className="text-xs font-display text-gold">
          +{legend.pointsReward} Pts
        </div>
      </div>

      <Card className="space-y-5 border-maya-red/30 relative overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-maya-red/15 blur-3xl rounded-full pointer-events-none" />

        <div className="text-center space-y-1">
          <span className="text-[10px] font-display text-gold uppercase tracking-[0.25em]">
            {legend.title}
          </span>
          <MysticalTitle className="text-2xl md:text-3xl mb-1 text-cream">
            {legend.name}
          </MysticalTitle>
          <div className="flex items-center justify-center gap-1.5 text-cream/60 text-xs font-serif italic">
            <MapPin size={12} className="text-gold" />
            <span>{legend.culturalOrigin}</span>
          </div>
        </div>

        {/* Pestañas de Lectura */}
        <div className="flex border-b border-gold/20">
          <button
            onClick={() => setTab('story')}
            className={`flex-1 py-2 text-xs font-display transition-colors border-b-2 ${
              tab === 'story'
                ? 'border-gold text-gold font-bold'
                : 'border-transparent text-cream/40 hover:text-cream/70'
            }`}
          >
            La Leyenda
          </button>
          <button
            onClick={() => setTab('history')}
            className={`flex-1 py-2 text-xs font-display transition-colors border-b-2 ${
              tab === 'history'
                ? 'border-gold text-gold font-bold'
                : 'border-transparent text-cream/40 hover:text-cream/70'
            }`}
          >
            Dato Curioso
          </button>
        </div>

        {/* Contenido */}
        <div className="min-h-[160px] bg-earth-brown/15 p-4 rounded-xl border border-gold/20 font-serif leading-relaxed">
          {tab === 'story' ? (
            <p className="text-cream/90 text-sm italic">
              "{legend.fullStory}"
            </p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gold">
                <Lightbulb size={16} />
                <span className="font-display text-xs uppercase tracking-wide">¿Sabías que...?</span>
              </div>
              <p className="text-cream/90 text-sm italic">
                {legend.didYouKnow}
              </p>
            </div>
          )}
        </div>

        {/* Botón para sellar el pasaporte */}
        <div className="space-y-2 pt-2">
          <Button onClick={handleClaim} className="w-full py-4 text-xs flex items-center justify-center gap-2">
            <Sparkles size={16} /> Reclamar Sello en Pasaporte
          </Button>
          <Button variant="outline" size="sm" onClick={onCancel} className="w-full text-xs">
            Cerrar
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
