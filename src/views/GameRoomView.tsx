import React from 'react';
import { motion } from 'motion/react';
import { Trophy, QrCode, Users, Flag, Crown, DoorOpen } from 'lucide-react';
import { GameRoom } from '../types/game';
import { Legend } from '../types/legend';
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

  // Pantalla de Resultados Finales - Ficha Beige Ancestral del Juego
  if (isFinished) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-md mx-auto px-2 space-y-4 pb-8"
      >
        <div className="p-5 sm:p-7 rounded-2xl bg-[#fbf7ee] border-2 border-gold shadow-[0_15px_45px_rgba(0,0,0,0.75)] text-[#1f1309] space-y-5">
          <div className="text-center space-y-2 pt-2">
            <motion.div
              initial={{ scale: 0.6, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              className="w-18 h-18 mx-auto rounded-full bg-gold/25 border-2 border-gold flex items-center justify-center shadow-md"
            >
              <Trophy size={34} className="text-amber-900" />
            </motion.div>
            <h2 className="text-2xl font-display font-black text-[#1f1309] tracking-tight mb-1">
              EL RITUAL HA CONCLUIDO
            </h2>
            <p className="text-xs text-[#4a3421] font-serif italic">
              Las almas han sido pesadas en la mesa ancestral. Estos son los exploradores de la noche:
            </p>
          </div>

          <div className="space-y-2.5">
            {sortedPlayers.map((p, index) => {
              const isCurrentUser = p.id === userId;
              const isLeader = index === 0;

              return (
                <motion.div
                  key={p.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.08 }}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    isLeader
                      ? 'bg-amber-200/90 border-2 border-gold shadow-md text-[#1f1309]'
                      : isCurrentUser
                      ? 'bg-[#ede1c7] border-2 border-gold/70 text-[#1f1309] shadow-sm'
                      : 'bg-[#f4ebd8] border border-[#d6be96] text-[#241508]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-display font-bold shrink-0 ${
                      isLeader 
                        ? 'bg-gold text-amber-950 shadow-sm border border-gold-light' 
                        : 'bg-[#d6be96] text-[#1f1309]'
                    }`}>
                      {index + 1}
                    </span>
                    <span className={`font-display text-sm truncate max-w-[170px] ${
                      isLeader ? 'text-[#1f1309] font-black' : 'text-[#241508] font-bold'
                    }`}>
                      {isLeader && <Crown size={14} className="inline mr-1 text-amber-900 -mt-0.5" />}
                      {p.name}
                      {isCurrentUser && (
                        <span className="text-[9px] font-mono uppercase bg-amber-900/15 text-amber-950 font-black px-1.5 py-0.5 rounded ml-1.5 border border-amber-900/30">
                          TÚ
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="font-display text-sm text-amber-950 font-black shrink-0">
                    {p.points || 0} pts
                  </div>
                </motion.div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onLeaveRoom();
            }}
            className="w-full py-3.5 bg-earth-brown hover:bg-gold text-cream hover:text-obsidian font-display font-bold text-xs uppercase tracking-wider rounded-xl border-2 border-gold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <DoorOpen size={16} /> Volver al Portal
          </button>
        </div>
      </motion.div>
    );
  }

  // Partida en Curso - Fichas de Juego Beige sobre Fondo Obsidiana
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-md mx-auto px-2 space-y-4 pb-8"
    >
      {/* Barra de Estado de la Partida: Ficha Beige Delgada */}
      <div className="flex justify-between items-center bg-[#fbf7ee] border-2 border-gold/70 shadow-md p-3.5 rounded-2xl text-[#1f1309]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold/20 border border-gold/60 flex items-center justify-center text-amber-900 shrink-0">
            <Trophy size={16} className="text-amber-900" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-mono text-[#7a3108] uppercase tracking-wider font-extrabold">
              Tablero de Juego
            </span>
            <span className="font-display text-[#1f1309] text-xs font-bold">
              Ronda {room.currentRound} de {room.maxRounds}
            </span>
          </div>
        </div>
        <div className="text-[10px] font-mono font-black text-amber-950 px-2.5 py-1 bg-amber-200/90 rounded-lg border border-gold/70 shadow-sm">
          SALA: {room.id}
        </div>
      </div>

      {/* Tarjeta de Acción Principal: Escáner Místico como Ficha de Juego */}
      <div
        className="cursor-pointer group bg-[#fbf7ee] hover:bg-white border-2 border-gold/80 hover:border-gold shadow-[0_12px_35px_rgba(0,0,0,0.6)] p-5 rounded-2xl text-[#1f1309] transition-all transform active:scale-[0.99]"
        onClick={() => {
          sound.playClick();
          onOpenScanner();
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-xl bg-gold/25 border-2 border-gold/70 flex items-center justify-center text-amber-900 group-hover:scale-105 transition-transform shrink-0 shadow-sm">
            <QrCode size={26} className="text-amber-900" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <h3 className="text-base font-display font-black text-[#1f1309] group-hover:text-earth-brown transition-colors">
              Escanear Tarjeta QR
            </h3>
            <p className="text-[#4a3421] text-xs font-serif italic leading-relaxed mt-0.5">
              Apunta la cámara a tu tarjeta física para invocar el reto de tu turno.
            </p>
          </div>
        </div>
      </div>

      {/* Finalizar Partida (solo Anfitrión) */}
      {isHost && (
        <button
          type="button"
          onClick={() => {
            if (window.confirm('¿Cerrar el ritual y revelar los resultados finales?')) {
              sound.playMysticChime();
              onFinishGame();
            }
          }}
          className="w-full py-3 bg-maya-red hover:bg-red-800 text-candle font-display font-bold text-xs uppercase tracking-wider rounded-xl border border-red-900 shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
        >
          <Flag size={14} /> Finalizar Ritual y Ver Resultados
        </button>
      )}

      {/* Tabla de Puntuaciones en Tiempo Real: Ficha Beige */}
      <div className="bg-[#fbf7ee] border-2 border-gold/70 shadow-[0_12px_35px_rgba(0,0,0,0.6)] p-4 sm:p-5 rounded-2xl space-y-3.5 text-[#1f1309]">
        <div className="flex items-center justify-between border-b border-gold/30 pb-2.5">
          <h3 className="font-display text-xs text-[#1f1309] flex items-center gap-1.5 uppercase tracking-wider font-extrabold">
            <Users size={15} className="text-amber-900" /> Tabla de Almas
          </h3>
          <span className="text-[11px] text-[#4a3421] font-serif italic">Puntos acumulados</span>
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
                    ? 'bg-amber-200/90 border-2 border-gold shadow-sm text-[#1f1309]'
                    : isCurrentUser
                    ? 'bg-[#ede1c7] border-2 border-gold/60 text-[#1f1309]'
                    : 'bg-[#f4ebd8] border border-[#d6be96] text-[#241508]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-display font-bold shrink-0 ${
                    isLeader ? 'bg-gold text-amber-950 border border-gold-light' : 'bg-[#d6be96] text-[#1f1309]'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="flex flex-col text-left min-w-0">
                    <span className="font-display text-xs text-[#1f1309] font-bold truncate max-w-[160px]">
                      {p.name} {isCurrentUser && <span className="text-[9px] font-mono font-black text-amber-900 ml-1">(TÚ)</span>}
                    </span>
                    {p.isHost && (
                      <span className="text-[8px] text-amber-900 font-mono font-bold uppercase">Anfitrión</span>
                    )}
                  </div>
                </div>

                <div className="font-display text-sm text-amber-950 font-black shrink-0">
                  {p.points || 0} pts
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Botón de Salida */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onLeaveRoom();
          }}
          className="w-full py-2.5 px-4 bg-black/60 hover:bg-gold/15 text-amber-300 hover:text-white font-display text-xs uppercase tracking-wider rounded-xl border-2 border-gold/60 transition-all cursor-pointer active:scale-95"
        >
          Abandonar Partida
        </button>
      </div>
    </motion.div>
  );
};
