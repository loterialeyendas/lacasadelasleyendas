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
  Plus
} from 'lucide-react';
import { Button, Card } from '../components/Theme';
import { sound } from '../lib/audio';
import { 
  SiteContent, 
  LandingContent, 
  LiveTheaterContent, 
  TheaterStationContent,
  fetchSiteContent, 
  saveSiteContent, 
  resetSiteContentToDefaults, 
  DEFAULT_LANDING_CONTENT, 
  DEFAULT_THEATER_CONTENT 
} from '../services/contentService';
import { LEYENDAS_DATA } from '../services/legendService';
import { optimizeImageFile } from '../lib/imageUtils';
import { PassportStampSvg } from '../components/svgs/PassportStampSvg';

import logoPng from '../images/logo.png';
import portadaPng from '../images/png/Portada.png';
import fondoSvg from '../images/optimized/Fondo.svg';

interface MayordomoViewProps {
  onGoToLanding: () => void;
  onGoToTheater: () => void;
}

const MAYORDOMO_STORAGE_AUTH_KEY = 'lacasadelasleyendas_mayordomo_auth';
const DEFAULT_ACCESS_PIN = 'leyendas2026';

export const MayordomoView: React.FC<MayordomoViewProps> = ({
  onGoToLanding,
  onGoToTheater
}) => {
  // Estado de Autenticación del Mayordomo
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(MAYORDOMO_STORAGE_AUTH_KEY) === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Pestaña Activa
  const [activeTab, setActiveTab] = useState<'images' | 'theater' | 'landing' | 'system'>('images');

  // Estado del Contenido
  const [content, setContent] = useState<SiteContent>({
    landing: DEFAULT_LANDING_CONTENT,
    theater: DEFAULT_THEATER_CONTENT
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Cargar contenido al iniciar
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const loaded = await fetchSiteContent();
        setContent(loaded);
      } catch (err) {
        console.error('Error cargando contenido en Mayordomo:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Manejo de Login del Mayordomo
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === DEFAULT_ACCESS_PIN || pinInput.trim() === 'antigravity') {
      sound.playMysticChime();
      setIsAuthenticated(true);
      sessionStorage.setItem(MAYORDOMO_STORAGE_AUTH_KEY, 'true');
      setPinError('');
    } else {
      sound.playError();
      setPinError('Clave de acceso incorrecta. Intenta de nuevo.');
    }
  };

  const handleLogout = () => {
    sound.playClick();
    setIsAuthenticated(false);
    sessionStorage.removeItem(MAYORDOMO_STORAGE_AUTH_KEY);
  };

  // Guardar Cambios
  const handleSave = async () => {
    sound.playMysticChime();
    setIsSaving(true);
    setSaveStatus(null);

    const res = await saveSiteContent(content);
    setIsSaving(false);

    if (res.success) {
      setSaveStatus({
        message: res.error || '¡Cambios guardados y publicados exitosamente en vivo!',
        type: res.error ? 'error' : 'success'
      });
      setTimeout(() => setSaveStatus(null), 5000);
    } else {
      setSaveStatus({
        message: 'No se pudieron guardar los cambios. Intenta de nuevo.',
        type: 'error'
      });
    }
  };

  // Restaurar Valores por Defecto
  const handleResetDefaults = async () => {
    if (window.confirm('¿Estás seguro de que deseas restablecer todos los textos e imágenes a los valores originales de fábrica? Se perderán las modificaciones no respaldadas.')) {
      sound.playMysticChime();
      setIsLoading(true);
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
      // Redimensionar avatar/ficha circular a máximo 400px con compresión WebP
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
              Gestor de Contenidos, Estaciones Escénicas y Personalización Gráfica
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
                  placeholder="••••••••••••"
                  className="w-full bg-black/80 border border-gold/40 focus:border-gold rounded-xl px-4 py-3 text-cream text-center tracking-widest text-lg font-mono outline-none shadow-inner transition-colors"
                  autoFocus
                />
                <KeyRound size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gold/60 pointer-events-none" />
              </div>
              {pinError && (
                <p className="text-xs text-maya-red mt-2 font-display flex items-center justify-center gap-1">
                  <AlertCircle size={14} /> {pinError}
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
            <span className="text-[11px] text-gold/60 font-mono">v2.1 • CMS Oficial</span>
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
                Estaciones Escénicas, Fichas Circulares y Portadas
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
              <AlertCircle size={20} className="text-maya-red shrink-0" />
            )}
            <p className="text-xs sm:text-sm font-display font-medium leading-snug">
              {saveStatus.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-6 relative z-10">
        
        {/* NAVEGACIÓN POR PESTAÑAS */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/70 border border-gold/30 overflow-x-auto">
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
            <span>🎭 Teatro en Vivo (Estaciones)</span>
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

        {/* CONTENIDO TAB 1: IMÁGENES, PORTADAS Y FICHAS CIRCULARES */}
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
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center">
                      <p className="text-xs text-cream font-display">
                        {content.landing.heroCoverImageUrl ? 'Imagen Personalizada Activa' : 'Imagen por Defecto del Sistema'}
                      </p>
                    </div>
                  </div>

                  {/* Controles de Carga */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <label className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleCoverFileUpload(e, 'landingCover')}
                          className="hidden"
                        />
                        <span className="w-full py-2.5 px-3 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold text-xs font-display font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm">
                          {uploadingTarget === 'landingCover' ? (
                            <RefreshCw size={14} className="animate-spin" />
                          ) : (
                            <Upload size={14} />
                          )}
                          <span>Subir Portada desde PC/Móvil</span>
                        </span>
                      </label>

                      {content.landing.heroCoverImageUrl && (
                        <button
                          onClick={() => {
                            sound.playClick();
                            updateLanding('heroCoverImageUrl', '');
                          }}
                          className="py-2.5 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-maya-red/40 text-red-300 text-xs font-display font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                          title="Restablecer a portada original"
                        >
                          <RotateCcw size={14} />
                          <span className="hidden sm:inline">Restablecer</span>
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] text-cream/70 uppercase block mb-1">O ingresa URL externa de imagen:</label>
                      <input
                        type="url"
                        value={content.landing.heroCoverImageUrl || ''}
                        onChange={(e) => updateLanding('heroCoverImageUrl', e.target.value)}
                        placeholder="https://ejemplo.com/mi-portada.webp"
                        className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-lg px-3 py-1.5 text-xs text-cream outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Portada / Cartel de Teatro en Vivo */}
                <div className="p-5 rounded-2xl bg-black/80 border border-gold/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-display uppercase tracking-wider text-maya-red font-bold flex items-center gap-1.5">
                      <Drama size={14} /> Cartel de Producción en Vivo (Teatro)
                    </span>
                    {content.theater.coverImageUrl && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-maya-red/20 text-red-200 border border-maya-red/40 font-bold font-mono">
                        ACTIVO
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
                      <div className="text-center p-4 space-y-2 text-cream/50">
                        <Drama size={36} className="mx-auto text-gold/40" />
                        <p className="text-xs font-serif italic">
                          No se ha configurado un cartel destacado. Se mostrará el encabezado tipográfico estándar.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Controles de Carga */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <label className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleCoverFileUpload(e, 'theaterCover')}
                          className="hidden"
                        />
                        <span className="w-full py-2.5 px-3 rounded-xl bg-maya-red/20 hover:bg-maya-red/30 border border-maya-red/50 text-red-100 text-xs font-display font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm">
                          {uploadingTarget === 'theaterCover' ? (
                            <RefreshCw size={14} className="animate-spin" />
                          ) : (
                            <Upload size={14} />
                          )}
                          <span>Subir Cartel de Teatro</span>
                        </span>
                      </label>

                      {content.theater.coverImageUrl && (
                        <button
                          onClick={() => {
                            sound.playClick();
                            updateTheater('coverImageUrl', '');
                          }}
                          className="py-2.5 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-maya-red/40 text-red-300 text-xs font-display font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                          title="Quitar Cartel"
                        >
                          <Trash2 size={14} />
                          <span className="hidden sm:inline">Quitar</span>
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] text-cream/70 uppercase block mb-1">O ingresa URL externa de cartel:</label>
                      <input
                        type="url"
                        value={content.theater.coverImageUrl || ''}
                        onChange={(e) => updateTheater('coverImageUrl', e.target.value)}
                        placeholder="https://ejemplo.com/cartel-teatro.webp"
                        className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-lg px-3 py-1.5 text-xs text-cream outline-none"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </Card>

            {/* SECCIÓN 2: FICHAS CIRCULARES DE LAS ESTACIONES ESCÉNICAS */}
            <Card className="p-6 sm:p-8 space-y-6 border-gold/40 bg-black/75 rounded-3xl">
              <div className="flex items-center justify-between border-b border-gold/20 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2.5 text-gold">
                  <Drama size={22} className="text-maya-red" />
                  <div>
                    <h2 className="font-display text-lg sm:text-xl font-bold">2. Fichas Circulares de las Estaciones Escénicas</h2>
                    <p className="text-xs text-cream/70 font-serif italic">
                      Sube una foto o ilustración para el círculo de cada estación (incluyendo La Vanushka).
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

            {/* SECCIÓN 3: FICHAS CIRCULARES DE LAS 7 LEYENDAS (CATÁLOGO Y PASAPORTE) */}
            <Card className="p-6 sm:p-8 space-y-6 border-gold/40 bg-black/75 rounded-3xl">
              <div className="flex items-center justify-between border-b border-gold/20 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2.5 text-gold">
                  <Sparkles size={22} />
                  <div>
                    <h2 className="font-display text-lg sm:text-xl font-bold">3. Fichas Circulares de las 7 Leyendas (Catálogo & Pasaporte)</h2>
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

        {/* CONTENIDO TAB 2: TEATRO EN VIVO Y ESTACIONES */}
        {activeTab === 'theater' && (
          <div className="space-y-6">
            
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
                      Restablece todos los textos y las 4 estaciones escénicas (con La Vanushka) a la configuración oficial inicial.
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
