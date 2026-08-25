import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ElementalLockContent {
  id: string;
  name: string;
  type: 'oro' | 'plata' | 'jade' | 'vida';
  badgeBg: string;
  subtitle: string;
  question: string;
  answer: string;
  culturalInsight: string;
  associatedLegends: string[];
}

export interface LandingContent {
  brandTitle: string;
  brandSubtitle: string;
  heroBadge: string;
  heroTitle: string;
  heroTitleItalic: string;
  heroDescription: string;
  heroCoverImageUrl?: string; // Imagen de portada personalizable de la Landing
  playButtonText: string;
  passportButtonText: string;
  bannerBadge: string;
  bannerTitle: string;
  locksSectionBadge: string;
  locksSectionTitle: string;
  locksSectionDescription: string;
  locks: ElementalLockContent[];
  legendFichasImages?: Record<string, string>; // Imágenes personalizadas para las 7 fichas de leyendas
  pillarsSectionBadge: string;
  pillarsSectionTitle: string;
  pillarsSectionDescription: string;
  pillar1Title: string;
  pillar1Description: string;
  pillar2Title: string;
  pillar2Description: string;
  pillar3Title: string;
  pillar3Description: string;
  ctaBadge: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  footerTitle: string;
  footerDescription: string;
}

export interface TheaterStationContent {
  number: number;
  location: string;
  legend: string;
  code: string;
  badge: string;
  badgeColor: string;
  description: string;
  highlights: string[];
  imageUrl?: string; // Imagen personalizada para el círculo/ficha de la estación
}

export interface TicketPlanContent {
  id: string; // 'jade' | 'vida' | 'oro' | 'plata'
  name: string;
  keyType: 'jade' | 'vida' | 'oro' | 'plata';
  badge: string;
  badgeBg: string;
  price: string;
  priceNote: string;
  capacityText: string;
  description: string;
  includes: string[];
  imageUrl?: string; // Imagen personalizada de la llave/candado
}

export interface TicketingPhaseContent {
  id: string;
  dates: string;
  title: string;
  discountBadge?: string;
  description: string;
  highlights: string[];
}

export interface TheaterTicketingContent {
  sectionBadge: string;
  sectionTitle: string;
  sectionDescription: string;
  selfServiceTitle: string;
  selfServiceDescription: string;
  selfServiceFootnote: string;
  phasesSectionTitle: string;
  phases: TicketingPhaseContent[];
  plansSectionTitle: string;
  plansSectionDescription: string;
  plans: TicketPlanContent[];
  specialEditionBadge: string;
  specialEditionTitle: string;
  specialEditionDescription: string;
  supportNote: string;
}

export interface SponsorTierContent {
  id: string;
  name: string;
  badge: string;
  investment: string;
  description: string;
  benefits: string[];
  isFeatured?: boolean;
}

export interface TheaterSponsorshipContent {
  sectionBadge: string;
  sectionTitle: string;
  sectionDescription: string;
  tiers: SponsorTierContent[];
  contactBadge: string;
  contactTitle: string;
  contactDescription: string;
  contactButtonText: string;
  whatsappMessage: string;
}

export interface LiveTheaterContent {
  badge: string;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  city: string;
  duration: string;
  durationSubtitle: string;
  coverImageUrl?: string; // Imagen de cartel/portada del evento teatral
  manifestoP1: string;
  manifestoP2: string;
  manifestoHighlight: string;
  dynamicsSectionBadge: string;
  dynamicsSectionTitle: string;
  dynamicsSectionDescription: string;
  groupTitle: string;
  groupDescription: string;
  groupFootnote: string;
  guideTitle: string;
  guideDescription: string;
  guideFootnote: string;
  stationsSectionBadge: string;
  stationsSectionTitle: string;
  stations: TheaterStationContent[];
  ticketing: TheaterTicketingContent; // Sistema de boletería en línea y planes
  sponsorship: TheaterSponsorshipContent; // Alianzas estratégicas y patrocinadores
  footerTitle: string;
  footerDescription: string;
}

export interface SiteContent {
  landing: LandingContent;
  theater: LiveTheaterContent;
  lastUpdated?: number;
}

