import React from 'react';
import { motion } from 'motion/react';
import { Trophy, QrCode, Users, Flag, Crown, DoorOpen } from 'lucide-react';
import { GameRoom } from '../types/game';
import { Legend } from '../types/legend';
import { Button, Card, MysticalTitle } from '../components/Theme';
import { sound } from '../lib/audio';

interface GameRoomViewProps {
  room: GameRoom;
  userId: string;
  isHost: boolean;
  onOpenScanner: () => void;
  onLeaveRoom: () => void;
  onFinishGame: () => void;
  onSelectLegendChallenge: (legend: Legend) => void;
}

export const GameRoomView: React.FC<GameRoomViewProps> = ({
  room,
  userId,
  isHost,
  onOpenScanner,
  onLeaveRoom,
  onFinishGame
}) => {
  const sortedPlayers = [...room.players].sort((a, b) => (b.points || 0) - (a.points || 0));
  const isFinished = room.status === 'finished';

  // Pantalla de Resultados Finales
  if (isFinished) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-md mx-auto px-2 space-y-4 pb-6"
      >
        <Card className="space-y-5">
          <div className="text-center space-y-2 pt-2">
            <motion.div
              initial={{ scale: 0.6, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              className="w-16 h-16 mx-auto rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center"
            >
              <Trophy size={30} className="text-gold" />
            </motion.div>
            <MysticalTitle className="text-2xl mb-0">EL RITUAL HA CONCLUIDO</MysticalTitle>
            <p className="text-xs text-cream/60 font-serif italic">
              Las almas han sido pesadas. Estos son los exploradores de la noche.
            </p>
          </div>

          <div className="space-y-2">
            {sortedPlayers.map((p, index) => {
              const isCurrentUser = p.id === userId;
              const isLeader = index === 0;

              return (
                <motion.div
                  key={p.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.08 }}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    isLeader
                      ? 'bg-gold/20 border-gold/50'
                      : isCurrentUser
                      ? 'bg-black/60 border-gold/30'
                      : 'bg-black/30 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-display font-bold ${
                      isLeader ? 'bg-gold text-[#fffdf4]' : 'bg-white/50 text-cream/70'
                    }`}>
                      {index + 1}
                    </span>
                    <span className={`font-display text-sm truncate max-w-[150px] ${
                      isLeader ? 'text-gold font-bold' : 'text-cream'
                    }`}>
                      {isLeader && <Crown size={13} className="inline mr-1 -mt-0.5" />}
                      {p.name}
                      {isCurrentUser && <span className="text-[9px] text-gold font-bold ml-1">(TÚ)</span>}
                    </span>
                  </div>

                  <div className="font-display text-sm text-cream/90 font-bold">
                    {p.points || 0} pts
                  </div>
                </motion.div>
              );
            })}
          </div>

          <Button
            onClick={() => {
              sound.playClick();
              onLeaveRoom();
            }}
            className="w-full py-4 flex items-center justify-center gap-2 text-xs"
          >
            <DoorOpen size={16} /> Volver al Portal
          </Button>
        </Card>
      </motion.div>
    );
  }

  // Partida en Curso
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-md mx-auto px-2 space-y-4 pb-6"
    >
      {/* Barra de Estado de la Partida */}
      <div className="flex justify-between items-center bg-black/70 backdrop-blur-md p-3.5 rounded-xl border border-gold/30">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-gold" />
          <span className="font-display text-cream text-xs">
            Ronda {room.currentRound} de {room.maxRounds}
          </span>
        </div>
        <div className="text-[10px] font-display text-gold px-2 py-0.5 bg-gold/15 rounded border border-gold/30">
          Sala: {room.id}
        </div>
      </div>

      {/* Tarjeta de Acción Principal: Escáner Místico */}
      <Card
        className="cursor-pointer group hover:bg-black/80 transition-all border-gold/40 shadow-[0_0_20px_rgba(190,141,44,0.15)] p-4"
        onClick={() => {
          sound.playClick();
          onOpenScanner();
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center border border-gold/40 group-hover:scale-105 transition-transform">
            <QrCode size={24} className="text-gold" />
          </div>
          <div className="text-left flex-1">
            <h3 className="text-base font-display text-gold group-hover:text-cream transition-colors">
              Escanear Tarjeta / Desafío
            </h3>
            <p className="text-cream/60 text-[11px] font-serif italic leading-tight">
              Apunta la cámara o escribe el código para invocar el reto de tu turno.
            </p>
          </div>
        </div>
      </Card>

      {/* Finalizar Partida (solo Anfitrión) */}
      {isHost && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            if (window.confirm('¿Cerrar el ritual y revelar los resultados finales?')) {
              sound.playMysticChime();
              onFinishGame();
            }
          }}
          className="w-full flex items-center justify-center gap-2 text-xs"
        >
          <Flag size={14} /> Finalizar Ritual y Ver Resultados
        </Button>
      )}

      {/* Tabla de Puntuaciones en Tiempo Real */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between border-b border-gold/15 pb-2">
          <h3 className="font-display text-xs text-gold flex items-center gap-1.5 uppercase tracking-wider">
            <Users size={14} className="text-gold" /> Tabla de Almas
          </h3>
          <span className="text-[10px] text-cream/50 font-serif">Puntos acumulados</span>
        </div>

        <div className="space-y-2">
          {sortedPlayers.map((p, index) => {
            const isCurrentUser = p.id === userId;
            const isLeader = index === 0;

            return (
              <motion.div
                key={p.id}
                layout
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  isLeader
                    ? 'bg-gold/20 border-gold/50 shadow-sm'
                    : isCurrentUser
                    ? 'bg-black/60 border-gold/30'
                    : 'bg-black/30 border-white/5 opacity-80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-display font-bold ${
                    isLeader ? 'bg-gold text-[#fffdf4]' : 'bg-white/50 text-cream/70'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="flex flex-col text-left">
                    <span className="font-display text-xs text-cream truncate max-w-[150px]">
                      {p.name} {isCurrentUser && <span className="text-[9px] text-gold font-bold ml-1">(TÚ)</span>}
                    </span>
                    {p.isHost && (
                      <span className="text-[8px] text-gold/80 font-display">Anfitrión</span>
                    )}
                  </div>
                </div>

                <div className="font-display text-sm text-gold font-bold">
                  {p.points || 0} pts
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Botón de Salida */}
      <div className="pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            sound.playClick();
            onLeaveRoom();
          }}
          className="w-full text-xs"
        >
          Abandonar Partida
        </Button>
      </div>
    </motion.div>
  );
};
