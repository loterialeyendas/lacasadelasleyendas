import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, ArrowLeft, X, Sparkles, ShieldCheck, KeyRound } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInAnonymously, updateProfile } from 'firebase/auth';
import { Button, Card, MysticalTitle } from './Theme';
import { sound } from '../lib/audio';

// Elementos gráficos: Candados y Llaves de alta resolución
import candadoOroPng from '../images/png/Candado oro.png';
import candadoJadePng from '../images/png/Candado jade.png';
import candadoPlataPng from '../images/png/Candado plata.png';
import candadoVidaPng from '../images/png/Candado vida.png';

import llaveOroPng from '../images/png/Llave oro.png';
import llaveJadePng from '../images/png/Llave jade.png';
import llavePlataPng from '../images/png/Llave plata.png';
import llaveVidaPng from '../images/png/Llave vida.png';

import logo from '../images/logo.png';

type TalismanType = 'oro' | 'jade' | 'plata' | 'vida';

interface TalismanConfig {
  name: string;
  lockImg: string;
  keyImg: string;
  glowColor: string;
  borderActive: string;
}

const TALISMANS: Record<TalismanType, TalismanConfig> = {
  oro: {
    name: 'Oro Colonial',
    lockImg: candadoOroPng,
    keyImg: llaveOroPng,
    glowColor: 'rgba(252, 207, 101, 0.45)',
    borderActive: 'border-gold text-gold bg-gold/15'
  },
  jade: {
    name: 'Jade Maya',
    lockImg: candadoJadePng,
    keyImg: llaveJadePng,
    glowColor: 'rgba(16, 185, 129, 0.45)',
    borderActive: 'border-emerald-400 text-emerald-300 bg-emerald-950/40'
  },
  plata: {
    name: 'Plata Nocturna',
    lockImg: candadoPlataPng,
    keyImg: llavePlataPng,
    glowColor: 'rgba(203, 213, 225, 0.45)',
    borderActive: 'border-slate-300 text-slate-200 bg-slate-800/40'
  },
  vida: {
    name: 'Fuego Eterno',
    lockImg: candadoVidaPng,
    keyImg: llaveVidaPng,
    glowColor: 'rgba(239, 68, 68, 0.45)',
    borderActive: 'border-rose-400 text-rose-300 bg-rose-950/40'
  }
};

const SUGGESTED_NAMES = [
  'El Sombrerón',
  'El Cadejo',
  'La Tatuana',
  'El Cipitío',
  'La Llorona',
  'Explorador Místico'
];

interface LoginProps {
  onLogin: (user: any) => void;
  onBack?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [name, setName] = useState('');
  const [selectedTalisman, setSelectedTalisman] = useState<TalismanType>('oro');
  const [loading, setLoading] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState('');

  const currentTalisman = TALISMANS[selectedTalisman];

  const handleSelectSuggestion = (suggestion: string) => {
    sound.playClick();
    setName(suggestion);
    setError('');
  };

