import React from 'react';
import { motion } from 'motion/react';
import { Users, Crown, KeyRound, Sparkles } from 'lucide-react';
import { Button, Card, MysticalTitle } from '../components/Theme';
import { sound } from '../lib/audio';
import logo from '../images/logo.png';
import lunaSvg from '../images/Luna.svg';
import volcanSvg from '../images/volcan.svg';
import llaveOroPng from '../images/png/Llave oro.png';

interface WelcomeViewProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
  onStartExplorer?: () => void;
  completedStamps?: number;
  totalLegends?: number;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onCreateRoom,
  onJoinRoom
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-md mx-auto px-3 py-2 space-y-4 relative"
    >
      {/* Cabecera con Diorama de Luna y Volcán */}
      <div className="relative z-10 bg-gradient-to-b from-black/90 via-black/75 to-black/90 border border-gold/40 rounded-2xl p-4 text-center space-y-3 shadow-[0_0_30px_rgba(0,0,0,0.9)] overflow-hidden">
        <div className="flex items-center justify-around px-2">
          {/* Volcán en la izquierda */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 sm:w-20 sm:h-20 shrink-0"
          >
            <img
              src={volcanSvg}
              alt="Volcán ancestral"
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]"
            />
          </motion.div>

          {/* Logo central de la Casa */}
          <div className="flex flex-col items-center">
            <img
              src={logo}
              alt="Logo Casa de las Leyendas"
              className="w-16 h-16 drop-shadow-[0_0_15px_rgba(190,141,44,0.5)] object-contain"
            />
            <span className="text-[9px] font-mono text-gold tracking-[0.2em] uppercase mt-1">
              Guatemala Mística
            </span>
          </div>

          {/* Luna a la derecha */}
          <motion.div
            animate={{ y: [0, -4, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 sm:w-20 sm:h-20 shrink-0"
          >
            <img
              src={lunaSvg}
              alt="Luna maya dorada"
              className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(252,207,101,0.7)]"
            />
          </motion.div>
        </div>

        <div className="space-y-1">
          <MysticalTitle className="text-2xl sm:text-3xl mb-0">
            SALA DE JUEGO
          </MysticalTitle>
          <p className="text-xs text-cream/80 font-serif italic">
            Bajo la Luna y la sombra del Volcán, convoca o únete a la partida
          </p>
        </div>
      </div>

      {/* Tarjeta Opción 1: Ser Mayordomo (Host) con Luna Protagonista */}
      <Card className="border-2 border-gold/60 bg-black/85 backdrop-blur-xl p-5 rounded-2xl shadow-[0_0_30px_rgba(190,141,44,0.25)] relative z-10 overflow-hidden space-y-3 group hover:border-gold transition-all">
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-black/60 border border-gold/50 flex items-center justify-center shrink-0 p-1.5 shadow-inner relative">
            <img 
              src={lunaSvg} 
              alt="Luna de la Casa" 
              className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(252,207,101,0.8)]"
            />
            <div className="absolute -bottom-1.5 -right-1.5 bg-black/90 p-1 rounded-full border border-gold/60 shadow">
              <Crown size={12} className="text-gold" />
            </div>
          </div>
          <div className="text-left flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-display text-base text-gold font-bold">
                Modo Mayordomo
              </h3>
              <span className="text-[9px] font-mono bg-gold/20 border border-gold/50 text-gold px-1.5 py-0.5 rounded font-bold">
                ANFITRIÓN
              </span>
            </div>
            <p className="text-xs text-cream/80 font-serif italic leading-tight mt-0.5">
              Crea la sala con tu código para compartir en móvil y convoca hasta 5 invitados al tablero.
            </p>
          </div>
        </div>

        <Button
          onClick={() => {
            sound.playMysticChime();
            onCreateRoom();
          }}
          className="w-full min-h-[48px] py-3 flex items-center justify-center gap-2 text-sm font-display tracking-wider rounded-xl shadow-[0_4px_16px_rgba(190,141,44,0.4)]"
        >
          <Crown size={18} className="text-gold" />
          <span>Crear Sala como Mayordomo</span>
        </Button>
      </Card>

      {/* Tarjeta Opción 2: Entrar como Invitado con Volcán Protagonista */}
      <Card className="border-2 border-red-500/40 bg-black/85 backdrop-blur-xl p-5 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.2)] relative z-10 space-y-3 hover:border-red-400 transition-all">
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-950/60 to-black/60 border border-red-500/40 flex items-center justify-center shrink-0 p-1.5 shadow-inner relative">
            <img 
              src={volcanSvg} 
              alt="Volcán de las Leyendas" 
              className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"
            />
            <div className="absolute -bottom-1.5 -right-1.5 bg-black/90 p-1 rounded-full border border-red-500/50 shadow">
              <Users size={12} className="text-red-400" />
            </div>
          </div>
          <div className="text-left flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-display text-base text-cream font-bold">
                Entrar como Invitado
              </h3>
              <span className="text-[9px] font-mono bg-red-950/70 border border-red-500/40 text-red-300 px-1.5 py-0.5 rounded font-bold">
                HASTA 5 JUGADORES
              </span>
            </div>
            <p className="text-xs text-cream/80 font-serif italic leading-tight mt-0.5">
              ¿Recibiste un código de sala? Ingrésalo para unirte a la partida del Mayordomo.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            sound.playClick();
            onJoinRoom();
          }}
          className="w-full min-h-[48px] py-3 flex items-center justify-center gap-2 text-sm font-display tracking-wider rounded-xl border-red-500/50 hover:border-red-400 text-cream"
        >
          <KeyRound size={18} className="text-red-400" />
          <span>Ingresar Código de Sala</span>
        </Button>
      </Card>
    </motion.div>
  );
};
