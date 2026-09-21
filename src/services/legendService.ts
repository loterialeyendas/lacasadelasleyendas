import { Legend } from '../types/legend';

export const LEYENDAS_DATA: Legend[] = [
  {
    id: 'sombreron',
    code: 'SOMB',
    name: 'El Sombrerón',
    title: 'El Enamorado de la Noche',
    category: 'character',
    keyReward: 'jade',
    shortDescription: 'Un hombre diminuto con un sombrero inmenso, botas de tacón y una guitarra mágica.',
    fullStory: 'Viste de negro con un cinturón reluciente. Se dice que vaga por los barrios coloniales de Guatemala en busca de jóvenes de cabello largo y ojos grandes para entonarles dulces serenatas y trenzarles el cabello con nudos imposibles de deshacer, dejándolas encantadas sin poder comer ni dormir.',
    culturalOrigin: 'Tradición oral de Santiago de Guatemala y Quetzaltenango (Siglo XVIII)',
    didYouKnow: 'Para curar a una víctima del Sombrerón, la tradición colonial mandaba cortarle el cabello inmediatamente y bendecirlo en una iglesia con agua bendita.',
    difficulty: 'medio',
    icon: 'Music',
    pointsReward: 300,
    riddle: {
      hints: [
        'Visto botas brillantes que resuenan en las calles empedradas...',
        'Llevo un accesorio tan grande en la cabeza que casi no me deja ver el cielo...',
        'Canto al pie de las ventanas y trenzo la crin de los caballos y el pelo de las doncellas.'
      ],
      options: ['El Sombrerón', 'El Cadejo', 'El Duende de la Mina', 'El Carretón'],
      correctAnswer: 'El Sombrerón',
      revealedInfo: '¡Correcto! El Sombrerón es también conocido como Tzitzimite en ciertas regiones de Centroamérica.'
    }
  },
  {
    id: 'cadejo',
    code: 'CADE',
    name: 'El Cadejo',
    title: 'El Guardián de Dos Rostros',
    category: 'trivia',
    keyReward: 'gold',
    shortDescription: 'Dos perros espectrales con patas de cabra y ojos encendidos que acompañan a los caminantes nocturnos.',
    fullStory: 'El Cadejo blanco es un espíritu benigno enviado para proteger a los viajeros pacíficos de los peligros del camino y de otros espectros. En contraste, el Cadejo negro busca devorar el alma de aquellos que caminan extraviados o con malas intenciones.',
    culturalOrigin: 'Cosmovisión mestiza maya-española presente en todo el territorio guatemalteco',
    didYouKnow: 'Se dice que cuando el Cadejo blanco y el negro se encuentran en un cruce de caminos, libran una batalla feroz donde se escuchan aullidos que congelan la sangre.',
    difficulty: 'fácil',
    icon: 'Shield',
    pointsReward: 250,
    trivia: {
      question: 'Según la tradición popular guatemalteca, ¿cuál es el propósito del Cadejo Blanco?',
      options: [
        'Asustar a los niños desobedientes',
        'Proteger y cuidar a los caminantes nocturnos',
        'Indicar dónde hay tesoros enterrados',
        'Llevarse las almas de los pecadores'
      ],
      answer: 1,
      explanation: 'El Cadejo Blanco es considerado el protector bondadoso de los viajeros nocturnos, mientras que el Negro representa la perdición.',
      timeLimit: 20
    }
  },
  {
    id: 'llorona',
    code: 'LLOR',
    name: 'La Llorona',
    title: 'El Llanto del Desconsuelo',
    category: 'trivia',
    keyReward: 'gold',
    shortDescription: 'El alma en pena de una mujer vestida de blanco que busca a sus hijos cerca de fuentes y ríos.',
    fullStory: 'La leyenda relata el trágico destino de María, una mujer que en un acto de desesperación ahogó a sus propios hijos y ahora vaga eternamente penando por las orillas de los ríos, lagos y pilas públicas, con un grito desgarrador que hace temblar la noche.',
    culturalOrigin: 'Leyenda colonial novohispana arraigada en Guatemala desde el siglo XVI',
    didYouKnow: 'La creencia popular dice: si escuchas el llanto de La Llorona muy cerca, en realidad está lejos; pero si lo escuchas a la distancia, ¡cuidado, está justo a tu lado!',
    difficulty: 'fácil',
    icon: 'Ghost',
    pointsReward: 250,
    trivia: {
      question: '¿Qué ocurre según el dicho popular cuando escuchas el grito de La Llorona muy lejos?',
      options: [
        'Significa que ya se marchó',
        'Significa que está en realidad muy cerca de ti',
        'Indica que va a llover torrencialmente',
        'Significa que está buscando a otro viajero'
      ],
      answer: 1,
      explanation: 'La paradoja del eco místico: su lamento engaña los sentidos; lejos suena cerca y cerca suena lejos.',
      timeLimit: 20
    }
  },
  {
    id: 'siguanaba',
    code: 'SIGU',
    name: 'La Siguanaba',
    title: 'La Ilusión del Barranco',
    category: 'character',
    keyReward: 'jade',
    shortDescription: 'Aparece como una hermosa mujer bañándose a la luz de la luna, pero revela un rostro equino terrorífico.',
    fullStory: 'Originalmente llamada Sihuehuet (mujer hermosa), fue castigada por descuidar a su hijo y engañar a su esposo. Ahora se aparece en los ríos y caminos solitarios a hombres infieles o trasnochadores, guiándolos hacia barrancos profundos antes de mostrar su rostro con mandíbula de caballo.',
    culturalOrigin: 'Fusión de la mitología maya tzitzimitl con narrativas coloniales',
    didYouKnow: 'Para liberarse de la fascinación de la Siguanaba, la tradición aconseja tirarse al suelo boca arriba, morder una rama de ruda o jalarse fuertemente el cabello.',
    difficulty: 'medio',
    icon: 'Eye',
    pointsReward: 300,
    riddle: {
      hints: [
        'Me baño de noche con un huipil transparente junto a las pilas o arroyos...',
        'Muestro una figura espléndida de espaldas para atraer a los curiosos...',
        'Cuando me miran de frente, descubren mi verdadero rostro cadavérico con forma de caballo.'
      ],
      options: ['La Siguanaba', 'La Tatuana', 'La Llorona', 'La Ciguapa'],
      correctAnswer: 'La Siguanaba',
      revealedInfo: '¡Correcto! Su hijo en el folclore guatemalteco es el mismísimo Cipitío, condenado a no crecer jamás.'
    }
  },
  {
    id: 'tatuana',
    code: 'TATU',
    name: 'La Tatuana',
    title: 'La Hechicera del Barco de Carbón',
    category: 'social',
    keyReward: 'obsidian',
    shortDescription: 'Una mujer acusada de brujería que escapó de las celdas de la Inquisición trazando un navío en el muro.',
    fullStory: 'Condenada por el Santo Oficio en la época colonial, pidió como última gracia un pedazo de carbón. Dibujó en el muro de su celda un barco velero con tanto detalle que, pronunciando unas palabras arcanas, subió a bordo y el navío navegó por los aires cruzando las rejas de la prisión.',
    culturalOrigin: 'Santiago de Guatemala / Antigua Guatemala (Siglo XVII)',
    didYouKnow: 'Miguel Ángel Asturias, premio Nobel guatemalteco, inmortalizó este mito en su célebre libro "Leyendas de Guatemala".',
    difficulty: 'difícil',
    icon: 'Sparkles',
    pointsReward: 350,
    socialChallenge: {
      title: 'El Trazo de la Fuga Mística',
      instructions: '¡Conquista la Llave de Obsidiana! Tómate una foto o video corto simulando que dibujas un barco mágico en el aire o en un muro con tu dedo de carbón. Compártelo en Instagram Stories, WhatsApp o TikTok con el hashtag oficial.',
      poseDescription: 'Posar con expresión hechicera y la mano trazando el velero mágico en el aire.',
      suggestedHashtag: '#CasaDeLasLeyendasGT',
      shareQuote: '¡Navegando entre las sombras con La Tatuana en La Casa de las Leyendas! ⛵✨🗝️',
      points: 350
    },
    trivia: {
      question: '¿Qué objeto utilizó La Tatuana para escapar mágicamente de su prisión colonial?',
      options: [
        'Una llave forjada en plata pura',
        'Un trozo de carbón con el que dibujó un barco',
        'Un espejo encantado de obsidiana',
        'Un manto tejido con hilos de oro'
      ],
      answer: 1,
      explanation: 'Con un simple carbón dibujó un barco en el muro y navegó por los aires escapando para siempre de sus captores.',
      timeLimit: 20
    }
  },
  {
    id: 'carreton',
    code: 'CARR',
    name: 'El Carretón de la Muerte',
    title: 'El Rodar de las Cadenas',
    category: 'mime',
    keyReward: 'silver',
    shortDescription: 'Una carreta fantasmal tirada por caballos con ojos de fuego que recoge las almas de los moribundos.',
    fullStory: 'No lleva cochero visible o bien es guiada por la mismísima Muerte. Sus ruedas chirrían con un estruendo metálico que no toca el adoquín y se acompaña de un viento helado. Se detiene frente a las casas donde alguien está a punto de partir hacia el más allá.',
    culturalOrigin: 'Tradición de las calles coloniales de la Nueva Guatemala de la Asunción',
    didYouKnow: 'Cuentan que si alguien oye el carretón aproximarse, debe cerrar puertas y ventanas y no asomarse por las cerraduras bajo riesgo de perder el habla o la razón.',
    difficulty: 'medio',
    icon: 'Skull',
    pointsReward: 300,
    challenge: {
      title: 'El Paso de las Cadenas',
      instructions: 'Realiza mímica y efectos de sonido con objetos cercanos imitando el avance del Carretón de la Muerte y el susto de los pobladores.',
      roleDescription: 'Uno o dos jugadores interpretan el carretón y el resto deben reaccionar con terror místico.',
      timeLimit: 45,
      points: 300
    }
  },
  {
    id: 'cipitio',
    code: 'CIPI',
    name: 'El Cipitío',
    title: 'El Niño Eterno de los Pies al Revés',
    category: 'trivia',
    keyReward: 'gold',
    shortDescription: 'El hijo de la Siguanaba, un duendecillo barrigón que come ceniza y camina con los pies volteados.',
    fullStory: 'Tiene la magia de teletransportarse y engaña a los cazadores y campesinos con sus huellas, pues al tener los pies apuntando hacia atrás, parece que avanza cuando en realidad va en dirección opuesta.',
    culturalOrigin: 'Folclore mesoamericano presente en el oriente y sur de Guatemala',
    didYouKnow: 'Le encanta arrojar piedrecitas y flores a las jóvenes que lavan en los ríos y su comida favorita es la ceniza caliente de los fogones de leña.',
    difficulty: 'fácil',
    icon: 'Feather',
    pointsReward: 250,
    trivia: {
      question: '¿Por qué las huellas del Cipitío confunden a quienes intentan seguirlo en el bosque?',
      options: [
        'Porque camina en círculos',
        'Porque tiene los pies al revés (apuntando hacia atrás)',
        'Porque vuela y no deja huellas',
        'Porque borra sus pasos con una rama'
      ],
      answer: 1,
      explanation: 'Sus pies están orientados hacia atrás, por lo que el rastro indica el sentido contrario al que realmente caminó.',
      timeLimit: 20
    }
  }
];

