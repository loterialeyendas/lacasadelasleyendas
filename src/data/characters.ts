import { KeyType } from '../types/game';
import chanchoSvg from '../images/tzipitios/Chancho.svg';
import chelaSvg from '../images/tzipitios/Chela.svg';
import chileraSvg from '../images/tzipitios/Chilera.svg';
import chincheSvg from '../images/tzipitios/Chinche.svg';
import chispudaSvg from '../images/tzipitios/Chispuda.svg';
import chongoSvg from '../images/tzipitios/Chongo.svg';

export interface LegendCharacter {
  id: string;
  code: string;
  name: string;
  title: string;
  archetype: string;
  element: string;
  keyReward: KeyType;
  colorTheme: {
    bg: string;
    border: string;
    text: string;
    glow: string;
    gradient: string;
  };
  iconName: string;
  avatarSvg: string;
  quote: string;
  perk: string;
}

// Los 6 Tzipitíos Oficiales de La Casa de las Leyendas
export const LEGEND_CHARACTERS: LegendCharacter[] = [
  {
    id: 'chancho',
    code: 'CHAN',
    name: 'Chancho',
    title: 'El Glotón Sabrosón',
    archetype: 'Espíritu del Banquete',
    element: 'Fuego y Fogón',
    keyReward: 'gold',
    colorTheme: {
      bg: 'bg-amber-950/60',
      border: 'border-amber-500/70',
      text: 'text-amber-400',
      glow: 'rgba(245, 158, 11, 0.45)',
      gradient: 'from-amber-900/80 via-yellow-950 to-black'
    },
    iconName: 'Flame',
    avatarSvg: chanchoSvg,
    quote: '¡La barriga llena alegra el alma y espanta a cualquier aparecido!',
    perk: 'Resistencia voraz y ánimo inquebrantable ante los enigmas.'
  },
  {
    id: 'chela',
    code: 'CHEL',
    name: 'Chela',
    title: 'La Dama de la Luna y las Cumbres',
    archetype: 'Guardián de la Bruma',
    element: 'Viento Frío y Luna',
    keyReward: 'silver',
    colorTheme: {
      bg: 'bg-sky-950/60',
      border: 'border-sky-400/70',
      text: 'text-sky-300',
      glow: 'rgba(56, 189, 248, 0.45)',
      gradient: 'from-sky-900/80 via-blue-950 to-black'
    },
    iconName: 'Moon',
    avatarSvg: chelaSvg,
    quote: 'Bajo la luna de plata de Xela, ningún misterio queda oculto.',
    perk: 'Visión serena para revelar pistas ocultas en la penumbra.'
  },
  {
    id: 'chilera',
    code: 'CHIL',
    name: 'Chilera',
    title: 'El Alma Pura de la Fiesta',
    archetype: 'Espíritu Festivo',
    element: 'Color y Algarabía',
    keyReward: 'jade',
    colorTheme: {
      bg: 'bg-emerald-950/60',
      border: 'border-emerald-500/70',
      text: 'text-emerald-400',
      glow: 'rgba(16, 185, 129, 0.45)',
      gradient: 'from-emerald-900/80 via-emerald-950 to-black'
    },
    iconName: 'Sparkles',
    avatarSvg: chileraSvg,
    quote: '¡Qué chilero se siente explorar, descubrir leyendas y ganar juntos!',
    perk: 'Entusiasmo mágico que contagia vibra y lucidez a todo el grupo.'
  },
  {
    id: 'chinche',
    code: 'CHIN',
    name: 'Chinche',
    title: 'El Diminuto Escurridizo',
    archetype: 'Pícaro Infiltrado',
    element: 'Sombra y Sigilo',
    keyReward: 'obsidian',
    colorTheme: {
      bg: 'bg-rose-950/60',
      border: 'border-rose-500/70',
      text: 'text-rose-400',
      glow: 'rgba(244, 63, 94, 0.45)',
      gradient: 'from-rose-950 via-neutral-950 to-black'
    },
    iconName: 'Shield',
    avatarSvg: chincheSvg,
    quote: 'Por las rendijas más diminutas se descubren los mayores secretos.',
    perk: 'Astucia silenciosa para descifrar acertijos crípticos.'
  },
  {
    id: 'chispuda',
    code: 'CHIS',
    name: 'Chispuda',
    title: 'El Relámpago del Ingenio',
    archetype: 'Chispa Rápida',
    element: 'Luz y Destello',
    keyReward: 'gold',
    colorTheme: {
      bg: 'bg-yellow-950/60',
      border: 'border-gold/80',
      text: 'text-gold',
      glow: 'rgba(252, 207, 101, 0.45)',
      gradient: 'from-amber-800/80 via-yellow-950 to-black'
    },
    iconName: 'Flame',
    avatarSvg: chispudaSvg,
    quote: '¡Ponte las pilas! Quien no vuela rápido se queda con la duda.',
    perk: 'Reflejos veloces para superar retos y trivias contra el reloj.'
  },
  {
    id: 'chongo',
    code: 'CHON',
    name: 'Chongo',
    title: 'El Bohemio Risueño',
    archetype: 'Trovador de la Calle',
    element: 'Música y Tradición',
    keyReward: 'silver',
    colorTheme: {
      bg: 'bg-purple-950/60',
      border: 'border-purple-400/70',
      text: 'text-purple-300',
      glow: 'rgba(168, 85, 247, 0.45)',
      gradient: 'from-purple-900/80 via-indigo-950 to-black'
    },
    iconName: 'Music',
    avatarSvg: chongoSvg,
    quote: 'Con rimas, ritmo y risas se desarman las trampas de la noche.',
    perk: 'Oído bohemio para descifrar acertijos musicales y poéticos.'
  }
];

// Mapa para retrocompatibilidad con perfiles existentes que guardaron leyendas previas
const LEGACY_ID_MAP: Record<string, string> = {
  sombreron: 'chongo',
  cadejo: 'chela',
  llorona: 'chilera',
  siguanaba: 'chispuda',
  tatuana: 'chinche',
  carreton: 'chancho',
  cipitio: 'chinche'
};

export const getCharacterById = (id?: string | null): LegendCharacter => {
  if (!id) return LEGEND_CHARACTERS[0];
  const cleanId = id.toLowerCase().trim();
  const direct = LEGEND_CHARACTERS.find((c) => c.id.toLowerCase() === cleanId);
  if (direct) return direct;
  const mappedId = LEGACY_ID_MAP[cleanId];
  if (mappedId) {
    const mapped = LEGEND_CHARACTERS.find((c) => c.id === mappedId);
    if (mapped) return mapped;
  }
  return LEGEND_CHARACTERS[0];
};

export const getPlayerCeremonialRank = (score: number, totalKeys: number) => {
  if (totalKeys >= 4 || score >= 1200) {
    return {
      title: 'Maestro de las 7 Leyendas',
      level: 4,
      badge: '👑',
      desc: 'Portador de las 4 llaves sagradas y sabio de Guatemala'
    };
  }
  if (totalKeys >= 3 || score >= 800) {
    return {
      title: 'Guardián de Portales',
      level: 3,
      badge: '🔮',
      desc: 'Dominas los enigmas y conoces los senderos oscuros'
    };
  }
  if (totalKeys >= 1 || score >= 400) {
    return {
      title: 'Rastreador de Sombras',
      level: 2,
      badge: '🗝️',
      desc: 'Has cruzado el velo y conquistado tu primera llave'
    };
  }
  return {
    title: 'Iniciado del Portal',
    level: 1,
    badge: '🕯️',
    desc: 'Comienzas a descubrir las leyendas de Guatemala'
  };
};
