import React, { useState } from 'react';
import { motion } from 'motion/react';
import { QrCode, KeyRound, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';
import { Scanner } from '../components/Scanner';
import { Button, Card, MysticalTitle } from '../components/Theme';
import { parseQRData, getLegendByCode, LEYENDAS_DATA } from '../services/legendService';
import { Legend } from '../types/legend';
import { sound } from '../lib/audio';

interface ScannerViewProps {
  onLegendFound: (legend: Legend) => void;
  onBack: () => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({ onLegendFound, onBack }) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'code'>('camera');
  const [manualCode, setManualCode] = useState('');
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
      setError(`Código no reconocido: "${data}". Intenta de nuevo.`);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!manualCode.trim()) {
      setError('Ingresa el código de la tarjeta física o estación (ej: SOMB, TRIV-CADE, TATU).');
      return;
    }

    const legend = parseQRData(manualCode) || getLegendByCode(manualCode);
    if (legend) {
      sound.playMysticChime();
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate(50); } catch {}
      }
      onLegendFound(legend);
    } else {
      sound.playError();
      setError(`Código "${manualCode.toUpperCase()}" no encontrado. Códigos de ejemplo: SOMB, CADE, LLOR, SIGU, TATU, CARR, CIPI (o tarjetas tipo TRIV-CADE).`);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-md mx-auto px-2 space-y-4"
    >
      {/* Botón de Retorno */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={onBack} aria-label="Volver" className="p-2 h-auto text-xs">
          <ArrowLeft size={16} />
        </Button>
        <h2 className="text-sm font-display text-gold tracking-widest uppercase">
          Portal de Invocación
        </h2>
        <div className="w-8" />
      </div>

      {/* Selector de Modo: Cámara vs Código Manual */}
      <div className="flex bg-black/60 p-1 rounded-xl border border-gold/30">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('camera');
            setError('');
          }}
          className={`flex-1 py-2 rounded-lg text-xs font-display flex items-center justify-center gap-2 transition-all ${
            activeTab === 'camera'
              ? 'bg-gold/20 text-gold border border-gold/40 shadow-sm'
              : 'text-cream/50 hover:text-cream'
          }`}
        >
          <QrCode size={16} />
          <span>Escanear QR</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('code');
            setError('');
          }}
          className={`flex-1 py-2 rounded-lg text-xs font-display flex items-center justify-center gap-2 transition-all ${
            activeTab === 'code'
              ? 'bg-gold/20 text-gold border border-gold/40 shadow-sm'
              : 'text-cream/50 hover:text-cream'
          }`}
        >
          <KeyRound size={16} />
          <span>Ingresar Código</span>
        </button>
      </div>

      {/* Vista de Cámara */}
      {activeTab === 'camera' && (
        <div className="space-y-3">
          <Scanner
            onScan={handleScanSuccess}
            onCancel={onBack}
          />
          <p className="text-[11px] text-cream/60 font-serif italic text-center px-4">
            Apunta la cámara al código QR ubicado en la estación física o carta del juego.
          </p>
        </div>
      )}

      {/* Vista de Código Manual */}
      {activeTab === 'code' && (
        <Card className="space-y-6">
          <div className="text-center space-y-1">
            <MysticalTitle className="text-xl mb-1">Código de Estación</MysticalTitle>
            <p className="text-xs text-cream/70 font-serif italic">
              Ingresa el código impreso en la tarjeta o placa (ej: SOMB, LLOR, CADE).
            </p>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value.toUpperCase())}
              placeholder="EJ: CADE"
              maxLength={6}
              className="w-full bg-black/50 border border-gold/30 rounded-xl p-4 text-center text-3xl tracking-[0.3em] font-display text-gold outline-none focus:border-gold shadow-inner"
              autoFocus
            />

            <Button type="submit" className="w-full py-4 flex items-center justify-center gap-2 text-xs">
              <Sparkles size={16} /> Invocar Desafío
            </Button>
          </form>

          {/* Atajos Rápidos de Prueba (solo en desarrollo) */}
          {import.meta.env.DEV && (
            <div className="pt-3 border-t border-gold/20">
              <span className="text-[9px] font-display text-cream/40 uppercase tracking-widest block text-center mb-2">
                Estaciones disponibles en la casa:
              </span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {LEYENDAS_DATA.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      sound.playClick();
                      setManualCode(l.code);
                    }}
                    className="px-2 py-1 bg-black/40 border border-gold/20 rounded text-[10px] font-display text-gold/80 hover:bg-gold/20 hover:text-cream transition-colors"
                  >
                    {l.code} ({l.name})
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Mensajes de Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 bg-maya-red/20 border border-maya-red/50 rounded-xl flex items-center gap-2 text-xs text-red-900"
        >
          <AlertCircle size={16} className="shrink-0 text-maya-red" />
          <span>{error}</span>
        </motion.div>
      )}
    </motion.div>
  );
};