export const DEFAULT_LANDING_CONTENT: LandingContent = {
  brandTitle: 'LA CASA DE LAS LEYENDAS',
  brandSubtitle: 'Guatemala • Experiencia Interactiva',
  heroBadge: 'El Portal Místico de Guatemala',
  heroTitle: 'DESCUBRE EL MISTERIO.',
  heroTitleItalic: 'Vive las Leyendas de Nuestros Ancestros.',
  heroDescription: 'Una experiencia cultural e interactiva que combina el juego de mesa físico, el recorrido presencial con códigos QR y desafíos digitales en tiempo real.',
  heroCoverImageUrl: '',
  playButtonText: 'ENTRAR AL JUEGO',
  passportButtonText: 'PASAPORTE DE SELLOS',
  bannerBadge: '31 DE OCTUBRE 2026 • TEATRO MUNICIPAL DE QUETZALTENANGO',
  bannerTitle: 'Tradición Escénica en Vivo: Recorrido Inmersivo en el Teatro →',
  locksSectionBadge: 'Dinámica Educativa de Secretos',
  locksSectionTitle: 'DESCUBRE QUÉ HAY DETRÁS DE CADA CANDADO',
  locksSectionDescription: 'Abre los candados sagrados de Oro, Plata, Jade y Vida para revelar la sabiduría y el trasfondo histórico de nuestras tradiciones:',
  locks: [
    {
      id: 'lock-oro',
      name: 'Candado de Oro',
      type: 'oro',
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
      badgeBg: 'bg-black/90 text-amber-200 border-gold/60 font-bold',
      subtitle: 'El Trascender de las Almas y la Memoria',
      question: '¿Por qué el Carretón y La Llorona siguen recorriendo las calles empedradas?',
      answer: 'Recuerdan el valor de la vida terrenal y la penitencia eterna de las almas que buscan redención y paz en la noche.',
      culturalInsight: 'Estas leyendas cumplían una función de memoria colectiva, respeto a los difuntos y reflexión en la sociedad colonial guatemalteca.',
      associatedLegends: ['La Llorona', 'El Carretón de la Muerte']
    }
  ],
  legendFichasImages: {},
  pillarsSectionBadge: 'Dinámicas y Mecánicas',
  pillarsSectionTitle: '¿CÓMO FUNCIONA LA EXPERIENCIA?',
  pillarsSectionDescription: 'Combina el mundo físico con la magia digital a través de 3 pilares únicos:',
  pillar1Title: '1. Escanea las Estaciones',
  pillar1Description: 'Apunta con la cámara de tu móvil a las cartas físicas o a las placas en la Casa de las Leyendas para invocar el reto de cada espectro.',
  pillar2Title: '2. Supera las Pruebas',
  pillar2Description: 'Responde preguntas con tiempo límite, descubre personajes con pistas misteriosas y actúa retos de mímica ante tus compañeros.',
  pillar3Title: '3. Colecciona los Sellos',
  pillar3Description: 'Completa tu Pasaporte Digital con los 7 sellos ancestrales y desbloquea el título de Maestro de Leyendas de Guatemala.',
  ctaBadge: '¿Estás listo para el ritual?',
  ctaTitle: 'COMIENZA TU AVENTURA EN LA CASA DE LAS LEYENDAS',
  ctaDescription: 'Ingresa desde tu teléfono para jugar en mesa con tus amigos o para realizar el recorrido interactivo por nuestras instalaciones.',
  ctaButtonText: 'INICIAR EXPERIENCIA DIGITAL',
  footerTitle: 'LA CASA DE LAS LEYENDAS • GUATEMALA',
  footerDescription: 'Preservando el patrimonio oral, la magia y las tradiciones populares de Guatemala.'
};

