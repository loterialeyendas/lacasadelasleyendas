import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, X, Sparkles, ShieldCheck, Smartphone, QrCode, ArrowRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
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

const checkIsDesktopBrowser = (): boolean => {
  if (typeof window === 'undefined') return false;
  const isLarge = window.innerWidth >= 820;
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return isLarge && !isMobileUA;
};

interface LoginProps {
  onLogin: (user: any) => void;
  onBack?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  // En escritorio, el ritual de entrada permanece oculto hasta que el usuario decida entrar en PC
  // Se abre SIEMPRE al cargar o refrescar la página
  const [isDesktopUser] = useState<boolean>(() => checkIsDesktopBrowser());
  const [showDesktopLogin, setShowDesktopLogin] = useState<boolean>(false);

  const [name, setName] = useState('');
  const [selectedTalisman, setSelectedTalisman] = useState<TalismanType>('oro');
  const [loading, setLoading] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState('');

  const currentTalisman = TALISMANS[selectedTalisman];

  const handleContinueOnDesktop = () => {
    sound.playClick();
    setShowDesktopLogin(true);
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

  // EN LA VERSIÓN WEB DE ESCRITORIO:
  // Se oculta completamente el Ritual de Entrada y se muestra de forma protagónica
  // el anuncio ceremonial de experiencia recomendada para móviles con Candado, Llave y Código QR.
  if (isDesktopUser && !showDesktopLogin) {
    const qrUrl = typeof window !== 'undefined' ? `${window.location.origin}/juego` : 'https://lacasadelasleyendas.com/juego';

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-xl mx-auto px-4 py-6 flex flex-col justify-center select-none"
      >
        <Card className="border-2 border-gold/70 bg-gradient-to-b from-[#1c150c]/95 via-[#130d07]/95 to-[#0b0704]/95 p-6 sm:p-8 rounded-3xl shadow-[0_0_50px_rgba(206,136,34,0.35),0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden backdrop-blur-xl space-y-6">
          {/* Halo áureo superior para dar luminosidad y calidez */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-56 rounded-full bg-gradient-to-b from-amber-400/25 via-gold/15 to-transparent blur-3xl pointer-events-none" />

          {/* Encabezado: Logo y Título */}
          <div className="relative text-center space-y-2">
            <div className="flex items-center justify-center gap-2.5">
              <img 
                src={logo} 
                alt="Logo La Casa de las Leyendas" 
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-[0_0_10px_rgba(252,207,101,0.5)]" 
              />
              <div className="text-left leading-none">
                <span className="block text-[10px] text-amber-300 font-serif tracking-[0.25em] uppercase font-bold">Guatemala</span>
                <span className="block text-sm font-display text-cream tracking-wider font-bold">Casa de las Leyendas</span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-gold/60 text-amber-300 text-[11px] font-mono tracking-widest uppercase font-bold shadow-sm">
              <Smartphone size={13} className="text-gold" /> Experiencia Diseñada para Móviles
            </span>
          </div>

          {/* Escenario Central: Candado y Llave de Oro interactivos */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center my-2">
            <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
              <div className="relative w-36 h-36 flex items-center justify-center rounded-2xl bg-gradient-to-b from-amber-950/40 via-black/60 to-transparent border border-gold/40 p-3 shadow-inner">
                {/* Halo radiante */}
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.4, 0.75, 0.4]
                  }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute w-28 h-28 rounded-full bg-amber-400/20 blur-xl pointer-events-none"
                />

                {/* Candado de Oro Sagrado */}
                <motion.img
                  src={candadoOroPng}
                  alt="Candado de Oro"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-24 h-24 object-contain relative z-10 drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)] filter"
                />

