import React from 'react';
import { motion } from 'motion/react';
import { Users, Crown, KeyRound, Sparkles } from 'lucide-react';
import { Button, Card } from '../components/Theme';
import { sound } from '../lib/audio';
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
      exit={{ opacity: 0, scale: 0.96 }}
      className="w-full max-w-lg mx-auto px-1.5 sm:px-4 py-2 sm:py-4 space-y-4 relative select-none"
    >
      <Card className="border-2 border-gold/70 backdrop-blur-xl bg-gradient-to-b from-[#1c150c]/98 via-[#130d07]/98 to-[#0b0704]/98 p-3.5 sm:p-6 rounded-3xl shadow-[0_0_50px_rgba(206,136,34,0.35),0_20px_50px_rgba(0,0,0,0.85)] space-y-4 sm:space-y-5 relative z-10 overflow-hidden text-[#FFF0C8]">
        
        {/* Halo áureo celestial superior */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-56 rounded-full bg-gradient-to-b from-amber-400/25 via-gold/15 to-transparent blur-3xl pointer-events-none" />

        {/* ENCABEZADO CON LA LUNA SAGRADA (Luna.svg) */}
        <div className="relative text-center pt-1 pb-1 space-y-2 select-none">
          {/* Marco sagrado de la Luna Maya */}
          <div className="relative inline-block">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1.5 bg-gradient-to-b from-amber-500/30 via-black to-[#1c150c] border-2 border-gold shadow-[0_0_25px_rgba(252,207,101,0.55)] flex items-center justify-center mx-auto overflow-hidden">
              <img 
                src={lunaSvg} 
                alt="Luna de las Leyendas" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(252,207,101,0.7)] transition-transform duration-500 hover:rotate-12 hover:scale-105" 
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#1a1208] border border-gold/80 rounded-full p-1 shadow-md">
              <Sparkles size={12} className="text-gold animate-spin" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950/80 border border-gold/60 text-amber-300 text-[10px] font-mono tracking-widest uppercase font-bold shadow-sm">
              <Crown size={12} className="text-gold" /> Círculo de las Leyendas
            </div>
            <h1 className="font-display text-xl sm:text-3xl text-amber-200 font-extrabold tracking-wider mt-1 drop-shadow-sm leading-tight">
              SALA DE JUEGO
            </h1>
            <p className="text-[11px] sm:text-xs text-amber-100/75 font-serif italic max-w-xs mx-auto">
              Bajo la mirada mística de la Luna, elige tu sendero sagrado
            </p>
          </div>
        </div>

        {/* TARJETA OPCIÓN 1: CREAR SALA COMO MAYORDOMO */}
        <div className="border-2 border-gold/70 bg-gradient-to-br from-amber-950/70 via-[#23180d] to-[#120d07] p-4 sm:p-5 rounded-2xl shadow-[0_0_25px_rgba(206,136,34,0.3)] space-y-3.5 relative overflow-hidden group hover:border-gold transition-all">
          <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-gold/10 blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black/70 border-2 border-gold/70 flex items-center justify-center shrink-0 p-1.5 shadow-md relative">
              <Crown size={28} className="text-amber-300" />
              <img 
                src={llaveOroPng} 
                alt="Llave de Oro" 
                className="w-5 h-5 absolute -bottom-1 -right-1 filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]" 
              />
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-display text-base sm:text-lg text-[#FFF0C8] font-bold">
                  Modo Mayordomo
                </h3>
                <span className="text-[9px] font-mono bg-gold/25 border border-gold/60 text-amber-200 px-2 py-0.5 rounded-full font-bold shadow-sm">
                  ANFITRIÓN • 6 JUGADORES
                </span>
              </div>
              <p className="text-xs text-amber-100/80 font-serif italic leading-relaxed mt-1">
                Forja una sala sagrada con tu código para compartir en móvil y convoca hasta 5 exploradores al tablero.
              </p>
            </div>
          </div>

          <Button
            onClick={() => {
              sound.playMysticChime();
              onCreateRoom();
            }}
            className="w-full min-h-[50px] sm:min-h-[54px] py-3.5 flex items-center justify-center gap-2 text-sm sm:text-base font-display font-extrabold tracking-wider rounded-xl shadow-[0_4px_24px_rgba(190,141,44,0.45)] border-2 border-gold text-[#140e08] bg-gradient-to-r from-amber-300 via-gold to-amber-300 hover:brightness-110 cursor-pointer active:scale-95"
          >
            <Crown size={18} className="text-[#140e08]" />
            <span>Crear Sala como Mayordomo</span>
          </Button>
        </div>

        {/* TARJETA OPCIÓN 2: ENTRAR COMO INVITADO (CÓDIGO DE SALA) */}
        <div className="border border-gold/45 bg-[#140e08]/90 p-4 sm:p-5 rounded-2xl shadow-sm space-y-3.5 hover:border-gold/70 transition-all relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black/60 border border-gold/40 flex items-center justify-center shrink-0 p-1.5 shadow-sm text-gold">
              <Users size={26} className="text-amber-300" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-display text-base sm:text-lg text-[#FFF0C8] font-bold">
                  Unirse a una Sala
                </h3>
                <span className="text-[9px] font-mono bg-amber-950/80 border border-gold/40 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  HASTA 5 INVITADOS
                </span>
              </div>
              <p className="text-xs text-amber-100/70 font-serif italic leading-relaxed mt-1">
                ¿Recibiste un código de 6 caracteres o un código QR? Ingrésalo para unirte a la partida del Mayordomo.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onJoinRoom();
            }}
            className="w-full min-h-[48px] sm:min-h-[50px] py-3 flex items-center justify-center gap-2 text-xs sm:text-sm font-display font-bold tracking-wider rounded-xl border-2 border-gold/60 hover:border-gold bg-gold/15 hover:bg-gold/25 text-amber-200 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <KeyRound size={17} className="text-gold" />
            <span>Ingresar Código de Sala</span>
          </button>
        </div>

        {/* PIE DE PÁGINA SAGRADO CON EL VOLCÁN (volcan.svg) */}
        <div className="relative mt-2 -mx-3.5 sm:-mx-6 -mb-3.5 sm:-mb-6 pt-3 overflow-hidden pointer-events-none select-none border-t border-gold/30 bg-gradient-to-b from-[#140e08] to-[#090603]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#090603] via-transparent to-transparent z-10" />
          
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full flex justify-center"
          >
            <img 
              src={volcanSvg} 
              alt="Volcanes Sagrados de Guatemala" 
              className="w-full h-24 sm:h-32 object-cover object-bottom opacity-45 filter drop-shadow-[0_-6px_20px_rgba(206,136,34,0.35)]" 
            />
          </motion.div>

          <div className="relative z-20 text-center pb-2.5 -mt-3">
            <p className="text-[10px] sm:text-[11px] font-serif italic text-amber-200/70 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Tierra Sagrada de Volcanes • La Casa de las Leyendas
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
