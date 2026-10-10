import React from 'react';
import { motion } from 'motion/react';
import { Users, Crown, KeyRound, Sparkles, Check } from 'lucide-react';
import { sound } from '../lib/audio';
import { LEGEND_CHARACTERS, getCharacterById } from '../data/characters';
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
  selectedCharacterId?: string;
  onSelectCharacter?: (characterId: string) => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onCreateRoom,
  onJoinRoom,
  isLoading = false,
  error = '',
  selectedCharacterId = 'chancho',
  onSelectCharacter
}) => {
  const activeChar = getCharacterById(selectedCharacterId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="w-full max-w-lg mx-auto px-2 sm:px-4 py-1 sm:py-3 relative select-none"
    >
      {/* Contenedor Principal: Ficha de Cartón Beige Ancestral del Juego */}
      <div className="p-3 sm:p-4.5 rounded-2xl sm:rounded-3xl bg-[#fbf7ee] border-2 border-gold shadow-[0_15px_45px_rgba(0,0,0,0.75)] text-[#1f1309] space-y-2 sm:space-y-3 relative z-10 overflow-hidden">
        
        {/* ENCABEZADO CON LA LUNA SAGRADA (Luna.svg) */}
        <div className="relative text-center pt-0.5 space-y-1 select-none">
          {/* Marco sagrado de la Luna */}
          <div className="relative inline-block">
            <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-full p-1 bg-[#140e08] border-2 border-gold shadow-md flex items-center justify-center mx-auto overflow-hidden">
              <img 
                src={lunaSvg} 
                alt="Luna de las Leyendas" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(252,207,101,0.6)] transition-transform duration-500 hover:rotate-12 hover:scale-105" 
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 bg-[#1a1208] border border-gold/80 rounded-full p-0.5 shadow-md">
              <Sparkles size={9} className="text-gold animate-spin" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.2 rounded-full bg-amber-200/90 border border-gold/70 text-amber-950 text-[9px] font-mono tracking-widest uppercase font-black shadow-sm">
              <Crown size={10} className="text-amber-900" /> Círculo de las Leyendas
            </div>
            <h1 className="font-display text-lg sm:text-xl text-[#1f1309] font-black tracking-wider mt-0.5 leading-tight">
              SALA DE JUEGO
            </h1>
          </div>
        </div>

        {/* SELECTOR DE LOS 6 TZIPITÍOS OFICIALES ANTES DE ENTRAR */}
        <div className="bg-[#ede1c7] border-2 border-gold/80 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[9px] sm:text-[10px] font-mono uppercase font-black text-amber-950 flex items-center gap-1">
              <Sparkles size={11} className="text-amber-800" />
              <span>Escoge a tu Tzipitío:</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-display font-black text-amber-950 bg-amber-200/90 border border-gold/70 px-2 py-0.2 rounded-full shadow-xs">
              {activeChar.name}
            </span>
          </div>

          {/* Fila compacta de los 6 Tzipitíos en pedestal blanco */}
          <div className="grid grid-cols-6 gap-1 sm:gap-1.5">
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
                  className={`flex flex-col items-center justify-center p-1 rounded-lg sm:rounded-xl transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-amber-100/95 border-2 border-amber-600 shadow-sm scale-[1.05]'
                      : 'bg-white/80 border border-[#d6be96] hover:border-gold hover:bg-white opacity-85 hover:opacity-100'
                  }`}
                >
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border flex items-center justify-center p-0.5 overflow-hidden shadow-xs ${
                    isSelected ? 'border-amber-600 ring-1 ring-gold' : 'border-gold/70'
                  }`}>
                    {char.avatarSvg ? (
                      <img 
                        src={char.avatarSvg} 
                        alt={char.name} 
                        className="w-full h-full object-contain filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]" 
                      />
                    ) : (
                      <Sparkles size={14} className="text-amber-600" />
                    )}
                  </div>
                  <span className={`text-[8px] sm:text-[9px] font-mono mt-0.5 leading-none truncate max-w-full ${
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

          {/* Rasgo del personaje seleccionado */}
          <div className="px-1 text-center">
            <p className="text-[10px] text-amber-950 font-mono font-bold truncate">
              ⚡ {activeChar.perk}
            </p>
          </div>
        </div>

        {/* Mensaje de Error (si existe) */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-2 sm:p-2.5 bg-rose-100 border-2 border-rose-500/70 text-rose-900 rounded-xl text-xs font-mono text-center font-bold shadow-sm"
          >
            {error}
          </motion.div>
        )}

        {/* TARJETA OPCIÓN 1: CREAR SALA (MODO MAYORDOMO) */}
        <div className="border-2 border-gold bg-[#ede1c7] p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-sm space-y-2 relative overflow-hidden group hover:border-gold transition-all">
          <div className="flex items-center gap-2.5 sm:gap-3 relative z-10">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-gold/25 border-2 border-gold flex items-center justify-center shrink-0 p-1 shadow-sm text-amber-900 relative">
              <Crown size={22} className="text-amber-900" />
              <img 
                src={llaveOroPng} 
                alt="Llave de Oro" 
                className="w-4 h-4 absolute -bottom-1 -right-1 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" 
              />
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-display text-sm sm:text-base text-[#1f1309] font-black leading-none">
                  Modo Mayordomo
                </h3>
                <span className="text-[8px] sm:text-[9px] font-mono bg-amber-200/90 border border-gold/70 text-amber-950 px-1.5 py-0.2 rounded-full font-bold shadow-sm">
                  ANFITRIÓN • 6 JUGADORES
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#3a2717] font-serif italic leading-snug mt-0.5">
                Forja una sala sagrada con tu código y convoca hasta 5 exploradores al tablero.
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
            className="w-full min-h-[42px] sm:min-h-[46px] py-2 sm:py-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-display font-bold uppercase tracking-wider rounded-xl shadow-md border-2 border-gold text-cream hover:text-obsidian bg-earth-brown hover:bg-gold transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                Forjando Sala...
              </span>
            ) : (
              <>
                <Crown size={16} />
                <span>Crear Sala</span>
              </>
            )}
          </button>
        </div>

        {/* TARJETA OPCIÓN 2: ENTRAR COMO INVITADO (CÓDIGO DE SALA) */}
        <div className="border-2 border-[#d6be96] bg-[#f5ebd6] hover:bg-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-sm space-y-2 transition-all text-[#1f1309]">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-[#ede1c7] border border-[#d6be96] flex items-center justify-center shrink-0 p-1 shadow-sm text-amber-900">
              <Users size={20} className="text-amber-900" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-display text-sm sm:text-base text-[#1f1309] font-bold leading-none">
                  Unirse a una Sala
                </h3>
                <span className="text-[8px] sm:text-[9px] font-mono bg-amber-200/90 border border-gold/60 text-amber-950 px-1.5 py-0.2 rounded-full font-bold">
                  HASTA 5 INVITADOS
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#4a3421] font-serif italic leading-snug mt-0.5">
                ¿Recibiste un código de 6 caracteres o un código QR? Ingrésalo para unirte a la partida.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onJoinRoom();
            }}
            className="w-full min-h-[40px] sm:min-h-[44px] py-2 sm:py-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-display font-bold uppercase tracking-wider rounded-xl border-2 border-gold/70 hover:border-gold bg-[#ede1c7] hover:bg-gold/25 text-[#1f1309] transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <KeyRound size={15} className="text-amber-900" />
            <span>Ingresar Código de Sala</span>
          </button>
        </div>

        {/* PIE DE PÁGINA SAGRADO: HORIZONTE DE VOLCANES (volcan.svg) */}
        <div className="relative mt-1 -mx-3.5 sm:-mx-5 -mb-3.5 sm:-mb-5 pt-2 pb-2 px-3 bg-gradient-to-t from-[#e2cfad] via-[#ede1c7] to-[#fbf7ee] border-t border-gold/40 flex flex-col items-center justify-center select-none overflow-hidden">
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full flex justify-center items-end"
          >
            <img 
              src={volcanSvg} 
              alt="Volcanes Sagrados de Guatemala" 
              className="h-16 sm:h-20 w-auto max-w-[380px] sm:max-w-[450px] object-contain filter drop-shadow-[0_2px_10px_rgba(180,83,9,0.35)] transition-transform hover:scale-105" 
            />
          </motion.div>

          <p className="text-[9px] sm:text-[10px] font-serif italic text-[#3a2717] font-bold flex items-center justify-center gap-1.5 mt-0.5 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Tierra Sagrada de Volcanes • La Casa de las Leyendas
          </p>
        </div>
      </div>
    </motion.div>
  );
};
