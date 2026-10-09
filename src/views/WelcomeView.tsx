import React from 'react';
import { motion } from 'motion/react';
import { Users, Crown, KeyRound, Sparkles } from 'lucide-react';
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
  isLoading?: boolean;
  error?: string;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onCreateRoom,
  onJoinRoom,
  isLoading = false,
  error = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="w-full max-w-lg mx-auto px-2 sm:px-4 py-3 sm:py-5 space-y-4 relative select-none"
    >
      {/* Contenedor Principal: Ficha de Cartón Beige Ancestral del Juego */}
      <div className="p-5 sm:p-7 rounded-3xl bg-[#fbf7ee] border-2 border-gold shadow-[0_15px_45px_rgba(0,0,0,0.75)] text-[#1f1309] space-y-5 relative z-10 overflow-hidden">
        
        {/* ENCABEZADO CON LA LUNA SAGRADA (Luna.svg) */}
        <div className="relative text-center pt-1 pb-1 space-y-2.5 select-none">
          {/* Marco sagrado de la Luna */}
          <div className="relative inline-block">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1.5 bg-[#140e08] border-2 border-gold shadow-md flex items-center justify-center mx-auto overflow-hidden">
              <img 
                src={lunaSvg} 
                alt="Luna de las Leyendas" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(252,207,101,0.6)] transition-transform duration-500 hover:rotate-12 hover:scale-105" 
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#1a1208] border border-gold/80 rounded-full p-1 shadow-md">
              <Sparkles size={13} className="text-gold animate-spin" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/90 border border-gold/70 text-amber-950 text-[10px] font-mono tracking-widest uppercase font-black shadow-sm">
              <Crown size={12} className="text-amber-900" /> Círculo de las Leyendas
            </div>
            <h1 className="font-display text-2xl sm:text-3xl text-[#1f1309] font-black tracking-wider mt-1.5 leading-tight">
              SALA DE JUEGO
            </h1>
            <p className="text-xs sm:text-sm text-[#4a3421] font-serif italic max-w-xs mx-auto">
              Bajo la mirada mística de la Luna, elige tu sendero sagrado
            </p>
          </div>
        </div>

        {/* Mensaje de Error (si existe) */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-rose-100 border-2 border-rose-500/70 text-rose-900 rounded-xl text-xs font-mono text-center font-bold shadow-sm"
          >
            {error}
          </motion.div>
        )}

        {/* TARJETA OPCIÓN 1: CREAR SALA COMO MAYORDOMO */}
        <div className="border-2 border-gold bg-[#ede1c7] p-4 sm:p-5 rounded-2xl shadow-md space-y-3.5 relative overflow-hidden group hover:border-gold transition-all">
          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gold/25 border-2 border-gold flex items-center justify-center shrink-0 p-1.5 shadow-sm text-amber-900 relative">
              <Crown size={28} className="text-amber-900" />
              <img 
                src={llaveOroPng} 
                alt="Llave de Oro" 
                className="w-5 h-5 absolute -bottom-1 -right-1 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" 
              />
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-display text-base sm:text-lg text-[#1f1309] font-black">
                  Modo Mayordomo
                </h3>
                <span className="text-[9px] font-mono bg-amber-200/90 border border-gold/70 text-amber-950 px-2 py-0.5 rounded-full font-bold shadow-sm">
                  ANFITRIÓN • 6 JUGADORES
                </span>
              </div>
              <p className="text-xs text-[#3a2717] font-serif italic leading-relaxed mt-1">
                Forja una sala sagrada con tu código para compartir en móvil y convoca hasta 5 exploradores al tablero.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              if (isLoading) return;
              sound.playMysticChime();
              onCreateRoom();
            }}
            className="w-full min-h-[50px] sm:min-h-[54px] py-3.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-display font-bold uppercase tracking-wider rounded-xl shadow-md border-2 border-gold text-cream hover:text-obsidian bg-earth-brown hover:bg-gold transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                Forjando Sala Sagrada...
              </span>
            ) : (
              <>
                <Crown size={18} />
                <span>Crear Sala como Mayordomo</span>
              </>
            )}
          </button>
        </div>

        {/* TARJETA OPCIÓN 2: ENTRAR COMO INVITADO (CÓDIGO DE SALA) */}
        <div className="border-2 border-[#d6be96] bg-[#f5ebd6] hover:bg-white p-4 sm:p-5 rounded-2xl shadow-sm space-y-3.5 transition-all text-[#1f1309]">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#ede1c7] border border-[#d6be96] flex items-center justify-center shrink-0 p-1.5 shadow-sm text-amber-900">
              <Users size={26} className="text-amber-900" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-display text-base sm:text-lg text-[#1f1309] font-bold">
                  Unirse a una Sala
                </h3>
                <span className="text-[9px] font-mono bg-amber-200/90 border border-gold/60 text-amber-950 px-2 py-0.5 rounded-full font-bold">
                  HASTA 5 INVITADOS
                </span>
              </div>
              <p className="text-xs text-[#4a3421] font-serif italic leading-relaxed mt-1">
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
            className="w-full min-h-[48px] sm:min-h-[50px] py-3 flex items-center justify-center gap-2 text-xs sm:text-sm font-display font-bold uppercase tracking-wider rounded-xl border-2 border-gold/70 hover:border-gold bg-[#ede1c7] hover:bg-gold/25 text-[#1f1309] transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <KeyRound size={17} className="text-amber-900" />
            <span>Ingresar Código de Sala</span>
          </button>
        </div>

        {/* PIE DE PÁGINA SAGRADO CON EL VOLCÁN (volcan.svg) */}
        <div className="relative mt-2 -mx-5 sm:-mx-7 -mb-5 sm:-mb-7 pt-3 overflow-hidden pointer-events-none select-none border-t border-gold/30 bg-[#ede1c7]">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full flex justify-center"
          >
            <img 
              src={volcanSvg} 
              alt="Volcanes Sagrados de Guatemala" 
              className="w-full h-24 sm:h-28 object-cover object-bottom opacity-35 filter drop-shadow-[0_-4px_12px_rgba(206,136,34,0.3)]" 
            />
          </motion.div>

          <div className="relative z-20 text-center pb-2.5 -mt-3">
            <p className="text-[10px] sm:text-[11px] font-serif italic text-[#4a3421] font-semibold flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Tierra Sagrada de Volcanes • La Casa de las Leyendas
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
