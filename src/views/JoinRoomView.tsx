import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Users, Sparkles, AlertCircle, QrCode, Camera } from 'lucide-react';
import { Button, Card, MysticalTitle } from '../components/Theme';
import { Scanner } from '../components/Scanner';
import { sound } from '../lib/audio';

interface JoinRoomViewProps {
  onJoin: (roomCode: string) => void;
  onBack: () => void;
  isLoading?: boolean;
  error?: string;
  initialCode?: string;
}

export const JoinRoomView: React.FC<JoinRoomViewProps> = ({
  onJoin,
  onBack,
  isLoading = false,
  error = '',
  initialCode = ''
}) => {
  const [code, setCode] = useState(initialCode);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    sound.playClick();
    onJoin(code.trim().toUpperCase());
  };

  const handleScanRoom = (data: string): boolean => {
    const clean = data.trim();
    let detectedRoomCode = '';

    if (clean.includes('room=')) {
      const match = clean.match(/room=([A-Za-z0-9]{4,8})/i);
      if (match) detectedRoomCode = match[1].toUpperCase();
    } else if (/^[A-Za-z0-9]{6}$/.test(clean)) {
      detectedRoomCode = clean.toUpperCase();
    }

    if (detectedRoomCode) {
      sound.playMysticChime();
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([50, 40, 60]);
        } catch {}
      }
      setCode(detectedRoomCode);
      setIsScanning(false);
      onJoin(detectedRoomCode);
      return true;
    }

    sound.playError();
    setScanError(`El código QR escaneado no parece ser de una sala: "${data}"`);
    return false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-md mx-auto px-2 space-y-4"
    >
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={isScanning ? () => setIsScanning(false) : onBack} 
          aria-label="Volver" 
          className="p-2 h-auto text-xs"
        >
          <ArrowLeft size={16} />
        </Button>
        <h2 className="text-xs font-display text-gold tracking-widest uppercase">
          {isScanning ? 'Escanear QR de Sala' : 'Unirse a Sala'}
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {isScanning ? (
          <motion.div
            key="scanner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            <Card className="border border-gold/40 p-4 space-y-3 bg-black/85 backdrop-blur-md">
              <Scanner
                onScan={handleScanRoom}
                onCancel={() => setIsScanning(false)}
              />
              <div className="text-center space-y-1 pt-1">
                <p className="text-xs text-gold font-display uppercase tracking-wider">
                  Apunta a la pantalla del Mayordomo
                </p>
                <p className="text-[11px] text-cream/70 font-serif italic leading-tight">
                  Lee el código QR de convocatoria para entrar a la partida en un instante.
                </p>
              </div>
            </Card>

            {scanError && (
              <div className="p-3 bg-maya-red/20 border border-maya-red/40 rounded-xl flex items-center gap-2 text-xs text-red-200">
                <AlertCircle size={16} className="text-maya-red shrink-0" />
                <span>{scanError}</span>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="space-y-6">
              <div className="text-center space-y-2">
                <MysticalTitle className="text-2xl mb-1">CÓDIGO DE SALA</MysticalTitle>
                <p className="text-xs text-cream/70 font-serif italic">
                  Ingresa el código de 6 caracteres compartido por el Mayordomo o escanea su pantalla.
                </p>
                <span className="text-[10px] font-mono text-gold/70 block">
                  (Hasta 5 invitados por sala convocada)
                </span>
              </div>

              {/* Botón para activar el escáner de sala */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setScanError('');
                  setIsScanning(true);
                }}
                className="w-full py-3.5 px-4 rounded-xl border border-gold/40 hover:border-gold bg-gold/15 hover:bg-gold/25 text-gold flex items-center justify-center gap-2.5 font-display text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <QrCode size={18} />
                <span>Escanear Código QR con Cámara</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gold/20" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-cream/40">
                  O escribe el código
                </span>
                <div className="flex-1 h-px bg-gold/20" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="CÓDIGO"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-black/50 border border-gold/30 rounded-xl p-4 text-center text-3xl tracking-[0.35em] text-gold font-display outline-none focus:border-gold shadow-inner"
                  maxLength={6}
                  autoFocus
                />

                {error && (
                  <div className="p-3 bg-maya-red/20 border border-maya-red/40 rounded-lg flex items-center gap-2 text-xs text-red-200">
                    <AlertCircle size={16} className="text-maya-red shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || code.length < 6}
                  className="w-full py-4 flex items-center justify-center gap-2 text-xs"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles size={16} /> Entrar como Invitado
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
