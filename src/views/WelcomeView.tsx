import React from 'react';
import { motion } from 'motion/react';
import { Compass, Users, Crown, QrCode, BookOpen, Sparkles, Ghost, Shield } from 'lucide-react';
import { Button, Card, MysticalTitle } from '../components/Theme';
import { sound } from '../lib/audio';
import logo from '../images/logo.png';

interface WelcomeViewProps {
  onStartExplorer: () => void;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
  completedStamps: number;
  totalLegends: number;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onStartExplorer,
  onCreateRoom,
  onJoinRoom,
  completedStamps,
  totalLegends
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto px-3 space-y-6"
    >
      {/* Encabezado y Logo */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative inline-block"
        >
          <div className="absolute inset-0 bg-gold/20 blur-2xl rounded-full" />
          <img
            src={logo}
            alt="Logo Casa de las Leyendas"
            className="w-24 h-24 mx-auto drop-shadow-[0_0_20px_rgba(190,141,44,0.4)] object-contain relative z-10"
          />
        </motion.div>

        <MysticalTitle className="text-2xl md:text-3xl mb-1">
          LA CASA DE LAS LEYENDAS
        </MysticalTitle>
        <p className="text-cream/80 font-serif italic text-sm">
          Guatemala Mágica y Ancestral
        </p>
      </div>

      {/* Tarjeta Modo Explorador / Recorrido */}
      <Card className="space-y-4 border-gold/40 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center text-gold border border-gold/40 shrink-0">
            <Compass size={26} className="animate-spin-slow" />
          </div>
          <div className="space-y-1 text-left flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base text-gold">Modo Explorador</h3>
              <span className="text-[10px] font-display px-2 py-0.5 rounded-full bg-gold/20 text-cream border border-gold/30">
                {completedStamps}/{totalLegends} Sellos
              </span>
            </div>
            <p className="text-xs text-cream/70 font-serif italic leading-tight">
              Recorre la casa física, escanea los códigos QR de cada estación y completa tu Pasaporte de Leyendas.
            </p>
          </div>
        </div>

        <Button
          onClick={() => {
            sound.playMysticChime();
            onStartExplorer();
          }}
          className="w-full py-3.5 flex items-center justify-center gap-2 text-xs"
        >
          <QrCode size={16} /> Abrir Pasaporte & Escáner
        </Button>
      </Card>

      {/* Sección Multijugador / Sala */}
      <Card className="space-y-4 border border-gold/30">
        <div className="text-left space-y-1">
          <div className="flex items-center gap-2 text-gold">
            <Users size={18} />
            <h3 className="font-display text-sm uppercase tracking-wider text-gold">
              Sala de Convocatoria (Multijugador)
            </h3>
          </div>
          <p className="text-xs text-cream/70 font-serif italic">
            El Mayordomo abre la sala y convoca hasta 5 invitados con el número de sala.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <Button
            variant="outline"
            onClick={() => {
              sound.playClick();
              onCreateRoom();
            }}
            className="flex flex-col items-center justify-center gap-1 py-3 px-2 text-xs border-gold/40 hover:border-gold"
          >
            <div className="flex items-center gap-1.5 text-gold font-bold">
              <Crown size={16} /> Ser Mayordomo
            </div>
            <span className="text-[9px] text-cream/50 lowercase tracking-normal">Crear sala (Host)</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              sound.playClick();
              onJoinRoom();
            }}
            className="flex flex-col items-center justify-center gap-1 py-3 px-2 text-xs border-white/20 hover:border-gold/40"
          >
            <div className="flex items-center gap-1.5 text-cream font-bold">
              <Users size={16} className="text-emerald-400" /> Entrar como Invitado
            </div>
            <span className="text-[9px] text-cream/50 lowercase tracking-normal">Ingresar código</span>
          </Button>
        </div>
      </Card>

      {/* Iconos Decorativos */}
      <div className="flex justify-center gap-6 opacity-30 pt-2">
        <Ghost size={24} className="text-gold" />
        <Shield size={24} className="text-maya-red" />
        <BookOpen size={24} className="text-gold" />
      </div>
    </motion.div>
  );
};
