import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Smartphone, Sparkles, QrCode, ArrowRight, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { sound } from '../lib/audio';

import candadoOroPng from '../images/png/Candado oro.png';
import llaveOroPng from '../images/png/Llave oro.png';
import logoPng from '../images/logo.png';

interface DesktopMobileAdviceModalProps {
  appUrl?: string;
}

const STORAGE_KEY = 'casa_leyendas_mobile_advice_dismissed';

export const DesktopMobileAdviceModal: React.FC<DesktopMobileAdviceModalProps> = ({ appUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(true);

  // URL a la que dirigirá el código QR
  const targetUrl = appUrl || (typeof window !== 'undefined' ? `${window.location.origin}/juego` : 'https://lacasadelasleyendas.com/juego');

  useEffect(() => {
    // Detectar si el usuario está en pantalla de escritorio/laptop
    const checkIsDesktop = () => {
      if (typeof window === 'undefined') return false;
      const isLargeScreen = window.innerWidth >= 820;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      return isLargeScreen && !isMobileUA;
    };

    const isDesk = checkIsDesktop();
    setIsDesktop(isDesk);

    if (isDesk) {
      const dismissed = sessionStorage.getItem(STORAGE_KEY) === 'true';
      setHasDismissed(dismissed);

      // Si no ha sido descartado en esta sesión, abrir con retraso agradable para no interrumpir la carga
      if (!dismissed) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleDismiss = () => {
    sound.playClick();
    setIsOpen(false);
    setHasDismissed(true);
    sessionStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleOpenAgain = () => {
    sound.playClick();
    setIsOpen(true);
  };

  // En móviles no renderizamos nada
  if (!isDesktop) return null;

  return (
    <>
      {/* Botón flotante discreto cuando el anuncio está colapsado */}
      {!isOpen && hasDismissed && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenAgain}
          title="Ver cómo abrir en tu móvil"
          aria-label="Abrir recomendación para móviles"
          className="fixed bottom-5 left-5 z-40 bg-black/90 hover:bg-black border border-gold/50 hover:border-gold text-cream px-3 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.85)] flex items-center gap-2.5 backdrop-blur-md cursor-pointer group transition-all"
        >
          <div className="relative w-7 h-7 flex items-center justify-center">
            <img 
              src={candadoOroPng} 
              alt="Candado" 
              className="w-6 h-6 object-contain filter drop-shadow-[0_0_4px_rgba(252,207,101,0.5)]" 
            />
            <img 
              src={llaveOroPng} 
              alt="Llave" 
              className="w-4 h-4 object-contain absolute -bottom-1 -right-1 filter drop-shadow group-hover:rotate-12 transition-transform" 
            />
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-[10px] text-gold font-mono uppercase tracking-wider font-bold flex items-center gap-1">
              <Smartphone size={11} /> Mejor en Móvil
            </span>
            <span className="text-[9px] text-cream/60 font-serif italic mt-0.5">
              Escanear QR
            </span>
          </div>
        </motion.button>
      )}

      {/* Modal Ceremonial con Candado, Llave y Código QR */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Fondo con desenfoque cinematográfico */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleDismiss}
              className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />

            {/* Contenedor del Anuncio Ceremonial */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative w-full max-w-xl bg-gradient-to-b from-neutral-950 via-obsidian to-black border-2 border-gold/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.95)] text-cream z-10 overflow-hidden select-none"
            >
              {/* Resplandor dorado de fondo */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gold/15 blur-3xl pointer-events-none" />

              {/* Botón de Cierre Superior */}
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Cerrar aviso"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 border border-white/20 hover:border-gold hover:bg-gold/10 text-cream/70 hover:text-cream flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Cabecera con Logo y Badge */}
              <div className="flex items-center gap-2 mb-4">
                <img src={logoPng} alt="Logo Casa de las Leyendas" className="w-7 h-7 object-contain" />
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold/90 bg-gold/15 border border-gold/30 px-2 py-0.5 rounded-full font-bold">
                  Experiencia Inmersiva Recomendada
                </span>
              </div>

              {/* Escenario Central: Candado y Llave Flotantes Místicos */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Lado Izquierdo / Superior: Escena Candado y Llave de Oro */}
                <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
                  <div className="relative w-36 h-36 flex items-center justify-center py-2">
                    {/* Halo de luz mística */}
                    <motion.div
                      animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.35, 0.7, 0.35]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute w-28 h-28 rounded-full bg-gold/25 blur-xl pointer-events-none"
                    />

                    {/* Candado de Oro Colonial */}
                    <motion.img
                      src={candadoOroPng}
                      alt="Candado de Oro Sagrado"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-24 h-24 object-contain relative z-10 drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)] filter"
                    />

                    {/* Llave de Oro Encajando en el Candado */}
                    <motion.img
                      src={llaveOroPng}
                      alt="Llave de Oro Mística"
                      animate={{
                        x: [-24, -14, -24],
                        y: [4, 0, 4],
                        rotate: [-20, -5, -20]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-16 h-16 object-contain absolute z-20 pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]"
                    />

                    {/* Sello de protección */}
                    <div className="absolute -bottom-2 bg-black/90 border border-gold/40 px-2.5 py-0.5 rounded-full text-[9px] font-mono text-gold tracking-widest flex items-center gap-1 shadow-md">
                      <Sparkles size={10} className="text-gold animate-spin" />
                      <span>CLAVE MÓVIL</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-cream/50 mt-1">
                    Cámara QR • Audio • Pasaporte
                  </span>
                </div>

                {/* Lado Derecho: Mensaje y Código QR */}
                <div className="md:col-span-7 flex flex-col justify-center text-left space-y-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-cream tracking-wide leading-tight">
                      ¡La magia cobra vida en tu <span className="text-gold">teléfono</span>!
                    </h3>
                    <p className="text-xs sm:text-[13px] text-cream/75 font-serif leading-relaxed mt-1.5">
                      Para disfrutar plenamente de los <strong className="text-cream">retos con cámara QR</strong>, el pasaporte táctil y los sonidos de las leyendas, te recomendamos abrir la aplicación desde tu dispositivo móvil.
                    </p>
                  </div>

                  {/* Tarjeta de Código QR para Escaneo Instantáneo */}
                  <div className="bg-black/60 border border-gold/40 rounded-2xl p-3 flex items-center gap-3.5 shadow-inner">
                    <div className="p-1.5 bg-white rounded-xl shadow-md shrink-0">
                      <QRCodeSVG
                        value={targetUrl}
                        size={84}
                        level="M"
                        includeMargin={false}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold block flex items-center gap-1">
                        <QrCode size={12} /> Escanea con tu celular
                      </span>
                      <p className="text-[11px] text-cream/70 font-sans leading-tight mt-0.5">
                        Apunta tu cámara aquí para abrir la experiencia directa sin escribir nada.
                      </p>
                      <span className="text-[9px] font-mono text-cream/40 truncate block mt-1">
                        {targetUrl.replace(/^https?:\/\//, '')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de Acción al Pie */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-white/20 hover:border-gold hover:bg-white/5 text-xs text-cream/70 hover:text-cream transition-all font-mono cursor-pointer"
                >
                  Continuar en este navegador de PC
                </button>

                <div className="flex items-center gap-2 text-xs text-gold font-mono">
                  <span>Guatemala Inmersiva</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