export const DEFAULT_TICKETING_CONTENT: TheaterTicketingContent = {
  sectionBadge: 'Propuesta Operativa y Acceso Digital',
  sectionTitle: 'SISTEMA DE BOLETERÍA EN LÍNEA',
  sectionDescription: 'Para optimizar la logística de ingreso, evitar filas prolongadas y dinamizar la promoción durante todo el mes de octubre, implementaremos un sistema digital accesible y ordenado.',
  selfServiceTitle: 'Plataforma de Autogestión y Reservación',
  selfServiceDescription: 'Permite hacer la reservación y pago directo en la web oficial, generando un código QR de acceso rápido e infalsificable para presentar desde cualquier dispositivo móvil.',
  selfServiceFootnote: 'Acceso exprés con escáner QR en el vestíbulo del Teatro',
  phasesSectionTitle: 'FASES DE PREVENTA (OCTUBRE 2026)',
  phases: [
    {
      id: 'preventa-cultural',
      dates: '1 al 10 de Octubre',
      title: 'Preventa Cultural (20% OFF)',
      discountBadge: '20% DESCUENTO PREFERENCIAL',
      description: 'Tarifa preferencial con un 20% de descuento para incentivar la planificación anticipada del público local, estudiantes y visitantes nacionales.',
      highlights: ['Tarifa preferencial con 20% de descuento', 'Selección prioritaria de horarios', 'Garantía de cupo en grupos íntimos']
    },
    {
      id: 'venta-general',
      dates: '11 al 30 de Octubre',
      title: 'Venta General por Horarios',
      discountBadge: 'BLOQUES DE HORARIO CONTROLADO',
      description: 'Disponibilidad por horarios específicos (bloques desde las 18:00 hasta las 23:00 horas cada 12 minutos) para asegurar el aforo permitido y la máxima calidad escénica.',
      highlights: ['Bloques de 18:00 a 23:00 horas', 'Salidas escalonadas cada 12 minutos', 'Aforo máximo de 15 personas por grupo']
    }
  ],
  plansSectionTitle: 'PLANES Y LLAVES SAGRADAS DE ACCESO',
  plansSectionDescription: 'Selecciona la llave de acceso que mejor se adapte a tu grupo o experiencia. Tarifa base individual desde Q50 por persona:',
  plans: [
    {
      id: 'jade',
      name: 'Plan Jade: Pase Supremo & Juego de Mesa',
      keyType: 'jade',
      badge: 'EDICIÓN ESPECIAL • MÁS COMPLETO',
      badgeBg: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60 font-bold',
      price: 'Q350',
      priceNote: 'Incluye Pase para 5 personas + Juego Físico Oficial',
      capacityText: '5 Personas + Juego de Mesa de Lujo',
      description: 'Boleto Edición Especial que incluye el juego de mesa oficial "La Casa de las Leyendas" (optimizado para 4 a 6 jugadores) más el pase completo para 5 personas.',
      includes: [
        'Pase de acceso completo para 5 personas al recorrido teatral',
        'Caja Oficial del Juego de Mesa "La Casa de las Leyendas" (4-6 jugadores)',
        'Acceso preferencial en el vestíbulo sin tiempos de espera',
        'Farol ceremonial místico durante el trayecto'
      ],
      imageUrl: ''
    },
    {
      id: 'vida',
      name: 'Plan Vida: Experiencia Inmersiva Grupal',
      keyType: 'vida',
      badge: 'EXPERIENCIA FAMILIAR & AMIGOS',
      badgeBg: 'bg-black/90 text-amber-200 border-gold/70 font-bold',
      price: 'Q250',
      priceNote: 'Q50 por persona (Grupo de 5)',
      capacityText: 'Pase Grupal para 5 personas',
      description: 'Pase grupal diseñado para familias o grupos de amigos que desean recorrer las 4 estaciones escénicas de manera conjunta con acompañamiento del Guía.',
      includes: [
        'Pase para 5 personas en el mismo bloque horario',
        'Farol de luz ambiental para el grupo',
        'Sellado digital automático en el Pasaporte de Leyendas',
        'Guía de la Tradición asignado'
      ],
      imageUrl: ''
    },
    {
      id: 'oro',
      name: 'Plan Oro: Pase Grupal Selecto',
      keyType: 'oro',
      badge: 'TRADICIÓN & ARTE',
      badgeBg: 'bg-black/90 text-gold border-gold/70 font-bold',
      price: 'Q150',
      priceNote: 'Q50 por persona (Grupo de 3)',
      capacityText: 'Pase para 3 personas',
      description: 'Ideal para grupos pequeños de 3 personas que buscan sumergirse en la narrativa colonial y la serenata del Sombrerón.',
      includes: [
        'Pase para 3 personas en bloque horario seleccionado',
        'Acceso completo a las 4 estaciones escénicas',
        'Desafíos digitales interactivos en tiempo real'
      ],
      imageUrl: ''
    },
    {
      id: 'plata',
      name: 'Plan Plata: Entrada Individual',
      keyType: 'plata',
      badge: 'ACCESO INDIVIDUAL',
      badgeBg: 'bg-slate-900/90 text-slate-200 border-slate-400/60 font-bold',
      price: 'Q50',
      priceNote: 'Q40 en Preventa Cultural (20% OFF)',
      capacityText: '1 Persona',
      description: 'Boleto individual con reservación de horario para disfrutar de la experiencia teatral inmersiva en el Teatro Municipal.',
      includes: [
        'Pase individual para el recorrido guiado de 45 minutos',
        'Código QR de acceso móvil al instante',
        'Acceso al Pasaporte Digital de Sellos'
      ],
      imageUrl: ''
    }
  ],
  specialEditionBadge: 'Colección de Lujo',
  specialEditionTitle: 'Boleto Edición Especial con Juego de Mesa',
  specialEditionDescription: 'El Plan Jade te permite llevarte a casa la caja física del juego "La Casa de las Leyendas", diseñado con cartas ilustradas, tableros de reto y mecánicas interactivas de 4 a 6 jugadores.',
  supportNote: 'Los pagos en línea contarán con confirmación inmediata por WhatsApp y correo electrónico con el boleto digital QR adjunto.'
};

