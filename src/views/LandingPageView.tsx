import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Compass, 
  QrCode, 
  Trophy, 
  Sparkles, 
  KeyRound, 
  ChevronDown, 
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  Drama,
  Menu,
  X,
  MessageCircle,
  Ticket,
  BookOpen,
  ExternalLink,
  Shield,
  Layers,
  Phone,
  Handshake,
  Users,
  Smartphone,
  Box,
  Dices
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button, Card } from '../components/Theme';
import { LEYENDAS_DATA } from '../services/legendService';
import { sound } from '../lib/audio';
import { 
  LandingContent, 
  DEFAULT_LANDING_CONTENT, 
  fetchSiteContent, 
  getLocalContent 
} from '../services/contentService';

// Elementos Gráficos PNG y SVG del proyecto
import portadaPng from '../images/png/Portada.png';
import solPng from '../images/png/Sol.png';
import nubeIzqPng from '../images/png/Nube izquierda.png';
import nubeDerPng from '../images/png/Nube derecha.png';
import juegoPapel3dImg from '../images/png/juego 3d papel.jpg';

import candadoOroPng from '../images/png/Candado oro.png';
import candadoPlataPng from '../images/png/Candado plata.png';
import candadoJadePng from '../images/png/Candado jade.png';
import candadoVidaPng from '../images/png/Candado vida.png';
import llaveOroPng from '../images/png/Llave oro.png';

import logoPng from '../images/logo.png';
import fondoSvg from '../images/optimized/Fondo.svg';

import { MysticKey } from '../components/svgs/MysticKey';
import { PassportStampSvg } from '../components/svgs/PassportStampSvg';

interface LandingPageViewProps {
  onEnterGame: () => void;
  onEnterExplorer: () => void;
  onEnterLiveTheater?: () => void;
  onEnterMayordomo?: () => void;
}

const LOCK_IMAGES: Record<string, string> = {
  oro: candadoOroPng,
  plata: candadoPlataPng,
  jade: candadoJadePng,
  vida: candadoVidaPng
};

