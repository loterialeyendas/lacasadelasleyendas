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
import { getLocalContent } from '../services/contentService';

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
  const legendImages = getLocalContent().landing.legendFichasImages || {};

  const unlockedLegendIds = new Set(stamps.map((s) => s.legendId));
  const completionPercentage = Math.round((stamps.length / LEYENDAS_DATA.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-md mx-auto px-2 space-y-4 pb-10"
    >
      {/* Barra superior */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={onBack} className="p-2.5 h-auto text-xs sm:text-sm">
          <ArrowLeft size={18} />
        </Button>
        <div className="text-center">
          <h2 className="text-sm sm:text-base font-display text-gold tracking-widest uppercase font-bold">
            Pasaporte Místico
          </h2>
          <span className="text-xs text-cream/70 font-serif">Casa de las Leyendas</span>
        </div>
        <div className="w-8" />
      </div>

      {/* Tarjeta de Progreso del Pasaporte */}
      <Card className="space-y-4 border-gold/50 relative overflow-hidden bg-black/80 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-display uppercase tracking-widest text-gold font-bold">
              Progreso del Recorrido
            </span>
            <h3 className="text-xl sm:text-2xl font-display text-cream font-bold">
              {stamps.length} de {LEYENDAS_DATA.length} Leyendas
            </h3>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/20 border border-gold/50 text-gold text-xs sm:text-sm font-display font-bold">
            <Trophy size={16} />
            <span>{totalScore} Pts</span>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="space-y-1.5">
          <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-gold/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-earth-brown via-gold to-cream"
            />
          </div>
          <div className="flex justify-between text-[11px] sm:text-xs font-display text-cream/70">
            <span>Iniciado</span>
            <span className="font-bold text-gold">{completionPercentage}% Completado</span>
            <span>Maestro de Leyendas</span>
          </div>
        </div>

        {/* Botón Flotante para Escanear */}
        <Button
          onClick={() => {
            sound.playClick();
            onOpenScanner();
          }}
          className="w-full py-4 flex items-center justify-center gap-2 text-xs sm:text-sm shadow-lg font-bold rounded-xl"
        >
          <QrCode size={20} />
          <span>Escanear Estación o Código</span>
        </Button>
      </Card>

      {/* Cuadrícula de Sellos del Pasaporte */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs sm:text-sm font-display uppercase tracking-wider text-gold font-bold">
            Álbum de Estaciones
          </h3>
          <span className="text-xs text-cream/70 font-serif italic">
            Toca una leyenda para ver detalles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden text-left ${
                  isUnlocked
                    ? 'bg-black/70 border-gold/60 shadow-[0_0_15px_rgba(190,141,44,0.2)]'
                    : 'bg-black/40 border-white/10 opacity-80 hover:opacity-100 hover:border-gold/40'
                }`}
              >
                {/* Sello de Marca de Agua de Desbloqueado */}
                {isUnlocked && (
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-gold/20 text-gold px-2.5 py-0.5 rounded-full border border-gold/40 text-[10px] font-display font-bold">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span>SELLADO</span>
                  </div>
                )}

                {!isUnlocked && (
                  <div className="absolute top-2.5 right-2.5">
                    <MysticLock isUnlocked={false} size={22} />
                  </div>
                )}

                <div className="flex items-center gap-3 mb-2">
                  <PassportStampSvg 
                    code={legend.code} 
                    name={legend.name} 
                    isUnlocked={isUnlocked} 
                    size={52} 
                    imageUrl={legendImages[legend.id]} 
                  />
                  <div>
                    <h4 className="font-display text-sm sm:text-base text-cream leading-tight font-bold">
                      {legend.name}
                    </h4>
                    <span className="text-[11px] text-gold font-display font-semibold block mt-0.5">
                      Código: {legend.code}
                    </span>
                    <span className="text-[10px] uppercase font-display text-cream/50">
                      {legend.category}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-cream/80 font-serif italic line-clamp-2 leading-relaxed">
                  "{legend.shortDescription}"
                </p>

                <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-display">
                  <span className="text-gold/80 font-semibold">
                    +{legend.pointsReward} Pts
                  </span>
                  <span className={isUnlocked ? "text-gold font-bold" : "text-cream/80 font-semibold"}>
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
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-md space-y-4 max-h-[85vh] overflow-y-auto border-gold/50 rounded-2xl p-6">
              <div className="text-center space-y-1.5">
                <PassportStampSvg 
                  code={selectedLegendDetail.code} 
                  name={selectedLegendDetail.name} 
                  isUnlocked={true} 
                  size={68} 
                  className="mx-auto mb-2"
                />
                <span className="text-xs font-display text-gold uppercase tracking-widest font-bold">
                  {selectedLegendDetail.title}
                </span>
                <MysticalTitle className="text-2xl sm:text-3xl mb-0">
                  {selectedLegendDetail.name}
                </MysticalTitle>
                <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-cream/70 font-serif italic">
                  <MapPin size={14} className="text-gold" />
                  <span>{selectedLegendDetail.culturalOrigin}</span>
                </div>
              </div>

              <div className="p-4 bg-earth-brown/25 rounded-xl border border-gold/20 space-y-2">
                <span className="text-xs font-display text-gold uppercase font-bold">La Historia:</span>
                <p className="text-sm text-cream font-serif italic leading-relaxed">
                  "{selectedLegendDetail.fullStory}"
                </p>
              </div>

              <div className="p-4 bg-black/60 rounded-xl border border-gold/25 space-y-1.5">
                <span className="text-xs font-display text-maya-red uppercase font-bold">Dato Ancestral:</span>
                <p className="text-sm text-cream/95 font-serif italic leading-relaxed">
                  {selectedLegendDetail.didYouKnow}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLegendDetail(null)}
                className="w-full text-xs sm:text-sm py-3 font-bold rounded-xl"
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