export const DEFAULT_SPONSORSHIP_CONTENT: TheaterSponsorshipContent = {
  sectionBadge: 'Marcas & Alianzas Corporativas',
  sectionTitle: 'Alianzas Estratégicas y Oportunidades para Patrocinadores',
  sectionDescription: 'Una producción cultural de esta magnitud representa una vitrina comercial excelente para marcas comprometidas con el desarrollo artístico y el turismo de Xela. Ofrecemos tres categorías de patrocinio corporativo:',
  tiers: [
    {
      id: 'leyenda',
      name: 'Patrocinio Leyenda',
      badge: 'Aliado Principal',
      investment: 'Q5,000.00 o su equivalente en especie',
      description: 'Presencia de marca integrada en la escenografía de la estación de cierre, mención destacada en la campaña publicitaria digital y física, y presencia en los pases de acceso digital. Presencia en campañas digitales y físicas.',
      benefits: [
        'Presencia de marca integrada en la escenografía de la estación de cierre',
        'Mención destacada en campaña publicitaria digital y física',
        'Presencia oficial en los pases de acceso digital (QR)',
        'Menciones de agradecimiento en vivo durante las funciones'
      ],
      isFeatured: true
    },
    {
      id: 'cultural',
      name: 'Patrocinio Cultural',
      badge: 'Aliados del Foyer',
      investment: 'Q2,500.00 o su equivalente en especie',
      description: 'Ubicación preferencial de tótems informativos en el área de recepción y descanso, ideal para empresas de servicios, banca o gastronomía, con difusión constante en redes sociales durante octubre.',
      benefits: [
        'Ubicación preferencial de tótems en recepción y descanso',
        'Ideal para empresas de servicios, banca o gastronomía',
        'Difusión constante en redes sociales durante todo octubre',
        'Logotipo en materiales institucionales del evento'
      ],
      isFeatured: false
    },
    {
      id: 'especial',
      name: 'Patrocinio Especial',
      badge: 'Mecenas del Patrimonio',
      investment: 'Q1,000.00 o su equivalente en especie',
      description: 'Inserción del logotipo corporativo en la boletería digital y en el panel institucional de agradecimiento ubicado en la fachada del Teatro Municipal la noche del evento.',
      benefits: [
        'Inserción de logotipo corporativo en boletería digital',
        'Panel institucional de agradecimiento en fachada del Teatro Municipal',
        'Agradecimiento público en memoria digital del proyecto'
      ],
      isFeatured: false
    }
  ],
  contactBadge: 'Contacto Corporativo',
  contactTitle: '¿Deseas unir tu marca a esta experiencia legendaria?',
  contactDescription: 'Comunícate directamente con la comisión organizadora para formalizar convenios institucionales, facturación y detalles de activación de marca.',
  contactButtonText: 'CONECTAR CON LA ORGANIZACIÓN POR WHATSAPP',
  whatsappMessage: 'Hola Comisión Organizadora de La Casa de las Leyendas, represento a una marca y deseamos información para participar como patrocinadores del evento teatral.'
};

