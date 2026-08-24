import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  QrCode, 
  CheckCircle2, 
  Trophy, 
  MapPin
} from 'lucide-react';
import { Legend, Stamp } from '../types/legend';
import { LEYENDAS_DATA } from '../services/legendService';
import { Button, Card, MysticalTitle } from '../components/Theme';
import { sound } from '../lib/audio';
import { PassportStampSvg } from '../components/svgs/PassportStampSvg';
import { MysticLock } from '../components/svgs/MysticLock';

interface ExplorerViewProps {
  stamps: Stamp[];
  totalScore: number;
  onOpenScanner: () => void;
  onSelectLegend: (legend: Legend) => void;
  onBack: () => void;
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({
  stamps,
  totalScore,
  onOpenScanner,
  onSelectLegend,
  onBack
}) => {
  const [selectedLegendDetail, setSelectedLegendDetail] = useState<Legend | null>(null);

  const unlockedLegendIds = new Set(stamps.map((s) => s.legendId));
  const completionPercentage = Math.round((stamps.length / LEYENDAS_DATA.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-md mx-auto px-2 space-y-4 pb-8"
    >
      {/* Barra superior */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={onBack} className="p-2 h-auto text-xs">
          <ArrowLeft size={16} />
        </Button>
        <div className="text-center">
          <h2 className="text-sm font-display text-gold tracking-widest uppercase">
            Pasaporte Místico
          </h2>
          <span className="text-[10px] text-cream/60 font-serif">Casa de las Leyendas</span>
        </div>
        <div className="w-8" />
      </div>

      {/* Tarjeta de Progreso del Pasaporte */}
      <Card className="space-y-4 border-gold/40 relative overflow-hidden bg-black/70">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-display uppercase tracking-widest text-gold">
              Progreso del Recorrido
            </span>
            <h3 className="text-xl font-display text-cream">
              {stamps.length} de {LEYENDAS_DATA.length} Leyendas
            </h3>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-display">
            <Trophy size={14} />
            <span>{totalScore} Pts</span>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="space-y-1">
          <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-gold/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-earth-brown via-gold to-cream"
            />
          </div>
          <div className="flex justify-between text-[9px] font-display text-cream/50">
            <span>Iniciado</span>
            <span>{completionPercentage}% Completado</span>
            <span>Maestro de Leyendas</span>
          </div>
        </div>

        {/* Botón Flotante para Escanear */}
        <Button
          onClick={() => {
            sound.playClick();
            onOpenScanner();
          }}
          className="w-full py-3.5 flex items-center justify-center gap-2 text-xs shadow-lg"
        >
          <QrCode size={18} />
          <span>Escanear Estación o Código</span>
        </Button>
      </Card>

      {/* Cuadrícula de Sellos del Pasaporte */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-display uppercase tracking-wider text-gold">
            Álbum de Estaciones
          </h3>
          <span className="text-[10px] text-cream/50 font-serif italic">
            Toca una leyenda para ver detalles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {LEYENDAS_DATA.map((legend) => {
            const isUnlocked = unlockedLegendIds.has(legend.id);

            return (
              <motion.div
                key={legend.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  sound.playClick();
                  if (isUnlocked) {
                    setSelectedLegendDetail(legend);
                  } else {
                    onSelectLegend(legend);
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden text-left ${
                  isUnlocked
                    ? 'bg-black/60 border-gold/50 shadow-[0_0_15px_rgba(190,141,44,0.15)]'
                    : 'bg-black/30 border-white/10 opacity-75 hover:opacity-100 hover:border-gold/30'
                }`}
              >
                {/* Sello de Marca de Agua de Desbloqueado */}
                {isUnlocked && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-gold/20 text-gold px-2 py-0.5 rounded-full border border-gold/40 text-[9px] font-display">
                    <CheckCircle2 size={11} className="text-emerald-400" />
                    <span>SELLADO</span>
                  </div>
                )}

                {!isUnlocked && (
                  <div className="absolute top-2 right-2">
                    <MysticLock isUnlocked={false} size={20} />
                  </div>
                )}

                <div className="flex items-center gap-3 mb-2">
                  <PassportStampSvg code={legend.code} name={legend.name} isUnlocked={isUnlocked} size={48} />
                  <div>
                    <h4 className="font-display text-xs text-cream leading-tight font-bold">
                      {legend.name}
                    </h4>
                    <span className="text-[9px] text-gold/80 font-display block">
                      Código: {legend.code}
                    </span>
                    <span className="text-[9px] uppercase font-display text-cream/40">
                      {legend.category}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-cream/70 font-serif italic line-clamp-2 leading-relaxed">
                  "{legend.shortDescription}"
                </p>

                <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-display">
                  <span className="text-gold/60">
                    +{legend.pointsReward} Pts
                  </span>
                  <span className={isUnlocked ? "text-gold font-bold" : "text-cream/60"}>
                    {isUnlocked ? 'Ver Historia 📜' : '¡Resolver Reto! ⚡'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal de Detalle de Leyenda Desbloqueada */}
      <AnimatePresence>
        {selectedLegendDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-md space-y-4 max-h-[85vh] overflow-y-auto border-gold/50">
              <div className="text-center space-y-1">
                <PassportStampSvg 
                  code={selectedLegendDetail.code} 
                  name={selectedLegendDetail.name} 
                  isUnlocked={true} 
                  size={64} 
                  className="mx-auto mb-2"
                />
                <span className="text-[10px] font-display text-gold uppercase tracking-widest">
                  {selectedLegendDetail.title}
                </span>
                <MysticalTitle className="text-2xl mb-0">
                  {selectedLegendDetail.name}
                </MysticalTitle>
                <div className="flex items-center justify-center gap-1 text-xs text-cream/60 font-serif italic">
                  <MapPin size={12} className="text-gold" />
                  <span>{selectedLegendDetail.culturalOrigin}</span>
                </div>
              </div>

              <div className="p-3 bg-earth-brown/20 rounded-xl border border-gold/20 space-y-2">
                <span className="text-[10px] font-display text-gold uppercase">La Historia:</span>
                <p className="text-xs text-cream font-serif italic leading-relaxed">
                  "{selectedLegendDetail.fullStory}"
                </p>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-gold/20 space-y-1">
                <span className="text-[10px] font-display text-maya-red uppercase">Dato Ancestral:</span>
                <p className="text-xs text-cream/90 font-serif italic leading-relaxed">
                  {selectedLegendDetail.didYouKnow}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLegendDetail(null)}
                className="w-full text-xs py-2.5"
              >
                Cerrar Pasaporte
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
