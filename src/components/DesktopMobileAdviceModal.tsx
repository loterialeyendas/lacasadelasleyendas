import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Smartphone, Sparkles, QrCode, ArrowRight, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { sound } from '../lib/audio';

import candadoOroPng from '../images/png/Candado oro.png';
import llaveOroPng from '../images/png/Llave oro.png';
import logoPng from '../images/logo.png';

interface DesktopMobileAdviceModalProps {
  appUrl?: string;
}

const STORAGE_KEY = 'casa_leyendas_mobile_advice_dismissed';

// Funciones de inicialización inmediata para evitar parpadeos ("flickering")
const checkIsDesktopInitial = (): boolean => {
  if (typeof window === 'undefined') return false;
  const isLargeScreen = window.innerWidth >= 820;
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return isLargeScreen && !isMobileUA;
};

const checkIsDismissedInitial = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

export const DesktopMobileAdviceModal: React.FC<DesktopMobileAdviceModalProps> = ({ appUrl }) => {
  // Inicialización síncrona: se abre en el primer frame si es desktop
  // Cada vez que el usuario refresca el navegador vuelve a abrirse
  const [isDesktop, setIsDesktop] = useState<boolean>(() => checkIsDesktopInitial());
  const [hasDismissed, setHasDismissed] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(() => checkIsDesktopInitial());

  // URL del juego para el código QR
  const targetUrl = appUrl || (typeof window !== 'undefined' ? `${window.location.origin}/juego` : 'https://lacasadelasleyendas.com/juego');

  useEffect(() => {
    const isDesk = checkIsDesktopInitial();
    setIsDesktop(isDesk);
    if (isDesk) {
      setIsOpen(true);
    }

    const handleResize = () => {
      const desk = checkIsDesktopInitial();
      setIsDesktop(desk);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDismiss = () => {
    sound.playClick();
    setIsOpen(false);
    setHasDismissed(true);
  };

  const handleOpenAgain = () => {
    sound.playClick();
    setIsOpen(true);
  };

  // En dispositivos móviles no se renderiza nada
  if (!isDesktop) return null;

  return (
    <>
      {/* Botón flotante discreto cuando el anuncio ha sido descartado */}
      {!isOpen && hasDismissed && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenAgain}
          title="Ver QR para abrir en tu celular"
          aria-label="Abrir recomendación para móviles"
          className="fixed bottom-5 left-5 z-40 bg-[#16120c]/95 hover:bg-[#201910] border border-gold/70 text-cream px-3.5 py-2 rounded-full shadow-[0_4px_25px_rgba(0,0,0,0.85)] flex items-center gap-2.5 backdrop-blur-md cursor-pointer group transition-all"
        >
          <div className="relative w-7 h-7 flex items-center justify-center">
            <img 
              src={candadoOroPng} 
              alt="Candado" 
              className="w-6 h-6 object-contain filter drop-shadow-[0_0_6px_rgba(252,207,101,0.6)]" 
            />
            <img 
              src={llaveOroPng} 
              alt="Llave" 
              className="w-4 h-4 object-contain absolute -bottom-1 -right-1 filter drop-shadow group-hover:rotate-12 transition-transform" 
            />
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-[10px] text-amber-300 font-mono uppercase tracking-wider font-bold flex items-center gap-1">
              <Smartphone size={11} /> Mejor en Móvil
            </span>
            <span className="text-[9px] text-[#FAF6EE]/70 font-serif italic mt-0.5">
              Ver Código QR
            </span>
          </div>
        </motion.button>
      )}

      {/* Modal Ceremonial de Advertencia con Candado, Llave y Código QR */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Fondo con desenfoque cálido y armónico con el fondo de la página */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleDismiss}
              className="fixed inset-0 bg-black/65 backdrop-blur-sm cursor-pointer"
            />

            {/* Contenedor Principal: Obsidiana Cálida Iluminada con Oro Colonial */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-xl bg-gradient-to-b from-[#1c150c] via-[#140e08] to-[#0d0905] border-2 border-gold/70 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(206,136,34,0.35),0_20px_50px_rgba(0,0,0,0.85)] text-cream z-10 overflow-hidden select-none"
            >
              {/* Resplandor áureo superior para dar calidez y armonía al fondo */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-48 rounded-full bg-gradient-to-b from-amber-400/25 via-gold/15 to-transparent blur-3xl pointer-events-none" />

              {/* Botón de Cierre Superior */}
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Cerrar aviso y continuar"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 border border-gold/40 hover:border-gold hover:bg-gold/20 text-cream/80 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
              >
                <X size={18} />
              </button>

              {/* Cabecera Ceremonial con Logo de la Casa */}
              <div className="flex items-center gap-2.5 mb-4">
                <img 
                  src={logoPng} 
                  alt="Logo Casa de las Leyendas" 
                  className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(252,207,101,0.5)]" 
                />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-300 font-bold">
                    CASA DE LAS LEYENDAS • GUATEMALA
                  </span>
                  <span className="text-[9px] font-serif italic text-cream/70">
                    Aviso Ceremonial para Navegadores de Escritorio
                  </span>
                </div>
              </div>

              {/* Escenario Central: Candado y Llave Flotantes + Mensaje + Código QR */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center my-1">
                {/* Lado Izquierdo: Candado y Llave con Pedestal Dorado */}
                <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
                  <div className="relative w-36 h-36 flex items-center justify-center rounded-2xl bg-gradient-to-b from-amber-950/40 via-black/60 to-transparent border border-gold/40 p-3 shadow-inner">
                    {/* Halo de luz cálida */}
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
                      alt="Candado de Oro Sagrado"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-24 h-24 object-contain relative z-10 drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)] filter"
                    />

                    {/* Llave de Oro Mística Encajando */}
                    <motion.img
                      src={llaveOroPng}
                      alt="Llave de Oro Mística"
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
                      <span>EXPERIENCIA MÓVIL</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-amber-200/80 mt-2 font-medium">
                    Cámara QR • Audio • Pasaporte
                  </span>
                </div>

                {/* Lado Derecho: Título Claro, Descripción y Código QR */}
                <div className="md:col-span-7 flex flex-col justify-center text-left space-y-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-display font-extrabold text-amber-200 tracking-wide leading-tight drop-shadow-sm">
                      ¡La mejor experiencia se vive en tu{' '}
                      <span className="text-gold underline decoration-gold/50 decoration-2 underline-offset-4">
                        teléfono móvil
                      </span>!
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#F5EDE0] font-serif leading-relaxed mt-2">
                      La Casa de las Leyendas fue forjada para jugarse con tu teléfono en mano: <strong className="text-amber-200 font-bold">escaneo instantáneo de cartas físicas</strong> con la cámara, retos de audio inmersivo y tu pasaporte interactivo.
                    </p>
                  </div>

                  {/* Tarjeta de Código QR para Escaneo Instantáneo */}
                  <div className="bg-[#1b140b]/90 border border-gold/50 rounded-2xl p-3 flex items-center gap-3.5 shadow-[0_4px_15px_rgba(0,0,0,0.6)]">
                    <div className="p-1.5 bg-white rounded-xl shadow-md shrink-0 border border-gold/40">
                      <QRCodeSVG
                        value={targetUrl}
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
                        Apunta tu cámara aquí para abrir la aplicación directamente en tu móvil.
                      </p>
                      <span className="text-[9px] font-mono text-amber-300/70 truncate block mt-1">
                        lacasadelasleyendas.com
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de Acción al Pie con Excelente Contraste */}
              <div className="mt-5 pt-3.5 border-t border-gold/20 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gold/50 hover:border-gold bg-gold/15 hover:bg-gold/25 text-amber-200 hover:text-white transition-all text-xs font-mono font-bold cursor-pointer shadow-sm active:scale-95"
                >
                  Continuar en este navegador web
                </button>

                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono">
                  <ShieldCheck size={14} className="text-gold" />
                  <span>Guatemala Inmersiva</span>
                  <ArrowRight size={14} className="text-gold" />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