export const DEFAULT_THEATER_CONTENT: LiveTheaterContent = {
  badge: 'Producción Escénica Inmersiva',
  title: 'LA CASA DE LAS LEYENDAS',
  subtitle: 'Tradición Escénica en el Teatro Municipal',
  date: '31 de Octubre, 2026',
  location: 'Teatro Municipal',
  city: 'Quetzaltenango',
  duration: '45 Minutos',
  durationSubtitle: 'Recorrido Guiado',
  coverImageUrl: '',
  manifestoP1: 'El próximo 31 de octubre de 2026, el emblemático Teatro Municipal de Quetzaltenango transformará sus espacios para presentar "La Casa de las Leyendas", una experiencia única de valor histórico, artístico y cultural.',
  manifestoP2: 'Olvídate de los conceptos genéricos extranjeros; esta noche el entretenimiento cultural tiene identidad propia. Se trata de una producción escénica inmersiva donde los pasillos, palcos y espacios subterráneos del teatro más bello de Occidente se convierten en escenarios vivos para reinterpretar las tradiciones y los mitos más representativos del folclor guatemalteco.',
  manifestoHighlight: 'Una propuesta de turismo cultural y recreativo que fusiona el arte dramático, la historia local y el patrimonio intangible en un recorrido guiado para todo público.',
  dynamicsSectionBadge: 'Dinámica de Acceso y Logística',
  dynamicsSectionTitle: 'ESTRUCTURA Y DINÁMICA DEL RECORRIDO',
  dynamicsSectionDescription: 'Para garantizar una experiencia ordenada, de alta calidad artística y fluida, el proyecto se organiza mediante estaciones escénicas independientes:',
  groupTitle: 'Grupos Controlados & Horarios',
  groupDescription: 'Los visitantes accederán en grupos controlados de máximo 15 personas cada 12 minutos, iniciando el trayecto desde el vestíbulo principal. El recorrido completo tendrá una duración aproximada de 45 minutos.',
  groupFootnote: 'Aforo limitado para una inmersión íntima',
  guideTitle: 'Personaje Guía & Farol Místico',
  guideDescription: 'Cada grupo será conducido por un personaje guía caracterizado que portará un farol ceremonial, asegurando la inmersión atmosférica y guiando al público a través de los cuatro actos del recorrido.',
  guideFootnote: 'Acompañamiento teatral continuo',
  stationsSectionBadge: 'Los 4 Actos Escénicos',
  stationsSectionTitle: 'ESTACIONES ESCÉNICAS EN EL TEATRO',
  stations: [
    {
      number: 1,
      location: 'El Vestíbulo Principal',
      legend: 'El Sombrerón',
      code: 'SOMB',
      badge: 'Bienvenida & Apertura Mística',
      badgeColor: 'border-amber-400/40 text-amber-300 bg-amber-900/40',
      description: 'Recepción del público con ambientación colonial, donde se revelará la historia del galán misterioso que trenza los cabellos y encanta las noches con su serenata.',
      highlights: ['Recepción y ambientación colonial', 'Efectos de sombras y susurros', 'El farolero místico guía'],
      imageUrl: ''
    },
    {
      number: 2,
      location: 'Los Pasillos y Palcos',
      legend: 'La Llorona',
      code: 'LLOR',
      badge: 'Música Tradicional en Vivo',
      badgeColor: 'border-blue-400/40 text-blue-300 bg-blue-900/40',
      description: 'Un espacio ambientado con música tradicional acústica en vivo, donde la narrativa oral cobra protagonismo a través de una emotiva y cautivadora interpretación actoral.',
      highlights: ['Música tradicional en vivo', 'Serenatas y guitarra acústica', 'Narrativa oral de época'],
      imageUrl: ''
    },
    {
      number: 3,
      location: 'El Foso del Escenario',
      legend: 'El Cadejo',
      code: 'CADE',
      badge: 'Expresión Corporal & Sonido 3D',
      badgeColor: 'border-slate-400/40 text-slate-200 bg-slate-800/40',
      description: 'Una experiencia centrada en el diseño de sonido envolvente y la expresión corporal, que simula el simbolismo del protector y caminante nocturno de nuestras sendas.',
      highlights: ['Sonido envolvente 360°', 'Danza y expresión corporal', 'Duelo místico de espectros'],
      imageUrl: ''
    },
    {
      number: 4,
      location: 'El Clímax en el Tabladillo',
      legend: 'La Vanushka',
      code: 'VANU',
      badge: 'Gran Escenario Principal & Danza',
      badgeColor: 'border-gold/70 text-gold bg-black/90 font-bold shadow-md',
      description: 'El escenario principal del teatro albergará la escena culminante con la conmovedora leyenda de amor y destino de la gitana Vanushka Cárdenas en Quetzaltenango, destacando por su despliegue coreográfico, escenografía de época y trabajo actoral de alto nivel artístico.',
      highlights: ['Escenografía de época', 'Gran despliegue coreográfico', 'Elenco teatral estelar'],
      imageUrl: ''
    }
  ],
  ticketing: DEFAULT_TICKETING_CONTENT,
  sponsorship: DEFAULT_SPONSORSHIP_CONTENT,
  footerTitle: 'LA CASA DE LAS LEYENDAS • TEATRO MUNICIPAL DE QUETZALTENANGO',
  footerDescription: '31 de Octubre de 2026 • Turismo Cultural, Arte Dramático y Patrimonio Intangible de Guatemala.'
};

