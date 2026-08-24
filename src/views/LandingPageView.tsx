import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Compass, 
  QrCode, 
  Trophy, 
  Sparkles, 
  KeyRound, 
  ChevronDown, 
  BookOpen,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';
import { Button, Card, MysticalTitle } from '../components/Theme';
import { LEYENDAS_DATA } from '../services/legendService';
import { sound } from '../lib/audio';

// Elementos Gráficos PNG y SVG del proyecto
import portadaPng from '../images/png/Portada.png';
import solPng from '../images/png/sol.png';
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
}

interface ElementalLock {
  id: string;
  name: string;
  type: 'oro' | 'plata' | 'jade' | 'vida';
  image: string;
  badgeBg: string;
  subtitle: string;
  question: string;
  answer: string;
  culturalInsight: string;
  associatedLegends: string[];
}

const ELEMENTAL_LOCKS: ElementalLock[] = [
  {
    id: 'lock-oro',
    name: 'Candado de Oro',
    type: 'oro',
    image: candadoOroPng,
    badgeBg: 'bg-gold/25 text-gold border-gold/50 font-bold',
    subtitle: 'El Misterio del Arte y la Libertad',
    question: '¿Qué poder ocultaban los objetos dorados y las serenatas en las noches coloniales?',
    answer: 'La música del Sombrerón y el barco de carbón de La Tatuana eran símbolos de encanto y escape ante las normas del Santo Oficio.',
    culturalInsight: 'En la tradición guatemalteca, el oro representa el resplandor de la astucia y la resistencia espiritual de los pueblos mestizos.',
    associatedLegends: ['El Sombrerón', 'La Tatuana']
  },
  {
    id: 'lock-plata',
    name: 'Candado de Plata',
    type: 'plata',
    image: candadoPlataPng,
    badgeBg: 'bg-slate-400/25 text-slate-100 border-slate-400/50 font-bold',
    subtitle: 'El Guardián de la Noche y la Protección',
    question: '¿Por qué la plata y la luna acompañan al Cadejo Blanco?',
    answer: 'El Cadejo Blanco es el protector espiritual de los caminantes desvalidos, combatiendo la oscuridad y las acechanzas del Cadejo Negro.',
    culturalInsight: 'Los arrieros y viajeros de la época colonial invocaban la luz de la luna y la protección de los guardianes espectrales en los caminos solitarios.',
    associatedLegends: ['El Cadejo']
  },
  {
    id: 'lock-jade',
    name: 'Candado de Jade',
    type: 'jade',
    image: candadoJadePng,
    badgeBg: 'bg-emerald-500/25 text-emerald-200 border-emerald-500/50 font-bold',
    subtitle: 'La Sabiduría Ancestral y las Aguas',
    question: '¿Qué secreto esconden las aguas de los arroyos y las huellas invertidas?',
    answer: 'La Siguanaba y su hijo el Cipitío representan el castigo por olvidar los valores ancestrales y la conexión mística con la naturaleza.',
    culturalInsight: 'El jade, piedra sagrada maya, simboliza la eternidad del alma, la fertilidad de la tierra y los espíritus que custodian los ríos de Guatemala.',
    associatedLegends: ['La Siguanaba', 'El Cipitío']
  },
  {
    id: 'lock-vida',
    name: 'Candado de Vida y Trascendencia',
    type: 'vida',
    image: candadoVidaPng,
    badgeBg: 'bg-maya-red/25 text-red-100 border-maya-red/50 font-bold',
    subtitle: 'El Trascender de las Almas y la Memoria',
    question: '¿Por qué el Carretón y La Llorona siguen recorriendo las calles empedradas?',
    answer: 'Recuerdan el valor de la vida terrenal y la penitencia eterna de las almas que buscan redención y paz en la noche.',
    culturalInsight: 'Estas leyendas cumplían una función de memoria colectiva, respeto a los difuntos y reflexión en la sociedad colonial guatemalteca.',
    associatedLegends: ['La Llorona', 'El Carretón de la Muerte']
  }
];

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onEnterGame,
  onEnterExplorer
}) => {
  const [selectedTeaser, setSelectedTeaser] = useState<string | null>(null);
  const [unlockedLocks, setUnlockedLocks] = useState<Record<string, boolean>>({});

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
                LA CASA DE LAS LEYENDAS
              </span>
              <span className="text-xs uppercase tracking-wider text-cream/70">
                Guatemala • Experiencia Interactiva
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={() => {
                sound.playMysticChime();
                onEnterGame();
              }}
              size="sm"
              className="py-2.5 px-5 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(190,141,44,0.4)]"
            >
              <Play size={15} className="fill-current" />
              <span>JUGAR AHORA</span>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION CON PORTADA, SOL Y NUBES CELESTIALES */}
      <section className="relative z-10 pt-6 pb-16 px-4 max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Composición Celestial: Sol flotante y Nubes */}
        <div className="relative w-full max-w-lg mx-auto mb-5 flex items-center justify-center">
          {/* Nube izquierda flotante */}
          <motion.img
            src={nubeIzqPng}
            alt="Nube Mística Izquierda"
            animate={{ x: [-8, 8, -8], y: [-3, 3, -3] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-3 sm:-left-12 top-2 w-24 sm:w-32 opacity-85 pointer-events-none drop-shadow-md z-20"
          />

          {/* Sol central resplandeciente */}
          <motion.div
            animate={{ rotate: [0, 360], scale: [1, 1.05, 1] }}
            transition={{ rotate: { duration: 40, repeat: Infinity, ease: "linear" }, scale: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
            className="relative z-10"
          >
            <div className="absolute inset-0 bg-gold/30 blur-2xl rounded-full pointer-events-none" />
            <img 
              src={solPng} 
              alt="Sol Místico de Guatemala" 
              className="w-24 sm:w-32 mx-auto drop-shadow-[0_0_25px_rgba(252,207,101,0.7)] object-contain"
            />
          </motion.div>

          {/* Nube derecha flotante */}
          <motion.img
            src={nubeDerPng}
            alt="Nube Mística Derecha"
            animate={{ x: [8, -8, 8], y: [3, -3, 3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-3 sm:-right-12 top-4 w-24 sm:w-32 opacity-85 pointer-events-none drop-shadow-md z-20"
          />
        </div>

        {/* Imagen Oficial de Portada de la Casa de las Leyendas */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-md sm:max-w-lg mx-auto mb-6 group w-full"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-gold via-maya-red to-gold rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition duration-700 pointer-events-none" />
          <div className="relative rounded-2xl overflow-hidden border-2 border-gold/50 shadow-[0_0_35px_rgba(190,141,44,0.3)] bg-black/70">
            <img 
              src={portadaPng} 
              alt="Portada La Casa de las Leyendas" 
              className="w-full h-auto object-contain max-h-[380px] sm:max-h-[460px] mx-auto hover:scale-[1.02] transition-transform duration-500"
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
            <Sparkles size={15} /> El Portal Místico de Guatemala
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display text-gold tracking-tight leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            DESCUBRE EL MISTERIO. <br />
            <span className="text-cream italic font-serif text-2xl sm:text-4xl block mt-1">
              Vive las Leyendas de Nuestros Ancestros.
            </span>
          </h1>

          <p className="text-cream/90 text-base sm:text-lg font-serif italic max-w-2xl mx-auto leading-relaxed px-2">
            Una experiencia cultural e interactiva que combina el juego de mesa físico, 
            el recorrido presencial con códigos QR y desafíos digitales en tiempo real.
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
              <span>ENTRAR AL JUEGO</span>
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
              <span>PASAPORTE DE SELLOS</span>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* SECCIÓN EDUCATIVA: DESCUBRE QUÉ HAY DETRÁS DE CADA CANDADO */}
      <section className="relative z-10 py-14 px-4 max-w-6xl mx-auto border-t border-gold/20">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs sm:text-sm font-display text-gold tracking-widest uppercase flex items-center justify-center gap-1.5 font-bold">
            <KeyRound size={16} /> Dinámica Educativa de Secretos
          </span>
          <h2 className="text-2xl sm:text-4xl font-display text-cream tracking-wide">
            DESCUBRE QUÉ HAY DETRÁS DE CADA CANDADO
          </h2>
          <p className="text-sm sm:text-base text-cream/80 font-serif italic max-w-2xl mx-auto leading-relaxed px-2">
            Abre los candados sagrados de Oro, Plata, Jade y Vida para revelar la sabiduría y el trasfondo histórico de nuestras tradiciones:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ELEMENTAL_LOCKS.map((lock) => {
            const isUnlocked = !!unlockedLocks[lock.id];

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
                        src={lock.image} 
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
            Dinámicas y Mecánicas
          </span>
          <h2 className="text-2xl sm:text-4xl font-display text-gold">
            ¿CÓMO FUNCIONA LA EXPERIENCIA?
          </h2>
          <p className="text-sm sm:text-base text-cream/80 font-serif italic max-w-xl mx-auto px-2">
            Combina el mundo físico con la magia digital a través de 3 pilares únicos:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4 border-gold/30 hover:border-gold/60 transition-all hover:scale-[1.02] rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold">
              <QrCode size={28} />
            </div>
            <h3 className="text-lg font-display text-gold font-bold">1. Escanea las Estaciones</h3>
            <p className="text-sm text-cream/85 font-serif italic leading-relaxed">
              Apunta con la cámara de tu móvil a las cartas físicas o a las placas en la Casa de las Leyendas para invocar el reto de cada espectro.
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-gold/30 hover:border-gold/60 transition-all hover:scale-[1.02] rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-maya-red/20 border border-maya-red/40 flex items-center justify-center text-maya-red">
              <Sparkles size={28} />
            </div>
            <h3 className="text-lg font-display text-gold font-bold">2. Supera las Pruebas</h3>
            <p className="text-sm text-cream/85 font-serif italic leading-relaxed">
              Responde preguntas con tiempo límite, descubre personajes con pistas misteriosas y actúa retos de mímica ante tus compañeros.
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-gold/30 hover:border-gold/60 transition-all hover:scale-[1.02] rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Trophy size={28} />
            </div>
            <h3 className="text-lg font-display text-gold font-bold">3. Colecciona los Sellos</h3>
            <p className="text-sm text-cream/85 font-serif italic leading-relaxed">
              Completa tu Pasaporte Digital con los 7 sellos ancestrales y desbloquea el título de Maestro de Leyendas de Guatemala.
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
                <PassportStampSvg code={legend.code} name={legend.name} isUnlocked={true} size={48} />
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
            ¿Estás listo para el ritual?
          </span>

          <h2 className="text-3xl sm:text-4xl font-display text-cream">
            COMIENZA TU AVENTURA EN LA CASA DE LAS LEYENDAS
          </h2>

          <p className="text-sm sm:text-base text-cream/90 font-serif italic max-w-xl mx-auto leading-relaxed">
            Ingresa desde tu teléfono para jugar en mesa con tus amigos o para realizar el recorrido interactivo por nuestras instalaciones.
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
            <span>INICIAR EXPERIENCIA DIGITAL</span>
          </Button>
        </Card>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-gold/20 py-8 px-4 text-center text-xs sm:text-sm text-cream/60 space-y-2">
        <p className="font-display text-gold tracking-widest text-sm sm:text-base font-bold">
          LA CASA DE LAS LEYENDAS • GUATEMALA
        </p>
        <p className="font-serif italic text-xs sm:text-sm">
          Preservando el patrimonio oral, la magia y las tradiciones populares de Guatemala.
        </p>
        <p className="text-xs text-cream/40 pt-2">
          © {new Date().getFullYear()} lacasadelasleyendas.com. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};
