import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, User, Crown, Play, Copy, Check, ArrowLeft, QrCode as QrIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { GameRoom } from '../types/game';
import { Button, Card, MysticalTitle } from '../components/Theme';
import { sound } from '../lib/audio';

interface LobbyViewProps {
  room: GameRoom;
  userId: string;
  isHost: boolean;
  onStartGame: () => void;
  onLeaveRoom: () => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  room,
  userId,
  isHost,
  onStartGame,
  onLeaveRoom
}) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCopyCode = () => {
    sound.playClick();
    navigator.clipboard.writeText(room.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canStart = room.players.length >= 2;
  const inviteUrl = `${window.location.origin}/?room=${room.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md mx-auto px-2 space-y-4"
    >
      <Card className="text-center space-y-6">
        {/* Cabecera del Código de Sala */}
        <div className="py-3 px-4 bg-earth-brown/20 border border-gold/30 rounded-xl space-y-2">
          <span className="text-[10px] font-display text-gold uppercase tracking-widest block">
            Código de Sala Mística
          </span>
          <div className="flex items-center justify-center gap-3">
            <h2 className="text-4xl font-display tracking-[0.25em] text-cream font-bold">
              {room.id}
            </h2>
            <button
              onClick={handleCopyCode}
              className="p-2 rounded-lg bg-black/40 border border-gold/30 text-gold hover:text-cream transition-colors"
              title="Copiar código"
              aria-label="Copiar código de sala"
            >
              {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setShowQR(!showQR);
              }}
              className="p-2 rounded-lg bg-black/40 border border-gold/30 text-gold hover:text-cream transition-colors"
              title="Mostrar código QR"
              aria-label={showQR ? 'Ocultar código QR' : 'Mostrar código QR'}
            >
              <QrIcon size={18} />
            </button>
          </div>
        </div>

        {/* Modal/Toggle QR para que otros se unan escaneando la pantalla */}
        {showQR && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-white rounded-xl inline-block shadow-xl border-4 border-gold mx-auto"
          >
            <QRCodeSVG value={inviteUrl} size={160} />
            <span className="text-[10px] text-neutral-800 font-display font-bold block mt-2">
              Escanea para unirte a la sala
            </span>
          </motion.div>
        )}

        {/* Lista de Jugadores */}
        <div className="space-y-3 text-left">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-display text-xs text-gold flex items-center gap-1.5 uppercase tracking-wider">
              <Users size={15} /> Jugadores Convocados ({room.players.length})
            </h3>
            <span className="text-[10px] text-cream/50 font-serif italic">
              {isHost ? 'Esperando inicio' : 'Esperando al anfitrión'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-1">
            {room.players.map((p) => {
              const isCurrentUser = p.id === userId;
              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    isCurrentUser
                      ? 'bg-gold/15 border-gold/40 text-cream'
                      : 'bg-black/40 border-gold/10 text-cream/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-black/50 border border-gold/30 flex items-center justify-center text-gold text-xs">
                      {p.isHost ? <Crown size={14} className="text-gold" /> : <User size={14} />}
                    </div>
                    <span className="font-display text-xs truncate max-w-[160px]">
                      {p.name} {isCurrentUser && <span className="text-[9px] text-gold font-bold ml-1">(TÚ)</span>}
                    </span>
                  </div>

                  {p.isHost && (
                    <span className="text-[9px] font-display text-gold px-2 py-0.5 rounded bg-gold/10 border border-gold/30">
                      Anfitrión
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Acciones */}
        <div className="space-y-3 pt-2 border-t border-gold/20">
          {isHost ? (
            <>
              <Button
                onClick={() => {
                  sound.playMysticChime();
                  onStartGame();
                }}
                className="w-full py-4 flex items-center justify-center gap-2 text-xs"
                disabled={!canStart}
              >
                <Play size={16} /> Iniciar Ritual Místico
              </Button>
              {!canStart && (
                <p className="text-[10px] text-cream/50 font-serif italic text-center -mt-1">
                  Invita al menos a un explorador más para comenzar el ritual.
                </p>
              )}
            </>
          ) : (
            <div className="p-3 bg-black/30 rounded-lg border border-gold/15 text-center">
              <p className="text-xs text-cream/70 font-serif italic animate-pulse">
                El anfitrión iniciará la partida en breve...
              </p>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              sound.playClick();
              onLeaveRoom();
            }}
            className="w-full text-xs"
          >
            Abandonar Sala
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
