import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  QrCode, 
  Sparkles, 
  KeyRound, 
  ChevronDown,
  Map as MapIcon,
  Users,
  Dices,
  Ghost,
  HelpCircle,
  Drama,
  Brain,
  Share2,
  HeartHandshake,
  TrendingUp,
  MapPin,
  Zap,
  ScrollText,
  Smartphone
} from 'lucide-react';
import { Button, Card } from '../components/Theme';
import { LEYENDAS_DATA } from '../services/legendService';
import { sound } from '../lib/audio';

import { MysticSun } from '../components/svgs/MysticSun';
import { MysticKey } from '../components/svgs/MysticKey';
import { PassportStampSvg } from '../components/svgs/PassportStampSvg';

import logoCasa from '../images/optimized/Logo Casa.svg';
import logoPng from '../images/logo.png';
import fondoSvg from '../images/optimized/Fondo.svg';
import solYNube from '../images/optimized/Sol y nube.svg';

const RULES_URL = 'https://mc.lluviadeideaseditorial.com/reglascasaleyendas/';

interface LandingPageViewProps {
  onEnterGame: () => void;
  onEnterExplorer: () => void;
}

// Animación de entrada al hacer scroll
const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6 }
} as const;

const BOX_ITEMS = [
  {
    icon: <MapIcon size={26} />,
    title: 'Tablero mapa de Guatemala',
    text: 'Del Teatro Municipal de Xela a las selvas de Petén: cada edificio del país es una casilla con secretos.'
  },
  {
    icon: <Users size={26} />,
    title: '6 Tzipitios para armar',
    text: 'Pequeños guardianes de la memoria ancestral, cada uno con su carácter y sus pies veloces.'
  },
  {
    icon: <Dices size={26} />,
    title: 'El dado de la noche',
    text: 'El destino decide quién enfrenta a cada leyenda. El recorrido va contrario a las agujas del reloj.'
  },
  {
    icon: <QrCode size={26} />,
    title: 'Tarjetas de retos QR',
    text: 'El puente entre la mesa y la magia digital: cada carta escaneada despierta un reto en tu teléfono.'
  },
  {
    icon: <KeyRound size={26} />,
    title: 'Las Cuatro Llaves',
    text: 'Una por cada pilar de la cultura guatemalteca. Quien las reúna todas podrá abrir los candados de la Casa.'
  },
  {
    icon: <Ghost size={26} />,
    title: 'Cartas de Aparición',
    text: 'Hechizos para ponerle chispa a la partida... o para hacerle la vida cuadritos al que va ganando.'
  }
];

const CHALLENGES = [
  {
    id: 'trivia',
    icon: <HelpCircle size={22} />,
    name: 'Trivia',
    tagline: '¿Cuánto sabes de Guate?',
    rules: [
      'Escanea la tarjeta y responde antes de que el tiempo se agote.',
      'Solo tienes una oportunidad: nadie puede dar pistas.',
      'Si aciertas, te llevas la llave.'
    ]
  },
  {
    id: 'mime',
    icon: <Drama size={22} />,
    name: 'Mímica',
    tagline: 'Describe sin hacer ruido',
    rules: [
      'Actúa lo que dice la tarjeta usando solo señas.',
      'Prohibido hablar, hacer sonidos o señalar objetos de la sala.',
      'Los demás adivinan antes de que termine el tiempo.'
    ]
  },
  {
    id: 'character',
    icon: <Brain size={22} />,
    name: 'Adivina el personaje',
    tagline: 'Detective de leyendas',
    rules: [
      'La app muestra un personaje misterioso.',
      'Haz preguntas que solo se respondan con SÍ o NO.',
      'Límite: 15 preguntas. Los demás llevan la cuenta.'
    ]
  },
  {
    id: 'social',
    icon: <Share2 size={22} />,
    name: 'Reto viral',
    tagline: 'Comparte para ganar',
    rules: [
      'Crea contenido sobre un tema guatemalteco en tus redes.',
      'Publica con #LaCasadelasLeyendas y participas por premios.',
      'Logra las interacciones pedidas antes de que acabe la ronda.'
    ]
  }
];

