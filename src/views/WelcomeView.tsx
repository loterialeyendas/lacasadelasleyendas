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
      {/* Fondo de ambiente: Luna y Volcán */}
      <div className="absolute -top-12 -right-4 w-28 h-28 pointer-events-none opacity-40 mix-blend-screen z-0">
        <motion.img 
          src={lunaSvg} 
          alt="Luna mística" 
          animate={{ y: [0, -6, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(252,207,101,0.5)]"
        />
      </div>

      <div className="text-center space-y-2 relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative inline-block"
        >
          <div className="absolute inset-0 bg-gold/25 blur-2xl rounded-full" />
          <img
            src={logo}
            alt="Logo Casa de las Leyendas"
            className="w-20 h-20 mx-auto drop-shadow-[0_0_15px_rgba(190,141,44,0.4)] object-contain relative z-10"
          />
        </motion.div>

        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-gold/80 tracking-[0.25em] uppercase block">
            Guatemala Mágica & Ancestral
          </span>
          <MysticalTitle className="text-2xl sm:text-3xl mb-0">
            SALA DE JUEGO
          </MysticalTitle>
          <p className="text-xs text-cream/70 font-serif italic">
            Elige tu camino para ingresar al ritual de leyendas
          </p>
        </div>
      </div>

      {/* Tarjeta Opción 1: Ser Mayordomo (Host) */}
      <Card className="border border-gold/50 bg-black/80 backdrop-blur-xl p-5 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.85)] relative z-10 overflow-hidden space-y-3 group hover:border-gold transition-all">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0 relative">
            <Crown size={24} className="text-gold" />
            <img src={llaveOroPng} alt="Llave" className="w-5 h-5 absolute -bottom-1 -right-1" />
          </div>
          <div className="text-left flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-display text-base text-gold font-bold">
                Modo Mayordomo
              </h3>
              <span className="text-[9px] font-mono bg-gold/20 border border-gold/40 text-gold px-1.5 py-0.5 rounded">
                ANFITRIÓN
              </span>
            </div>
            <p className="text-xs text-cream/70 font-serif italic leading-tight">
              Crea la sala, obtén tu código para compartir por WhatsApp u otras apps y convoca hasta 5 invitados.
            </p>
          </div>
        </div>

        <Button
          onClick={() => {
            sound.playMysticChime();
            onCreateRoom();
          }}
          className="w-full min-h-[48px] py-3 flex items-center justify-center gap-2 text-sm font-display tracking-wider rounded-xl shadow-[0_4px_16px_rgba(190,141,44,0.3)]"
        >
          <Crown size={18} className="text-gold" />
          <span>Crear Sala como Mayordomo</span>
        </Button>
      </Card>

      {/* Tarjeta Opción 2: Entrar como Invitado */}
      <Card className="border border-white/15 bg-black/70 backdrop-blur-xl p-5 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.7)] relative z-10 space-y-3 hover:border-emerald-500/40 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/50 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
            <Users size={24} />
          </div>
          <div className="text-left flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-display text-base text-cream font-bold">
                Entrar como Invitado
              </h3>
              <span className="text-[9px] font-mono bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded">
                HASTA 5 JUGADORES
              </span>
            </div>
            <p className="text-xs text-cream/70 font-serif italic leading-tight">
              ¿Un Mayordomo te compartió un código de sala? Ingrésalo para sumarte a la partida en curso.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            sound.playClick();
            onJoinRoom();
          }}
          className="w-full min-h-[48px] py-3 flex items-center justify-center gap-2 text-sm font-display tracking-wider rounded-xl border-emerald-500/40 hover:border-emerald-400 text-cream"
        >
          <KeyRound size={18} className="text-emerald-400" />
          <span>Ingresar Código de Sala</span>
        </Button>
      </Card>

      {/* Silueta ambiental del Volcán en la parte inferior */}
      <div className="relative w-full h-24 overflow-hidden rounded-xl opacity-35 pointer-events-none mt-2">
        <img 
          src={volcanSvg} 
          alt="Volcán de Guatemala" 
          className="w-full h-full object-cover object-bottom filter drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
      </div>
    </motion.div>
  );
};