  const handleSelectTalisman = (type: TalismanType) => {
    sound.playClick();
    setSelectedTalisman(type);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      sound.playError();
      setError('Escribe tu nombre o elige un apodo místico');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Iniciar sesión anónima en Firebase
      const userCredential = await signInAnonymously(auth);
      await updateProfile(userCredential.user, {
        displayName: cleanName
      });

      // 2. Animación mística de desbloqueo de cerrojo
      setIsUnlocking(true);
      sound.playUnlock();

      // Vibración háptica en dispositivos móviles
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([40, 50, 70]);
        } catch {
          // Silencioso en navegadores sin soporte
        }
      }

      // 3. Pausa para permitir que la animación y sonido concluyan
      setTimeout(() => {
        onLogin(userCredential.user);
      }, 750);
    } catch (err: any) {
      console.error(err);
      sound.playError();
      setError('Error al cruzar el portal: ' + (err.message || 'Intenta de nuevo'));
      setIsUnlocking(false);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto px-4 py-2 sm:py-6 flex flex-col justify-center"
    >
      {/* Botón superior Volver al Portal (Optimizado para móvil) */}
      {onBack && (
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-cream/70 hover:text-gold active:scale-95 transition-all py-2 px-3 rounded-lg border border-gold/20 hover:border-gold/50 bg-black/40 backdrop-blur-md cursor-pointer"
          >
            <ArrowLeft size={14} className="text-gold" />
            <span>Volver al portal</span>
          </button>

          <span className="text-[10px] text-gold/70 font-mono uppercase tracking-wider flex items-center gap-1">
            <KeyRound size={12} />
            Acceso Sagrado
          </span>
        </div>
      )}

      {/* Tarjeta Principal Mística */}
      <Card className="border border-gold/40 backdrop-blur-xl bg-black/80 p-5 sm:p-7 rounded-2xl shadow-[0_0_35px_rgba(0,0,0,0.85)] relative overflow-hidden">
        {/* Resplandor místico de fondo según el talismán */}
        <div 
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none blur-3xl transition-colors duration-700 opacity-40"
          style={{ backgroundColor: currentTalisman.glowColor }}
        />

        {/* Encabezado con Logo y Escenario Candado-Llave */}
        <div className="relative text-center space-y-3 mb-5">
          {/* Logo flotante sutil */}
          <div className="flex items-center justify-center gap-2">
            <img 
              src={logo} 
              alt="Logo La Casa de las Leyendas" 
              className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(190,141,44,0.4)]" 
            />
            <div className="text-left">
              <span className="block text-[10px] text-gold/80 font-serif tracking-[0.25em] uppercase">Guatemala</span>
              <span className="block text-xs font-display text-cream tracking-wider">Casa de las Leyendas</span>
            </div>
          </div>

          {/* Escenario Ritual: Candado y Llave Interactivos */}
          <div className="relative h-32 flex items-center justify-center select-none py-1">
            {/* Halo radiante central */}
            <motion.div
              animate={{
                scale: isUnlocking ? [1, 1.8, 2.2] : [1, 1.08, 1],
                opacity: isUnlocking ? [0.6, 1, 0] : [0.35, 0.6, 0.35]
              }}
              transition={{
                duration: isUnlocking ? 0.75 : 3.5,
                repeat: isUnlocking ? 0 : Infinity,
                ease: "easeInOut"
              }}
              className="absolute w-28 h-28 rounded-full pointer-events-none blur-xl"
              style={{ backgroundColor: currentTalisman.glowColor }}
            />

            {/* Candado Místico */}
            <motion.div
              animate={
                isUnlocking
                  ? { scale: [1, 1.15, 1.25], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1.8)'] }
                  : { y: [0, -4, 0] }
              }
              transition={
                isUnlocking
                  ? { duration: 0.7 }
                  : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
              }
              className="relative z-10"
            >
              <img
                src={currentTalisman.lockImg}
                alt={currentTalisman.name}
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] filter"
              />

              {/* Indicador de estado místico */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 border border-gold/40 px-2 py-0.5 rounded-full text-[9px] font-mono tracking-widest text-gold shadow-sm flex items-center gap-1">
                {isUnlocking ? (
                  <>
                    <Sparkles size={10} className="text-gold animate-spin" />
                    <span className="text-gold font-bold">DESBLOQUEADO</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                    <span>PORTAL SELLADO</span>
                  </>
                )}
              </div>
            </motion.div>

            {/* Llave Mística Animada que Encaja en el Candado */}
            <motion.div
              animate={
                isUnlocking
                  ? {
                      x: [-45, -12, 0],
                      y: [10, -5, 0],
                      rotate: [-20, 45, 90],
                      opacity: [1, 1, 0.8]
                    }
                  : name.trim().length > 0
                  ? {
                      x: [-40, -32, -40],
                      y: [5, 0, 5],
                      rotate: [-25, -15, -25]
                    }
                  : {
                      x: [-50, -45, -50],
                      y: [8, 2, 8],
                      rotate: [-30, -25, -30]
                    }
              }
              transition={
                isUnlocking
                  ? { duration: 0.6, ease: "easeOut" }
                  : { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }
              className="absolute z-20 pointer-events-none"
            >
              <img
                src={currentTalisman.keyImg}
                alt={`Llave ${currentTalisman.name}`}
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
              />
            </motion.div>
          </div>

          <div className="space-y-1">
            <MysticalTitle className="text-xl sm:text-2xl mb-0">RITUAL DE ENTRADA</MysticalTitle>
            <p className="text-cream/70 italic text-xs font-serif leading-tight px-2">
              Forja tu identidad para que los guardianes reconozcan tu espíritu
            </p>
          </div>
        </div>

        {/* Selector de Talismán Guardián (Oro, Jade, Plata, Vida) */}
        <div className="mb-4">
          <label className="text-[10px] uppercase font-mono tracking-widest text-gold/80 block mb-1.5 px-0.5 flex items-center justify-between">
            <span>Elige tu Llave Guardiana:</span>
            <span className="text-[9px] text-cream/40 lowercase">{currentTalisman.name}</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(Object.keys(TALISMANS) as TalismanType[]).map((type) => {
              const item = TALISMANS[type];
              const isSelected = selectedTalisman === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSelectTalisman(type)}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? item.borderActive + ' shadow-[0_0_10px_rgba(190,141,44,0.3)] scale-[1.03]'
                      : 'border-white/10 hover:border-white/20 bg-white/5 text-cream/60'
                  }`}
                >
                  <img src={item.keyImg} alt={item.name} className="w-6 h-6 object-contain mb-1" />
                  <span className="text-[9px] font-sans capitalize tracking-tight">{type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Formulario de Acceso Optimizado para Pantallas Táctiles */}
        <form onSubmit={handleLogin} className="space-y-3.5">
          <div className="space-y-1.5">
            <label 
              htmlFor="playerNameInput" 
              className="text-gold text-[11px] uppercase tracking-widest font-mono block px-1"
            >
              Nombre del Jugador o Apodo
            </label>
            
            <div className="relative flex items-center">
              <input
                id="playerNameInput"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Ej. El Cadejo, Sara..."
                maxLength={24}
                autoFocus
                autoComplete="nickname"
                autoCapitalize="words"
                autoCorrect="off"
                spellCheck={false}
                inputMode="text"
                enterKeyHint="go"
                disabled={loading || isUnlocking}
                className="w-full bg-black/60 border border-gold/30 rounded-xl px-3.5 py-3 pr-10 text-cream text-[16px] placeholder:text-cream/30 focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none transition-all shadow-inner"
              />

              {/* Botón rápido para limpiar texto en móvil */}
              {name.length > 0 && !loading && !isUnlocking && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setName('');
                  }}
                  aria-label="Limpiar nombre"
                  className="absolute right-2.5 p-1 rounded-full text-cream/40 hover:text-cream active:scale-90 transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Sugerencias Rápidas para Móvil (Apodos Míticos con un solo tap) */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-cream/50 block px-1">
              Inspiración Rápida:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_NAMES.map((sug) => {
                const isActive = name === sug;
                return (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => handleSelectSuggestion(sug)}
                    className={`text-[11px] font-sans px-2.5 py-1 rounded-full border transition-all cursor-pointer active:scale-95 ${
                      isActive
                        ? 'border-gold text-gold bg-gold/15 font-semibold'
                        : 'border-white/10 hover:border-gold/30 text-cream/70 bg-white/5'
                    }`}
                  >
                    {sug}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mensaje de error amigable */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-maya-red/15 border border-maya-red/40 rounded-lg p-2.5 text-cream text-[11px] text-center flex items-center justify-center gap-1.5">
                  <span className="text-maya-red font-bold">⚠</span>
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botón Principal de Gran Área Táctil para Móvil (Mínimo 52px de altura) */}
          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2 min-h-[52px] py-3.5 text-base sm:text-lg tracking-wider rounded-xl shadow-[0_4px_20px_rgba(190,141,44,0.35)] mt-2"
            disabled={loading || isUnlocking}
          >
            {isUnlocking ? (
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 text-gold font-bold"
              >
                <Sparkles size={20} className="animate-spin" />
                <span>¡Abriendo Portal Sagrado!</span>
              </motion.div>
            ) : loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                <span>Invocando a los ancestros...</span>
              </div>
            ) : (
              <>
                <LogIn size={20} className="text-gold" />
                <span>Desbloquear y Entrar</span>
              </>
            )}
          </Button>
        </form>

        {/* Pie informativo sutil */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-cream/40">
          <span className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-gold/60" />
            Sesión Anónima Segura
          </span>
          <span>Leyendas de Guatemala</span>
        </div>
      </Card>

      <p className="text-[10px] text-cream/30 text-center uppercase tracking-tight mt-3">
        Tu pasaporte y tus sellos se conservarán en tu dispositivo.
      </p>
    </motion.div>
  );
};
