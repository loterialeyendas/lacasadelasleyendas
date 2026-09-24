import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, X, Sparkles, ShieldCheck } from 'lucide-react';
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

interface LoginProps {
  onLogin: (user: any) => void;
  onBack?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [selectedTalisman, setSelectedTalisman] = useState<TalismanType>('oro');
  const [loading, setLoading] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState('');

  const currentTalisman = TALISMANS[selectedTalisman];

  const handleSelectTalisman = (type: TalismanType) => {
    sound.playClick();
    setSelectedTalisman(type);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      sound.playError();
      setError('Por favor ingresa tu nombre o apodo de explorador');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let finalUser: any = null;

      try {
        // 1. Intentar inicio de sesión anónima en Firebase Authentication
        const userCredential = await signInAnonymously(auth);
        await updateProfile(userCredential.user, {
          displayName: cleanName
        });
        finalUser = userCredential.user;
      } catch (authErr: any) {
        console.warn('Firebase Auth no disponible en este momento, usando perfil local offline-first:', authErr);
        // Respaldo Offline-First si no hay red o auth anónimo
        const localUid = localStorage.getItem('casa_leyendas_local_uid') || ('exp_' + Math.random().toString(36).substring(2, 9));
        localStorage.setItem('casa_leyendas_local_uid', localUid);
        localStorage.setItem('casa_leyendas_local_name', cleanName);
        finalUser = {
          uid: localUid,
          displayName: cleanName,
          isAnonymous: true
        };
      }

      // 2. Animación mística de desbloqueo de cerrojo
      setIsUnlocking(true);
      sound.playUnlock();

      // Vibración háptica en dispositivos móviles compatibles
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([40, 50, 70]);
        } catch {
          // Silencioso
        }
      }

      // 3. Pausa para permitir que la animación y sonido concluyan
      setTimeout(() => {
        onLogin(finalUser);
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md mx-auto px-3 py-2 flex flex-col justify-center"
    >
      {/* Tarjeta Principal Mística con Espaciado Vertical Optimizado */}
      <Card className="border border-gold/40 backdrop-blur-xl bg-black/85 p-4 sm:p-6 rounded-2xl shadow-[0_0_35px_rgba(0,0,0,0.85)] relative overflow-hidden space-y-4">
        {/* Resplandor místico de fondo según el talismán */}
        <div 
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full pointer-events-none blur-3xl transition-colors duration-700 opacity-35"
          style={{ backgroundColor: currentTalisman.glowColor }}
        />

        {/* Encabezado: Logo y Título Compactos */}
        <div className="relative text-center space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <img 
              src={logo} 
              alt="Logo La Casa de las Leyendas" 
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-[0_0_8px_rgba(190,141,44,0.4)]" 
            />
            <div className="text-left leading-none">
              <span className="block text-[9px] text-gold/80 font-serif tracking-[0.25em] uppercase">Guatemala</span>
              <span className="block text-xs font-display text-cream tracking-wider font-bold">Casa de las Leyendas</span>
            </div>
          </div>

          <MysticalTitle className="text-xl sm:text-2xl mb-0 font-bold tracking-wider">
            RITUAL DE ENTRADA
          </MysticalTitle>
          <p className="text-cream/70 italic text-[11px] sm:text-xs font-serif leading-tight">
            Forja tu identidad para que los guardianes reconozcan tu espíritu
          </p>
        </div>

        {/* Escenario Ritual Compacto: Candado y Llave Interactivos */}
        <div className="relative h-24 sm:h-28 flex items-center justify-center select-none py-1">
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
            className="absolute w-24 h-24 rounded-full pointer-events-none blur-xl"
            style={{ backgroundColor: currentTalisman.glowColor }}
          />

          {/* Candado Místico */}
          <motion.div
            animate={
              isUnlocking
                ? { scale: [1, 1.15, 1.25], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1.8)'] }
                : { y: [0, -3, 0] }
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
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] filter"
            />

            {/* Indicador de estado del portal */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/85 border border-gold/40 px-2 py-0.5 rounded-full text-[9px] font-mono tracking-widest text-gold shadow-sm flex items-center gap-1">
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
                    x: [-40, -10, 0],
                    y: [8, -3, 0],
                    rotate: [-20, 45, 90],
                    opacity: [1, 1, 0.8]
                  }
                : name.trim().length > 0
                ? {
                    x: [-35, -28, -35],
                    y: [4, 0, 4],
                    rotate: [-25, -15, -25]
                  }
                : {
                    x: [-42, -38, -42],
                    y: [6, 2, 6],
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
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
            />
          </motion.div>
        </div>

        {/* Selector de Talismán Guardián (Oro, Jade, Plata, Vida) */}
        <div>
          <label className="text-[10px] uppercase font-mono tracking-widest text-gold/80 block mb-1 px-0.5 flex items-center justify-between">
            <span>Elige tu Llave Guardiana:</span>
            <span className="text-[9px] text-cream/40 capitalize">{currentTalisman.name}</span>
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
                  <img src={item.keyImg} alt={item.name} className="w-5 h-5 sm:w-6 sm:h-6 object-contain mb-0.5" />
                  <span className="text-[9px] font-sans capitalize tracking-tight">{type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Formulario de Entrada */}
        <form onSubmit={handleLogin} className="space-y-3">
          <div className="space-y-1">
            <label 
              htmlFor="playerNameInput" 
              className="text-gold text-[10px] sm:text-[11px] uppercase tracking-widest font-mono block px-1"
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
                placeholder="Escribe tu nombre o apodo..."
                maxLength={24}
                autoFocus
                autoComplete="nickname"
                autoCapitalize="words"
                autoCorrect="off"
                spellCheck={false}
                inputMode="text"
                enterKeyHint="go"
                disabled={loading || isUnlocking}
                className="w-full bg-black/60 border border-gold/30 rounded-xl px-3.5 py-3 pr-10 text-cream text-[15px] sm:text-[16px] placeholder:text-cream/30 focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none transition-all shadow-inner"
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

          {/* Mensaje de error amigable */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-maya-red/15 border border-maya-red/40 rounded-lg p-2 text-cream text-[11px] text-center flex items-center justify-center gap-1.5">
                  <span className="text-maya-red font-bold">⚠</span>
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botón Principal de Acceso */}
          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2 min-h-[48px] py-3 text-sm sm:text-base tracking-wider rounded-xl shadow-[0_4px_20px_rgba(190,141,44,0.35)] cursor-pointer"
            disabled={loading || isUnlocking}
          >
            {isUnlocking ? (
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 text-gold font-bold"
              >
                <Sparkles size={18} className="animate-spin" />
                <span>¡Abriendo Portal Sagrado!</span>
              </motion.div>
            ) : loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                <span>Invocando a los ancestros...</span>
              </div>
            ) : (
              <>
                <LogIn size={18} className="text-gold" />
                <span>Desbloquear y Entrar</span>
              </>
            )}
          </Button>
        </form>

        {/* Pie informativo sutil */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-cream/40">
          <span className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-gold/60" />
            Progreso guardado en tu pasaporte
          </span>
          <span className="font-serif italic">Guatemala</span>
        </div>
      </Card>
    </motion.div>
  );
};