export const getLegendById = (id: string): Legend | undefined => {
  return LEYENDAS_DATA.find((l) => l.id.toLowerCase() === id.toLowerCase());
};

export const getLegendByCode = (code: string): Legend | undefined => {
  let normalized = code.trim().toUpperCase();
  
  // Limpiar prefijos de tarjetas físicas de tablero (ej: "TRIV-SOMB" -> "SOMB", "CARD-TATU" -> "TATU")
  if (normalized.includes('-')) {
    const parts = normalized.split('-');
    normalized = parts[parts.length - 1]; // tomar el sufijo del código
  } else if (normalized.includes('_')) {
    const parts = normalized.split('_');
    normalized = parts[parts.length - 1];
  }

  return LEYENDAS_DATA.find((l) => l.code === normalized || l.id.toUpperCase() === normalized);
};

export const parseQRData = (rawText: string): Legend | undefined => {
  const clean = rawText.trim();
  
  // Si viene en formato URL (ej: https://.../?legend=sombreron o /card/SOCI-TATU)
  try {
    if (clean.includes('http://') || clean.includes('https://') || clean.includes('?') || clean.includes('/')) {
      const url = new URL(clean.startsWith('http') ? clean : `https://lacasadelasleyendas.com/${clean}`);
      const legendParam = 
        url.searchParams.get('legend') || 
        url.searchParams.get('card') || 
        url.searchParams.get('id') || 
        url.searchParams.get('code');

      if (legendParam) {
        return getLegendByCode(legendParam) || getLegendById(legendParam);
      }

      // Si la URL contiene la leyenda en el pathname (ej: /qr/sombreron o /card/TRIV-CADE)
      const segments = url.pathname.split('/').filter(Boolean);
      const lastSegment = segments[segments.length - 1];
      if (lastSegment) {
        const match = getLegendByCode(lastSegment) || getLegendById(lastSegment);
        if (match) return match;
      }
    }
  } catch {
    // Si no es URL válida, continuar con búsqueda directa
  }

  // Búsqueda por ID, Tarjeta o Código
  return getLegendByCode(clean) || getLegendById(clean);
};

