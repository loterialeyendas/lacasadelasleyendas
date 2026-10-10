import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Users, Sparkles, AlertCircle, QrCode, Check } from 'lucide-react';
import { Scanner } from '../components/Scanner';
import { sound } from '../lib/audio';
import { LEGEND_CHARACTERS, getCharacterById } from '../data/characters';

interface JoinRoomViewProps {
  onJoin: (roomCode: string) => void;
  onBack: () => void;
  isLoading?: boolean;
  error?: string;
  initialCode?: string;
  selectedCharacterId?: string;
  onSelectCharacter?: (characterId: string) => void;
}

export const JoinRoomView: React.FC<JoinRoomViewProps> = ({
  onJoin,
  onBack,
  isLoading = false,
  error = '',
  initialCode = '',
  selectedCharacterId = 'chancho',
  onSelectCharacter
}) => {
  const [code, setCode] = useState(initialCode);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const activeChar = getCharacterById(selectedCharacterId);

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
      className="w-full max-w-md mx-auto px-2 space-y-4 select-none pb-6"
    >
      <div className="flex items-center gap-2">
        <button 
          type="button"
          onClick={isScanning ? () => setIsScanning(false) : onBack} 
          aria-label="Volver" 
          className="p-2 h-auto text-xs rounded-xl border border-gold/60 bg-black/60 text-amber-300 hover:bg-gold/20 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <ArrowLeft size={16} />
        </button>
        <h2 className="text-xs font-display text-amber-300 tracking-widest uppercase font-bold">
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
            <div className="border-2 border-gold p-5 space-y-3 bg-[#fbf7ee] rounded-2xl shadow-[0_15px_45px_rgba(0,0,0,0.75)] text-[#1f1309]">
              <Scanner
                onScan={handleScanRoom}
                onCancel={() => setIsScanning(false)}
              />
              <div className="text-center space-y-1 pt-1">
                <p className="text-xs text-[#1f1309] font-display font-black uppercase tracking-wider">
                  Apunta a la pantalla del Mayordomo
                </p>
                <p className="text-xs text-[#4a3421] font-serif italic leading-tight">
                  Lee el código QR de convocatoria para entrar a la partida en un instante.
                </p>
              </div>
            </div>

            {scanError && (
              <div className="p-3 bg-rose-100 border-2 border-rose-500/70 text-rose-900 rounded-xl flex items-center gap-2 text-xs font-mono font-bold shadow-sm">
                <AlertCircle size={16} className="text-rose-700 shrink-0" />
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
            <div className="p-5 sm:p-7 rounded-3xl bg-[#fbf7ee] border-2 border-gold shadow-[0_15px_45px_rgba(0,0,0,0.75)] text-[#1f1309] space-y-5">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/90 border border-gold/70 text-amber-950 text-[10px] font-mono tracking-widest uppercase font-black shadow-sm">
                  <Users size={12} className="text-amber-900" /> Sala de Juego
                </div>
                <h1 className="font-display text-2xl font-black text-[#1f1309] tracking-wider mt-1 mb-0">
                  CÓDIGO DE SALA
                </h1>
                <p className="text-xs text-[#4a3421] font-serif italic">
                  Ingresa el código de 6 caracteres compartido por el Mayordomo o escanea su pantalla.
                </p>
                <span className="text-[10px] font-mono text-amber-950 font-bold block bg-amber-200/60 py-0.5 rounded-lg border border-gold/40">
                  (Hasta 5 invitados por sala convocada)
                </span>
              </div>

              {/* Selector de Personaje para Invitado */}
              <div className="bg-[#ede1c7] border-2 border-gold/70 rounded-2xl p-2.5 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-mono uppercase font-black text-amber-950 flex items-center gap-1">
                    <Sparkles size={11} className="text-amber-800" />
                    <span>Tu Tzipitío Invitado:</span>
                  </span>
                  <span className="text-[10px] font-display font-black text-amber-950 bg-amber-200/90 border border-gold/70 px-2 py-0.2 rounded-full shadow-xs">
                    {activeChar.name}
                  </span>
                </div>

                <div className="grid grid-cols-6 gap-1">
                  {LEGEND_CHARACTERS.map((char) => {
                    const isSelected = char.id === selectedCharacterId;
                    return (
                      <button
                        key={char.id}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          onSelectCharacter?.(char.id);
                        }}
                        title={`${char.name} - ${char.title}`}
                        className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-amber-100/95 border-2 border-amber-600 shadow-sm scale-[1.05]'
                            : 'bg-white/80 border border-[#d6be96] hover:border-gold hover:bg-white opacity-85 hover:opacity-100'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full bg-white border flex items-center justify-center p-0.5 overflow-hidden shadow-xs ${
                          isSelected ? 'border-amber-600 ring-1 ring-gold' : 'border-gold/70'
                        }`}>
                          {char.avatarSvg ? (
                            <img src={char.avatarSvg} alt={char.name} className="w-full h-full object-contain" />
                          ) : (
                            <Sparkles size={12} className="text-amber-600" />
                          )}
                        </div>
                        <span className={`text-[8px] font-mono mt-0.5 leading-none truncate max-w-full ${
                          isSelected ? 'text-amber-950 font-black' : 'text-[#3a2717] font-bold'
                        }`}>
                          {char.name}
                        </span>
                        {isSelected && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-xs">
                            <Check size={9} strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Botón para activar el escáner de sala */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setScanError('');
                  setIsScanning(true);
                }}
                className="w-full py-3.5 px-4 rounded-xl border-2 border-gold hover:border-gold bg-[#ede1c7] hover:bg-gold/25 text-[#1f1309] flex items-center justify-center gap-2.5 font-display text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <QrCode size={18} className="text-amber-900" />
                <span>Escanear Código QR con Cámara</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gold/40" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#7a624a] font-bold">
                  O escribe el código
                </span>
                <div className="flex-1 h-px bg-gold/40" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="CÓDIGO"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#ede1c7] border-2 border-gold rounded-xl p-3.5 text-center text-3xl tracking-[0.35em] text-amber-950 font-mono font-black outline-none focus:bg-white shadow-inner"
                  maxLength={6}
                  autoFocus
                />

                {error && (
                  <div className="p-3 bg-rose-100 border-2 border-rose-500/70 text-rose-900 rounded-xl flex items-center gap-2 text-xs font-mono font-bold shadow-sm">
                    <AlertCircle size={16} className="text-rose-700 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || code.length < 6}
                  className="w-full py-3.5 bg-earth-brown hover:bg-gold text-cream hover:text-obsidian font-display font-bold text-xs uppercase tracking-wider rounded-xl border-2 border-gold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles size={16} /> Entrar como Invitado
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
