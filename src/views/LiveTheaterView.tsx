import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Compass,
  QrCode,
  Ticket,
  CheckCircle2,
  Check,
  Package,
  CreditCard,
  Tag,
  ArrowRight,
  Send,
  X,
  MessageCircle,
  Building2,
  Handshake,
  Crown,
  Award
} from 'lucide-react';
import { Button, Card } from '../components/Theme';
import { sound } from '../lib/audio';
import { 
  LiveTheaterContent, 
  TicketPlanContent,
  DEFAULT_THEATER_CONTENT, 
  DEFAULT_TICKETING_CONTENT,
  DEFAULT_SPONSORSHIP_CONTENT,
  fetchSiteContent, 
  getLocalContent 
} from '../services/contentService';

const WHATSAPP_NUMBER = '50246741239';
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Casa%20de%20las%20Leyendas,%20deseo%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20evento%20y%20el%20juego%20de%20mesa.`;

import logoPng from '../images/logo.png';
import fondoSvg from '../images/optimized/Fondo.svg';

import candadoJadePng from '../images/png/Candado jade.png';
import candadoVidaPng from '../images/png/Candado vida.png';
import candadoOroPng from '../images/png/Candado oro.png';
import candadoPlataPng from '../images/png/Candado plata.png';

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
  const [selectedPlanId, setSelectedPlanId] = useState<string>('jade');
  const [activePhaseId, setActivePhaseId] = useState<string>('preventa-cultural');
  const [showSimulatedPass, setShowSimulatedPass] = useState<boolean>(false);

  useEffect(() => {
    fetchSiteContent().then((res) => {
      if (res?.theater) {
        setContent(res.theater);
      }
    });
  }, []);

  const ticketing = content.ticketing || DEFAULT_TICKETING_CONTENT;
  const sponsorship = content.sponsorship || DEFAULT_SPONSORSHIP_CONTENT;
  const plans = (ticketing.plans && ticketing.plans.length > 0) ? ticketing.plans : DEFAULT_TICKETING_CONTENT.plans;
  const phases = (ticketing.phases && ticketing.phases.length > 0) ? ticketing.phases : DEFAULT_TICKETING_CONTENT.phases;

  const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[0] || DEFAULT_TICKETING_CONTENT.plans[0];

  const getKeyImageForPlan = (plan: TicketPlanContent) => {
    if (plan.imageUrl && plan.imageUrl.trim().length > 0) {
      return plan.imageUrl;
    }
    switch (plan.keyType) {
      case 'jade': return candadoJadePng;
      case 'vida': return candadoVidaPng;
      case 'oro': return candadoOroPng;
      case 'plata': return candadoPlataPng;
      default: return candadoJadePng;
    }
  };

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

      {/* Header Sticky con Botón de Regreso SPA */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-obsidian/90 border-b border-gold/30 px-4 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            type="button"
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="flex items-center gap-2 text-gold hover:text-cream transition-colors text-xs sm:text-sm font-display font-bold cursor-pointer group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>VOLVER AL INICIO</span>
          </button>

          <div className="flex items-center gap-2.5">
            <img 
              src={logoPng} 
              alt="Casa de las Leyendas" 
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-[0_0_8px_rgba(190,141,44,0.4)]"
            />
            <span className="font-display text-xs sm:text-sm tracking-widest text-gold font-bold">
              PRODUCCIÓN EN VIVO
            </span>
          </div>
        </div>
      </header>

      {/* Hero Principal del Evento Escénico */}
      <section className="relative z-10 pt-8 pb-14 px-4 max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Badge de Categoría con Alto Contraste */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/85 border border-gold/70 text-gold text-xs sm:text-sm font-display font-bold tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(190,141,44,0.3)]"
        >
          <Drama size={16} className="text-gold" />
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

        {/* Ficha Técnica / Datos Clave */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mt-8"
        >
          <Card className="p-4 bg-black/70 border-gold/40 flex items-center gap-3.5 text-left shadow-lg">
            <div className="w-11 h-11 rounded-xl bg-gold/15 flex items-center justify-center text-gold shrink-0 border border-gold/30">
              <Calendar size={22} />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-gold font-display font-bold block">FECHA</span>
              <span className="text-sm sm:text-base font-semibold text-cream">{content.date}</span>
            </div>
          </Card>

          <Card className="p-4 bg-black/70 border-gold/40 flex items-center gap-3.5 text-left shadow-lg">
            <div className="w-11 h-11 rounded-xl bg-maya-red/20 flex items-center justify-center text-maya-red shrink-0 border border-maya-red/30">
              <MapPin size={22} />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-gold font-display font-bold block">UBICACIÓN</span>
              <span className="text-sm sm:text-base font-semibold text-cream">{content.location}</span>
              <span className="text-xs text-cream/70 block">{content.city}</span>
            </div>
          </Card>

          <Card className="p-4 bg-black/70 border-gold/40 flex items-center gap-3.5 text-left shadow-lg">
            <div className="w-11 h-11 rounded-xl bg-gold/15 flex items-center justify-center text-gold shrink-0 border border-gold/30">
              <Clock size={22} />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-gold font-display font-bold block">DURACIÓN</span>
              <span className="text-sm sm:text-base font-semibold text-cream">{content.duration}</span>
              <span className="text-xs text-cream/70 block">{content.durationSubtitle}</span>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Manifiesto y Concepto */}
      <section className="relative z-10 py-12 px-4 max-w-4xl mx-auto border-t border-gold/20">
        <div className="text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-display text-gold font-bold">
            UNA EXPERIENCIA DE VALOR HISTÓRICO, ARTÍSTICO Y CULTURAL
          </h2>
          
          <div className="space-y-4 text-cream/90 font-serif italic text-base sm:text-lg leading-relaxed text-justify sm:text-center">
            <p>{content.manifestoP1}</p>
            <p>{content.manifestoP2}</p>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-gold/10 border border-gold/30 text-gold font-display text-sm sm:text-base font-bold shadow-md">
            "{content.manifestoHighlight}"
          </div>
        </div>
      </section>

      {/* Dinámica de Acceso y Estaciones Escénicas */}
      <section className="relative z-10 py-12 px-4 max-w-6xl mx-auto border-t border-gold/20">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-display uppercase tracking-widest text-gold font-bold">
            {content.dynamicsSectionBadge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-display text-gold">
            {content.dynamicsSectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-cream/80 max-w-2xl mx-auto font-serif italic">
            {content.dynamicsSectionDescription}
          </p>
        </div>

        {/* 2 Pilares Logísticos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6 sm:p-8 bg-black/60 border-gold/40 space-y-4">
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
              <ShieldCheck size={16} className="text-gold" />
              <span>{content.groupFootnote}</span>
            </div>
          </Card>

          <Card className="p-6 sm:p-8 bg-black/60 border-gold/40 space-y-4">
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
            <span className="text-xs font-display uppercase tracking-widest text-gold font-bold">
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

      {/* SECCIÓN INTERACTIVA: SISTEMA DE BOLETERÍA EN LÍNEA & PLANES DE LLAVES SAGRADAS */}
      <section id="boleteria" className="relative z-10 py-16 px-4 max-w-6xl mx-auto border-t border-gold/30">
        
        {/* Encabezado Principal de Boletería */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/90 border border-gold/60 text-gold text-xs sm:text-sm font-display font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(190,141,44,0.3)]">
            <Ticket size={16} className="text-gold" />
            <span>{ticketing.sectionBadge}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display text-gold tracking-wide">
            {ticketing.sectionTitle}
          </h2>

          <p className="text-sm sm:text-base text-cream/90 max-w-3xl mx-auto font-serif italic leading-relaxed">
            {ticketing.sectionDescription}
          </p>
        </div>

        {/* Tarjeta Destacada: Plataforma de Autogestión Digital */}
        <Card className="mb-12 p-6 sm:p-8 bg-gradient-to-r from-black/90 via-obsidian/95 to-black/90 border-gold/60 relative overflow-hidden shadow-[0_0_40px_rgba(190,141,44,0.25)] rounded-3xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 blur-3xl rounded-full pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-3 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-display text-gold font-bold uppercase tracking-wider bg-gold/15 px-3 py-1 rounded-full border border-gold/30">
                <QrCode size={14} />
                <span>Acceso Rápido & Autogestión</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display text-cream font-bold">
                {ticketing.selfServiceTitle}
              </h3>
              <p className="text-sm sm:text-base text-cream/80 font-serif italic leading-relaxed">
                {ticketing.selfServiceDescription}
              </p>
              <div className="flex items-center gap-2 text-xs text-gold/90 font-display font-bold">
                <CheckCircle2 size={15} className="text-gold" />
                <span>{ticketing.selfServiceFootnote}</span>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-gold/10 border border-gold/30 text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-black/80 border border-gold/60 flex items-center justify-center text-gold shadow-md">
                <QrCode size={30} />
              </div>
              <span className="text-xs font-display text-gold font-bold tracking-widest uppercase">CÓDIGO QR DIGITAL</span>
              <span className="text-[11px] text-cream/70 font-sans">Presentación directa desde tu móvil sin necesidad de imprimir</span>
            </div>
          </div>
        </Card>

        {/* Fases de Preventa (Tabs Interactivas) */}
        <div className="mb-14 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-display uppercase tracking-widest text-gold font-bold">CALENDARIO DE ADQUISICIÓN</span>
            <h3 className="text-2xl sm:text-3xl font-display text-gold font-bold">
              {ticketing.phasesSectionTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {phases.map((phase) => {
              const isSelected = activePhaseId === phase.id;
              return (
                <motion.div
                  key={phase.id}
                  whileHover={{ scale: 1.015 }}
                  onClick={() => {
                    sound.playClick();
                    setActivePhaseId(phase.id);
                  }}
                  className={`p-6 sm:p-7 rounded-3xl cursor-pointer transition-all duration-300 relative overflow-hidden border ${
                    isSelected 
                      ? 'bg-black/90 border-gold shadow-[0_0_30px_rgba(190,141,44,0.35)] ring-1 ring-gold' 
                      : 'bg-black/60 border-gold/30 hover:border-gold/60 opacity-90'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-display font-bold">
                        <Calendar size={13} />
                        {phase.dates}
                      </span>
                      {phase.discountBadge && (
                        <span className="text-[11px] font-display font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/50">
                          {phase.discountBadge}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xl sm:text-2xl font-display text-cream font-bold">
                      {phase.title}
                    </h4>

                    <p className="text-sm text-cream/80 font-serif italic leading-relaxed">
                      {phase.description}
                    </p>

                    <div className="pt-2 space-y-2 border-t border-gold/20">
                      {phase.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-cream/90 font-sans">
                          <CheckCircle2 size={13} className="text-gold shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* PLANES Y LLAVES SAGRADAS (DEL MÁS GRANDE AL MÁS PEQUEÑO: JADE, VIDA, ORO, PLATA) */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-display uppercase tracking-widest text-gold font-bold">EXPERIENCIAS & EDICIONES DISPONIBLES</span>
            <h3 className="text-2xl sm:text-4xl font-display text-gold font-bold">
              {ticketing.plansSectionTitle}
            </h3>
            <p className="text-sm sm:text-base text-cream/80 max-w-2xl mx-auto font-serif italic">
              {ticketing.plansSectionDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              const keyImg = getKeyImageForPlan(plan);

              return (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -6 }}
                  onClick={() => {
                    sound.playMysticChime();
                    setSelectedPlanId(plan.id);
                  }}
                  className={`rounded-3xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 relative overflow-hidden border ${
                    isSelected
                      ? 'bg-black/95 border-gold shadow-[0_0_35px_rgba(190,141,44,0.45)] ring-2 ring-gold/80 scale-[1.02]'
                      : 'bg-black/75 border-gold/30 hover:border-gold/60 hover:shadow-xl'
                  }`}
                >
                  {/* Halo de luz decorativo */}
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/20 blur-2xl rounded-full pointer-events-none" />
                  )}

                  <div className="space-y-4">
                    {/* Badge del Plan */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] sm:text-[11px] font-display uppercase tracking-wider px-2.5 py-1 rounded-lg border ${plan.badgeBg}`}>
                        {plan.badge}
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-gold text-obsidian flex items-center justify-center font-bold text-xs shrink-0">
                          ✓
                        </span>
                      )}
                    </div>

                    {/* Ilustración de la Llave / Candado Sagrado */}
                    <div className="flex flex-col items-center justify-center pt-2 pb-1">
                      <div className="relative group">
                        <div className="absolute -inset-2 bg-gold/20 rounded-full blur-md opacity-70 group-hover:opacity-100 transition" />
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-black/80 border-2 border-gold/60 p-2 flex items-center justify-center shadow-lg overflow-hidden">
                          <img 
                            src={keyImg} 
                            alt={plan.name} 
                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300 drop-shadow-md"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Título y Capacidad */}
                    <div className="text-center space-y-1">
                      <h4 className="text-lg sm:text-xl font-display text-cream font-bold leading-snug min-h-[48px] flex items-center justify-center">
                        {plan.name}
                      </h4>
                      <span className="text-xs text-gold font-display font-semibold block">
                        {plan.capacityText}
                      </span>
                    </div>

                    {/* Precio */}
                    <div className="text-center py-2 bg-gold/10 rounded-2xl border border-gold/30 space-y-0.5">
                      <div className="text-2xl sm:text-3xl font-display text-gold font-bold tracking-tight">
                        {plan.price}
                      </div>
                      <div className="text-[11px] text-cream/70 font-sans italic">
                        {plan.priceNote}
                      </div>
                    </div>

                    {/* Descripción */}
                    <p className="text-xs sm:text-sm text-cream/80 font-serif italic leading-relaxed text-center min-h-[50px]">
                      "{plan.description}"
                    </p>

                    {/* Lista de Inclusiones */}
                    <div className="space-y-2 pt-2 border-t border-gold/20">
                      {plan.includes.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-cream/90 font-sans">
                          <Check size={13} className="text-gold shrink-0 mt-0.5" />
                          <span className="leading-tight">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botón de Selección */}
                  <div className="pt-5 mt-auto">
                    <Button
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      className={`w-full py-2.5 text-xs font-display font-bold flex items-center justify-center gap-1.5 rounded-xl ${
                        isSelected 
                          ? 'bg-gradient-to-r from-gold via-cream to-gold text-obsidian shadow-lg' 
                          : 'border-gold text-gold hover:bg-gold/15'
                      }`}
                    >
                      <span>{isSelected ? 'PLAN SELECCIONADO' : 'ELEGIR ESTE PLAN'}</span>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* PASE TEATRAL DIGITAL QR Y SIMULADOR INTERACTIVO */}
          <div className="mt-12 flex flex-col items-center">
            <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-black/95 via-obsidian to-black border-2 border-gold/80 p-6 sm:p-8 text-center space-y-5 shadow-[0_0_50px_rgba(190,141,44,0.35)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 blur-2xl rounded-full pointer-events-none" />

              <div className="flex items-center justify-between border-b border-gold/30 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <img src={logoPng} alt="Logo" className="w-7 h-7 object-contain drop-shadow" />
                  <span className="text-xs sm:text-sm font-display text-gold font-bold tracking-wider">
                    PASE TEATRAL QR
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/50 font-bold">
                  AUTOGESTIÓN
                </span>
              </div>

              {/* QR Code Simulado Interactivo */}
              <div className="flex flex-col items-center justify-center p-5 bg-white rounded-2xl shadow-inner mx-auto max-w-[220px]">
                <QrCode size={140} className="text-obsidian" />
                <span className="text-[10px] font-mono text-obsidian/80 mt-2 font-bold tracking-wider">
                  COD: {selectedPlan.keyType.toUpperCase()}-2026-TEATRO
                </span>
              </div>

              <div className="space-y-1.5 text-center">
                <span className="text-xs uppercase tracking-widest text-gold font-display font-bold block">
                  {selectedPlan.name} • {selectedPlan.price}
                </span>
                <p className="text-xs text-cream/80 font-serif italic">
                  Teatro Municipal de Quetzaltenango • 31 de Octubre
                </p>
              </div>

              <Button
                onClick={() => {
                  sound.playMysticChime();
                  setShowSimulatedPass(true);
                }}
                size="md"
                className="w-full py-3.5 text-xs sm:text-sm font-display font-bold flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(190,141,44,0.5)] text-obsidian bg-gradient-to-r from-gold via-cream to-gold hover:scale-105 rounded-xl transition-all cursor-pointer"
              >
                <Send size={15} />
                <span>SIMULAR RESERVACIÓN DE BOLETO</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CORPORATIVA: ALIANZAS ESTRATÉGICAS Y OPORTUNIDADES PARA PATROCINADORES */}
      <section id="patrocinios" className="relative z-10 py-16 px-4 max-w-6xl mx-auto border-t border-gold/20">
        <div className="space-y-12">
          
          {/* Cabecera de Patrocinios */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-display font-bold tracking-widest uppercase shadow-sm">
              <Handshake size={15} />
              <span>{sponsorship.sectionBadge}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-display text-cream font-bold leading-tight">
              {sponsorship.sectionTitle}
            </h2>

            <p className="text-sm sm:text-base text-cream/80 font-serif italic leading-relaxed">
              {sponsorship.sectionDescription}
            </p>
          </div>

          {/* Cards de Categorías de Patrocinio */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sponsorship.tiers.map((tier) => {
              const isLeyenda = tier.id === 'leyenda';
              const isCultural = tier.id === 'cultural';

              return (
                <motion.div
                  key={tier.id}
                  whileHover={{ y: -6 }}
                  className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                    isLeyenda
                      ? 'bg-gradient-to-b from-black via-earth-brown/40 to-black border-2 border-gold shadow-[0_0_35px_rgba(190,141,44,0.35)]'
                      : isCultural
                      ? 'bg-black/85 border-gold/60 shadow-lg'
                      : 'bg-black/70 border-gold/30 hover:border-gold/60'
                  }`}
                >
                  {isLeyenda && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-gold to-amber-500 text-obsidian text-[10px] font-display font-bold tracking-wider py-1 px-4 rounded-bl-xl uppercase shadow-md flex items-center gap-1">
                      <Crown size={12} className="fill-obsidian" /> ALIADO PRINCIPAL
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between pt-1">
                      <span className={`text-[10px] uppercase font-display font-bold tracking-wider px-3 py-1 rounded-full border ${
                        isLeyenda 
                          ? 'bg-gold/20 text-gold border-gold/50' 
                          : isCultural 
                          ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40' 
                          : 'bg-slate-800 text-slate-200 border-slate-600'
                      }`}>
                        {tier.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-display text-cream font-bold">
                        {tier.name}
                      </h3>
                      <div className="mt-2.5 p-3.5 rounded-xl bg-gold/10 border border-gold/30 text-left space-y-0.5">
                        <span className="text-[10px] text-cream/70 font-mono uppercase block">
                          Aporte / Inversión:
                        </span>
                        <span className="text-sm sm:text-base font-display text-gold font-bold block leading-snug">
                          {tier.investment}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-cream/85 font-serif italic leading-relaxed">
                      "{tier.description}"
                    </p>

                    {/* Beneficios Clave */}
                    <div className="space-y-2 pt-3 border-t border-gold/20 text-xs">
                      <span className="text-[11px] font-display text-gold font-bold uppercase tracking-wider block">
                        Beneficios Clave:
                      </span>
                      {tier.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-cream/90 font-sans">
                          <Check size={14} className="text-gold shrink-0 mt-0.5" />
                          <span className="leading-snug text-xs">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botón de Contacto por WhatsApp para esta Categoría */}
                  <div className="pt-6 mt-auto">
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Casa%20de%20las%20Leyendas,%20deseamos%20informaci%C3%B3n%20para%20participar%20con%20el%20${encodeURIComponent(tier.name)}%20(${encodeURIComponent(tier.badge)}).`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => sound.playClick()}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-display font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                        isLeyenda
                          ? 'bg-gradient-to-r from-gold via-cream to-gold text-obsidian hover:scale-105 shadow-[0_0_15px_rgba(190,141,44,0.4)]'
                          : 'border border-gold text-gold hover:bg-gold/15'
                      }`}
                    >
                      <MessageCircle size={14} className={isLeyenda ? 'fill-obsidian' : 'text-gold'} />
                      <span>SOLICITAR CONVENIO</span>
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Banner de Contacto Corporativo y Facturación */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-black via-obsidian to-black border-2 border-gold/60 text-center space-y-4 shadow-[0_0_40px_rgba(190,141,44,0.25)] relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold mx-auto shadow-inner">
              <Building2 size={24} />
            </div>

            <div className="space-y-1.5 max-w-2xl mx-auto">
              <span className="text-xs font-display text-gold font-bold uppercase tracking-widest block">
                {sponsorship.contactBadge}
              </span>
              <h3 className="text-xl sm:text-3xl font-display text-cream font-bold">
                {sponsorship.contactTitle}
              </h3>
              <p className="text-xs sm:text-sm text-cream/80 font-serif italic">
                {sponsorship.contactDescription}
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(sponsorship.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="py-3.5 px-8 text-xs sm:text-sm font-display font-bold inline-flex items-center gap-2.5 shadow-[0_0_25px_rgba(16,185,129,0.4)] text-emerald-100 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border-2 border-emerald-500 hover:border-emerald-400 hover:scale-105 rounded-2xl transition-all cursor-pointer"
              >
                <MessageCircle size={18} className="text-emerald-400 fill-emerald-400" />
                <span>{sponsorship.contactButtonText}</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Modal de Simulación de Boleto / Confirmación */}
      <AnimatePresence>
        {showSimulatedPass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-obsidian border-2 border-gold/80 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(190,141,44,0.5)] relative text-center"
            >
              <button
                onClick={() => {
                  sound.playClick();
                  setShowSimulatedPass(false);
                }}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-cream transition"
              >
                <X size={18} />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold mx-auto shadow-md">
                <CheckCircle2 size={34} />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-display text-gold font-bold uppercase tracking-widest block">
                  PROPUESTA DIGITAL LISTA
                </span>
                <h3 className="text-2xl font-display text-cream font-bold">
                  ¡Simulación Exitosa!
                </h3>
                <p className="text-xs sm:text-sm text-cream/80 font-serif italic">
                  Has simulado la selección del <strong className="text-gold">{selectedPlan.name}</strong> ({selectedPlan.price}) para la presentación del 31 de Octubre en el Teatro Municipal.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/80 border border-gold/30 text-xs text-left space-y-2 font-sans">
                <div className="text-gold font-bold font-display text-xs">Incluye en tu reservación:</div>
                {selectedPlan.includes.map((inc, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-cream/90 text-[11px]">
                    <Check size={12} className="text-gold shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => {
                  sound.playClick();
                  setShowSimulatedPass(false);
                }}
                className="w-full py-3 text-xs font-display font-bold shadow-lg"
              >
                ENTENDIDO, VOLVER A LA RUTA
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