                {/* Llave de Oro Mística */}
                <motion.img
                  src={llaveOroPng}
                  alt="Llave de Oro"
                  animate={{
                    x: [-24, -14, -24],
                    y: [4, 0, 4],
                    rotate: [-20, -5, -20]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-16 h-16 object-contain absolute z-20 pointer-events-none drop-shadow-[0_4px_14px_rgba(0,0,0,0.95)]"
                />

                {/* Badge de clave móvil */}
                <div className="absolute -bottom-2.5 bg-[#1a130a] border border-gold/60 px-2.5 py-0.5 rounded-full text-[9px] font-mono text-amber-300 font-bold tracking-widest flex items-center gap-1 shadow-md">
                  <Sparkles size={10} className="text-gold animate-spin" />
                  <span>MODO MÓVIL</span>
                </div>
              </div>

              <span className="text-[11px] font-mono text-amber-200/80 mt-2 font-medium">
                Cámara QR • Pasaporte • Audio
              </span>
            </div>

            {/* Lado Derecho: Mensaje y Código QR */}
            <div className="md:col-span-7 flex flex-col justify-center text-left space-y-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-amber-200 tracking-wide leading-tight drop-shadow-sm">
                  ¡La magia cobra vida en tu{' '}
                  <span className="text-gold underline decoration-gold/50 decoration-2 underline-offset-4">
                    teléfono móvil
                  </span>!
                </h3>
                <p className="text-xs sm:text-[13px] text-[#F5EDE0] font-serif leading-relaxed mt-2">
                  La Casa de las Leyendas fue concebida para jugarse con tu teléfono en mano: <strong className="text-amber-200 font-bold">escaneo de cartas físicas con tu cámara</strong>, retos sensoriales y tu pasaporte interactivo.
                </p>
              </div>

              {/* Tarjeta de Código QR para Escaneo Instantáneo */}
              <div className="bg-[#1b140b]/90 border border-gold/50 rounded-2xl p-3 flex items-center gap-3.5 shadow-[0_4px_15px_rgba(0,0,0,0.6)]">
                <div className="p-1.5 bg-white rounded-xl shadow-md shrink-0 border border-gold/40">
                  <QRCodeSVG
                    value={qrUrl}
                    size={82}
                    level="M"
                    includeMargin={false}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold block flex items-center gap-1.5">
                    <QrCode size={13} className="text-gold" /> Escanea con tu celular
                  </span>
                  <p className="text-[11px] text-[#F5EDE0]/85 font-sans leading-snug mt-0.5">
                    Apunta tu cámara aquí para abrir la aplicación directamente en tu móvil sin escribir nada.
                  </p>
                  <span className="text-[9px] font-mono text-amber-300/70 truncate block mt-1">
                    lacasadelasleyendas.com
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Acción al Pie */}
          <div className="pt-4 border-t border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleContinueOnDesktop}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gold/70 hover:border-gold bg-gold/15 hover:bg-gold/25 text-amber-200 hover:text-white transition-all text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Continuar en este navegador web (PC)</span>
              <ArrowRight size={14} />
            </button>

            {onBack && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onBack();
                }}
                className="text-xs font-mono text-cream/50 hover:text-gold transition-colors cursor-pointer py-1"
              >
                Volver al portal
              </button>
            )}
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md mx-auto px-4 py-4 sm:py-6 flex flex-col justify-center"
    >
      {/* Tarjeta Principal Mística con Espaciado Vertical Amplio y Elegante */}
      <Card className="border border-gold/40 backdrop-blur-xl bg-black/85 p-6 sm:p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.85)] relative overflow-hidden space-y-6 sm:space-y-7">
        {/* Resplandor místico de fondo según el talismán */}
        <div 
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none blur-3xl transition-colors duration-700 opacity-35"
          style={{ backgroundColor: currentTalisman.glowColor }}
        />

        {/* Encabezado: Logo y Título con Espaciado Generoso */}
        <div className="relative text-center space-y-2.5">
          <div className="flex items-center justify-center gap-2.5">
            <img 
              src={logo} 
              alt="Logo La Casa de las Leyendas" 
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-[0_0_10px_rgba(190,141,44,0.45)]" 
            />
            <div className="text-left leading-none">
              <span className="block text-[10px] text-gold/80 font-serif tracking-[0.25em] uppercase">Guatemala</span>
              <span className="block text-sm font-display text-cream tracking-wider font-bold">Casa de las Leyendas</span>
            </div>
          </div>

          <MysticalTitle className="text-2xl sm:text-3xl mb-0 font-bold tracking-wider">
            RITUAL DE ENTRADA
          </MysticalTitle>
          <p className="text-cream/70 italic text-xs sm:text-sm font-serif leading-relaxed px-2">
            Forja tu identidad para que los guardianes reconozcan tu espíritu
          </p>
        </div>

        {/* Escenario Ritual Espacioso: Candado y Llave Ampliados (+30%) */}
        <div className="relative h-36 sm:h-40 flex items-center justify-center select-none py-2">
          {/* Halo radiante central */}
          <motion.div
            animate={{
              scale: isUnlocking ? [1, 1.8, 2.2] : [1, 1.1, 1],
              opacity: isUnlocking ? [0.6, 1, 0] : [0.35, 0.65, 0.35]
            }}
            transition={{
              duration: isUnlocking ? 0.75 : 3.5,
              repeat: isUnlocking ? 0 : Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-32 h-32 rounded-full pointer-events-none blur-2xl"
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
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-[0_6px_20px_rgba(0,0,0,0.85)] filter"
            />

            {/* Indicador de estado del portal */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 border border-gold/40 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-gold shadow-md flex items-center gap-1.5">
              {isUnlocking ? (
                <>
                  <Sparkles size={11} className="text-gold animate-spin" />
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

          {/* Llave Mística Animada Ampliada un 30% */}
          <motion.div
            animate={
              isUnlocking
                ? {
                    x: [-45, -12, 0],
                    y: [10, -4, 0],
                    rotate: [-20, 45, 90],
                    opacity: [1, 1, 0.8]
                  }
                : name.trim().length > 0
                ? {
                    x: [-42, -32, -42],
                    y: [5, 0, 5],
                    rotate: [-25, -15, -25]
                  }
                : {
                    x: [-48, -42, -48],
                    y: [8, 3, 8],
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
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
            />
          </motion.div>
        </div>

        {/* Selector de Llave Guardiana con Llaves Ampliadas +30% */}
        <div className="space-y-2">
          <label className="text-[11px] uppercase font-mono tracking-widest text-gold/80 block px-1 flex items-center justify-between">
            <span>Elige tu Llave Guardiana:</span>
            <span className="text-[10px] text-cream/50 capitalize font-serif italic">{currentTalisman.name}</span>
          </label>
          <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
            {(Object.keys(TALISMANS) as TalismanType[]).map((type) => {
              const item = TALISMANS[type];
              const isSelected = selectedTalisman === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSelectTalisman(type)}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? item.borderActive + ' shadow-[0_0_12px_rgba(190,141,44,0.35)] scale-[1.04]'
                      : 'border-white/10 hover:border-white/25 bg-white/5 text-cream/60 hover:text-cream'
                  }`}
                >
                  <img 
                    src={item.keyImg} 
                    alt={item.name} 
                    className="w-8 h-8 sm:w-9 sm:h-9 object-contain mb-1 transition-transform hover:scale-110" 
                  />
                  <span className="text-[10px] sm:text-[11px] font-sans font-medium capitalize tracking-tight">{type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Formulario de Entrada con Espaciado Cómodo */}
        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
          <div>
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
                aria-label="Nombre o apodo del jugador"
                maxLength={24}
                autoFocus
                autoComplete="nickname"
                autoCapitalize="words"
                autoCorrect="off"
                spellCheck={false}
                inputMode="text"
                enterKeyHint="go"
                disabled={loading || isUnlocking}
                className="w-full bg-black/60 border border-gold/30 rounded-xl px-4 py-3.5 sm:py-4 pr-11 text-cream text-[15px] sm:text-[16px] placeholder:text-cream/40 focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none transition-all shadow-inner"
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
                  className="absolute right-3 p-1.5 rounded-full text-cream/40 hover:text-cream active:scale-90 transition-all cursor-pointer"
                >
                  <X size={17} />
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
                <div className="bg-maya-red/15 border border-maya-red/40 rounded-xl p-2.5 text-cream text-xs text-center flex items-center justify-center gap-2">
                  <span className="text-maya-red font-bold">⚠</span>
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botón Principal de Acceso */}
          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2.5 min-h-[52px] sm:min-h-[56px] py-3.5 sm:py-4 text-base tracking-wider rounded-xl shadow-[0_4px_24px_rgba(190,141,44,0.4)] cursor-pointer"
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
                <span className="font-semibold">Desbloquear y Entrar</span>
              </>
            )}
          </Button>
        </form>

        {/* Pie informativo sutil */}
        <div className="pt-3 sm:pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-cream/45">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-gold/70" />
            Progreso guardado en tu pasaporte
          </span>
          <span className="font-serif italic text-gold/60">Guatemala</span>
        </div>
      </Card>
    </motion.div>
  );
};
