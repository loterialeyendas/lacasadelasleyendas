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
  ctaBadge: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
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
      badgeBg: 'bg-maya-red/25 text-red-100 border-maya-red/50 font-bold',
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
  guideTitle: 'El Guía de la Tradición (Maestro de Ceremonias)',
  guideDescription: 'Un actor con indumentaria de época o inspirado en personajes icónicos de la literatura popular recibirá a los asistentes, entregando un farol de luz ambiental y explicando las normas de convivencia y seguridad de la travesía.',
  guideFootnote: 'Farol ceremonial entregado a cada grupo',
  stationsSectionBadge: 'Recorrido Inmersivo por el Teatro',
  stationsSectionTitle: 'LAS ESTACIONES ESCÉNICAS',
  stations: [
    {
      number: 1,
      location: 'Los Sótanos',
      legend: 'La Llorona',
      code: 'LLOR',
      badge: 'Arquitectura Oculta & Misterio',
      badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40',
      description: 'El diseño sonoro de ambiente y efectos lumínicos guiarán al grupo por los espacios arquitectónicos más resguardados del teatro, recreando la atmósfera clásica de esta leyenda nacional.',
      highlights: ['Diseño sonoro envolvente', 'Efectos lumínicos inmersivos', 'Atmósfera colonial clásica'],
      imageUrl: ''
    },
    {
      number: 2,
      location: 'Los Palcos Altos',
      legend: 'El Sombrerón',
      code: 'SOMB',
      badge: 'Música Acústica & Tradición Oral',
      badgeColor: 'border-gold/40 text-gold bg-gold/10',
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
      badgeColor: 'border-maya-red/40 text-red-200 bg-maya-red/20',
      description: 'El escenario principal del teatro albergará la escena culminante con la conmovedora leyenda de amor y destino de la gitana Vanushka Cárdenas en Quetzaltenango, destacando por su despliegue coreográfico, escenografía de época y trabajo actoral de alto nivel artístico.',
      highlights: ['Escenografía de época', 'Gran despliegue coreográfico', 'Elenco teatral estelar'],
      imageUrl: ''
    }
  ],
  ctaBadge: 'Vive la Experiencia Completa',
  ctaTitle: 'LLEVA LA MAGIA EN TU TELÉFONO',
  ctaDescription: 'Complementa la noche de teatro con la aplicación web oficial: escanea las cartas místicas, desbloquea los 7 sellos del pasaporte y desafía a tus amigos.',
  ctaButtonText: 'ENTRAR AL JUEGO DIGITAL',
  footerTitle: 'LA CASA DE LAS LEYENDAS • TEATRO MUNICIPAL DE QUETZALTENANGO',
  footerDescription: '31 de Octubre de 2026 • Turismo Cultural, Arte Dramático y Patrimonio Intangible de Guatemala.'
};

const LOCAL_STORAGE_KEY = 'lacasadelasleyendas_site_content_v2';
const FIRESTORE_DOC_ID = 'main_content';

/**
 * Carga el contenido del sitio desde localStorage (rápido) y Firestore (sincronizado)
 */
export function getLocalContent(): SiteContent {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem('lacasadelasleyendas_site_content_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      
      // Auto-migrar la estación de la Siguanaba a La Vanushka si viene del caché anterior
      let theaterStations = parsed.theater?.stations || DEFAULT_THEATER_CONTENT.stations;
      theaterStations = theaterStations.map((st: TheaterStationContent) => {
        if (st.number === 4 && (st.legend === 'La Siguanaba' || !st.legend)) {
          return {
            ...st,
            legend: 'La Vanushka',
            code: st.code === 'SIGU' ? 'VANU' : (st.code || 'VANU'),
            description: st.description.includes('Vanushka') 
              ? st.description 
              : 'El escenario principal del teatro albergará la escena culminante con la conmovedora leyenda de amor y destino de la gitana Vanushka Cárdenas en Quetzaltenango, destacando por su despliegue coreográfico, escenografía de época y trabajo actoral de alto nivel artístico.'
          };
        }
        return st;
      });

      return {
        landing: { ...DEFAULT_LANDING_CONTENT, ...parsed.landing },
        theater: { 
          ...DEFAULT_THEATER_CONTENT, 
          ...parsed.theater,
          stations: theaterStations
        },
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
        if (st.number === 4 && (st.legend === 'La Siguanaba' || !st.legend)) {
          return {
            ...st,
            legend: 'La Vanushka',
            code: st.code === 'SIGU' ? 'VANU' : (st.code || 'VANU')
          };
        }
        return st;
      });

      const merged: SiteContent = {
        landing: { ...DEFAULT_LANDING_CONTENT, ...remote.landing },
        theater: { 
          ...DEFAULT_THEATER_CONTENT, 
          ...remote.theater,
          stations: theaterStations
        },
        lastUpdated: remote.lastUpdated || Date.now()
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
      return merged;
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