const LOCAL_STORAGE_KEY = 'lacasadelasleyendas_site_content_v3';
const FIRESTORE_DOC_ID = 'main_content';

/**
 * Carga el contenido del sitio desde localStorage (rápido) y Firestore (sincronizado)
 */
export function getLocalContent(): SiteContent {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY) || 
                localStorage.getItem('lacasadelasleyendas_site_content_v2') || 
                localStorage.getItem('lacasadelasleyendas_site_content_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      
      // Auto-migrar la estación de la Siguanaba a La Vanushka si viene del caché anterior
      let theaterStations = parsed.theater?.stations || DEFAULT_THEATER_CONTENT.stations;
      theaterStations = theaterStations.map((st: TheaterStationContent) => {
        if (st.number === 4) {
          const isOldBadge = !st.badgeColor || st.badgeColor.includes('red-200') || st.badgeColor.includes('maya-red/20');
          return {
            ...st,
            legend: (st.legend === 'La Siguanaba' || !st.legend) ? 'La Vanushka' : st.legend,
            code: st.code === 'SIGU' ? 'VANU' : (st.code || 'VANU'),
            badgeColor: isOldBadge ? 'border-gold/70 text-gold bg-black/90 font-bold shadow-md' : st.badgeColor,
            description: st.description.includes('Vanushka') 
              ? st.description 
              : 'El escenario principal del teatro albergará la escena culminante con la conmovedora leyenda de amor y destino de la gitana Vanushka Cárdenas en Quetzaltenango, destacando por su despliegue coreográfico, escenografía de época y trabajo actoral de alto nivel artístico.'
          };
        }
        return st;
      });

      const mergedTheater: LiveTheaterContent = {
        ...DEFAULT_THEATER_CONTENT,
        ...parsed.theater,
        stations: theaterStations,
        ticketing: {
          ...DEFAULT_TICKETING_CONTENT,
          ...(parsed.theater?.ticketing || {}),
          plans: (parsed.theater?.ticketing?.plans && parsed.theater.ticketing.plans.length > 0) 
            ? parsed.theater.ticketing.plans 
            : DEFAULT_TICKETING_CONTENT.plans,
          phases: (parsed.theater?.ticketing?.phases && parsed.theater.ticketing.phases.length > 0)
            ? parsed.theater.ticketing.phases
            : DEFAULT_TICKETING_CONTENT.phases
        },
        sponsorship: {
          ...DEFAULT_SPONSORSHIP_CONTENT,
          ...(parsed.theater?.sponsorship || {}),
          tiers: (parsed.theater?.sponsorship?.tiers && parsed.theater.sponsorship.tiers.length > 0)
            ? parsed.theater.sponsorship.tiers
            : DEFAULT_SPONSORSHIP_CONTENT.tiers
        }
      };

      return {
        landing: { ...DEFAULT_LANDING_CONTENT, ...parsed.landing },
        theater: mergedTheater,
        lastUpdated: parsed.lastUpdated
      };
    }
  } catch (err) {
    console.warn('Error leyendo contenido local:', err);
  }
  return {
    landing: DEFAULT_LANDING_CONTENT,
    theater: DEFAULT_THEATER_CONTENT
  };
}

