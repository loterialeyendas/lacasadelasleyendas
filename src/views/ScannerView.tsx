import React, { useState } from 'react';
import { motion } from 'motion/react';
import { QrCode, ArrowLeft, AlertCircle } from 'lucide-react';
import { Scanner } from '../components/Scanner';
import { Button, Card } from '../components/Theme';
import { parseQRData } from '../services/legendService';
import { Legend } from '../types/legend';
import { sound } from '../lib/audio';

interface ScannerViewProps {
  onLegendFound: (legend: Legend) => void;
  onBack: () => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({ onLegendFound, onBack }) => {
  const [error, setError] = useState('');

  const handleScanSuccess = (data: string) => {
    sound.playMysticChime();
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([60, 40, 60]);
      } catch {}
    }
    const legend = parseQRData(data);
    if (legend) {
      onLegendFound(legend);
    } else {
      sound.playError();
      setError(`Tarjeta QR no reconocida: "${data}". Intenta apuntar de nuevo a la tarjeta oficial.`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-md mx-auto px-3 space-y-4"
    >
      {/* Botón de Retorno y Título */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack} 
          aria-label="Volver al tablero" 
          className="p-2 h-auto text-xs"
        >
          <ArrowLeft size={16} />
        </Button>
        <h2 className="text-sm font-display text-gold tracking-widest uppercase flex items-center gap-1.5">
          <QrCode size={16} /> Escanear Tarjeta QR
        </h2>
        <div className="w-8" />
      </div>

      {/* Contenedor del Escáner */}
      <Card className="border border-gold/40 p-4 space-y-3 bg-black/80 backdrop-blur-md">
        <Scanner
          onScan={handleScanSuccess}
          onCancel={onBack}
        />
        
        <div className="text-center space-y-1 pt-1">
          <p className="text-xs text-gold/90 font-display uppercase tracking-wider">
            Apunta la cámara a tu tarjeta física
          </p>
          <p className="text-[11px] text-cream/60 font-serif italic leading-tight">
            Coloca el código QR de la tarjeta dentro del marco para invocar el reto de tu turno.
          </p>
        </div>
      </Card>

      {/* Mensajes de Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 bg-maya-red/20 border border-maya-red/50 rounded-xl flex items-center gap-2 text-xs text-red-200"
        >
          <AlertCircle size={16} className="shrink-0 text-maya-red" />
          <span>{error}</span>
        </motion.div>
      )}
    </motion.div>
  );
};
