import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Lock, 
  KeyRound, 
  Save, 
  RotateCcw, 
  Eye, 
  Layers, 
  Drama, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Download, 
  Upload, 
  RefreshCw,
  Edit3,
  Calendar,
  MapPin,
  Clock,
  Users,
  Compass,
  FileText,
  Key,
  Image as ImageIcon,
  Trash2,
  ExternalLink,
  Plus,
  Ticket,
  QrCode,
  Tag,
  Check,
  Handshake
} from 'lucide-react';
import { Button, Card } from '../components/Theme';
import { sound } from '../lib/audio';
import { 
  SiteContent, 
  LandingContent, 
  LiveTheaterContent, 
  TheaterStationContent,
  TicketPlanContent,
  TheaterTicketingContent,
  TheaterSponsorshipContent,
  SponsorTierContent,
  fetchSiteContent, 
  saveSiteContent, 
  resetSiteContentToDefaults, 
  DEFAULT_LANDING_CONTENT, 
  DEFAULT_THEATER_CONTENT,
  DEFAULT_TICKETING_CONTENT,
  DEFAULT_SPONSORSHIP_CONTENT
} from '../services/contentService';
import { LEYENDAS_DATA } from '../services/legendService';
import { optimizeImageFile } from '../lib/imageUtils';
import { PassportStampSvg } from '../components/svgs/PassportStampSvg';

import logoPng from '../images/logo.png';
import portadaPng from '../images/png/Portada.png';
import fondoSvg from '../images/optimized/Fondo.svg';

import candadoJadePng from '../images/png/Candado jade.png';
import candadoVidaPng from '../images/png/Candado vida.png';
import candadoOroPng from '../images/png/Candado oro.png';
import candadoPlataPng from '../images/png/Candado plata.png';

interface MayordomoViewProps {
  onGoToLanding: () => void;
  onGoToTheater: () => void;
}

const MAYORDOMO_PIN = '1776'; // PIN oficial de acceso al panel
const SESSION_STORAGE_KEY = 'lacasadelasleyendas_mayordomo_auth';