/**
 * Obtiene el contenido actualizado desde Firestore o fallback local
 */
export async function fetchSiteContent(): Promise<SiteContent> {
  const local = getLocalContent();
  try {
    const docRef = doc(db, 'site_content', FIRESTORE_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const remote = snap.data() as Partial<SiteContent>;
      
      let theaterStations = remote.theater?.stations || DEFAULT_THEATER_CONTENT.stations;
      theaterStations = theaterStations.map((st: TheaterStationContent) => {
        if (st.number === 4) {
          const isOldBadge = !st.badgeColor || st.badgeColor.includes('red-200') || st.badgeColor.includes('maya-red/20');
          return {
            ...st,
            legend: (st.legend === 'La Siguanaba' || !st.legend) ? 'La Vanushka' : st.legend,
            code: st.code === 'SIGU' ? 'VANU' : (st.code || 'VANU'),
            badgeColor: isOldBadge ? 'border-gold/70 text-gold bg-black/90 font-bold shadow-md' : st.badgeColor
          };
        }
        return st;
      });

      const mergedTheater: LiveTheaterContent = {
        ...DEFAULT_THEATER_CONTENT,
        ...remote.theater,
        stations: theaterStations,
        ticketing: {
          ...DEFAULT_TICKETING_CONTENT,
          ...(remote.theater?.ticketing || {}),
          plans: (remote.theater?.ticketing?.plans && remote.theater.ticketing.plans.length > 0)
            ? remote.theater.ticketing.plans
            : DEFAULT_TICKETING_CONTENT.plans,
          phases: (remote.theater?.ticketing?.phases && remote.theater.ticketing.phases.length > 0)
            ? remote.theater.ticketing.phases
            : DEFAULT_TICKETING_CONTENT.phases
        },
        sponsorship: {
          ...DEFAULT_SPONSORSHIP_CONTENT,
          ...(remote.theater?.sponsorship || {}),
          tiers: (remote.theater?.sponsorship?.tiers && remote.theater.sponsorship.tiers.length > 0)
            ? remote.theater.sponsorship.tiers
            : DEFAULT_SPONSORSHIP_CONTENT.tiers
        }
      };

      const finalContent: SiteContent = {
        landing: { ...DEFAULT_LANDING_CONTENT, ...remote.landing },
        theater: mergedTheater,
        lastUpdated: remote.lastUpdated || Date.now()
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(finalContent));
      return finalContent;
    }
  } catch (err) {
    console.warn('No se pudo sincronizar contenido con Firestore (usando caché):', err);
  }
  return local;
}

/**
 * Guarda los cambios de contenido en localStorage y Firestore
 */
export async function saveSiteContent(content: SiteContent): Promise<{ success: boolean; error?: string }> {
  const payload: SiteContent = {
    ...content,
    lastUpdated: Date.now()
  };

  // Guardar local de inmediato
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('Error guardando en localStorage:', err);
  }

  // Guardar en Firestore
  try {
    const docRef = doc(db, 'site_content', FIRESTORE_DOC_ID);
    await setDoc(docRef, payload, { merge: true });
    return { success: true };
  } catch (err: any) {
    console.error('Error guardando en Firestore:', err);
    return { 
      success: true, 
      error: 'Guardado localmente. (Nota: Para sincronizar en la nube Firestore, asegúrate de estar autenticado en Firebase o tener conexión).' 
    };
  }
}

/**
 * Restaura los contenidos a los valores de fábrica
 */
export async function resetSiteContentToDefaults(): Promise<SiteContent> {
  const defaultPayload: SiteContent = {
    landing: DEFAULT_LANDING_CONTENT,
    theater: DEFAULT_THEATER_CONTENT,
    lastUpdated: Date.now()
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultPayload));
  try {
    const docRef = doc(db, 'site_content', FIRESTORE_DOC_ID);
    await setDoc(docRef, defaultPayload);
  } catch (err) {
    console.warn('Error restableciendo Firestore:', err);
  }
  return defaultPayload;
}
