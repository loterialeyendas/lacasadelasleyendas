import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Sparkles, 
  Flame, 
  ArrowLeft, 
  Play, 
  Drama, 
  ShieldCheck, 
  Compass
} from 'lucide-react';
import { Button, Card } from '../components/Theme';
import { sound } from '../lib/audio';
import { 
  LiveTheaterContent, 
  DEFAULT_THEATER_CONTENT, 
  fetchSiteContent, 
  getLocalContent 
} from '../services/contentService';

import logoPng from '../images/logo.png';
import fondoSvg from '../images/optimized/Fondo.svg';

import { PassportStampSvg } from '../components/svgs/PassportStampSvg';

interface LiveTheaterViewProps {
  onBack: () => void;
  onEnterGame: () => void;
}

export const LiveTheaterView: React.FC<LiveTheaterViewProps> = ({
  onBack,
  onEnterGame
}) => {
  const [content, setContent] = useState<LiveTheaterContent>(() => getLocalContent().theater);

  useEffect(() => {
    fetchSiteContent().then((res) => {
      if (res?.theater) {
        setContent(res.theater);
      }
    });
  }, []);

  return (
    <div className="w-full min-h-screen bg-obsidian text-cream font-sans overflow-x-hidden relative selection:bg-gold selection:text-obsidian">
      
      {/* Fondo Gráfico SVG y Luces Ambientales */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <img 
          src={fondoSvg} 
          alt="Fondo Místico" 
          className="w-full h-full object-cover mix-blend-screen scale-105"
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-maya-red/20 via-gold/15 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Header Sticky con Botón de Regreso */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-obsidian/90 border-b border-gold/30 px-4 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="flex items-center gap-2 text-gold hover:text-cream transition-colors text-xs sm:text-sm font-display font-bold cursor-pointer group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>VOLVER AL INICIO</span>
          </button>

          <div className="flex items-center gap-3">
            <img 
              src={logoPng} 
              alt="Casa de las Leyendas" 
              className="w-9 h-9 object-contain drop-shadow-[0_0_8px_rgba(190,141,44,0.4)]"
            />
            <span className="hidden sm:inline font-display text-xs tracking-widest text-gold font-bold">
              PRODUCCIÓN EN VIVO
            </span>
          </div>

          <Button 
            onClick={() => {
              sound.playMysticChime();
              onEnterGame();
            }}
            size="sm"
            className="py-2 px-4 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(190,141,44,0.4)]"
          >
            <Play size={14} className="fill-current" />
            <span>APP DIGITAL</span>
          </Button>
        </div>
      </header>

      {/* Hero Principal del Evento Escénico */}
      <section className="relative z-10 pt-8 pb-14 px-4 max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Badge de Categoría */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-maya-red/20 border border-maya-red/50 text-red-200 text-xs sm:text-sm font-display tracking-widest uppercase mb-4 shadow-lg"
        >
          <Drama size={16} className="text-maya-red" />
          <span>{content.badge}</span>
        </motion.div>

        {/* Título Principal */}
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-display text-gold tracking-tight leading-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] max-w-4xl"
        >
          {content.title} <br />
          <span className="text-cream italic font-serif text-2xl sm:text-4xl block mt-2 font-normal">
            {content.subtitle}
          </span>
        </motion.h1>

        {/* Portada / Cartel Teatral Personalizable si está configurado */}
        {content.coverImageUrl && (
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="relative max-w-2xl mx-auto mt-6 mb-2 group w-full px-2"
          >
            <div className="absolute -inset-1.5 bg-gradient-to-r from-maya-red via-gold to-maya-red rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-700 pointer-events-none" />
            <div className="relative rounded-2xl overflow-hidden border-2 border-gold/70 shadow-[0_0_40px_rgba(190,141,44,0.45)] bg-black/80">
              <img
                src={content.coverImageUrl}
                alt="Cartel Producción Escénica"
                className="w-full h-auto object-contain max-h-[420px] sm:max-h-[500px] mx-auto hover:scale-[1.01] transition-transform duration-500"
              />
            </div>
          </motion.div>
        )}

        {/* Subtítulo y Tarjetas Clave (Fecha, Lugar, Formato) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-8 w-full max-w-3xl"
        >
          <div className="p-4 rounded-2xl bg-black/60 border border-gold/30 flex items-center gap-3 text-left">
            <div className="w-11 h-11 rounded-xl bg-gold/15 flex items-center justify-center text-gold shrink-0 border border-gold/30">
              <Calendar size={22} />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-gold font-display font-bold block">FECHA</span>
              <span className="text-sm font-bold text-cream font-display">{content.date}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/60 border border-gold/30 flex items-center gap-3 text-left">
            <div className="w-11 h-11 rounded-xl bg-maya-red/20 flex items-center justify-center text-maya-red shrink-0 border border-maya-red/30">
              <MapPin size={22} />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-maya-red font-display font-bold block">UBICACIÓN</span>
              <span className="text-sm font-bold text-cream font-display leading-tight block">{content.location}</span>
              <span className="text-xs text-cream/70 font-serif italic">{content.city}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/60 border border-gold/30 flex items-center gap-3 text-left">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-300 shrink-0 border border-amber-500/30">
              <Clock size={22} />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-amber-300 font-display font-bold block">DURACIÓN</span>
              <span className="text-sm font-bold text-cream font-display">{content.duration}</span>
              <span className="text-xs text-cream/70 font-serif italic">{content.durationSubtitle}</span>
            </div>
          </div>
        </motion.div>

        {/* Manifiesto y Descripción Editorial */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl text-left bg-black/50 p-6 sm:p-8 rounded-3xl border border-gold/30 space-y-4 shadow-xl"
        >
          <p className="text-base sm:text-lg text-cream/95 font-serif italic leading-relaxed first-letter:text-4xl first-letter:font-display first-letter:text-gold first-letter:mr-2 first-letter:float-left">
            {content.manifestoP1}
          </p>
          <p className="text-sm sm:text-base text-cream/85 font-serif italic leading-relaxed">
            {content.manifestoP2}
          </p>
          <div className="p-3.5 bg-gold/10 rounded-2xl border border-gold/30 text-xs sm:text-sm text-gold font-display font-semibold flex items-center gap-2.5">
            <Sparkles size={18} className="shrink-0" />
            <span>{content.manifestoHighlight}</span>
          </div>
        </motion.div>
      </section>

      {/* ESTRUCTURA Y DINÁMICA DEL RECORRIDO */}
      <section className="relative z-10 py-14 px-4 max-w-6xl mx-auto border-t border-gold/20">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs sm:text-sm font-display text-gold tracking-widest uppercase flex items-center justify-center gap-1.5 font-bold">
            <Compass size={16} /> {content.dynamicsSectionBadge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-display text-cream">
            {content.dynamicsSectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-cream/80 font-serif italic max-w-2xl mx-auto leading-relaxed">
            {content.dynamicsSectionDescription}
          </p>
        </div>

        {/* Tarjetas de Logística (Grupos y El Guía de la Tradición) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Card: Grupos y Horarios */}
          <Card className="p-6 sm:p-8 space-y-4 border-gold/40 bg-black/70 rounded-3xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-display text-gold font-bold">
              {content.groupTitle}
            </h3>
            <p className="text-sm sm:text-base text-cream/85 font-serif italic leading-relaxed">
              {content.groupDescription}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-display text-cream/70 uppercase tracking-wider">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>{content.groupFootnote}</span>
            </div>
          </Card>

          {/* Card: El Guía de la Tradición */}
          <Card className="p-6 sm:p-8 space-y-4 border-gold/40 bg-black/70 rounded-3xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-maya-red/20 border border-maya-red/40 flex items-center justify-center text-maya-red">
              <Flame size={24} />
            </div>
            <h3 className="text-xl font-display text-gold font-bold">
              {content.guideTitle}
            </h3>
            <p className="text-sm sm:text-base text-cream/85 font-serif italic leading-relaxed">
              {content.guideDescription}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-display text-cream/70 uppercase tracking-wider">
              <Sparkles size={16} className="text-gold" />
              <span>{content.guideFootnote}</span>
            </div>
          </Card>
        </div>

        {/* LAS 4 ESTACIONES ESCÉNICAS */}
        <div className="space-y-6">
          <div className="text-center space-y-1 mb-8">
            <span className="text-xs font-display uppercase tracking-widest text-maya-red font-bold">
              {content.stationsSectionBadge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-display text-gold">
              {content.stationsSectionTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {content.stations.map((st) => (
              <motion.div
                key={st.number}
                whileHover={{ scale: 1.015 }}
                className="p-6 sm:p-7 rounded-3xl bg-black/75 border border-gold/30 hover:border-gold/60 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden shadow-lg"
              >
                <div className="space-y-3.5">
                  {/* Encabezado de la estación */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-display font-bold">
                      Estación {st.number} • {st.location}
                    </span>
                    <span className={`text-[11px] font-display font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${st.badgeColor}`}>
                      {st.badge}
                    </span>
                  </div>

                  {/* Título de la Leyenda con Ficha / Sello Circular Personalizado */}
                  <div className="flex items-center gap-4 pt-1">
                    <PassportStampSvg 
                      code={st.code} 
                      name={st.legend} 
                      isUnlocked={true} 
                      size={54} 
                      imageUrl={st.imageUrl} 
                    />
                    <div>
                      <h4 className="text-xl sm:text-2xl font-display text-cream font-bold">
                        {st.legend}
                      </h4>
                      <span className="text-xs text-gold font-serif italic">
                        Ubicación teatral: {st.location}
                      </span>
                    </div>
                  </div>

                  {/* Descripción de la Escena */}
                  <p className="text-sm sm:text-base text-cream/90 font-serif italic leading-relaxed pt-1">
                    "{st.description}"
                  </p>

                  {/* Puntos destacados */}
                  <div className="pt-2 flex flex-wrap gap-2">
                    {st.highlights.map((h, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-cream/80 font-sans flex items-center gap-1">
                        <Sparkles size={11} className="text-gold" /> {h}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA: COMBINA CON LA APP DIGITAL */}
      <section className="relative z-10 py-16 px-4 max-w-4xl mx-auto text-center">
        <Card className="p-8 sm:p-12 space-y-6 border-gold/50 bg-gradient-to-b from-black/90 to-earth-brown/40 relative overflow-hidden shadow-[0_0_50px_rgba(122,49,8,0.5)] rounded-3xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/15 blur-3xl rounded-full pointer-events-none" />

          <span className="text-xs sm:text-sm font-display text-gold uppercase tracking-widest block font-bold">
            {content.ctaBadge}
          </span>

          <h2 className="text-2xl sm:text-4xl font-display text-cream">
            {content.ctaTitle}
          </h2>

          <p className="text-sm sm:text-base text-cream/90 font-serif italic max-w-xl mx-auto leading-relaxed">
            {content.ctaDescription}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button 
              onClick={() => {
                sound.playMysticChime();
                onEnterGame();
              }}
              size="lg"
              className="w-full sm:w-auto px-9 py-4 text-sm sm:text-base inline-flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(190,141,44,0.6)] text-obsidian bg-gradient-to-r from-gold via-cream to-gold font-bold hover:scale-105 rounded-xl"
            >
              <Play size={18} className="fill-obsidian" />
              <span>{content.ctaButtonText}</span>
            </Button>

            <Button 
              variant="outline"
              onClick={() => {
                sound.playClick();
                onBack();
              }}
              size="lg"
              className="w-full sm:w-auto px-8 py-4 text-sm sm:text-base inline-flex items-center justify-center gap-2 border-gold text-gold hover:bg-gold/15 rounded-xl"
            >
              <ArrowLeft size={16} />
              <span>REGRESAR AL PORTAL</span>
            </Button>
          </div>
        </Card>
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
    </div>
  );
};