export const MayordomoView: React.FC<MayordomoViewProps> = ({
  onGoToLanding,
  onGoToTheater
}) => {
  // Estado de Autenticación
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true';
  });
  const [pinInput, setPinInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Contenido Global del Sitio
  const [content, setContent] = useState<SiteContent>(() => ({
    landing: DEFAULT_LANDING_CONTENT,
    theater: DEFAULT_THEATER_CONTENT
  }));

  const [activeTab, setActiveTab] = useState<'images' | 'theater' | 'landing' | 'system'>('images');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Estados de Carga de Archivos
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);

  // Cargar contenido al montar
  useEffect(() => {
    let isMounted = true;
    fetchSiteContent().then((res) => {
      if (isMounted && res) {
        setContent(res);
        setIsLoading(false);
      }
    }).catch(() => {
      if (isMounted) setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Manejo de Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === MAYORDOMO_PIN) {
      sound.playMysticChime();
      setIsAuthenticated(true);
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
      setLoginError('');
    } else {
      sound.playError();
      setLoginError('Clave de Mayordomo incorrecta.');
      setPinInput('');
    }
  };

  // Logout
  const handleLogout = () => {
    sound.playClick();
    setIsAuthenticated(false);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  };

  // Guardar Cambios en Firestore y LocalStorage
  const handleSave = async () => {
    setIsSaving(true);
    sound.playClick();

    try {
      const res = await saveSiteContent(content);
      if (res.success) {
        sound.playMysticChime();
        setSaveStatus({
          message: res.error || '¡Cambios guardados y publicados con éxito!',
          type: 'success'
        });
      } else {
        sound.playError();
        setSaveStatus({
          message: 'Error al guardar los cambios en la nube.',
          type: 'error'
        });
      }
    } catch (err: any) {
      sound.playError();
      setSaveStatus({
        message: err.message || 'Error inesperado al guardar.',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  // Restablecer valores de fábrica
  const handleResetDefaults = async () => {
    if (window.confirm('¿Estás seguro de restablecer todos los textos e imágenes a los valores de fábrica? Esta acción no se puede deshacer.')) {
      setIsLoading(true);
      sound.playClick();
      const reset = await resetSiteContentToDefaults();
      setContent(reset);
      setIsLoading(false);
      setSaveStatus({
        message: 'Contenidos restablecidos a los valores por defecto.',
        type: 'success'
      });
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  // Exportar Contenido a JSON
  const handleExportJSON = () => {
    sound.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(content, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `lacasadelasleyendas_contenido_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Importar Contenido desde JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.landing && parsed.theater) {
          setContent({
            landing: { ...DEFAULT_LANDING_CONTENT, ...parsed.landing },
            theater: { ...DEFAULT_THEATER_CONTENT, ...parsed.theater },
            lastUpdated: Date.now()
          });
          sound.playMysticChime();
          setSaveStatus({
            message: 'Archivo JSON importado. Recuerda hacer clic en "Guardar y Publicar" para confirmarlo.',
            type: 'success'
          });
        } else {
          sound.playError();
          alert('El archivo JSON no tiene el formato válido de La Casa de las Leyendas.');
        }
      } catch (err) {
        sound.playError();
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Helpers para modificar campos
  const updateLanding = <K extends keyof LandingContent>(key: K, value: LandingContent[K]) => {
    setContent((prev) => ({
      ...prev,
      landing: {
        ...prev.landing,
        [key]: value
      }
    }));
  };

  const updateTheater = <K extends keyof LiveTheaterContent>(key: K, value: LiveTheaterContent[K]) => {
    setContent((prev) => ({
      ...prev,
      theater: {
        ...prev.theater,
        [key]: value
      }
    }));
  };

  const updateTicketing = <K extends keyof TheaterTicketingContent>(key: K, value: TheaterTicketingContent[K]) => {
    setContent((prev) => {
      const currentTicketing = prev.theater.ticketing || DEFAULT_TICKETING_CONTENT;
      return {
        ...prev,
        theater: {
          ...prev.theater,
          ticketing: {
            ...currentTicketing,
            [key]: value
          }
        }
      };
    });
  };

  const updateSponsorship = <K extends keyof TheaterSponsorshipContent>(key: K, value: TheaterSponsorshipContent[K]) => {
    setContent((prev) => {
      const currentSponsorship = prev.theater.sponsorship || DEFAULT_SPONSORSHIP_CONTENT;
      return {
        ...prev,
        theater: {
          ...prev.theater,
          sponsorship: {
            ...currentSponsorship,
            [key]: value
          }
        }
      };
    });
  };

  // Manejo de Carga de Imagen para Portadas
  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'landingCover' | 'theaterCover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTarget(target);
    sound.playClick();

    try {
      // Redimensionar portada a máximo 1280px con compresión WebP
      const optimizedBase64 = await optimizeImageFile(file, {
        maxWidth: 1280,
        maxHeight: 1280,
        quality: 0.85,
        format: 'image/webp'
      });

      if (target === 'landingCover') {
        updateLanding('heroCoverImageUrl', optimizedBase64);
      } else {
        updateTheater('coverImageUrl', optimizedBase64);
      }
      sound.playMysticChime();
    } catch (err) {
      console.error('Error optimizando imagen de portada:', err);
      alert('Hubo un problema al procesar la imagen.');
    } finally {
      setUploadingTarget(null);
    }
  };

  // Manejo de Carga de Imagen para Ficha Circular de Estación Teatral
  const handleStationImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, stationIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTarget(`station-${stationIndex}`);
    sound.playClick();

    try {
      const optimizedBase64 = await optimizeImageFile(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.88,
        format: 'image/webp'
      });

      const updatedStations = [...content.theater.stations];
      updatedStations[stationIndex].imageUrl = optimizedBase64;
      updateTheater('stations', updatedStations);
      sound.playMysticChime();
    } catch (err) {
      console.error('Error optimizando ficha de estación:', err);
      alert('Hubo un problema al procesar la imagen circular.');
    } finally {
      setUploadingTarget(null);
    }
  };

  // Manejo de Carga de Imagen para Ficha Circular de las 7 Leyendas
  const handleLegendFichaUpload = async (e: React.ChangeEvent<HTMLInputElement>, legendId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTarget(`legend-${legendId}`);
    sound.playClick();

    try {
      const optimizedBase64 = await optimizeImageFile(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.88,
        format: 'image/webp'
      });

      const currentImages = content.landing.legendFichasImages || {};
      updateLanding('legendFichasImages', {
        ...currentImages,
        [legendId]: optimizedBase64
      });
      sound.playMysticChime();
    } catch (err) {
      console.error('Error optimizando ficha de leyenda:', err);
      alert('Hubo un problema al procesar la imagen.');
    } finally {
      setUploadingTarget(null);
    }
  };

  // Manejo de Carga de Imagen para Planes de Boletería (Jade, Vida, Oro, Plata)
  const handleTicketPlanImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, planIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTarget(`plan-${planIndex}`);
    sound.playClick();

    try {
      const optimizedBase64 = await optimizeImageFile(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.88,
        format: 'image/webp'
      });

      const currentTicketing = content.theater.ticketing || DEFAULT_TICKETING_CONTENT;
      const currentPlans = [...(currentTicketing.plans || DEFAULT_TICKETING_CONTENT.plans)];
      currentPlans[planIndex] = {
        ...currentPlans[planIndex],
        imageUrl: optimizedBase64
      };

      updateTheater('ticketing', {
        ...currentTicketing,
        plans: currentPlans
      });
      sound.playMysticChime();
    } catch (err) {
      console.error('Error optimizando imagen de plan:', err);
      alert('Hubo un problema al procesar la imagen de la llave.');
    } finally {
      setUploadingTarget(null);
    }
  };

  const getKeyDefaultImage = (keyType: string) => {
    switch (keyType) {
      case 'jade': return candadoJadePng;
      case 'vida': return candadoVidaPng;
      case 'oro': return candadoOroPng;
      case 'plata': return candadoPlataPng;
      default: return candadoJadePng;
    }
  };

  const currentTicketing = content.theater.ticketing || DEFAULT_TICKETING_CONTENT;
  const currentPlans = currentTicketing.plans || DEFAULT_TICKETING_CONTENT.plans;
  const currentPhases = currentTicketing.phases || DEFAULT_TICKETING_CONTENT.phases;

  // PANTALLA DE ACCESO (LOGIN CON PIN)
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-obsidian text-cream flex items-center justify-center p-4 relative overflow-hidden selection:bg-gold selection:text-obsidian font-sans">
        {/* Fondo Místico */}
        <div className="fixed inset-0 pointer-events-none opacity-25">
          <img src={fondoSvg} alt="Fondo" className="w-full h-full object-cover" />
        </div>

        <Card className="w-full max-w-md p-8 border-gold/50 bg-black/90 relative z-10 shadow-[0_0_50px_rgba(190,141,44,0.3)] rounded-3xl space-y-6 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shadow-[0_0_20px_rgba(190,141,44,0.4)]">
              <Shield size={32} />
            </div>
            <h1 className="font-display text-2xl text-gold font-bold tracking-wider">
              PANEL MAYORDOMO
            </h1>
            <p className="text-xs text-cream/70 font-serif italic">
              Gestor de Contenidos, Estaciones Escénicas, Boletería y Personalización Gráfica
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-display uppercase tracking-widest text-gold/90 block mb-1.5 text-left font-semibold">
                Clave de Mayordomo:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••"
                  autoFocus
                  className="w-full bg-black/80 border border-gold/40 focus:border-gold rounded-xl px-4 py-3 text-center text-xl tracking-widest text-gold font-mono outline-none shadow-inner"
                />
              </div>
              {loginError && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1 justify-center">
                  <AlertCircle size={14} /> {loginError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full py-3.5 flex items-center justify-center gap-2 font-display text-sm font-bold shadow-lg"
            >
              <Lock size={16} />
              <span>INGRESAR AL PANEL</span>
            </Button>
          </form>

          <div className="pt-2 border-t border-gold/20 flex items-center justify-between text-xs">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="text-cream/60 hover:text-gold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft size={14} /> Volver a la Landing
            </a>
            <span className="text-[11px] text-gold/60 font-mono">v3.0 • CMS Oficial</span>
          </div>
        </Card>
      </div>
    );
  }

  // PANTALLA PRINCIPAL DEL PANEL MAYORDOMO
  return (
    <div className="w-full min-h-screen bg-obsidian text-cream font-sans pb-20 relative selection:bg-gold selection:text-obsidian">
      
      {/* Fondo Místico */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <img src={fondoSvg} alt="Fondo" className="w-full h-full object-cover" />
      </div>

      {/* HEADER DE ADMINISTRACIÓN STICKY */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-obsidian/95 border-b border-gold/30 px-4 py-3 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          
          <div className="flex items-center gap-3">
            <img src={logoPng} alt="Logo" className="w-9 h-9 object-contain" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-base font-bold text-gold tracking-wide">
                  MAYORDOMO CMS
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-mono font-semibold">
                  EN LÍNEA
                </span>
              </div>
              <span className="text-[11px] text-cream/70 font-serif italic hidden sm:inline">
                Estaciones Escénicas, Boletería, Fichas Circulares y Portadas
              </span>
            </div>
          </div>

          {/* Botones de Acción Global (Abren en ventana nueva) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <a
              href="/rutadeleyendas"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="py-2 px-3 text-xs font-display font-semibold flex items-center gap-1.5 text-maya-red hover:text-cream border border-maya-red/40 hover:border-maya-red rounded-xl bg-maya-red/10 transition-all cursor-pointer shadow-sm"
              title="Abrir Ruta de Leyendas en nueva ventana"
            >
              <Drama size={14} />
              <span className="hidden xs:inline">Ver Teatro</span>
              <ExternalLink size={12} className="opacity-70" />
            </a>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="py-2 px-3 text-xs font-display font-semibold flex items-center gap-1.5 text-gold hover:text-cream border border-gold/40 hover:border-gold rounded-xl bg-gold/10 transition-all cursor-pointer shadow-sm"
              title="Abrir Portal Landing en nueva ventana"
            >
              <Eye size={14} />
              <span className="hidden xs:inline">Ver Portal</span>
              <ExternalLink size={12} className="opacity-70" />
            </a>

            <Button
              onClick={handleSave}
              disabled={isSaving || isLoading}
              size="sm"
              className="py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(190,141,44,0.5)]"
            >
              {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              <span>{isSaving ? 'GUARDANDO...' : 'GUARDAR Y PUBLICAR'}</span>
            </Button>

            <button
              onClick={handleLogout}
              className="p-2 text-cream/50 hover:text-maya-red rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-xs"
              title="Cerrar Sesión"
            >
              <Lock size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* NOTIFICACIÓN DE ESTADO DE GUARDADO */}
      <AnimatePresence>
        {saveStatus && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className={`fixed top-18 right-4 z-50 p-4 rounded-2xl border shadow-2xl flex items-center gap-3 max-w-md ${
              saveStatus.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-100 shadow-emerald-900/40'
                : 'bg-red-950/90 border-maya-red text-red-100 shadow-red-900/40'
            }`}
          >
            {saveStatus.type === 'success' ? (
              <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle size={20} className="text-red-400 shrink-0" />
            )}
            <p className="text-xs font-medium leading-tight">{saveStatus.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CUERPO PRINCIPAL CON PESTAÑAS */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10 space-y-8">
        
        {/* SELECTOR DE PESTAÑAS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gold/30">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('images');
            }}
            className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-display font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'images'
                ? 'bg-gradient-to-r from-gold via-cream to-gold text-obsidian shadow-md'
                : 'text-cream/70 hover:text-gold hover:bg-white/5'
            }`}
          >
            <ImageIcon size={16} />
            <span>🎨 Imágenes y Fichas</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('theater');
            }}
            className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-display font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'theater'
                ? 'bg-gradient-to-r from-gold via-cream to-gold text-obsidian shadow-md'
                : 'text-cream/70 hover:text-gold hover:bg-white/5'
            }`}
          >
            <Drama size={16} />
            <span>🎭 Teatro & Boletería</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('landing');
            }}
            className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-display font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'landing'
                ? 'bg-gradient-to-r from-gold via-cream to-gold text-obsidian shadow-md'
                : 'text-cream/70 hover:text-gold hover:bg-white/5'
            }`}
          >
            <Layers size={16} />
            <span>📜 Textos del Portal</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('system');
            }}
            className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-display font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'system'
                ? 'bg-gradient-to-r from-gold via-cream to-gold text-obsidian shadow-md'
                : 'text-cream/70 hover:text-gold hover:bg-white/5'
            }`}
          >
            <Shield size={16} />
            <span>⚙️ Respaldos & Sistema</span>
          </button>
        </div>

        {/* CONTENIDO TAB 1: IMÁGENES, PORTADAS, FICHAS Y LLAVES */}
        {activeTab === 'images' && (
          <div className="space-y-8">
            
            {/* SECCIÓN 1: PORTADAS PRINCIPALES */}
            <Card className="p-6 sm:p-8 space-y-6 border-gold/40 bg-black/75 rounded-3xl">
              <div className="flex items-center justify-between border-b border-gold/20 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2.5 text-gold">
                  <ImageIcon size={22} />
                  <div>
                    <h2 className="font-display text-lg sm:text-xl font-bold">1. Portadas Principales (Hero y Teatro)</h2>
                    <p className="text-xs text-cream/70 font-serif italic">
                      Sube imágenes de portada o ingresa URLs. Se comprimen automáticamente para máxima velocidad.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Portada Hero Principal */}
                <div className="p-5 rounded-2xl bg-black/80 border border-gold/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-display uppercase tracking-wider text-gold font-bold flex items-center gap-1.5">
                      <Sparkles size={14} /> Portada Principal (Landing Hero)
                    </span>
                    {content.landing.heroCoverImageUrl && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gold/20 text-gold border border-gold/40 font-bold font-mono">
                        PERSONALIZADA
                      </span>
                    )}
                  </div>

                  {/* Previsualización */}
                  <div className="relative w-full h-52 sm:h-64 rounded-xl overflow-hidden border-2 border-gold/50 bg-black/90 flex items-center justify-center group">
                    <img
                      src={content.landing.heroCoverImageUrl || portadaPng}
                      alt="Portada Hero"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  {/* Controles de Carga */}
                  <div className="space-y-2">
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleCoverFileUpload(e, 'landingCover')}
                        className="hidden"
                      />
                      <span className="w-full py-2.5 px-4 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold text-xs font-display font-bold flex items-center justify-center gap-2 cursor-pointer transition-all">
                        {uploadingTarget === 'landingCover' ? (
                          <RefreshCw size={14} className="animate-spin" />
                        ) : (
                          <Upload size={14} />
                        )}
                        <span>Subir Imagen de Portada Hero (Archivo)</span>
                      </span>
                    </label>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="O ingresa URL directa..."
                        value={content.landing.heroCoverImageUrl || ''}
                        onChange={(e) => updateLanding('heroCoverImageUrl', e.target.value)}
                        className="flex-1 bg-black/60 border border-gold/30 rounded-lg px-3 py-1.5 text-xs text-cream outline-none font-mono"
                      />
                      {content.landing.heroCoverImageUrl && (
                        <button
                          onClick={() => updateLanding('heroCoverImageUrl', '')}
                          className="p-1.5 text-red-300 hover:text-red-100 hover:bg-red-950 rounded-lg transition-colors cursor-pointer"
                          title="Restablecer a imagen por defecto"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cartel Producción en Vivo */}
                <div className="p-5 rounded-2xl bg-black/80 border border-gold/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-display uppercase tracking-wider text-gold font-bold flex items-center gap-1.5">
                      <Drama size={14} /> Cartel del Evento (Teatro en Vivo)
                    </span>
                    {content.theater.coverImageUrl && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gold/20 text-gold border border-gold/40 font-bold font-mono">
                        PERSONALIZADO
                      </span>
                    )}
                  </div>

                  {/* Previsualización */}
                  <div className="relative w-full h-52 sm:h-64 rounded-xl overflow-hidden border-2 border-gold/50 bg-black/90 flex items-center justify-center group">
                    {content.theater.coverImageUrl ? (
                      <img
                        src={content.theater.coverImageUrl}
                        alt="Cartel Teatro"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="text-center p-6 text-cream/50 space-y-2">
                        <Drama size={36} className="mx-auto text-gold/40" />
                        <p className="text-xs font-serif italic">Sin cartel personalizado. Sube uno para que aparezca en el Hero de la Ruta.</p>
                      </div>
                    )}
                  </div>

                  {/* Controles de Carga */}
                  <div className="space-y-2">
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleCoverFileUpload(e, 'theaterCover')}
                        className="hidden"
                      />
                      <span className="w-full py-2.5 px-4 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold text-xs font-display font-bold flex items-center justify-center gap-2 cursor-pointer transition-all">
                        {uploadingTarget === 'theaterCover' ? (
                          <RefreshCw size={14} className="animate-spin" />
                        ) : (
                          <Upload size={14} />
                        )}
                        <span>Subir Cartel del Evento Teatral (Archivo)</span>
                      </span>
                    </label>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="O ingresa URL directa..."
                        value={content.theater.coverImageUrl || ''}
                        onChange={(e) => updateTheater('coverImageUrl', e.target.value)}
                        className="flex-1 bg-black/60 border border-gold/30 rounded-lg px-3 py-1.5 text-xs text-cream outline-none font-mono"
                      />
                      {content.theater.coverImageUrl && (
                        <button
                          onClick={() => updateTheater('coverImageUrl', '')}
                          className="p-1.5 text-red-300 hover:text-red-100 hover:bg-red-950 rounded-lg transition-colors cursor-pointer"
                          title="Quitar cartel personalizado"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </Card>

            {/* SECCIÓN 2: LLAVES SAGRADAS DE BOLETERÍA (JADE, VIDA, ORO, PLATA) */}
            <Card className="p-6 sm:p-8 space-y-6 border-gold/40 bg-black/75 rounded-3xl">
              <div className="flex items-center justify-between border-b border-gold/20 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2.5 text-gold">
                  <Key size={22} />
                  <div>
                    <h2 className="font-display text-lg sm:text-xl font-bold">2. Llaves y Candados de Boletería (Jade, Vida, Oro, Plata)</h2>
                    <p className="text-xs text-cream/70 font-serif italic">
                      Personaliza las imágenes de las 4 llaves de acceso para los planes de boletería del Teatro Municipal.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentPlans.map((plan, idx) => {
                  const keyImg = plan.imageUrl || getKeyDefaultImage(plan.keyType);

                  return (
                    <div key={plan.id} className="p-5 rounded-2xl bg-black/80 border border-gold/30 flex flex-col justify-between space-y-4 text-center">
                      <div className="space-y-1">
                        <span className="text-[10px] font-display uppercase tracking-widest text-gold font-bold block">
                          {plan.keyType.toUpperCase()}
                        </span>
                        <h3 className="font-display text-sm text-cream font-bold leading-tight">
                          {plan.name}
                        </h3>
                        <span className="text-xs text-gold font-bold font-display block">
                          {plan.price}
                        </span>
                      </div>

                      {/* Previsualización de la Llave */}
                      <div className="py-2 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-2xl bg-black/90 border-2 border-gold/60 p-2 flex items-center justify-center shadow-lg overflow-hidden">
                          <img
                            src={keyImg}
                            alt={plan.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>

                      {/* Botón de Carga */}
                      <div className="space-y-2">
                        <label className="block">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleTicketPlanImageUpload(e, idx)}
                            className="hidden"
                          />
                          <span className="w-full py-2 px-2.5 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold text-xs font-display font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all">
                            {uploadingTarget === `plan-${idx}` ? (
                              <RefreshCw size={13} className="animate-spin" />
                            ) : (
                              <Upload size={13} />
                            )}
                            <span>{plan.imageUrl ? 'Cambiar Llave' : 'Subir Llave'}</span>
                          </span>
                        </label>

                        {plan.imageUrl && (
                          <button
                            onClick={() => {
                              sound.playClick();
                              const updated = [...currentPlans];
                              updated[idx].imageUrl = '';
                              updateTicketing('plans', updated);
                            }}
                            className="text-[11px] text-red-300/80 hover:text-red-300 flex items-center justify-center gap-1 mx-auto cursor-pointer"
                          >
                            <Trash2 size={12} /> Quitar Personalizada
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* SECCIÓN 3: FICHAS CIRCULARES DE ESTACIONES TEATRALES (INCLUYE LA VANUSHKA) */}
            <Card className="p-6 sm:p-8 space-y-6 border-gold/40 bg-black/75 rounded-3xl">
              <div className="flex items-center justify-between border-b border-gold/20 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2.5 text-gold">
                  <Drama size={22} />
                  <div>
                    <h2 className="font-display text-lg sm:text-xl font-bold">3. Fichas Circulares de Estaciones Teatrales</h2>
                    <p className="text-xs text-cream/70 font-serif italic">
                      Sube fotos o avatares para cada una de las 4 estaciones escénicas (incluyendo La Vanushka).
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {content.theater.stations.map((st, idx) => (
                  <div key={st.number} className="p-5 rounded-2xl bg-black/80 border border-gold/30 flex flex-col justify-between space-y-4 text-center">
                    
                    <div className="space-y-2">
                      <span className="text-[11px] font-display uppercase tracking-widest text-gold font-bold block">
                        Estación {st.number}
                      </span>
                      <h3 className="font-display text-base text-cream font-bold leading-tight">
                        {st.legend}
                      </h3>
                      <span className="text-[11px] text-cream/60 font-serif italic block">
                        {st.location}
                      </span>
                    </div>

                    {/* Previsualización del Círculo Ficha con Marco Dorado */}
                    <div className="py-2 flex items-center justify-center">
                      <PassportStampSvg
                        code={st.code}
                        name={st.legend}
                        isUnlocked={true}
                        size={84}
                        imageUrl={st.imageUrl}
                      />
                    </div>

                    {/* Botón de Carga de Imagen */}
                    <div className="space-y-2">
                      <label className="block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleStationImageUpload(e, idx)}
                          className="hidden"
                        />
                        <span className="w-full py-2 px-2.5 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold text-xs font-display font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all">
                          {uploadingTarget === `station-${idx}` ? (
                            <RefreshCw size={13} className="animate-spin" />
                          ) : (
                            <Upload size={13} />
                          )}
                          <span>{st.imageUrl ? 'Cambiar Foto' : 'Subir Foto'}</span>
                        </span>
                      </label>

                      {st.imageUrl && (
                        <button
                          onClick={() => {
                            sound.playClick();
                            const updated = [...content.theater.stations];
                            updated[idx].imageUrl = '';
                            updateTheater('stations', updated);
                          }}
                          className="text-[11px] text-red-300/80 hover:text-red-300 flex items-center justify-center gap-1 mx-auto cursor-pointer"
                        >
                          <Trash2 size={12} /> Quitar Foto
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* SECCIÓN 4: FICHAS CIRCULARES DE LAS 7 LEYENDAS (CATÁLOGO Y PASAPORTE) */}
            <Card className="p-6 sm:p-8 space-y-6 border-gold/40 bg-black/75 rounded-3xl">
              <div className="flex items-center justify-between border-b border-gold/20 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2.5 text-gold">
                  <Sparkles size={22} />
                  <div>
                    <h2 className="font-display text-lg sm:text-xl font-bold">4. Fichas Circulares de las 7 Leyendas (Catálogo & Pasaporte)</h2>
                    <p className="text-xs text-cream/70 font-serif italic">
                      Personaliza las imágenes de los sellos del catálogo para un acabado visual de nivel museo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {LEYENDAS_DATA.map((leg) => {
                  const currentImg = content.landing.legendFichasImages?.[leg.id];

                  return (
                    <div key={leg.id} className="p-4 rounded-2xl bg-black/80 border border-gold/30 flex flex-col justify-between space-y-3 text-center">
                      <div>
                        <h4 className="font-display text-sm text-gold font-bold">{leg.name}</h4>
                        <span className="text-[10px] uppercase font-display text-cream/50">Código: {leg.code}</span>
                      </div>

                      {/* Preview */}
                      <div className="py-2 flex items-center justify-center">
                        <PassportStampSvg
                          code={leg.code}
                          name={leg.name}
                          isUnlocked={true}
                          size={76}
                          imageUrl={currentImg}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleLegendFichaUpload(e, leg.id)}
                            className="hidden"
                          />
                          <span className="w-full py-1.5 px-2 rounded-lg bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold text-[11px] font-display font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all">
                            {uploadingTarget === `legend-${leg.id}` ? (
                              <RefreshCw size={12} className="animate-spin" />
                            ) : (
                              <Upload size={12} />
                            )}
                            <span>{currentImg ? 'Cambiar' : 'Subir Foto'}</span>
                          </span>
                        </label>

                        {currentImg && (
                          <button
                            onClick={() => {
                              sound.playClick();
                              const currentMap = { ...(content.landing.legendFichasImages || {}) };
                              delete currentMap[leg.id];
                              updateLanding('legendFichasImages', currentMap);
                            }}
                            className="text-[10px] text-red-300/70 hover:text-red-300 flex items-center justify-center gap-1 mx-auto cursor-pointer"
                          >
                            <Trash2 size={11} /> Quitar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

          </div>
        )}

        {/* CONTENIDO TAB 2: TEATRO EN VIVO, ESTACIONES Y BOLETERÍA */}
        {activeTab === 'theater' && (
          <div className="space-y-8">
            
            {/* DATOS GENERALES DEL EVENTO */}
            <Card className="p-6 sm:p-8 space-y-6 border-gold/40 bg-black/75 rounded-3xl">
              <div className="flex items-center gap-2.5 text-gold border-b border-gold/20 pb-3">
                <Calendar size={20} />
                <h2 className="font-display text-lg sm:text-xl font-bold">1. Datos Generales de la Producción</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-display uppercase tracking-wider text-gold/90 block mb-1.5 font-bold">
                    Badge / Categoría
                  </label>
                  <input
                    type="text"
                    value={content.theater.badge}
                    onChange={(e) => updateTheater('badge', e.target.value)}
                    className="w-full bg-black/60 border border-gold/30 focus:border-gold rounded-xl px-3.5 py-2 text-sm text-cream outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-display uppercase tracking-wider text-gold/90 block mb-1.5 font-bold">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={content.theater.title}
                    onChange={(e) => updateTheater('title', e.target.value)}
                    className="w-full bg-black/60 border border-gold/30 focus:border-gold rounded-xl px-3.5 py-2 text-sm text-cream outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-display uppercase tracking-wider text-gold/90 block mb-1.5 font-bold">
                    Subtítulo / Lugar
                  </label>
                  <input
                    type="text"
                    value={content.theater.subtitle}
                    onChange={(e) => updateTheater('subtitle', e.target.value)}
                    className="w-full bg-black/60 border border-gold/30 focus:border-gold rounded-xl px-3.5 py-2 text-sm text-cream outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-display uppercase tracking-wider text-gold/90 block mb-1.5 font-bold">
                    Fecha del Evento
                  </label>
                  <input
                    type="text"
                    value={content.theater.date}
                    onChange={(e) => updateTheater('date', e.target.value)}
                    className="w-full bg-black/60 border border-gold/30 focus:border-gold rounded-xl px-3.5 py-2 text-sm text-cream outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-display uppercase tracking-wider text-gold/90 block mb-1.5 font-bold">
                    Ubicación (Teatro)
                  </label>
                  <input
                    type="text"
                    value={content.theater.location}
                    onChange={(e) => updateTheater('location', e.target.value)}
                    className="w-full bg-black/60 border border-gold/30 focus:border-gold rounded-xl px-3.5 py-2 text-sm text-cream outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-display uppercase tracking-wider text-gold/90 block mb-1.5 font-bold">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={content.theater.city}
                    onChange={(e) => updateTheater('city', e.target.value)}
                    className="w-full bg-black/60 border border-gold/30 focus:border-gold rounded-xl px-3.5 py-2 text-sm text-cream outline-none"
                  />
                </div>
              </div>
            </Card>

            {/* LAS 4 ESTACIONES ESCÉNICAS (INCLUYENDO LA VANUSHKA) */}
            <Card className="p-6 sm:p-8 space-y-6 border-gold/40 bg-black/75 rounded-3xl">
              <div className="flex items-center justify-between border-b border-gold/20 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2.5 text-gold">
                  <Drama size={20} />
                  <h2 className="font-display text-lg sm:text-xl font-bold">2. Estaciones Escénicas Teatrales</h2>
                </div>
                <span className="text-xs font-mono text-gold/80">Estación 4: La Vanushka</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {content.theater.stations.map((st, idx) => (
                  <div key={st.number} className="p-5 rounded-2xl bg-black/80 border border-gold/30 space-y-4">
                    
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <PassportStampSvg
                          code={st.code}
                          name={st.legend}
                          isUnlocked={true}
                          size={46}
                          imageUrl={st.imageUrl}
                        />
                        <div>
                          <span className="font-display text-xs text-gold font-bold block">
                            Estación {st.number}
                          </span>
                          <span className="font-display text-sm sm:text-base text-cream font-bold">
                            {st.legend}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={st.code}
                          onChange={(e) => {
                            const updated = [...content.theater.stations];
                            updated[idx].code = e.target.value.toUpperCase();
                            updateTheater('stations', updated);
                          }}
                          placeholder="CÓDIGO"
                          className="w-20 bg-black/60 border border-gold/40 rounded-lg px-2 py-1 text-xs text-gold font-mono text-center font-bold outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-cream/70 uppercase block mb-1">Título de la Leyenda</label>
                        <input
                          type="text"
                          value={st.legend}
                          onChange={(e) => {
                            const updated = [...content.theater.stations];
                            updated[idx].legend = e.target.value;
                            updateTheater('stations', updated);
                          }}
                          className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-lg px-3 py-1.5 text-xs text-cream outline-none font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-cream/70 uppercase block mb-1">Ubicación en el Teatro</label>
                        <input
                          type="text"
                          value={st.location}
                          onChange={(e) => {
                            const updated = [...content.theater.stations];
                            updated[idx].location = e.target.value;
                            updateTheater('stations', updated);
                          }}
                          className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-lg px-3 py-1.5 text-xs text-cream outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-cream/70 uppercase block mb-1">Badge de Atmósfera</label>
                      <input
                        type="text"
                        value={st.badge}
                        onChange={(e) => {
                          const updated = [...content.theater.stations];
                          updated[idx].badge = e.target.value;
                          updateTheater('stations', updated);
                        }}
                        className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-lg px-3 py-1.5 text-xs text-cream outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-cream/70 uppercase block mb-1">Descripción de la Escena</label>
                      <textarea
                        rows={3}
                        value={st.description}
                        onChange={(e) => {
                          const updated = [...content.theater.stations];
                          updated[idx].description = e.target.value;
                          updateTheater('stations', updated);
                        }}
                        className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-lg px-3 py-1.5 text-xs text-cream outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* SECCIÓN 3: SISTEMA DE BOLETERÍA EN LÍNEA & PLANES (JADE, VIDA, ORO, PLATA) */}
            <Card className="p-6 sm:p-8 space-y-6 border-gold/40 bg-black/75 rounded-3xl">
              <div className="flex items-center justify-between border-b border-gold/20 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2.5 text-gold">
                  <Ticket size={22} />
                  <div>
                    <h2 className="font-display text-lg sm:text-xl font-bold">3. Sistema de Boletería en Línea y Planes de Acceso</h2>
                    <p className="text-xs text-cream/70 font-serif italic">
                      Administra la propuesta operativa, fases de preventa y los 4 planes de llaves sagradas (Jade, Vida, Oro, Plata).
                    </p>
                  </div>
                </div>
              </div>

              {/* Textos Generales de Boletería */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-display uppercase tracking-wider text-gold/90 block mb-1.5 font-bold">
                    Badge de Sección
                  </label>
                  <input
                    type="text"
                    value={currentTicketing.sectionBadge}
                    onChange={(e) => updateTicketing('sectionBadge', e.target.value)}
                    className="w-full bg-black/60 border border-gold/30 focus:border-gold rounded-xl px-3.5 py-2 text-sm text-cream outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-display uppercase tracking-wider text-gold/90 block mb-1.5 font-bold">
                    Título de Sección
                  </label>
                  <input
                    type="text"
                    value={currentTicketing.sectionTitle}
                    onChange={(e) => updateTicketing('sectionTitle', e.target.value)}
                    className="w-full bg-black/60 border border-gold/30 focus:border-gold rounded-xl px-3.5 py-2 text-sm text-cream outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-display uppercase tracking-wider text-gold/90 block mb-1.5 font-bold">
                    Descripción General de Boletería
                  </label>
                  <textarea
                    rows={2}
                    value={currentTicketing.sectionDescription}
                    onChange={(e) => updateTicketing('sectionDescription', e.target.value)}
                    className="w-full bg-black/60 border border-gold/30 focus:border-gold rounded-xl px-3.5 py-2 text-sm text-cream outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-display uppercase tracking-wider text-gold/90 block mb-1.5 font-bold">
                    Título Autogestión Digital
                  </label>
                  <input
                    type="text"
                    value={currentTicketing.selfServiceTitle}
                    onChange={(e) => updateTicketing('selfServiceTitle', e.target.value)}
                    className="w-full bg-black/60 border border-gold/30 focus:border-gold rounded-xl px-3.5 py-2 text-sm text-cream outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-display uppercase tracking-wider text-gold/90 block mb-1.5 font-bold">
                    Nota al Pie (QR / Escáner)
                  </label>
                  <input
                    type="text"
                    value={currentTicketing.selfServiceFootnote}
                    onChange={(e) => updateTicketing('selfServiceFootnote', e.target.value)}
                    className="w-full bg-black/60 border border-gold/30 focus:border-gold rounded-xl px-3.5 py-2 text-sm text-cream outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-display uppercase tracking-wider text-gold/90 block mb-1.5 font-bold">
                    Descripción de Autogestión
                  </label>
                  <textarea
                    rows={2}
                    value={currentTicketing.selfServiceDescription}
                    onChange={(e) => updateTicketing('selfServiceDescription', e.target.value)}
                    className="w-full bg-black/60 border border-gold/30 focus:border-gold rounded-xl px-3.5 py-2 text-sm text-cream outline-none"
                  />
                </div>
              </div>

              {/* Fases de Preventa */}
              <div className="space-y-4 pt-4 border-t border-gold/20">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-gold" />
                  <h3 className="font-display text-base font-bold text-gold">Fases de Preventa (Octubre)</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPhases.map((phase, pIdx) => (
                    <div key={phase.id} className="p-4 rounded-2xl bg-black/80 border border-gold/30 space-y-3">
                      <div>
                        <label className="text-[11px] text-gold uppercase font-bold block mb-1">Título de Fase</label>
                        <input
                          type="text"
                          value={phase.title}
                          onChange={(e) => {
                            const updated = [...currentPhases];
                            updated[pIdx].title = e.target.value;
                            updateTicketing('phases', updated);
                          }}
                          className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-lg px-3 py-1.5 text-xs text-cream outline-none font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-cream/70 uppercase block mb-1">Fechas</label>
                          <input
                            type="text"
                            value={phase.dates}
                            onChange={(e) => {
                              const updated = [...currentPhases];
                              updated[pIdx].dates = e.target.value;
                              updateTicketing('phases', updated);
                            }}
                            className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-lg px-3 py-1.5 text-xs text-cream outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-cream/70 uppercase block mb-1">Badge de Descuento</label>
                          <input
                            type="text"
                            value={phase.discountBadge || ''}
                            onChange={(e) => {
                              const updated = [...currentPhases];
                              updated[pIdx].discountBadge = e.target.value;
                              updateTicketing('phases', updated);
                            }}
                            className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-lg px-3 py-1.5 text-xs text-cream outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-cream/70 uppercase block mb-1">Descripción</label>
                        <textarea
                          rows={2}
                          value={phase.description}
                          onChange={(e) => {
                            const updated = [...currentPhases];
                            updated[pIdx].description = e.target.value;
                            updateTicketing('phases', updated);
                          }}
                          className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-lg px-3 py-1.5 text-xs text-cream outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editor de los 4 Planes (Jade, Vida, Oro, Plata) */}
              <div className="space-y-4 pt-4 border-t border-gold/20">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Key size={18} className="text-gold" />
                    <h3 className="font-display text-base font-bold text-gold">Planes de Llaves Sagradas (4 Planes)</h3>
                  </div>
                  <span className="text-xs font-mono text-gold/80">Orden: Jade → Vida → Oro → Plata</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {currentPlans.map((plan, plIdx) => (
                    <div key={plan.id} className="p-5 rounded-2xl bg-black/85 border border-gold/40 space-y-4 shadow-md">
                      
                      <div className="flex items-center justify-between border-b border-gold/20 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-display font-bold uppercase tracking-wider text-gold bg-gold/15 px-2.5 py-0.5 rounded border border-gold/30">
                            {plan.keyType.toUpperCase()}
                          </span>
                          <span className="font-display text-sm text-cream font-bold">{plan.name}</span>
                        </div>
                        <span className="text-sm font-display text-gold font-bold">{plan.price}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-cream/70 uppercase block mb-1">Nombre del Plan</label>
                          <input
                            type="text"
                            value={plan.name}
                            onChange={(e) => {
                              const updated = [...currentPlans];
                              updated[plIdx].name = e.target.value;
                              updateTicketing('plans', updated);
                            }}
                            className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-lg px-3 py-1.5 text-xs text-cream outline-none font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-cream/70 uppercase block mb-1">Badge de Etiqueta</label>
                          <input
                            type="text"
                            value={plan.badge}
                            onChange={(e) => {
                              const updated = [...currentPlans];
                              updated[plIdx].badge = e.target.value;
                              updateTicketing('plans', updated);
                            }}
                            className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-lg px-3 py-1.5 text-xs text-cream outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-cream/70 uppercase block mb-1">Precio (ej: Q350 / Q50)</label>
                          <input
                            type="text"
                            value={plan.price}
                            onChange={(e) => {
                              const updated = [...currentPlans];
                              updated[plIdx].price = e.target.value;
                              updateTicketing('plans', updated);
                            }}
                            className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-lg px-3 py-1.5 text-xs text-gold font-bold outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-cream/70 uppercase block mb-1">Nota de Precio / Desglose</label>
                          <input
                            type="text"
                            value={plan.priceNote}
                            onChange={(e) => {
                              const updated = [...currentPlans];
                              updated[plIdx].priceNote = e.target.value;
                              updateTicketing('plans', updated);
                            }}
                            className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-lg px-3 py-1.5 text-xs text-cream outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[11px] text-cream/70 uppercase block mb-1">Capacidad / Personas</label>
                          <input
                            type="text"
                            value={plan.capacityText}
                            onChange={(e) => {
                              const updated = [...currentPlans];
                              updated[plIdx].capacityText = e.target.value;
                              updateTicketing('plans', updated);
                            }}
                            className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-lg px-3 py-1.5 text-xs text-cream outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[11px] text-cream/70 uppercase block mb-1">Descripción del Plan</label>
                          <textarea
                            rows={2}
                            value={plan.description}
                            onChange={(e) => {
                              const updated = [...currentPlans];
                              updated[plIdx].description = e.target.value;
                              updateTicketing('plans', updated);
                            }}
                            className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-lg px-3 py-1.5 text-xs text-cream outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[11px] text-cream/70 uppercase block mb-1">
                            Elementos Incluidos (1 por línea)
                          </label>
                          <textarea
                            rows={3}
                            value={plan.includes.join('\n')}
                            onChange={(e) => {
                              const updated = [...currentPlans];
                              updated[plIdx].includes = e.target.value.split('\n').filter(Boolean);
                              updateTicketing('plans', updated);
                            }}
                            className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-lg px-3 py-1.5 text-xs text-cream outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* SECCIÓN 4: PATROCINIOS CORPORATIVOS Y ALIANZAS */}
            {(() => {
              const currentSponsorship = content.theater.sponsorship || DEFAULT_SPONSORSHIP_CONTENT;
              const currentTiers = currentSponsorship.tiers || DEFAULT_SPONSORSHIP_CONTENT.tiers;

              return (
                <Card className="p-6 sm:p-8 space-y-6 border-gold/40 bg-black/75 rounded-3xl">
                  <div className="flex items-center gap-2.5 text-gold border-b border-gold/20 pb-3">
                    <Handshake size={20} />
                    <h2 className="font-display text-lg sm:text-xl font-bold">
                      4. Alianzas Estratégicas & Oportunidades para Patrocinadores
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-display uppercase tracking-wider text-gold/90 block mb-1.5 font-bold">
                        Badge de la Sección
                      </label>
                      <input
                        type="text"
                        value={currentSponsorship.sectionBadge}
                        onChange={(e) => updateSponsorship('sectionBadge', e.target.value)}
                        className="w-full bg-black/60 border border-gold/30 focus:border-gold rounded-xl px-3.5 py-2 text-sm text-cream outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-display uppercase tracking-wider text-gold/90 block mb-1.5 font-bold">
                        Título de la Sección
                      </label>
                      <input
                        type="text"
                        value={currentSponsorship.sectionTitle}
                        onChange={(e) => updateSponsorship('sectionTitle', e.target.value)}
                        className="w-full bg-black/60 border border-gold/30 focus:border-gold rounded-xl px-3.5 py-2 text-sm text-cream outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-display uppercase tracking-wider text-gold/90 block mb-1.5 font-bold">
                        Descripción Introductoria para Marcas
                      </label>
                      <textarea
                        rows={2}
                        value={currentSponsorship.sectionDescription}
                        onChange={(e) => updateSponsorship('sectionDescription', e.target.value)}
                        className="w-full bg-black/60 border border-gold/30 focus:border-gold rounded-xl px-3.5 py-2 text-sm text-cream outline-none"
                      />
                    </div>
                  </div>

                  {/* Edición de los 3 Tiers de Patrocinio */}
                  <div className="space-y-4 pt-4 border-t border-gold/20">
                    <h3 className="text-sm font-display uppercase tracking-wider text-gold font-bold">
                      Categorías de Patrocinio (Leyenda, Cultural, Especial)
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {currentTiers.map((tier, tIdx) => (
                        <div key={tier.id} className="p-4 rounded-2xl bg-black/80 border border-gold/30 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-display text-sm font-bold text-gold">{tier.name}</span>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/30">
                              {tier.badge}
                            </span>
                          </div>

                          <div>
                            <label className="text-[11px] text-cream/70 uppercase block mb-1">Nombre de Categoría</label>
                            <input
                              type="text"
                              value={tier.name}
                              onChange={(e) => {
                                const updated = [...currentTiers];
                                updated[tIdx].name = e.target.value;
                                updateSponsorship('tiers', updated);
                              }}
                              className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-lg px-3 py-1.5 text-xs text-cream outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-cream/70 uppercase block mb-1">Subtítulo / Badge</label>
                            <input
                              type="text"
                              value={tier.badge}
                              onChange={(e) => {
                                const updated = [...currentTiers];
                                updated[tIdx].badge = e.target.value;
                                updateSponsorship('tiers', updated);
                              }}
                              className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-lg px-3 py-1.5 text-xs text-cream outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-cream/70 uppercase block mb-1">Inversión / Aporte</label>
                            <input
                              type="text"
                              value={tier.investment}
                              onChange={(e) => {
                                const updated = [...currentTiers];
                                updated[tIdx].investment = e.target.value;
                                updateSponsorship('tiers', updated);
                              }}
                              className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-lg px-3 py-1.5 text-xs text-gold font-bold outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-cream/70 uppercase block mb-1">Descripción del Paquete</label>
                            <textarea
                              rows={3}
                              value={tier.description}
                              onChange={(e) => {
                                const updated = [...currentTiers];
                                updated[tIdx].description = e.target.value;
                                updateSponsorship('tiers', updated);
                              }}
                              className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-lg px-3 py-1.5 text-xs text-cream outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-cream/70 uppercase block mb-1">
                              Beneficios Clave (1 por línea)
                            </label>
                            <textarea
                              rows={3}
                              value={tier.benefits.join('\n')}
                              onChange={(e) => {
                                const updated = [...currentTiers];
                                updated[tIdx].benefits = e.target.value.split('\n').filter(Boolean);
                                updateSponsorship('tiers', updated);
                              }}
                              className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-lg px-3 py-1.5 text-xs text-cream outline-none font-mono"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Configuración del Call to Action de Patrocinios */}
                  <div className="space-y-4 pt-4 border-t border-gold/20">
                    <h3 className="text-sm font-display uppercase tracking-wider text-gold font-bold">
                      Banner y Botón de Contacto por WhatsApp para Empresas
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] text-cream/70 uppercase block mb-1">Título del Banner</label>
                        <input
                          type="text"
                          value={currentSponsorship.contactTitle}
                          onChange={(e) => updateSponsorship('contactTitle', e.target.value)}
                          className="w-full bg-black/60 border border-gold/30 focus:border-gold rounded-xl px-3.5 py-2 text-sm text-cream outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-cream/70 uppercase block mb-1">Texto del Botón</label>
                        <input
                          type="text"
                          value={currentSponsorship.contactButtonText}
                          onChange={(e) => updateSponsorship('contactButtonText', e.target.value)}
                          className="w-full bg-black/60 border border-gold/30 focus:border-gold rounded-xl px-3.5 py-2 text-sm text-cream outline-none"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-[11px] text-cream/70 uppercase block mb-1">Mensaje Precargado de WhatsApp</label>
                        <input
                          type="text"
                          value={currentSponsorship.whatsappMessage}
                          onChange={(e) => updateSponsorship('whatsappMessage', e.target.value)}
                          className="w-full bg-black/60 border border-gold/30 focus:border-gold rounded-xl px-3.5 py-2 text-sm text-cream outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })()}

          </div>
        )}

        {/* CONTENIDO TAB 3: TEXTOS Y CANDADOS DEL PORTAL */}
        {activeTab === 'landing' && (
          <div className="space-y-6">
            
            {/* HERO PRINCIPAL */}
            <Card className="p-6 sm:p-8 space-y-6 border-gold/40 bg-black/75 rounded-3xl">
              <div className="flex items-center gap-2.5 text-gold border-b border-gold/20 pb-3">
                <Sparkles size={20} />
                <h2 className="font-display text-lg sm:text-xl font-bold">1. Textos del Encabezado Hero</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-display uppercase tracking-wider text-gold/90 block mb-1.5 font-bold">
                    Badge Superior
                  </label>
                  <input
                    type="text"
                    value={content.landing.heroBadge}
                    onChange={(e) => updateLanding('heroBadge', e.target.value)}
                    className="w-full bg-black/60 border border-gold/30 focus:border-gold rounded-xl px-3.5 py-2 text-sm text-cream outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-display uppercase tracking-wider text-gold/90 block mb-1.5 font-bold">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={content.landing.heroTitle}
                    onChange={(e) => updateLanding('heroTitle', e.target.value)}
                    className="w-full bg-black/60 border border-gold/30 focus:border-gold rounded-xl px-3.5 py-2 text-sm text-cream outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-display uppercase tracking-wider text-gold/90 block mb-1.5 font-bold">
                    Subtítulo Cursiva
                  </label>
                  <input
                    type="text"
                    value={content.landing.heroTitleItalic}
                    onChange={(e) => updateLanding('heroTitleItalic', e.target.value)}
                    className="w-full bg-black/60 border border-gold/30 focus:border-gold rounded-xl px-3.5 py-2 text-sm text-cream outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-display uppercase tracking-wider text-gold/90 block mb-1.5 font-bold">
                    Descripción Editorial
                  </label>
                  <textarea
                    rows={3}
                    value={content.landing.heroDescription}
                    onChange={(e) => updateLanding('heroDescription', e.target.value)}
                    className="w-full bg-black/60 border border-gold/30 focus:border-gold rounded-xl px-3.5 py-2 text-sm text-cream outline-none"
                  />
                </div>
              </div>
            </Card>

            {/* CANDADOS ELEMENTALES */}
            <Card className="p-6 sm:p-8 space-y-6 border-gold/40 bg-black/75 rounded-3xl">
              <div className="flex items-center gap-2.5 text-gold border-b border-gold/20 pb-3">
                <KeyRound size={20} />
                <h2 className="font-display text-lg sm:text-xl font-bold">2. Los 4 Candados Sagrados</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {content.landing.locks.map((lock, idx) => (
                  <div key={lock.id} className="p-5 rounded-2xl bg-black/80 border border-gold/30 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm font-bold text-gold">{lock.name}</span>
                      <span className="text-xs uppercase px-2.5 py-0.5 rounded border border-white/20 text-cream/80">
                        {lock.type}
                      </span>
                    </div>

                    <div>
                      <label className="text-[11px] text-cream/70 uppercase block mb-1">Subtítulo Místico</label>
                      <input
                        type="text"
                        value={lock.subtitle}
                        onChange={(e) => {
                          const updatedLocks = [...content.landing.locks];
                          updatedLocks[idx].subtitle = e.target.value;
                          updateLanding('locks', updatedLocks);
                        }}
                        className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-cream outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-cream/70 uppercase block mb-1">Pregunta del Enigma</label>
                      <textarea
                        rows={2}
                        value={lock.question}
                        onChange={(e) => {
                          const updatedLocks = [...content.landing.locks];
                          updatedLocks[idx].question = e.target.value;
                          updateLanding('locks', updatedLocks);
                        }}
                        className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-cream outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-cream/70 uppercase block mb-1">Revelación / Respuesta</label>
                      <textarea
                        rows={2}
                        value={lock.answer}
                        onChange={(e) => {
                          const updatedLocks = [...content.landing.locks];
                          updatedLocks[idx].answer = e.target.value;
                          updateLanding('locks', updatedLocks);
                        }}
                        className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-cream outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        )}

        {/* CONTENIDO TAB 4: SISTEMA Y RESPALDOS */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <Card className="p-6 sm:p-8 space-y-6 border-white/20 bg-black/75 rounded-3xl">
              <div className="flex items-center gap-2.5 text-cream border-b border-white/15 pb-3">
                <Shield size={20} />
                <h2 className="font-display text-lg sm:text-xl font-bold">Respaldos, Exportación y Restauración</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Exportar JSON */}
                <div className="p-6 rounded-2xl bg-black/60 border border-gold/30 space-y-3 text-center flex flex-col justify-between">
                  <div className="space-y-2">
                    <Download size={28} className="mx-auto text-gold" />
                    <h3 className="font-display text-sm font-bold text-cream">Exportar Copia de Seguridad</h3>
                    <p className="text-xs text-cream/70 font-serif italic">
                      Descarga un archivo JSON con todos los textos, imágenes y configuraciones actuales.
                    </p>
                  </div>
                  <Button onClick={handleExportJSON} variant="outline" size="sm" className="w-full py-2.5 text-xs">
                    Descargar JSON
                  </Button>
                </div>

                {/* Importar JSON */}
                <div className="p-6 rounded-2xl bg-black/60 border border-gold/30 space-y-3 text-center flex flex-col justify-between">
                  <div className="space-y-2">
                    <Upload size={28} className="mx-auto text-gold" />
                    <h3 className="font-display text-sm font-bold text-cream">Restaurar desde JSON</h3>
                    <p className="text-xs text-cream/70 font-serif italic">
                      Sube un archivo de copia de seguridad previamente exportado.
                    </p>
                  </div>
                  <label className="block">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="hidden"
                    />
                    <span className="w-full py-2.5 px-3 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold text-xs font-display font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all">
                      Seleccionar Archivo JSON
                    </span>
                  </label>
                </div>

                {/* Restablecer Valores de Fábrica */}
                <div className="p-6 rounded-2xl bg-black/60 border border-maya-red/40 space-y-3 text-center flex flex-col justify-between">
                  <div className="space-y-2">
                    <RotateCcw size={28} className="mx-auto text-maya-red" />
                    <h3 className="font-display text-sm font-bold text-cream">Valores de Fábrica</h3>
                    <p className="text-xs text-cream/70 font-serif italic">
                      Restablece todos los textos, boletería y las 4 estaciones escénicas (con La Vanushka) a la configuración oficial inicial.
                    </p>
                  </div>
                  <button
                    onClick={handleResetDefaults}
                    className="w-full py-2.5 px-3 rounded-xl bg-maya-red/20 hover:bg-maya-red/30 border border-maya-red text-red-200 text-xs font-display font-bold cursor-pointer transition-all"
                  >
                    Restablecer de Fábrica
                  </button>
                </div>

              </div>
            </Card>
          </div>
        )}

      </main>
    </div>
  );
};