const PLAY_STEPS = [
  {
    title: 'El Maestro de Leyendas convoca',
    text: 'El anfitrión crea la sala desde su teléfono y lleva el control de las llaves ganadas por el grupo.'
  },
  {
    title: 'Reúne a la mancha',
    text: 'Cada jugador entra desde su navegador con el código de sala o escaneando el QR. Nada que instalar.'
  },
  {
    title: 'Escanea y supera retos',
    text: 'En tu turno: tira el dado, cae en una casilla con ícono y escanea la tarjeta indicada para invocar el reto.'
  },
  {
    title: 'Reúne 4 llaves y entra a la Casa',
    text: 'Con cuatro llaves y una vuelta más al tablero, abre los candados y corónate tata o nana del juego.'
  }
];

const UNIQUE_POINTS = [
  {
    icon: <TrendingUp size={24} />,
    title: 'Primer juego actualizable de Guatemala',
    text: 'El contenido evoluciona: nuevas leyendas, retos y sorpresas llegan solas a tu partida, sin comprar otra caja.'
  },
  {
    icon: <HeartHandshake size={24} />,
    title: 'Evoluciona con su comunidad',
    text: 'Los jugadores reportan, proponen y moldean el juego. Es un legado colectivo que crece con cada partida.'
  },
  {
    icon: <MapPin size={24} />,
    title: 'Cultura viva, hecha en casa',
    text: 'Historias contadas por generaciones de abuelos, ilustradas y programadas por talento guatemalteco.'
  },
  {
    icon: <Zap size={24} />,
    title: 'A jugar en minutos',
    text: 'Sin tiendas de aplicaciones ni registros eternos: un teléfono con cámara y listo, a recorrer Guatemala.'
  }
];

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onEnterGame,
  onEnterExplorer
}) => {
  const [selectedTeaser, setSelectedTeaser] = useState<string | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<string>('trivia');

  const scrollTo = (id: string) => {
    sound.playClick();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeChallengeData = CHALLENGES.find((c) => c.id === activeChallenge) || CHALLENGES[0];

  return (
    <div className="w-full min-h-screen bg-obsidian text-cream font-sans overflow-x-hidden relative selection:bg-gold selection:text-obsidian">

      {/* Fondo Gráfico y Efectos de Iluminación */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-35">
        <img 
          src={fondoSvg} 
          alt="" 
          aria-hidden="true"
          className="w-full h-full object-cover mix-blend-screen scale-105"
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-gold/15 via-maya-red/10 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Barra de Navegación */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-obsidian/80 border-b border-gold/20 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer"
            aria-label="Volver arriba"
          >
            <img 
              src={logoPng} 
              alt="Casa de las Leyendas" 
              width={40}
              height={40}
              className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(190,141,44,0.5)]"
            />
            <div className="flex flex-col text-left">
              <span className="font-display text-sm tracking-widest text-gold font-bold">
                LA CASA DE LAS LEYENDAS
              </span>
              <span className="text-[9px] uppercase tracking-wider text-cream/60">
                Guatemala • El juego actualizable
              </span>
            </div>
          </button>

          <Button 
            onClick={() => {
              sound.playMysticChime();
              onEnterGame();
            }}
            size="sm"
            className="py-2 px-4 text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(190,141,44,0.4)]"
          >
            <Play size={14} className="fill-current" />
            <span>JUGAR AHORA</span>
          </Button>
        </div>
      </header>

      {/* ==================== HERO ==================== */}
      <section className="relative z-10 pt-10 pb-16 px-4 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Sol y nube flotantes */}
        <motion.img
          src={solYNube}
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45, x: [0, 12, 0], y: [0, -8, 0] }}
          transition={{
            opacity: { duration: 1.5 },
            x: { repeat: Infinity, duration: 9, ease: 'easeInOut' },
            y: { repeat: Infinity, duration: 7, ease: 'easeInOut' }
          }}
          className="absolute top-16 left-2 sm:left-6 w-28 sm:w-40 pointer-events-none hidden md:block"
        />

        <div className="relative mb-6 max-w-sm mx-auto">
          <div className="absolute -top-6 -right-6 z-20 pointer-events-none">
            <MysticSun size={48} />
          </div>
          <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full -z-10 animate-pulse" />
          <motion.img 
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            src={logoCasa} 
            alt="Logo La Casa de las Leyendas" 
            width={288}
            height={288}
            className="w-56 sm:w-72 mx-auto drop-shadow-[0_0_25px_rgba(190,141,44,0.5)] object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = logoPng;
            }}
          />
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-5 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-maya-red/20 border border-maya-red/50 text-cream text-[11px] font-display tracking-widest uppercase shadow-[0_0_15px_rgba(200,55,55,0.25)]">
            <Sparkles size={13} className="text-gold" /> 
            <span>El primer juego actualizable de Guatemala</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display text-gold tracking-tight leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            LAS LEYENDAS NO MUEREN.
            <span className="text-cream italic font-serif text-2xl sm:text-4xl block mt-2">
              Se juegan en familia.
            </span>
          </h1>

          <p className="text-cream/80 text-sm sm:text-lg font-serif italic max-w-2xl mx-auto leading-relaxed">
            Un juego de mesa que despierta en tu teléfono: recorre Guatemala, invoca a La Llorona, 
            El Cadejo y El Sombrerón, y gana las Cuatro Llaves antes de que el olvido te alcance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button 
              onClick={() => {
                sound.playMysticChime();
                onEnterGame();
              }}
              size="lg"
              className="w-full sm:w-auto px-8 py-4 text-sm flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(190,141,44,0.6)] text-obsidian bg-gradient-to-r from-gold via-cream to-gold font-bold hover:scale-105"
            >
              <Play size={18} className="fill-obsidian" />
              <span>ENTRAR A LA CASA</span>
            </Button>

            <Button 
              variant="outline"
              onClick={() => scrollTo('historia')}
              size="lg"
              className="w-full sm:w-auto px-8 py-4 text-sm flex items-center justify-center gap-2 border-gold text-gold hover:bg-gold/15"
            >
              <ScrollText size={18} />
              <span>CONOCER LA HISTORIA</span>
            </Button>
          </div>
        </motion.div>

        <motion.button
          onClick={() => scrollTo('historia')}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-12 text-gold/70 hover:text-gold transition-colors cursor-pointer"
          aria-label="Desplazarse hacia abajo"
        >
          <ChevronDown size={28} />
        </motion.button>
      </section>

      {/* ==================== LA HISTORIA: LOS TZIPITIOS ==================== */}
      <section id="historia" className="relative z-10 py-16 px-4 max-w-4xl mx-auto border-t border-gold/20 scroll-mt-16">
        <motion.div {...reveal} className="text-center space-y-6">
          <span className="text-xs font-display text-maya-red tracking-widest uppercase block">
            La leyenda detrás del juego
          </span>
          <h2 className="text-2xl sm:text-4xl font-display text-cream">
            UNA CARRERA CONTRA EL OLVIDO
          </h2>

          <div className="space-y-5 text-left sm:text-center text-cream/85 font-serif text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
            <p>
              Bajo la luz plateada de la luna viven los{' '}
              <strong className="text-gold not-italic">Tzipitios</strong>: criaturas pequeñas, tímidas y 
              valientes, guardianas olvidadas de la sabiduría ancestral. Cuando un pueblo deja de contar 
              sus historias, un Tzipitio empieza a desvanecerse...
            </p>
            <p>
              Para sobrevivir deben llegar a{' '}
              <em className="text-gold">La Casa de las Leyendas</em>, el santuario donde habitan los seres 
              más famosos del misterio guatemalteco: La Llorona, El Cadejo, El Sombrerón y muchos más. 
              Solo allí, reclamando las{' '}
              <strong className="text-gold not-italic">Cuatro Llaves de la cultura</strong>, podrán volver a ser recordados.
            </p>
            <p className="text-maya-red/90 italic">
              Pero cuidado: las leyendas no quieren compartir su casa, y harán todo por detenerlos. 
              Solo en equipo —y con astucia— llegarás hasta la puerta.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <MysticKey isTurned size={44} />
          </div>

          <blockquote className="text-xl sm:text-2xl font-display text-gold italic pt-2">
            "¿Estás listo para escribir tu nombre en la historia?"
          </blockquote>
        </motion.div>
      </section>

      {/* ==================== QUÉ ES ==================== */}
      <section className="relative z-10 py-14 px-4 max-w-6xl mx-auto border-t border-gold/20">
        <motion.div {...reveal} className="text-center space-y-2 mb-10">
          <span className="text-xs font-display text-gold tracking-widest uppercase block">
            ¿Qué es La Casa de las Leyendas?
          </span>
          <h2 className="text-2xl sm:text-4xl font-display text-gold">
            MESA, TELÉFONO Y MAGIA, TODO EN UNO
          </h2>
          <p className="text-xs sm:text-sm text-cream/70 font-serif italic max-w-2xl mx-auto leading-relaxed">
            Un juego de mesa tradicional fusionado con tecnología para que ninguna partida sea igual a la anterior:
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              accent: 'bg-gold/15 border-gold/40 text-gold',
              icon: <MapIcon size={26} />,
              title: 'Un tablero que cobra vida',
              text: 'El mapa de Guatemala es el campo de juego: mercados de colores, ciudades coloniales encantadas y volcanes nublados. Cada edificio es una casilla especial con su propia aparición.'
            },
            {
              accent: 'bg-maya-red/20 border-maya-red/40 text-maya-red',
              icon: <Smartphone size={26} />,
              title: 'Una app sin instalación',
              text: 'Todo vive en el navegador de tu teléfono. Sin descargas ni registros complicados: entra, escoge tu Tzipitio y a jugar.'
            },
            {
              accent: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
              icon: <QrCode size={26} />,
              title: 'QR como varita mágica',
              text: 'Las cartas físicas se abren en retos digitales en tiempo real: trivia contra el reloj, mímica, detective de personajes y desafíos virales.'
            }
          ].map((pillar) => (
            <Card key={pillar.title} className="p-6 space-y-4 border-gold/30 hover:border-gold/60 transition-all hover:scale-[1.02]">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${pillar.accent}`}>
                {pillar.icon}
              </div>
              <h3 className="text-lg font-display text-gold">{pillar.title}</h3>
              <p className="text-xs text-cream/80 font-serif italic leading-relaxed">{pillar.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ==================== QUÉ INCLUYE ==================== */}
      <section className="relative z-10 py-14 px-4 max-w-6xl mx-auto border-t border-gold/20">
        <motion.div {...reveal} className="text-center space-y-2 mb-10">
          <span className="text-xs font-display text-gold tracking-widest uppercase block">
            Qué incluye
          </span>
          <h2 className="text-2xl sm:text-4xl font-display text-cream">
            ASÍ ES LA CAJA
          </h2>
          <p className="text-xs sm:text-sm text-cream/70 font-serif italic max-w-xl mx-auto">
            Todo lo que necesitas para convocar a las leyendas a tu mesa:
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BOX_ITEMS.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.08 }}
              className="p-5 rounded-xl bg-black/60 border border-gold/25 hover:border-gold/60 transition-all space-y-3"
            >
              <div className="w-11 h-11 rounded-lg bg-gold/15 border border-gold/35 flex items-center justify-center text-gold">
                {item.icon}
              </div>
              <h3 className="font-display text-base text-gold font-bold">{item.title}</h3>
              <p className="text-xs text-cream/75 font-serif italic leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== QUÉ ESPERAR: LOS RETOS ==================== */}
      <section className="relative z-10 py-14 px-4 max-w-5xl mx-auto border-t border-gold/20">
        <motion.div {...reveal} className="text-center space-y-2 mb-8">
          <span className="text-xs font-display text-maya-red tracking-widest uppercase block">
            Qué esperar
          </span>
          <h2 className="text-2xl sm:text-4xl font-display text-gold">
            CUATRO RETOS, UNA SOLA REGLA: DIVIÉRTETE
          </h2>
          <p className="text-xs sm:text-sm text-cream/70 font-serif italic max-w-xl mx-auto">
            Cada casilla con ícono invoca un tipo de reto distinto. ¿Cuál te tocará?
          </p>
        </motion.div>

        {/* Selector de retos */}
        <motion.div {...reveal} className="flex flex-wrap justify-center gap-2 mb-6">
          {CHALLENGES.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                sound.playClick();
                setActiveChallenge(c.id);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-display flex items-center gap-2 border transition-all cursor-pointer ${
                activeChallenge === c.id
                  ? 'bg-gold/20 text-gold border-gold/50 shadow-[0_0_15px_rgba(190,141,44,0.25)]'
                  : 'bg-black/40 text-cream/60 border-gold/20 hover:text-cream hover:border-gold/40'
              }`}
            >
              {c.icon}
              <span>{c.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Detalle del reto activo */}
        <motion.div 
          key={activeChallengeData.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="p-6 sm:p-8 space-y-5 border-gold/40">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
                {activeChallengeData.icon}
              </div>
              <div className="text-left">
                <h3 className="text-xl font-display text-gold">{activeChallengeData.name}</h3>
                <p className="text-xs text-cream/60 font-serif italic">{activeChallengeData.tagline}</p>
              </div>
            </div>
            <ul className="space-y-2.5 text-left">
              {activeChallengeData.rules.map((rule) => (
                <li key={rule} className="flex items-start gap-2.5 text-xs sm:text-sm text-cream/85 font-serif">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        {/* Nota de apariciones */}
        <motion.p {...reveal} className="mt-6 text-[11px] text-cream/50 font-serif italic text-center max-w-lg mx-auto flex items-center justify-center gap-2">
          <Ghost size={14} className="text-maya-red shrink-0" />
          <span>
            Y si caes en un edificio especial... se activa una Carta de Aparición y la noche se pone interesante.
          </span>
        </motion.p>
      </section>

      {/* ==================== CÓMO SE JUEGA ==================== */}
      <section id="como-jugar" className="relative z-10 py-14 px-4 max-w-4xl mx-auto border-t border-gold/20 scroll-mt-16">
        <motion.div {...reveal} className="text-center space-y-2 mb-10">
          <span className="text-xs font-display text-gold tracking-widest uppercase block">
            Cómo se juega con la app
          </span>
          <h2 className="text-2xl sm:text-4xl font-display text-cream">
            DE LA SALA A LA CASA EN 4 PASOS
          </h2>
        </motion.div>

        <div className="space-y-4">
          {PLAY_STEPS.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="flex items-start gap-4 p-4 rounded-xl bg-black/60 border border-gold/25 hover:border-gold/50 transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-gold text-obsidian font-display font-bold flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(190,141,44,0.4)]">
                {idx + 1}
              </div>
              <div className="text-left space-y-1">
                <h3 className="font-display text-sm text-gold font-bold">{step.title}</h3>
                <p className="text-xs text-cream/75 font-serif italic leading-relaxed">{step.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== LAS LEYENDAS ==================== */}
      <section className="relative z-10 py-14 px-4 max-w-6xl mx-auto border-t border-gold/20">
        <motion.div {...reveal} className="text-center space-y-2 mb-8">
          <span className="text-xs font-display text-gold tracking-widest uppercase block">
            Los habitantes de la Casa
          </span>
          <h2 className="text-2xl sm:text-4xl font-display text-cream">
            LAS 7 LEYENDAS ANCESTRALES
          </h2>
          <p className="text-xs text-cream/60 font-serif italic">
            Toca cualquiera para asomarte a su historia:
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEYENDAS_DATA.map((legend) => (
            <motion.div
              key={legend.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                sound.playClick();
                setSelectedTeaser(selectedTeaser === legend.id ? null : legend.id);
              }}
              className="p-4 rounded-xl bg-black/60 border border-gold/30 hover:border-gold/60 transition-all cursor-pointer text-left space-y-2 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <PassportStampSvg code={legend.code} name={legend.name} isUnlocked={true} size={42} />
                <span className="text-[10px] uppercase font-display text-cream/50">
                  {legend.category}
                </span>
              </div>

              <h4 className="font-display text-base text-gold font-bold">{legend.name}</h4>
              <p className="text-xs text-cream/70 font-serif italic line-clamp-2">
                "{legend.shortDescription}"
              </p>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gold font-display">
                <span>{selectedTeaser === legend.id ? 'Ocultar' : 'Ver secreto'}</span>
                <ChevronDown 
                  size={14} 
                  className={`transition-transform duration-300 ${selectedTeaser === legend.id ? 'rotate-180' : ''}`} 
                />
              </div>

              {selectedTeaser === legend.id && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-3 border-t border-gold/20 space-y-2 text-xs font-serif"
                >
                  <p className="text-cream/90 italic">"{legend.fullStory}"</p>
                  <p className="text-[11px] text-gold font-display">{legend.culturalOrigin}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== POR QUÉ ES ÚNICO ==================== */}
      <section className="relative z-10 py-14 px-4 max-w-6xl mx-auto border-t border-gold/20">
        <motion.div {...reveal} className="text-center space-y-2 mb-10">
          <span className="text-xs font-display text-maya-red tracking-widest uppercase block">
            Producto original
          </span>
          <h2 className="text-2xl sm:text-4xl font-display text-gold">
            NO HAY OTRO JUEGO COMO ESTE
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {UNIQUE_POINTS.map((point, idx) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (idx % 2) * 0.08 }}
              className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-black/70 to-earth-brown/20 border border-gold/30 hover:border-gold/60 transition-all"
            >
              <div className="w-11 h-11 rounded-lg bg-gold/15 border border-gold/35 flex items-center justify-center text-gold shrink-0">
                {point.icon}
              </div>
              <div className="space-y-1.5 text-left">
                <h3 className="font-display text-sm text-gold font-bold leading-snug">{point.title}</h3>
                <p className="text-xs text-cream/75 font-serif italic leading-relaxed">{point.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== CTA FINAL ==================== */}
      <section className="relative z-10 py-16 px-4 max-w-4xl mx-auto text-center">
        <motion.div {...reveal}>
          <Card className="p-8 sm:p-12 space-y-6 border-gold/50 bg-gradient-to-b from-black/80 to-earth-brown/30 relative overflow-hidden shadow-[0_0_50px_rgba(122,49,8,0.4)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-3xl rounded-full pointer-events-none" />
            
            <span className="text-xs font-display text-gold uppercase tracking-widest block">
              El tablero está listo y las velas encendidas
            </span>

            <h2 className="text-3xl sm:text-4xl font-display text-cream">
              HAY UN TZIPITIO ESPERÁNDOTE
            </h2>

            <p className="text-xs sm:text-base text-cream/80 font-serif italic max-w-xl mx-auto">
              Reúne a tu familia o a tus compas, saca las tarjetas y deja que las leyendas 
              entren a la mesa. El viento sopla entre los cerros... y la Casa aguarda.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button 
                onClick={() => {
                  sound.playMysticChime();
                  onEnterGame();
                }}
                size="lg"
                className="px-10 py-5 text-sm sm:text-base inline-flex items-center gap-3 shadow-[0_0_30px_rgba(190,141,44,0.7)] text-obsidian bg-gradient-to-r from-gold via-cream to-gold font-bold hover:scale-105"
              >
                <Play size={20} className="fill-obsidian" />
                <span>ENTRAR A LA CASA</span>
              </Button>

              <Button 
                variant="outline"
                onClick={() => {
                  sound.playClick();
                  onEnterExplorer();
                }}
                size="lg"
                className="px-8 py-5 text-xs sm:text-sm inline-flex items-center gap-2 border-gold text-gold hover:bg-gold/15"
              >
                <MapPin size={16} />
                <span>EXPLORAR LEYENDAS GRATIS</span>
              </Button>
            </div>

            <a 
              href={RULES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-gold/70 hover:text-gold underline underline-offset-4 transition-colors font-serif italic"
            >
              <ScrollText size={13} />
              Lee las instrucciones completas del juego de mesa
            </a>
          </Card>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-gold/20 py-8 px-4 text-center text-xs text-cream/50 space-y-2">
        <p className="font-display text-gold tracking-widest text-sm">
          LA CASA DE LAS LEYENDAS • GUATEMALA
        </p>
        <p className="font-serif italic text-[11px]">
          Preservando el patrimonio oral, la magia y las tradiciones populares de Guatemala.
        </p>
        <p className="text-[10px] text-cream/30 pt-2">
          © {new Date().getFullYear()} lluviadeidea editorial. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};


