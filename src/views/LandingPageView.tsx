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
  CheckCircle2,
  Lightbulb,
  Drama
} from 'lucide-react';
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

import candadoOroPng from '../images/png/Candado oro.png';
import candadoPlataPng from '../images/png/Candado plata.png';
import candadoJadePng from '../images/png/Candado jade.png';
import candadoVidaPng from '../images/png/Candado vida.png';

import logoPng from '../images/logo.png';
import fondoSvg from '../images/optimized/Fondo.svg';

import { MysticKey } from '../components/svgs/MysticKey';
import { PassportStampSvg } from '../components/svgs/PassportStampSvg';

interface LandingPageViewProps {
  onEnterGame: () => void;
  onEnterExplorer: () => void;
  onEnterLiveTheater?: () => void;
}

const LOCK_IMAGES: Record<string, string> = {
  oro: candadoOroPng,
  plata: candadoPlataPng,
  jade: candadoJadePng,
  vida: candadoVidaPng
};

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onEnterGame,
  onEnterExplorer,
  onEnterLiveTheater
}) => {
  const [content, setContent] = useState<LandingContent>(() => getLocalContent().landing);
  const [selectedTeaser, setSelectedTeaser] = useState<string | null>(null);
  const [unlockedLocks, setUnlockedLocks] = useState<Record<string, boolean>>({});

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

      {/* Barra de Navegación de la Landing */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-obsidian/90 border-b border-gold/30 px-4 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={logoPng} 
              alt="Casa de las Leyendas" 
              className="w-11 h-11 object-contain drop-shadow-[0_0_10px_rgba(190,141,44,0.5)]"
            />
            <div className="flex flex-col text-left">
              <span className="font-display text-sm sm:text-base tracking-widest text-gold font-bold leading-tight">
                {content.brandTitle}
              </span>
              <span className="text-xs uppercase tracking-wider text-cream/70">
                {content.brandSubtitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a 
              href="/rutadeleyendas"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="py-2 px-3 sm:px-4 text-xs sm:text-sm font-display font-bold flex items-center gap-1.5 text-gold hover:text-cream border border-gold/40 hover:border-gold rounded-xl bg-gold/10 hover:bg-gold/20 transition-all cursor-pointer shadow-[0_0_10px_rgba(190,141,44,0.2)]"
            >
              <Drama size={15} className="text-maya-red" />
              <span className="hidden xs:inline">EN VIVO</span>
              <span className="xs:hidden">TEATRO</span>
              <span className="hidden sm:inline">(TEATRO)</span>
            </a>

            <Button 
              onClick={() => {
                sound.playMysticChime();
                onEnterGame();
              }}
              size="sm"
              className="py-2.5 px-3.5 sm:px-5 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(190,141,44,0.4)]"
            >
              <Play size={15} className="fill-current" />
              <span>{content.playButtonText || 'JUGAR'}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION CON PORTADA, SOL Y NUBES CELESTIALES */}
      <section className="relative z-10 pt-6 pb-16 px-4 max-w-6xl mx-auto text-center flex flex-col items-center">
        
        {/* Banner Destacado: Obra en Vivo en Teatro Municipal (Abre en ventana nueva) */}
        <motion.a
          href="/rutadeleyendas"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => sound.playClick()}
          className="mb-6 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-maya-red/30 via-gold/20 to-maya-red/30 border border-gold/50 cursor-pointer shadow-[0_0_20px_rgba(190,141,44,0.25)] flex items-center gap-3 text-left group max-w-2xl"
        >
          <div className="w-9 h-9 rounded-xl bg-gold/20 flex items-center justify-center text-gold shrink-0 border border-gold/40">
            <Drama size={19} className="text-gold group-hover:rotate-12 transition-transform" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] sm:text-[11px] uppercase font-display font-bold tracking-widest text-gold bg-black/60 px-2 py-0.5 rounded border border-gold/30">
              {content.bannerBadge}
            </span>
            <p className="text-xs sm:text-sm font-display text-cream font-bold leading-tight mt-1 truncate sm:whitespace-normal">
              {content.bannerTitle}
            </p>
          </div>
        </motion.a>

        {/* Composición Celestial: Sol flotante y Nubes */}
        <div className="relative w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto mb-6 flex items-center justify-center">
          {/* Nube izquierda flotante */}
          <motion.img
            src={nubeIzqPng}
            alt="Nube Mística Izquierda"
            animate={{ x: [-10, 10, -10], y: [-4, 4, -4] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-3 sm:-left-10 md:-left-16 lg:-left-24 top-2 w-24 sm:w-32 md:w-40 lg:w-48 opacity-85 pointer-events-none drop-shadow-md z-20"
          />

          {/* Sol central resplandeciente */}
          <motion.div
            animate={{ rotate: [0, 360], scale: [1, 1.06, 1] }}
            transition={{ rotate: { duration: 40, repeat: Infinity, ease: "linear" }, scale: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
            className="relative z-10"
          >
            <div className="absolute inset-0 bg-gold/35 blur-3xl rounded-full pointer-events-none" />
            <img 
              src={solPng} 
              alt="Sol Místico de Guatemala" 
              className="w-24 sm:w-32 md:w-40 lg:w-48 mx-auto drop-shadow-[0_0_35px_rgba(252,207,101,0.8)] object-contain"
            />
          </motion.div>

          {/* Nube derecha flotante */}
          <motion.img
            src={nubeDerPng}
            alt="Nube Mística Derecha"
            animate={{ x: [10, -10, 10], y: [4, -4, 4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-3 sm:-right-10 md:-right-16 lg:-right-24 top-4 w-24 sm:w-32 md:w-40 lg:w-48 opacity-85 pointer-events-none drop-shadow-md z-20"
          />
        </div>

        {/* Imagen Oficial de Portada Ampliada para Web */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto mb-8 group w-full px-2 sm:px-0"
        >
          <div className="absolute -inset-1.5 bg-gradient-to-r from-gold via-maya-red to-gold rounded-2xl md:rounded-3xl blur-xl opacity-45 group-hover:opacity-80 transition duration-700 pointer-events-none" />
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border-2 border-gold/60 shadow-[0_0_45px_rgba(190,141,44,0.4)] bg-black/80">
            <img 
              src={content.heroCoverImageUrl || portadaPng} 
              alt="Portada La Casa de las Leyendas" 
              className="w-full h-auto object-contain max-h-[380px] sm:max-h-[480px] md:max-h-[560px] lg:max-h-[640px] mx-auto hover:scale-[1.015] transition-transform duration-500"
            />
          </div>
        </motion.div>

        {/* Textos del Hero */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs sm:text-sm font-display tracking-widest uppercase">
            <Sparkles size={15} /> {content.heroBadge}
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display text-gold tracking-tight leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            {content.heroTitle} <br />
            <span className="text-cream italic font-serif text-2xl sm:text-4xl block mt-1">
              {content.heroTitleItalic}
            </span>
          </h1>

          <p className="text-cream/90 text-base sm:text-lg font-serif italic max-w-2xl mx-auto leading-relaxed px-2">
            {content.heroDescription}
          </p>

          {/* Botones de Acción Primaria */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
            <Button 
              onClick={() => {
                sound.playMysticChime();
                onEnterGame();
              }}
              size="lg"
              className="w-full sm:w-auto px-8 py-4 text-sm sm:text-base flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(190,141,44,0.6)] text-obsidian bg-gradient-to-r from-gold via-cream to-gold font-bold hover:scale-105"
            >
              <Play size={18} className="fill-obsidian" />
              <span>{content.playButtonText}</span>
            </Button>

            <Button 
              variant="outline"
              onClick={() => {
                sound.playClick();
                onEnterExplorer();
              }}
              size="lg"
              className="w-full sm:w-auto px-8 py-4 text-sm sm:text-base flex items-center justify-center gap-2 border-gold text-gold hover:bg-gold/15"
            >
              <Compass size={18} />
              <span>{content.passportButtonText}</span>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* SECCIÓN EDUCATIVA: DESCUBRE QUÉ HAY DETRÁS DE CADA CANDADO */}
      <section className="relative z-10 py-14 px-4 max-w-6xl mx-auto border-t border-gold/20">
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
              <Card 
                key={lock.id}
                className={`p-6 space-y-4 border transition-all duration-500 relative overflow-hidden flex flex-col justify-between rounded-2xl ${
                  isUnlocked 
                    ? `border-gold bg-black/90 shadow-[0_0_25px_rgba(190,141,44,0.35)]` 
                    : `border-gold/30 bg-black/60 hover:border-gold/60`
                }`}
              >
                <div className="space-y-3.5">
                  {/* Ilustración del Candado PNG y Badge */}
                  <div className="flex items-center justify-between">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gold/10 blur-md rounded-full" />
                      <img 
                        src={lockImg} 
                        alt={lock.name} 
                        className={`w-16 h-16 object-contain transition-transform duration-500 ${
                          isUnlocked ? 'scale-110 drop-shadow-[0_0_15px_rgba(252,207,101,0.8)]' : 'opacity-90'
                        }`}
                      />
                    </div>

                    <span className={`text-xs font-display uppercase tracking-wider px-2.5 py-1 rounded-lg border ${lock.badgeBg}`}>
                      {lock.name}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-base text-cream font-bold leading-snug">
                      {lock.subtitle}
                    </h3>
                    <span className="text-xs text-gold font-serif italic block mt-1">
                      Leyendas: {lock.associatedLegends.join(', ')}
                    </span>
                  </div>

                  <div className="p-3.5 bg-earth-brown/25 rounded-xl border border-gold/20 text-sm text-cream font-serif italic leading-relaxed">
                    "{lock.question}"
                  </div>

                  {/* Contenido Revelado al Abrir el Candado */}
                  <AnimatePresence>
                    {isUnlocked && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 pt-2.5 border-t border-gold/20 text-sm font-serif"
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-display uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-bold">
                            <CheckCircle2 size={14} /> Revelación Ancestral:
                          </span>
                          <p className="text-cream/95 italic text-sm leading-relaxed">
                            {lock.answer}
                          </p>
                        </div>

                        <div className="p-3 bg-black/70 rounded-xl border border-gold/25 space-y-1">
                          <span className="text-xs font-display uppercase tracking-widest text-gold flex items-center gap-1.5 font-bold">
                            <Lightbulb size={13} /> Contexto Histórico:
                          </span>
                          <p className="text-cream/85 text-xs sm:text-sm leading-relaxed">
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
                  className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-display flex items-center justify-center gap-2 border transition-all cursor-pointer mt-4 font-bold shadow-md ${
                    isUnlocked
                      ? 'bg-gold/20 text-gold border-gold/50 hover:bg-gold/30'
                      : 'bg-earth-brown hover:bg-gold text-cream hover:text-obsidian border-gold/50'
                  }`}
                >
                  <MysticKey isTurned={isUnlocked} size={18} />
                  <span>{isUnlocked ? 'Cerrar Secreto' : 'Girar Llave de Oro'}</span>
                </button>
              </Card>
            );
          })}
        </div>
      </section>

      {/* PILARES DE LA EXPERIENCIA */}
      <section className="relative z-10 py-14 px-4 max-w-6xl mx-auto border-t border-gold/20">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs sm:text-sm font-display text-maya-red tracking-widest uppercase font-bold">
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
          <Card className="p-6 space-y-4 border-gold/30 hover:border-gold/60 transition-all hover:scale-[1.02] rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold">
              <QrCode size={28} />
            </div>
            <h3 className="text-lg font-display text-gold font-bold">{content.pillar1Title}</h3>
            <p className="text-sm text-cream/85 font-serif italic leading-relaxed">
              {content.pillar1Description}
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-gold/30 hover:border-gold/60 transition-all hover:scale-[1.02] rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-maya-red/20 border border-maya-red/40 flex items-center justify-center text-maya-red">
              <Sparkles size={28} />
            </div>
            <h3 className="text-lg font-display text-gold font-bold">{content.pillar2Title}</h3>
            <p className="text-sm text-cream/85 font-serif italic leading-relaxed">
              {content.pillar2Description}
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-gold/30 hover:border-gold/60 transition-all hover:scale-[1.02] rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Trophy size={28} />
            </div>
            <h3 className="text-lg font-display text-gold font-bold">{content.pillar3Title}</h3>
            <p className="text-sm text-cream/85 font-serif italic leading-relaxed">
              {content.pillar3Description}
            </p>
          </Card>
        </div>
      </section>

      {/* RECORRIDO DE LEYENDAS CON SELLOS */}
      <section className="relative z-10 py-14 px-4 max-w-6xl mx-auto border-t border-gold/20">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs sm:text-sm font-display text-gold tracking-widest uppercase font-bold">
            Catálogo Místico
          </span>
          <h2 className="text-2xl sm:text-4xl font-display text-cream">
            LAS 7 LEYENDAS ANCESTRALES
          </h2>
          <p className="text-sm sm:text-base text-cream/70 font-serif italic">
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
              className="p-5 rounded-2xl bg-black/60 border border-gold/30 hover:border-gold/60 transition-all cursor-pointer text-left space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <PassportStampSvg 
                  code={legend.code} 
                  name={legend.name} 
                  isUnlocked={true} 
                  size={48} 
                  imageUrl={content.legendFichasImages?.[legend.id]} 
                />
                <span className="text-xs uppercase font-display text-cream/60 font-semibold px-2 py-0.5 rounded bg-black/40 border border-white/10">
                  {legend.category}
                </span>
              </div>

              <h4 className="font-display text-lg text-gold font-bold">{legend.name}</h4>
              <p className="text-sm text-cream/80 font-serif italic line-clamp-2 leading-relaxed">
                "{legend.shortDescription}"
              </p>

              <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs sm:text-sm text-gold font-display font-semibold">
                <span>{selectedTeaser === legend.id ? 'Ocultar historia' : 'Ver secreto ancestral'}</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-300 ${selectedTeaser === legend.id ? 'rotate-180' : ''}`} 
                />
              </div>

              {selectedTeaser === legend.id && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-3 border-t border-gold/20 space-y-2 text-sm font-serif"
                >
                  <p className="text-cream/95 italic leading-relaxed">"{legend.fullStory}"</p>
                  <p className="text-xs text-gold font-display font-bold">📍 {legend.culturalOrigin}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* BANNER FINAL DE LLAMADO A LA ACCIÓN */}
      <section className="relative z-10 py-16 px-4 max-w-4xl mx-auto text-center">
        <Card className="p-8 sm:p-12 space-y-6 border-gold/50 bg-gradient-to-b from-black/80 to-earth-brown/30 relative overflow-hidden shadow-[0_0_50px_rgba(122,49,8,0.4)] rounded-3xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-3xl rounded-full pointer-events-none" />
          
          <span className="text-xs sm:text-sm font-display text-gold uppercase tracking-widest block font-bold">
            {content.ctaBadge}
          </span>

          <h2 className="text-3xl sm:text-4xl font-display text-cream">
            {content.ctaTitle}
          </h2>

          <p className="text-sm sm:text-base text-cream/90 font-serif italic max-w-xl mx-auto leading-relaxed">
            {content.ctaDescription}
          </p>

          <Button 
            onClick={() => {
              sound.playMysticChime();
              onEnterGame();
            }}
            size="lg"
            className="px-10 py-5 text-sm sm:text-base inline-flex items-center gap-3 shadow-[0_0_30px_rgba(190,141,44,0.7)] text-obsidian bg-gradient-to-r from-gold via-cream to-gold font-bold hover:scale-105 rounded-xl"
          >
            <Play size={20} className="fill-obsidian" />
            <span>{content.ctaButtonText}</span>
          </Button>
        </Card>
      </section>

      {/* FOOTER */}
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
    </div>
  );
};
