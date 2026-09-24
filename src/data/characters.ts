import { KeyType } from '../types/game';

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
  quote: string;
  perk: string;
}

export const LEGEND_CHARACTERS: LegendCharacter[] = [
  {
    id: 'sombreron',
    code: 'SOMB',
    name: 'El Sombrerón',
    title: 'El Enamorado de la Noche',
    archetype: 'Trovador Errante',
    element: 'Viento Colonial',
    keyReward: 'jade',
    colorTheme: {
      bg: 'bg-emerald-950/60',
      border: 'border-emerald-500/60',
      text: 'text-emerald-400',
      glow: 'rgba(16, 185, 129, 0.45)',
      gradient: 'from-emerald-900/80 via-emerald-950 to-black'
    },
    iconName: 'Music',
    quote: 'En las cuerdas de plata viaja el suspiro de las doncellas.',
    perk: 'Oído místico para descifrar acertijos poéticos.'
  },
  {
    id: 'cadejo',
    code: 'CADE',
    name: 'El Cadejo Blanco',
    title: 'El Guardián del Camino',
    archetype: 'Espíritu Protector',
    element: 'Fuego y Luz',
    keyReward: 'gold',
    colorTheme: {
      bg: 'bg-amber-950/60',
      border: 'border-gold/70',
      text: 'text-gold',
      glow: 'rgba(252, 207, 101, 0.45)',
      gradient: 'from-amber-900/80 via-yellow-950 to-black'
    },
    iconName: 'Shield',
    quote: 'Mis ojos arden para disipar las sombras que acechan tus pasos.',
    perk: 'Escudo guardián que inspira valentía en encrucijadas.'
  },
  {
    id: 'llorona',
    code: 'LLOR',
    name: 'La Llorona',
    title: 'El Llanto del Desconsuelo',
    archetype: 'Espectro de las Aguas',
    element: 'Agua y Neblina',
    keyReward: 'gold',
    colorTheme: {
      bg: 'bg-sky-950/60',
      border: 'border-sky-400/60',
      text: 'text-sky-300',
      glow: 'rgba(56, 189, 248, 0.45)',
      gradient: 'from-sky-900/80 via-blue-950 to-black'
    },
    iconName: 'Ghost',
    quote: 'En el murmullo de los ríos se oye la pena de los siglos.',
    perk: 'Intuición profunda para percibir secretos distantes.'
  },
  {
    id: 'siguanaba',
    code: 'SIGU',
    name: 'La Siguanaba',
    title: 'La Ilusión del Barranco',
    archetype: 'Hechicera Lunar',
    element: 'Espejismo y Selva',
    keyReward: 'jade',
    colorTheme: {
      bg: 'bg-teal-950/60',
      border: 'border-teal-400/60',
      text: 'text-teal-300',
      glow: 'rgba(20, 184, 166, 0.45)',
      gradient: 'from-teal-900/80 via-emerald-950 to-black'
    },
    iconName: 'Sparkles',
    quote: 'No todo lo que deslumbra es lo que tus ojos quieren ver.',
    perk: 'Fascinación hipnótica que desafía el ingenio humano.'
  },
  {
    id: 'tatuana',
    code: 'TATU',
    name: 'La Tatuana',
    title: 'La Dama del Navío de Carbón',
    archetype: 'Maga Ancestral',
    element: 'Éter y Símbolos',
    keyReward: 'silver',
    colorTheme: {
      bg: 'bg-purple-950/60',
      border: 'border-purple-400/60',
      text: 'text-purple-300',
      glow: 'rgba(168, 85, 247, 0.45)',
      gradient: 'from-purple-900/80 via-indigo-950 to-black'
    },
    iconName: 'Sailboat',
    quote: 'Con un trazo de carbón sobre la piedra navego hacia la libertad.',
    perk: 'Maestría con símbolos antiguos y acertijos crípticos.'
  },
  {
    id: 'carreton',
    code: 'CARR',
    name: 'El Carretón',
    title: 'El Conductor de Medianoche',
    archetype: 'Caronte Nocturno',
    element: 'Hierro y Tinieblas',
    keyReward: 'silver',
    colorTheme: {
      bg: 'bg-slate-900/70',
      border: 'border-slate-400/60',
      text: 'text-slate-200',
      glow: 'rgba(148, 163, 184, 0.45)',
      gradient: 'from-slate-800 via-slate-950 to-black'
    },
    iconName: 'Moon',
    quote: 'El chirrido de las ruedas anuncia que el destino no espera.',
    perk: 'Paso inquebrantable frente a retos de resistencia.'
  },
  {
    id: 'cipitio',
    code: 'CIPI',
    name: 'El Cipitío',
    title: 'El Duende de las Cenizas',
    archetype: 'Pícaro Guardián',
    element: 'Tierra y Ceniza',
    keyReward: 'obsidian',
    colorTheme: {
      bg: 'bg-rose-950/60',
      border: 'border-rose-500/60',
      text: 'text-rose-400',
      glow: 'rgba(244, 63, 94, 0.45)',
      gradient: 'from-rose-950 via-neutral-950 to-black'
    },
    iconName: 'Flame',
    quote: 'Camino hacia adelante dejando huellas hacia atrás.',
    perk: 'Astucia traviesa para desorientar a los rivales.'
  }
];

export const getCharacterById = (id?: string | null): LegendCharacter => {
  if (!id) return LEGEND_CHARACTERS[0];
  const found = LEGEND_CHARACTERS.find((c) => c.id.toLowerCase() === id.toLowerCase());
  return found || LEGEND_CHARACTERS[0];
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