const WHATSAPP_NUMBER = '50246741239';
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Casa%20de%20las%20Leyendas,%20deseo%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20evento%20y%20el%20juego%20de%20mesa.`;

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onEnterGame,
  onEnterExplorer,
  onEnterLiveTheater,
  onEnterMayordomo
}) => {
  const [content, setContent] = useState<LandingContent>(() => getLocalContent().landing);
  const [selectedTeaser, setSelectedTeaser] = useState<string | null>(null);
  const [unlockedLocks, setUnlockedLocks] = useState<Record<string, boolean>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchSiteContent().then((res) => {
      if (res?.landing) {
        setContent(res.landing);
      }
    });
  }, []);

  const handleUnlockLock = (lockId: string) => {
    sound.playMysticChime();
    setUnlockedLocks((prev) => ({
      ...prev,
      [lockId]: !prev[lockId]
    }));
  };

  const scrollToSection = (id: string) => {
    sound.playClick();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-obsidian text-cream font-sans overflow-x-hidden relative selection:bg-gold selection:text-obsidian">
      
      {/* Fondo Gráfico SVG Optimizado y Efectos de Iluminación */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <img 
          src={fondoSvg} 
          alt="Fondo Místico" 
          className="w-full h-full object-cover mix-blend-screen scale-105"
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-gold/15 via-maya-red/10 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Barra de Navegación de la Landing (Optimizada para Móviles con Menú Desplegable) */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-obsidian/95 border-b border-gold/30 px-3 sm:px-4 py-2.5 sm:py-3.5 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          
          {/* Logo y Título Responsive */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img 
              src={logoPng} 
              alt="Casa de las Leyendas" 
              className="w-8 h-8 sm:w-11 sm:h-11 object-contain drop-shadow-[0_0_10px_rgba(190,141,44,0.5)] shrink-0"
            />
            <div className="flex flex-col text-left min-w-0">
              <span className="font-display text-xs xs:text-sm sm:text-base tracking-wider sm:tracking-widest text-gold font-bold leading-tight truncate">
                {content.brandTitle}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-cream/70 hidden xs:inline leading-none mt-0.5">
                {content.brandSubtitle}
              </span>
            </div>
          </div>

          {/* Toggle del Menú */}
          <div className="flex items-center gap-2 shrink-0">
            {/* BOTÓN DEL MENÚ DESPLEGABLE */}
            <button
              onClick={() => {
                sound.playClick();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Cerrar Menú de Navegación" : "Abrir Menú de Navegación"}
              className={`py-1.5 px-3.5 sm:py-2 sm:px-4 rounded-xl border transition-all cursor-pointer flex items-center gap-2 font-display text-xs sm:text-sm font-bold active:scale-95 shadow-md ${
                isMobileMenuOpen
                  ? 'bg-gold text-obsidian border-gold shadow-[0_0_16px_rgba(203,161,67,0.6)]'
                  : 'bg-gold/15 hover:bg-gold/25 text-amber-300 border-gold/50 hover:border-gold shadow-[0_0_12px_rgba(190,141,44,0.25)]'
              }`}
            >
              {isMobileMenuOpen ? <X size={18} className="stroke-[2.5]" /> : <Menu size={18} />}
              <span>{isMobileMenuOpen ? 'CERRAR' : 'MENÚ'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MENÚ DESPLEGABLE EN COLUMNA DESDE LA IZQUIERDA */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Telón / Backdrop oscuro con desenfoque para aislar y concentrar la lectura */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => {
                sound.playClick();
                setIsMobileMenuOpen(false);
              }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer z-40"
            />

            {/* Columna Lateral Desplegable desde la Izquierda */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="relative z-50 w-[310px] xs:w-[350px] sm:w-[410px] max-w-[88vw] h-full bg-[#130d07] border-r-2 border-gold/75 shadow-[25px_0_70px_rgba(0,0,0,0.98),0_0_40px_rgba(203,161,67,0.25)] backdrop-blur-2xl p-5 sm:p-6 flex flex-col justify-between overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(203,161,67,0.4)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gold/40 [&::-webkit-scrollbar-thumb]:rounded-full text-left select-none space-y-6"
            >
              <div className="space-y-6">
                {/* Cabecera de la Columna con Alto Contraste */}
                <div className="flex items-center justify-between border-b border-gold/30 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/50 flex items-center justify-center p-1.5 shadow-[0_0_12px_rgba(203,161,67,0.25)] shrink-0">
                      <img src={logoPng} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-sm sm:text-base font-bold text-amber-300 tracking-wider truncate">
                        LA CASA DE LAS LEYENDAS
                      </h3>
                      <p className="text-xs text-stone-300 font-sans truncate">
                        Directorio & Atajos
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-1.5 sm:p-2 rounded-xl bg-stone-900/80 hover:bg-gold/20 text-stone-300 hover:text-amber-200 border border-stone-700/60 hover:border-gold transition-colors cursor-pointer shrink-0 ml-2"
                    title="Cerrar menú"
                    aria-label="Cerrar menú"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* GRUPO 1: EXPERIENCIA DIGITAL Y JUEGO */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-display uppercase tracking-wider bg-amber-200/80 text-amber-950 border border-amber-500/50">
                      🎮 Juego Digital & Salas
                    </span>
                    <div className="h-px bg-gold/20 flex-1" />
                  </div>

                  <div className="flex flex-col gap-2">
                    {/* Entrar al Juego */}
                    <button
                      onClick={() => {
                        sound.playMysticChime();
                        setIsMobileMenuOpen(false);
                        onEnterGame();
                      }}
                      className="group p-3 sm:p-3.5 rounded-xl bg-[#fbf7ee] hover:bg-white border-2 border-gold/60 hover:border-gold shadow-md hover:shadow-[0_0_15px_rgba(203,161,67,0.4)] flex items-center justify-between text-left transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-gold/30 border border-gold/70 flex items-center justify-center text-amber-900 group-hover:scale-105 transition-transform shrink-0">
                          <Play size={18} className="fill-amber-900" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm font-display font-bold text-[#1f1309] block truncate">
                            Entrar al Juego / Sala
                          </span>
                          <span className="text-xs text-[#4a3421] block truncate">
                            Partidas en vivo y anfitrión
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-amber-800/70 group-hover:text-amber-900 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </button>

                    {/* Modo Explorador / Pasaporte */}
                    <button
                      onClick={() => {
                        sound.playClick();
                        setIsMobileMenuOpen(false);
                        onEnterExplorer();
                      }}
                      className="group p-3 sm:p-3.5 rounded-xl bg-[#fbf7ee] hover:bg-white border-2 border-gold/60 hover:border-gold shadow-md hover:shadow-[0_0_15px_rgba(203,161,67,0.4)] flex items-center justify-between text-left transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 border border-emerald-500/60 flex items-center justify-center text-emerald-800 group-hover:scale-105 transition-transform shrink-0">
                          <Compass size={18} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm font-display font-bold text-[#1f1309] block truncate">
                            Modo Pasaporte
                          </span>
                          <span className="text-xs text-[#4a3421] block truncate">
                            Exploración offline y sellos
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-amber-800/70 group-hover:text-amber-900 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </button>
                  </div>
                </div>

                {/* GRUPO 2: PRODUCCIÓN TEATRAL EN VIVO */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-display uppercase tracking-wider bg-rose-200/80 text-rose-950 border border-rose-500/50">
                      🎭 Producción Teatral Xela
                    </span>
                    <div className="h-px bg-rose-900/30 flex-1" />
                  </div>

                  <div className="flex flex-col gap-2">
                    {/* Obra Teatral */}
                    <a
                      href="/rutadeleyendas"
                      onClick={(e) => {
                        if (onEnterLiveTheater) e.preventDefault();
                        sound.playClick();
                        setIsMobileMenuOpen(false);
                        onEnterLiveTheater?.();
                      }}
                      className="group p-3 rounded-xl bg-[#fbf7ee] hover:bg-white border-2 border-rose-900/30 hover:border-rose-500 shadow-md transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-rose-100 border border-rose-400 flex items-center justify-center text-rose-800 shrink-0">
                          <Drama size={16} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs sm:text-sm font-display font-bold text-[#1f1309] block truncate">
                            Ruta de Leyendas
                          </span>
                          <span className="text-[11px] sm:text-xs text-[#4a3421] block truncate">
                            31 de Octubre • Teatro Municipal
                          </span>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-rose-800 shrink-0 ml-1" />
                    </a>

                    {/* Boletería y Planes */}
                    <a
                      href="/rutadeleyendas#boleteria"
                      onClick={(e) => {
                        if (onEnterLiveTheater) e.preventDefault();
                        sound.playClick();
                        setIsMobileMenuOpen(false);
                        onEnterLiveTheater?.();
                      }}
                      className="group p-3 rounded-xl bg-[#fbf7ee] hover:bg-white border-2 border-gold/60 hover:border-gold shadow-md transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-400 flex items-center justify-center text-amber-800 shrink-0">
                          <Ticket size={16} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs sm:text-sm font-display font-bold text-[#1f1309] block truncate">
                            Boletería & Planes
                          </span>
                          <span className="text-[11px] sm:text-xs text-[#4a3421] block truncate">
                            Jade, Vida, Oro y Plata
                          </span>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-amber-800 shrink-0 ml-1" />
                    </a>

                    {/* Patrocinios */}
                    <a
                      href="/rutadeleyendas#patrocinios"
                      onClick={(e) => {
                        if (onEnterLiveTheater) e.preventDefault();
                        sound.playClick();
                        setIsMobileMenuOpen(false);
                        onEnterLiveTheater?.();
                      }}
                      className="group p-3 rounded-xl bg-[#fbf7ee] hover:bg-white border-2 border-gold/60 hover:border-gold shadow-md transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-400 flex items-center justify-center text-amber-800 shrink-0">
                          <Handshake size={16} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs sm:text-sm font-display font-bold text-[#1f1309] block truncate">
                            Patrocinios & Marcas
                          </span>
                          <span className="text-[11px] sm:text-xs text-[#4a3421] block truncate">
                            Alianzas y marcas en Xela
                          </span>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-amber-800 shrink-0 ml-1" />
                    </a>
                  </div>
                </div>

                {/* GRUPO 3: NAVEGACIÓN EN LA LANDING */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-display uppercase tracking-wider bg-stone-200 text-stone-900 border border-stone-400">
                      📜 Secciones de la Página
                    </span>
                    <div className="h-px bg-stone-700 flex-1" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => scrollToSection('hibrido')}
                      className="p-2.5 rounded-xl bg-[#fbf7ee] hover:bg-white border-2 border-gold/50 hover:border-gold transition-all text-left cursor-pointer group"
                    >
                      <Layers size={15} className="text-amber-800 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-display font-bold text-[#1f1309] block truncate">Cartón + App</span>
                      <span className="text-[11px] text-amber-900 leading-tight block truncate">Juego Híbrido</span>
                    </button>

                    <button
                      onClick={() => scrollToSection('candados')}
                      className="p-2.5 rounded-xl bg-[#fbf7ee] hover:bg-white border-2 border-gold/50 hover:border-gold transition-all text-left cursor-pointer group"
                    >
                      <KeyRound size={15} className="text-amber-800 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-display font-bold text-[#1f1309] block truncate">4 Candados</span>
                      <span className="text-[11px] text-[#4a3421] leading-tight block truncate">Secretos</span>
                    </button>

                    <button
                      onClick={() => scrollToSection('pilares')}
                      className="p-2.5 rounded-xl bg-[#fbf7ee] hover:bg-white border-2 border-gold/50 hover:border-gold transition-all text-left cursor-pointer group"
                    >
                      <Sparkles size={15} className="text-amber-800 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-display font-bold text-[#1f1309] block truncate">Mecánicas</span>
                      <span className="text-[11px] text-[#4a3421] leading-tight block truncate">3 Pilares</span>
                    </button>

                    <button
                      onClick={() => scrollToSection('catalogo')}
                      className="p-2.5 rounded-xl bg-[#fbf7ee] hover:bg-white border-2 border-gold/50 hover:border-gold transition-all text-left cursor-pointer group"
                    >
                      <BookOpen size={15} className="text-amber-800 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-display font-bold text-[#1f1309] block truncate">7 Leyendas</span>
                      <span className="text-[11px] text-[#4a3421] leading-tight block truncate">Catálogo</span>
                    </button>

                    <a
                      href="/mayordomo"
                      onClick={(e) => {
                        if (onEnterMayordomo) e.preventDefault();
                        sound.playClick();
                        setIsMobileMenuOpen(false);
                        onEnterMayordomo?.();
                      }}
                      className="col-span-2 p-2.5 rounded-xl bg-[#fbf7ee] hover:bg-white border-2 border-gold/50 hover:border-gold transition-all text-left cursor-pointer group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Shield size={15} className="text-amber-800 group-hover:scale-110 transition-transform" />
                        <div>
                          <span className="text-xs font-display font-bold text-[#1f1309] block leading-tight">Mayordomo</span>
                          <span className="text-[10px] text-[#4a3421] leading-tight block">Panel de Administración CMS</span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-amber-800 group-hover:text-amber-950" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Pie de la Columna con texto de lectura clara */}
              <div className="pt-4 border-t border-gold/25 text-center space-y-1 text-xs text-stone-300">
                <p className="font-serif italic text-amber-200/90">
                  La Casa de las Leyendas • Guatemala
                </p>
                <p className="font-mono text-[11px] text-amber-400/80">
                  lacasadelasleyendas.com
                </p>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* HERO SECTION CON PORTADA, SOL Y NUBES CELESTIALES */}
      <section className="relative z-10 pt-6 pb-16 px-3 sm:px-4 max-w-6xl mx-auto text-center flex flex-col items-center w-full box-border overflow-hidden sm:overflow-visible">
        
        {/* Banner Destacado: Obra en Vivo en Teatro Municipal */}
        <motion.a
          href="/rutadeleyendas"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            if (onEnterLiveTheater) {
              e.preventDefault();
            }
            sound.playClick();
            onEnterLiveTheater?.();
          }}
          className="w-full max-w-xl mx-auto mb-6 p-2.5 sm:p-3.5 rounded-2xl bg-[#fbf7ee] border-2 border-gold/80 cursor-pointer shadow-[0_10px_25px_rgba(0,0,0,0.55)] flex items-center gap-2.5 sm:gap-3 text-left group box-border overflow-hidden hover:bg-white transition-all"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-200/80 flex items-center justify-center text-amber-900 shrink-0 border border-gold/70 shadow-sm">
            <Drama size={18} className="text-amber-900 group-hover:rotate-12 transition-transform" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] sm:text-[11px] uppercase font-display font-bold tracking-widest text-[#faf5ea] bg-earth-brown px-2 py-0.5 rounded border border-gold/50 shadow-xs">
                {content.bannerBadge}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-display text-[#1f1309] font-bold leading-tight mt-1 break-words line-clamp-2 sm:line-clamp-none">
              {content.bannerTitle}
            </p>
          </div>
          <div className="hidden xs:flex items-center text-amber-800 group-hover:text-amber-950 shrink-0 pl-1">
            <ExternalLink size={14} />
          </div>
        </motion.a>

        {/* Composición Celestial: Sol flotante y Nubes */}
        <div className="relative w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto mb-6 flex items-center justify-center overflow-hidden sm:overflow-visible py-2">
          {/* Nube izquierda flotante */}
          <motion.img
            src={nubeIzqPng}
            alt="Nube Mística Izquierda"
            animate={{ x: [-6, 6, -6], y: [-3, 3, -3] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-0 sm:-left-10 md:-left-16 lg:-left-24 top-2 w-20 sm:w-32 md:w-40 lg:w-48 opacity-85 pointer-events-none drop-shadow-md z-20"
          />

          {/* Sol resplandeciente central */}
          <motion.img
            src={solPng}
            alt="Sol Ancestral Maya"
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="w-28 h-28 sm:w-44 sm:h-44 md:w-52 md:h-52 object-contain drop-shadow-[0_0_35px_rgba(252,207,101,0.6)] z-10 select-none"
          />

          {/* Nube derecha flotante */}
          <motion.img
            src={nubeDerPng}
            alt="Nube Mística Derecha"
            animate={{ x: [6, -6, 6], y: [3, -3, 3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-0 sm:-right-10 md:-right-16 lg:-right-24 top-4 w-20 sm:w-32 md:w-40 lg:w-48 opacity-85 pointer-events-none drop-shadow-md z-20"
          />
        </div>

        {/* Badge del Hero */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs sm:text-sm font-display tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(190,141,44,0.3)] max-w-full truncate"
        >
          <Sparkles size={16} className="shrink-0" />
          <span className="truncate">{content.heroBadge}</span>
        </motion.div>

        {/* Título Principal */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-display text-gold tracking-tight leading-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] max-w-4xl"
        >
          {content.heroTitle} <br />
          <span className="text-cream italic font-serif text-3xl sm:text-5xl md:text-6xl block mt-2 font-normal">
            {content.heroTitleItalic}
          </span>
        </motion.h1>

        {/* Portada Personalizable (si existe) */}
        {content.heroCoverImageUrl && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="relative max-w-2xl mx-auto mt-6 mb-2 group w-full px-2"
          >
            <div className="absolute -inset-1.5 bg-gradient-to-r from-gold via-maya-red to-gold rounded-2xl md:rounded-3xl blur-xl opacity-45 group-hover:opacity-80 transition duration-700 pointer-events-none" />
            <div className="relative rounded-2xl overflow-hidden border-2 border-gold/60 shadow-[0_0_40px_rgba(190,141,44,0.4)] bg-black/80">
              <img
                src={content.heroCoverImageUrl}
                alt="Portada La Casa de las Leyendas"
                className="w-full h-auto object-contain max-h-[380px] sm:max-h-[460px] mx-auto hover:scale-[1.01] transition-transform duration-500"
              />
            </div>
          </motion.div>
        )}

        {/* Descripción Editorial */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-cream/90 font-serif italic max-w-2xl leading-relaxed"
        >
          "{content.heroDescription}"
        </motion.p>

        {/* Botones de Acción */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4"
        >
          <Button
            onClick={() => {
              sound.playMysticChime();
              onEnterGame();
            }}
            size="lg"
            className="w-full sm:w-auto px-8 py-4 text-base sm:text-lg flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(190,141,44,0.6)] text-obsidian bg-gradient-to-r from-gold via-cream to-gold font-bold hover:scale-105 rounded-xl transition-all"
          >
            <Play size={20} className="fill-obsidian" />
            <span>{content.playButtonText || 'ENTRAR AL JUEGO'}</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              sound.playClick();
              onEnterGame();
            }}
            size="lg"
            className="w-full sm:w-auto px-8 py-4 text-base sm:text-lg flex items-center justify-center gap-3 border-gold text-gold hover:bg-gold/15 rounded-xl transition-all"
          >
            <Users size={20} />
            <span>UNIRSE A SALA</span>
          </Button>
        </motion.div>

        {/* ANUNCIO MÍSTICO PARA VERSIÓN WEB DE ESCRITORIO: CANDADO, LLAVE Y QR PARA EXPERIENCIA MÓVIL */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="hidden md:flex mt-10 max-w-2xl w-full mx-auto p-4 rounded-2xl bg-[#fbf7ee] border-2 border-gold/80 shadow-[0_12px_30px_rgba(0,0,0,0.55)] items-center justify-between gap-4 text-left relative overflow-hidden select-none"
        >
          {/* Resplandor dorado de fondo */}
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />

          {/* Candado y Llave de Oro Místicos */}
          <div className="flex items-center gap-3.5 shrink-0 pl-1">
            <div className="relative w-14 h-14 flex items-center justify-center rounded-xl bg-amber-200/60 border border-gold/60 p-2 shadow-xs">
              <motion.img 
                src={candadoOroPng} 
                alt="Candado de Oro" 
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-11 h-11 object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]" 
              />
              <motion.img 
                src={llaveOroPng} 
                alt="Llave de Oro" 
                animate={{ rotate: [-15, 10, -15], x: [-3, 2, -3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-7 h-7 object-contain absolute -bottom-1 -right-1 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]" 
              />
            </div>
            <div className="max-w-[340px]">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-950 font-bold flex items-center gap-1">
                  <Smartphone size={12} /> Mejor en tu Teléfono Móvil
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-earth-brown text-cream font-mono font-bold border border-gold/40">
                  Recomendado
                </span>
              </div>
              <p className="text-xs text-[#3b2a1a] font-serif leading-snug mt-1">
                Para escanear cartas físicas, activar retos de cámara y vivir el audio sensorial, abre la experiencia desde tu móvil.
              </p>
            </div>
          </div>

          {/* Mini QR para escaneo instantáneo directo desde la pantalla */}
          <div className="flex items-center gap-2.5 shrink-0 bg-[#f0e4ce] border border-gold/60 p-2 rounded-xl shadow-xs">
            <div className="p-1 bg-white rounded-lg border border-gold/40 shadow-xs">
              <QRCodeSVG 
                value={typeof window !== 'undefined' ? `${window.location.origin}/juego` : 'https://lacasadelasleyendas.com/juego'} 
                size={54} 
                level="M" 
              />
            </div>
            <div className="text-[10px] font-mono text-amber-950 leading-tight">
              <span className="block font-bold">ESCANEA</span>
              <span className="text-[9px] text-[#523c28] block font-sans">Con tu cámara</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECCIÓN NUEVA: EL JUEGO HÍBRIDO (EL CARTÓN FÍSICO EN PAPEL Y LA MAGIA DIGITAL) */}
      <section id="hibrido" className="relative z-10 py-16 px-4 max-w-6xl mx-auto border-t border-gold/20">
        <div className="text-center space-y-2 mb-10 sm:mb-12">
          <span className="text-xs sm:text-sm font-display text-gold tracking-widest uppercase flex items-center justify-center gap-2 font-bold">
            <Layers size={16} className="text-gold" /> {content.hybridSectionBadge || 'Experiencia de Mesa Híbrida'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-display text-cream tracking-wide">
            {content.hybridSectionTitle || 'EL CARTÓN FÍSICO Y LA MAGIA DIGITAL'}
          </h2>
          <p className="text-sm sm:text-base text-cream/80 font-serif italic max-w-2xl mx-auto leading-relaxed px-2">
            {content.hybridSectionSubtitle || 'Lo mejor de dos mundos: la calidez de reunirse en familia alrededor de un tablero tangible combinada con la emoción inmersiva de la tecnología.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* LADO VISUAL: FOTOGRAFÍA DEL CARTÓN FÍSICO EN PAPEL 3D */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl overflow-hidden border-2 border-gold/60 bg-gradient-to-b from-[#1c150c] to-[#0a0704] shadow-[0_0_50px_rgba(206,136,34,0.35),0_20px_50px_rgba(0,0,0,0.85)] group">
              {/* Resplandor áureo decorativo de fondo */}
              <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-gold/15 blur-3xl pointer-events-none" />

              {/* Imagen del Cartón Físico en Papel */}
              <img
                src={juegoPapel3dImg}
                alt="Juego de Mesa Físico en Cartón y Papel - La Casa de las Leyendas"
                className="w-full h-auto max-h-[460px] object-cover object-center group-hover:scale-105 transition-transform duration-700 select-none"
              />

              {/* Insignia superior flotante */}
              <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-md border border-gold/60 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold tracking-wider text-amber-300 flex items-center gap-1.5 shadow-lg">
                <Sparkles size={13} className="text-gold animate-spin" />
                <span>TABLERO FÍSICO EN CARTÓN</span>
              </div>

              {/* Pie de foto descriptivo integrado en la imagen */}
              <div className="absolute bottom-3 left-3 right-3 bg-[#fbf7ee]/95 backdrop-blur-md border-2 border-gold/70 rounded-2xl p-3 sm:p-4 text-left shadow-xl">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gold/30 border border-gold/70 flex items-center justify-center text-amber-900 shrink-0">
                      <Box size={16} />
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-display font-bold text-[#1f1309] block leading-tight">
                        Material de Alta Calidad
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-[#4a3421] font-sans block">
                        Tablero plegable, cartas ilustradas, fichas coleccionables y dados
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-amber-950 bg-amber-200/80 border border-gold/50 px-2 py-0.5 rounded-md hidden xs:inline shrink-0 font-bold">
                    Edición Especial
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* LADO CONCEPTUAL: 3 PILARES DE LA EXPERIENCIA HÍBRIDA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 space-y-4 text-left"
          >
            {/* Pilar 1: Lo Físico */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#fbf7ee] border-2 border-amber-600/40 hover:border-gold transition-colors relative overflow-hidden group shadow-md">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-200/80 border border-amber-600/50 flex items-center justify-center text-amber-900 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  <Dices size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-display font-bold text-[#1f1309]">
                    {content.hybridBoardTitle || '1. El Cartón Físico en Papel'}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#3a2717] font-sans leading-relaxed">
                    {content.hybridBoardDescription || 'La emoción de tirar los dados, tocar tus cartas ilustradas, mover tu ficha sobre el mapa colonial y compartir miradas y risas reales con quienes tienes enfrente.'}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-[10px] font-mono font-bold text-amber-950 bg-amber-200/70 px-2 py-0.5 rounded border border-amber-500/40">
                      ✓ Sin pantallas que aíslen
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-950 bg-amber-200/70 px-2 py-0.5 rounded border border-amber-500/40">
                      ✓ Conexión familiar cara a cara
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pilar 2: Lo Digital */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#fbf7ee] border-2 border-indigo-400/40 hover:border-indigo-600 transition-colors relative overflow-hidden group shadow-md">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-300 flex items-center justify-center text-indigo-900 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  <Smartphone size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-display font-bold text-[#151a3d]">
                    {content.hybridDigitalTitle || '2. Portal Interactivo en tu Móvil'}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#3a2717] font-sans leading-relaxed">
                    {content.hybridDigitalDescription || 'Apunta tu cámara a las cartas o casillas para activar pruebas contra reloj, acertijos con audio, retos de mímica y ganar llaves sagradas en tiempo real.'}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-[10px] font-mono font-bold text-indigo-950 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-300">
                      ✓ Escaneo QR instantáneo
                    </span>
                    <span className="text-[10px] font-mono font-bold text-indigo-950 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-300">
                      ✓ Efectos y sonidos místicos
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pilar 3: La Fusión */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#fbf7ee] border-2 border-emerald-500/40 hover:border-emerald-700 transition-colors relative overflow-hidden group shadow-md">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-400 flex items-center justify-center text-emerald-900 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  <Sparkles size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-display font-bold text-[#0c291b]">
                    {content.hybridUnionTitle || '3. Conexión Real sin Barreras'}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#3a2717] font-sans leading-relaxed">
                    {content.hybridUnionDescription || 'Sin descargas pesadas ni registros complejos. Un juego de mesa tradicional que cobra vida propia para crear momentos memorables en cualquier hogar.'}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-[10px] font-mono font-bold text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      ✓ Funciona en cualquier navegador
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      ✓ Para todas las edades
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de Acción de la Sección */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Button
                onClick={() => {
                  sound.playMysticChime();
                  onEnterGame();
                }}
                className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-gold via-cream to-gold text-obsidian rounded-xl shadow-[0_0_20px_rgba(190,141,44,0.5)] hover:scale-105 transition-transform"
              >
                <Play size={15} className="fill-obsidian" />
                <span>PROBAR APP DEL JUEGO</span>
              </Button>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="w-full sm:w-auto px-5 py-3 text-xs sm:text-sm font-display font-bold inline-flex items-center justify-center gap-2 border border-emerald-500/70 bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-200 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                <MessageCircle size={15} className="text-emerald-400" />
                <span>CONSULTAR POR EL JUEGO FÍSICO</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN EDUCATIVA: DESCUBRE QUÉ HAY DETRÁS DE CADA CANDADO */}
      <section id="candados" className="relative z-10 py-14 px-4 max-w-6xl mx-auto border-t border-gold/20">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs sm:text-sm font-display text-gold tracking-widest uppercase flex items-center justify-center gap-1.5 font-bold">
            <KeyRound size={16} /> {content.locksSectionBadge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-display text-cream tracking-wide">
            {content.locksSectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-cream/80 font-serif italic max-w-2xl mx-auto leading-relaxed px-2">
            {content.locksSectionDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.locks.map((lock) => {
            const isUnlocked = !!unlockedLocks[lock.id];
            const lockImg = LOCK_IMAGES[lock.type] || candadoOroPng;

            return (
              <div 
                key={lock.id}
                className={`p-6 space-y-4 border-2 transition-all duration-500 relative overflow-hidden flex flex-col justify-between rounded-2xl ${
                  isUnlocked 
                    ? `border-gold bg-[#fbf7ee] shadow-[0_15px_35px_rgba(203,161,67,0.4)]` 
                    : `border-gold/60 bg-[#faf4e6] hover:border-gold shadow-lg`
                }`}
              >
                <div className="space-y-3.5">
                  {/* Ilustración del Candado PNG y Badge */}
                  <div className="flex items-center justify-between">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gold/25 blur-md rounded-full" />
                      <img 
                        src={lockImg} 
                        alt={lock.name} 
                        className={`w-16 h-16 object-contain transition-transform duration-500 ${
                          isUnlocked ? 'scale-110 drop-shadow-[0_0_15px_rgba(203,161,67,0.8)]' : 'opacity-95 drop-shadow-md'
                        }`}
                      />
                    </div>

                    <span className={`text-xs font-display uppercase tracking-wider px-2.5 py-1 rounded-lg border-2 font-bold shadow-xs ${lock.badgeBg}`}>
                      {lock.name}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-base sm:text-lg text-[#1f1309] font-bold leading-snug">
                      {lock.subtitle}
                    </h3>
                    <span className="text-xs text-amber-900 font-serif italic block mt-1 font-semibold">
                      Leyendas: {lock.associatedLegends.join(', ')}
                    </span>
                  </div>

                  <div className="p-3.5 bg-[#ede1c7] rounded-xl border border-[#d6be96] text-sm text-[#241508] font-serif italic leading-relaxed shadow-inner">
                    "{lock.question}"
                  </div>

                  {/* Contenido Revelado al Abrir el Candado */}
                  <AnimatePresence>
                    {isUnlocked && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 pt-2.5 border-t border-gold/40 text-sm font-serif"
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-display uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 font-bold">
                            <CheckCircle2 size={14} className="text-emerald-700" /> Revelación Ancestral:
                          </span>
                          <p className="text-[#1f1309] italic text-sm leading-relaxed">
                            {lock.answer}
                          </p>
                        </div>

                        <div className="p-3 bg-[#ede1c7] rounded-xl border border-[#d6be96] space-y-1 shadow-inner">
                          <span className="text-xs font-display uppercase tracking-widest text-amber-950 flex items-center gap-1.5 font-bold">
                            <Lightbulb size={13} className="text-amber-800" /> Contexto Histórico:
                          </span>
                          <p className="text-[#241508] text-xs sm:text-sm leading-relaxed">
                            {lock.culturalInsight}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Botón de Giro de Llave */}
                <button
                  onClick={() => handleUnlockLock(lock.id)}
                  className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-display flex items-center justify-center gap-2 border transition-all cursor-pointer mt-4 font-bold shadow-md ${
                    isUnlocked
                      ? 'bg-gold/30 text-amber-950 border-gold/70 hover:bg-gold/45'
                      : 'bg-earth-brown hover:bg-gold text-cream hover:text-obsidian border-gold/60'
                  }`}
                >
                  <MysticKey isTurned={isUnlocked} size={18} />
                  <span>{isUnlocked ? 'Cerrar Secreto' : 'Girar Llave de Oro'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* PILARES DE LA EXPERIENCIA */}
      <section id="pilares" className="relative z-10 py-14 px-4 max-w-6xl mx-auto border-t border-gold/20">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs sm:text-sm font-display text-gold tracking-widest uppercase font-bold">
            {content.pillarsSectionBadge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-display text-gold">
            {content.pillarsSectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-cream/80 font-serif italic max-w-xl mx-auto px-2">
            {content.pillarsSectionDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 space-y-4 border-2 border-gold/60 hover:border-gold transition-all hover:scale-[1.02] rounded-2xl bg-[#fbf7ee] shadow-[0_12px_35px_rgba(0,0,0,0.6)]">
            <div className="w-14 h-14 rounded-2xl bg-amber-200/80 border border-gold/70 flex items-center justify-center text-amber-900 shadow-sm">
              <QrCode size={28} />
            </div>
            <h3 className="text-lg font-display text-[#1f1309] font-bold">{content.pillar1Title}</h3>
            <p className="text-sm text-[#3a2717] font-serif leading-relaxed">
              {content.pillar1Description}
            </p>
          </div>

          <div className="p-6 space-y-4 border-2 border-gold/60 hover:border-gold transition-all hover:scale-[1.02] rounded-2xl bg-[#fbf7ee] shadow-[0_12px_35px_rgba(0,0,0,0.6)]">
            <div className="w-14 h-14 rounded-2xl bg-rose-200/80 border border-rose-400 flex items-center justify-center text-rose-900 shadow-sm">
              <Sparkles size={28} />
            </div>
            <h3 className="text-lg font-display text-[#1f1309] font-bold">{content.pillar2Title}</h3>
            <p className="text-sm text-[#3a2717] font-serif leading-relaxed">
              {content.pillar2Description}
            </p>
          </div>

          <div className="p-6 space-y-4 border-2 border-gold/60 hover:border-gold transition-all hover:scale-[1.02] rounded-2xl bg-[#fbf7ee] shadow-[0_12px_35px_rgba(0,0,0,0.6)]">
            <div className="w-14 h-14 rounded-2xl bg-amber-200/80 border border-amber-400 flex items-center justify-center text-amber-900 shadow-sm">
              <Trophy size={28} />
            </div>
            <h3 className="text-lg font-display text-[#1f1309] font-bold">{content.pillar3Title}</h3>
            <p className="text-sm text-[#3a2717] font-serif leading-relaxed">
              {content.pillar3Description}
            </p>
          </div>
        </div>
      </section>

      {/* RECORRIDO DE LEYENDAS CON SELLOS */}
      <section id="catalogo" className="relative z-10 py-14 px-4 max-w-6xl mx-auto border-t border-gold/20">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs sm:text-sm font-display text-gold tracking-widest uppercase font-bold">
            Catálogo Místico
          </span>
          <h2 className="text-2xl sm:text-4xl font-display text-cream">
            LAS 7 LEYENDAS ANCESTRALES
          </h2>
          <p className="text-sm sm:text-base text-cream/75 font-serif italic">
            Toca cualquiera de las estaciones para descubrir su historia:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LEYENDAS_DATA.map((legend) => (
            <motion.div
              key={legend.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                sound.playClick();
                setSelectedTeaser(selectedTeaser === legend.id ? null : legend.id);
              }}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                selectedTeaser === legend.id
                  ? 'border-gold bg-[#fbf7ee] shadow-[0_15px_35px_rgba(203,161,67,0.45)]'
                  : 'border-gold/60 bg-[#faf4e6] hover:border-gold shadow-lg'
              }`}
            >
              <div className="flex items-start gap-4">
                <PassportStampSvg
                  code={legend.code}
                  name={legend.name}
                  isUnlocked={true}
                  size={58}
                  imageUrl={content.legendFichasImages?.[legend.id]}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-mono text-amber-950 font-bold">{legend.code}</span>
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-amber-200/80 text-amber-950 border border-amber-600/40 font-mono font-bold shadow-xs">
                      {legend.difficulty}
                    </span>
                  </div>
                  <h4 className="font-display text-base font-bold text-[#1f1309] truncate mt-1">
                    {legend.name}
                  </h4>
                  <p className="text-xs text-amber-900 font-serif italic line-clamp-1 font-semibold">
                    {legend.title}
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#3a2717] font-serif italic mt-3 line-clamp-2 leading-relaxed">
                "{legend.shortDescription}"
              </p>

              {/* Detalle Expandible al Tocar */}
              <AnimatePresence>
                {selectedTeaser === legend.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-gold/40 text-xs space-y-2"
                  >
                    <p className="text-[#241508] font-serif leading-relaxed text-xs sm:text-sm">
                      {legend.fullStory}
                    </p>
                    <div className="p-2.5 rounded-lg bg-[#ede1c7] border border-amber-600/40 text-[11px] sm:text-xs text-amber-950 shadow-inner">
                      ✨ <strong>Dato Curioso:</strong> {legend.didYouKnow}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BANNER CTA INFERIOR */}
      <section className="relative z-10 py-16 px-4 max-w-4xl mx-auto text-center">
        <div className="p-8 sm:p-12 space-y-6 border-2 border-gold bg-gradient-to-b from-[#fdfbf6] via-[#fbf7ee] to-[#ede1c7] relative overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] rounded-3xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/20 blur-3xl rounded-full pointer-events-none" />

          <span className="text-xs sm:text-sm font-display text-amber-950 uppercase tracking-widest block font-bold bg-amber-200/70 inline-block px-3 py-1 rounded-full border border-amber-500/40 shadow-xs">
            {content.ctaBadge}
          </span>

          <h2 className="text-2xl sm:text-4xl font-display text-[#1f1309] tracking-wide font-bold">
            {content.ctaTitle}
          </h2>

          <p className="text-sm sm:text-base text-[#3a2717] font-serif italic max-w-xl mx-auto leading-relaxed">
            {content.ctaDescription}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button 
              onClick={() => {
                sound.playMysticChime();
                onEnterGame();
              }}
              size="lg"
              className="w-full sm:w-auto px-9 py-4 text-sm sm:text-base inline-flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(190,141,44,0.6)] text-obsidian bg-gradient-to-r from-gold via-cream to-gold font-bold hover:scale-105 rounded-xl transition-transform"
            >
              <Play size={18} className="fill-obsidian" />
              <span>{content.ctaButtonText}</span>
            </Button>

            <a 
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="w-full sm:w-auto px-8 py-4 text-sm sm:text-base inline-flex items-center justify-center gap-2 border-2 border-emerald-600 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-display font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)]"
            >
              <MessageCircle size={18} className="text-white" />
              <span>CONSULTAR POR WHATSAPP</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gold/20 py-8 px-4 text-center text-xs sm:text-sm text-cream/60 space-y-2">
        <p className="font-display text-gold tracking-widest text-sm sm:text-base font-bold">
          {content.footerTitle}
        </p>
        <p className="font-serif italic text-xs sm:text-sm">
          {content.footerDescription}
        </p>
        <p className="text-xs text-cream/40 pt-2">
          © {new Date().getFullYear()} lacasadelasleyendas.com. Todos los derechos reservados.
        </p>
      </footer>

      {/* BOTÓN FLOTANTE DE WHATSAPP (ESQUINA INFERIOR DERECHA - SOLO ICONO) */}
      <motion.a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => sound.playClick()}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-5 right-5 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-950/95 via-emerald-900/95 to-emerald-950/95 border-2 border-emerald-500/80 hover:border-emerald-400 text-emerald-300 hover:text-white flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.8)] transition-all cursor-pointer backdrop-blur-md group"
        title="Chatear por WhatsApp Oficial: +502 4674-1239"
        aria-label="Chatear por WhatsApp"
      >
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/25 border border-emerald-400/50 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:rotate-6 transition-all">
          <MessageCircle size={20} className="text-emerald-400 fill-emerald-400" />
        </div>
      </motion.a>
    </div>
  );
};
