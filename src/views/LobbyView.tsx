import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Crown, 
  Play, 
  Copy, 
  Check, 
  QrCode as QrIcon, 
  Sparkles, 
  KeyRound, 
  Edit3, 
  Share2, 
  CheckCircle2, 
  MessageCircle,
  Radio,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { GameRoom } from '../types/game';
import { Button, Card, MysticalTitle } from '../components/Theme';
import { sound } from '../lib/audio';
import { assignPlayerRole } from '../services/roomService';

import lunaSvg from '../images/Luna.svg';
import volcanSvg from '../images/volcan.svg';
import llaveOroPng from '../images/png/Llave oro.png';

interface LobbyViewProps {
  room: GameRoom;
  userId: string;
  isHost: boolean;
  onStartGame: () => void;
  onLeaveRoom: () => void;
}

const CEREMONIAL_ROLES = [
  { title: 'Guardián de Jade', desc: 'Protector de los misterios y enigmas' },
  { title: 'Cazador de Sombras', desc: 'Rastreador de apariciones ancestrales' },
  { title: 'Cronista del Popol Vuh', desc: 'Portador de la sabiduría y relatos' },
  { title: 'Centinela Sagrado', desc: 'Defensor de los sellos de la Casa' },
  { title: 'Voz de las Leyendas', desc: 'Intérprete de las almas que deambulan' },
  { title: 'Explorador Invitado', desc: 'Valiente viajero recién convocado' }
];

export const LobbyView: React.FC<LobbyViewProps> = ({
  room,
  userId,
  isHost,
  onStartGame,
  onLeaveRoom
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [customRoleInput, setCustomRoleInput] = useState('');

  // Identificar al Mayordomo (Host) y a los Invitados (hasta 5)
  const mayordomo = room.players.find((p) => p.isHost || p.role === 'mayordomo') || room.players[0];
  const guests = room.players.filter((p) => p.id !== mayordomo?.id);
  const guestCount = guests.length;
  const maxGuests = room.maxGuests || 5;
  const isRoomFull = guestCount >= maxGuests;
  const canStart = room.players.length >= 2;

  const inviteUrl = `${window.location.origin}/juego?room=${room.id}`;

  const handleCopyCode = () => {
    sound.playClick();
    navigator.clipboard.writeText(room.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareOtherApps = async () => {
    sound.playClick();
    const shareData = {
      title: 'La Casa de las Leyendas - Sala Mística',
      text: `👻 ¡Te convoco a mi sala de juego en La Casa de las Leyendas!\n🔑 Código de Sala: ${room.id}\nEntra directamente desde tu móvil:`,
      url: inviteUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Cancelado por el usuario
      }
    } else {
      navigator.clipboard.writeText(
        `👻 ¡Te convoco a mi sala en La Casa de las Leyendas!\n🔑 Código de Sala: ${room.id}\n👉 Entra aquí: ${inviteUrl}`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    sound.playClick();
    const msg = encodeURIComponent(
      `👻 *La Casa de las Leyendas*\n¡Te convoco a mi sala de juego!\n*Código de Sala:* ${room.id}\n👉 Entra aquí desde tu móvil: ${inviteUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  };

  const handleAssignRole = async (targetPlayerId: string, roleTitle: string) => {
    sound.playClick();
    try {
      await assignPlayerRole(room.id, targetPlayerId, roleTitle, 'invitado');
      setEditingPlayerId(null);
      setCustomRoleInput('');
    } catch (err) {
      console.error('Error al asignar rol:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="w-full max-w-lg mx-auto px-2 sm:px-4 py-2 sm:py-4 space-y-4 relative"
    >
      <Card className="border-2 border-gold/50 backdrop-blur-xl bg-black/90 p-4 sm:p-6 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.95)] space-y-5 relative z-10 overflow-hidden">
        
        {/* MURAL MÍSTICO AMBIENTAL: VOLCÁN Y LUNA EN LA SALA */}
        <div className="relative rounded-2xl overflow-hidden border border-gold/40 bg-gradient-to-b from-[#131a2f] via-[#0b0f1a] to-black/90 p-3 sm:p-4 shadow-2xl">
          {/* Estrellas de fondo */}
          <div className="absolute inset-0 bg-[radial-gradient(#fcdc70_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

          <div className="flex items-center justify-between relative z-10 gap-2">
            {/* VOLCÁN ANCESTRAL (Izquierda) */}
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex flex-col items-center"
            >
              <img
                src={volcanSvg}
                alt="Volcán ancestral de Guatemala"
                className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(239,68,68,0.7)]"
              />
              <span className="text-[8px] font-mono text-red-400/90 tracking-wider uppercase -mt-1 font-bold">
                Tierra Sagrada
              </span>
            </motion.div>

            {/* TÍTULO Y AMBIENTACIÓN CENTRAL */}
            <div className="text-center px-1 flex-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-[9px] uppercase font-mono tracking-widest font-bold">
                <Crown size={11} className="text-gold" />
                Sala del Mayordomo
              </span>
              <h2 className="font-display text-sm sm:text-base text-cream font-bold mt-1 tracking-wider leading-tight">
                CONVOCATORIA NOCTURNA
              </h2>
              <p className="text-[10px] sm:text-xs text-gold/80 font-serif italic leading-tight mt-0.5">
                Bajo el resplandor de la Luna y la fuerza del Volcán
              </p>
            </div>

            {/* LUNA MAYA DORADA (Derecha) */}
            <motion.div
              animate={{ y: [0, -5, 0], rotate: [0, 3, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex flex-col items-center"
            >
              <img
                src={lunaSvg}
                alt="Luna maya dorada"
                className="w-full h-full object-contain filter drop-shadow-[0_0_18px_rgba(252,207,101,0.8)]"
              />
              <span className="text-[8px] font-mono text-gold/90 tracking-wider uppercase -mt-1 font-bold">
                Noche Mística
              </span>
            </motion.div>
          </div>
        </div>

        {/* Cabecera Ceremonial: Código de Sala */}
        <div className="text-center space-y-2.5">
          <div className="py-3 px-4 bg-black/70 border border-gold/40 rounded-xl space-y-2.5 shadow-inner">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cream/70 block">
              Código de Sala para Convidar
            </span>

            <div className="flex items-center justify-center gap-3">
              <h2 className="text-4xl sm:text-5xl font-display tracking-[0.25em] text-gold font-bold drop-shadow-[0_0_15px_rgba(252,207,101,0.6)]">
                {room.id}
              </h2>

              <button
                type="button"
                onClick={handleCopyCode}
                className="p-2.5 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold transition-all active:scale-95 cursor-pointer"
                title="Copiar código"
                aria-label="Copiar código"
              >
                {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowQR(!showQR);
                }}
                className={`p-2.5 rounded-xl border transition-all active:scale-95 cursor-pointer text-gold ${
                  showQR ? 'bg-gold text-obsidian border-gold' : 'bg-gold/15 hover:bg-gold/25 border-gold/40'
                }`}
                title="Mostrar código QR"
                aria-label="Mostrar código QR"
              >
                <QrIcon size={18} />
              </button>
            </div>

            {/* BOTONES DESTACADOS PARA COMPARTIR EN MÓVIL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <Button
                type="button"
                onClick={handleShareOtherApps}
                className="w-full py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-display tracking-wider rounded-xl bg-gold text-obsidian hover:bg-gold/90 font-bold shadow-md cursor-pointer"
              >
                <Share2 size={16} />
                <span>Compartir Código</span>
              </Button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="w-full py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-display tracking-wider rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <MessageCircle size={16} />
                <span>Enviar por WhatsApp</span>
              </button>
            </div>

            {copiedLink && (
              <span className="text-[10px] text-emerald-400 font-mono block">
                ✓ Enlace de invitación copiado al portapapeles
              </span>
            )}
          </div>
        </div>

        {/* Modal QR Desplegable */}
        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-black/90 border border-gold/40 rounded-xl text-center space-y-2">
                <div className="p-3 bg-white rounded-xl inline-block shadow-2xl border-2 border-gold mx-auto">
                  <QRCodeSVG value={inviteUrl} size={150} />
                </div>
                <p className="text-[11px] text-gold font-mono">
                  Escanea para unirte a la sala en <span className="underline">lacasadelasleyendas.com/juego</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CUADRO INDICANDO A LOS JUGADORES QUE SE ESTÁN SUMANDO */}
        <div className="bg-black/60 border border-gold/30 rounded-xl p-3.5 space-y-3 shadow-inner">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <Radio size={14} className="text-emerald-400 animate-pulse" />
              <h3 className="font-display text-xs text-gold uppercase tracking-wider">
                Convocatoria en Vivo ({room.players.length}/6 Jugadores)
              </h3>
            </div>
            
            {isRoomFull ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/50 font-bold animate-pulse">
                ¡SALA COMPLETA!
              </span>
            ) : (
              <span className="text-[10px] font-mono text-emerald-400">
                {maxGuests - guestCount} {maxGuests - guestCount === 1 ? 'plaza restante' : 'plazas restantes'}
              </span>
            )}
          </div>

          {/* Tarjeta del Mayordomo */}
          <div className="p-2.5 rounded-lg border border-gold/50 bg-gold/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold flex items-center justify-center text-gold relative">
                <Crown size={16} />
                <img src={llaveOroPng} alt="Llave" className="w-4 h-4 absolute -bottom-1 -right-1" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-xs text-cream font-bold">{mayordomo?.name}</span>
                  {mayordomo?.id === userId && (
                    <span className="text-[8px] font-mono bg-gold text-obsidian px-1 rounded font-bold">TÚ</span>
                  )}
                </div>
                <span className="text-[9px] text-gold/80 font-serif italic block">
                  👑 {mayordomo?.customTitle || 'Mayordomo de la Casa (Host)'}
                </span>
              </div>
            </div>
            <span className="text-[9px] font-mono text-gold bg-gold/20 px-2 py-0.5 rounded border border-gold/30">
              Anfitrión
            </span>
          </div>

          {/* Ranuras de los 5 Invitados */}
          <div className="space-y-1.5">
            {[0, 1, 2, 3, 4].map((index) => {
              const guest = guests[index];
              const slotNumber = index + 1;

              if (guest) {
                const isCurrentGuest = guest.id === userId;
                const isEditing = editingPlayerId === guest.id;

                return (
                  <motion.div
                    key={guest.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-2.5 rounded-lg border transition-all ${
                      isCurrentGuest
                        ? 'border-gold/40 bg-gold/10'
                        : 'border-white/10 bg-black/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-950/70 border border-emerald-400/50 flex items-center justify-center text-emerald-300 font-mono text-[10px] font-bold">
                          #{slotNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-display text-xs text-cream">{guest.name}</span>
                            {isCurrentGuest && (
                              <span className="text-[8px] font-mono text-gold font-bold">(TÚ)</span>
                            )}
                          </div>
                          <span className="text-[9px] text-gold/80 font-serif italic block">
                            ✨ {guest.customTitle || `Invitado #${slotNumber}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isHost && (
                          <button
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              setEditingPlayerId(isEditing ? null : guest.id);
                            }}
                            className="p-1 rounded border border-gold/30 hover:border-gold bg-gold/10 text-gold text-[9px] font-mono flex items-center gap-1 cursor-pointer"
                            title="Designar rol"
                          >
                            <Edit3 size={10} />
                            <span>Rol</span>
                          </button>
                        )}

                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <CheckCircle2 size={9} /> Sumado
                        </span>
                      </div>
                    </div>

                    {/* Selector de rol por el Mayordomo */}
                    {isHost && isEditing && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 pt-2 border-t border-gold/20 space-y-2"
                      >
                        <span className="text-[9px] font-mono text-gold block uppercase">
                          Designar Rol para {guest.name}:
                        </span>
                        
                        <div className="grid grid-cols-2 gap-1">
                          {CEREMONIAL_ROLES.map((r) => (
                            <button
                              key={r.title}
                              type="button"
                              onClick={() => handleAssignRole(guest.id, r.title)}
                              className="text-left p-1 rounded border border-gold/20 hover:border-gold bg-black/60 hover:bg-gold/15 transition-all text-[9px] cursor-pointer"
                            >
                              <div className="font-display text-cream">{r.title}</div>
                              <div className="text-[8px] text-cream/50 truncate font-serif italic">{r.desc}</div>
                            </button>
                          ))}
                        </div>

                        <div className="flex gap-1 pt-1">
                          <input
                            type="text"
                            value={customRoleInput}
                            onChange={(e) => setCustomRoleInput(e.target.value)}
                            placeholder="Escribe otro rol místico..."
                            maxLength={24}
                            className="flex-1 bg-black/60 border border-gold/30 rounded px-2 py-1 text-xs text-cream outline-none focus:border-gold"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (customRoleInput.trim()) {
                                handleAssignRole(guest.id, customRoleInput.trim());
                              }
                            }}
                            disabled={!customRoleInput.trim()}
                            className="px-2.5 py-1 rounded bg-gold text-obsidian font-display text-[9px] font-bold uppercase disabled:opacity-40 cursor-pointer"
                          >
                            Asignar
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              }

              // Ranura vacía
              return (
                <div
                  key={`empty-slot-${slotNumber}`}
                  className="p-2 rounded-lg border border-dashed border-white/15 bg-white/[0.02] flex items-center justify-between text-cream/40 text-[11px]"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border border-dashed border-white/20 flex items-center justify-center font-mono text-[10px]">
                      #{slotNumber}
                    </div>
                    <span className="font-serif italic text-cream/40">
                      Esperando que se una el invitado #{slotNumber}...
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-gold/50">Libre</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTÓN PARA IR AL TABLERO AL ESTAR COMPLETA LA SALA */}
        <div className="space-y-2.5 pt-2 border-t border-gold/20">
          {isHost ? (
            <>
              {isRoomFull ? (
                // Sala Completa (5 invitados + Mayordomo)
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="space-y-1.5"
                >
                  <div className="p-2 rounded-lg bg-gold/20 border border-gold text-center text-xs font-display text-gold">
                    ✨ ¡SALA COMPLETA! Los 5 invitados se han sumado.
                  </div>
                  <Button
                    onClick={() => {
                      sound.playMysticChime();
                      onStartGame();
                    }}
                    className="w-full min-h-[54px] py-4 flex items-center justify-center gap-2 text-base font-display tracking-wider rounded-xl shadow-[0_0_25px_rgba(252,207,101,0.6)] border-2 border-gold text-obsidian bg-gold font-bold hover:bg-gold/90 cursor-pointer"
                  >
                    <Play size={20} className="fill-current" />
                    <span>IR AL TABLERO DE JUEGO</span>
                    <ArrowRight size={20} />
                  </Button>
                </motion.div>
              ) : (
                // Aún no está completa, pero se puede iniciar si hay al menos 1 invitado
                <div className="space-y-1.5">
                  <Button
                    onClick={() => {
                      sound.playMysticChime();
                      onStartGame();
                    }}
                    className="w-full min-h-[50px] py-3.5 flex items-center justify-center gap-2 text-sm sm:text-base font-display tracking-wider rounded-xl shadow-[0_4px_20px_rgba(190,141,44,0.35)]"
                    disabled={!canStart}
                  >
                    <Play size={18} className="text-gold" />
                    <span>
                      {canStart
                        ? `Ir al Tablero (${room.players.length} Jugadores)`
                        : 'Esperando al menos 1 invitado...'}
                    </span>
                    {canStart && <ArrowRight size={18} />}
                  </Button>

                  {!canStart ? (
                    <p className="text-[11px] text-gold/80 font-serif italic text-center">
                      Comparte el código <span className="font-mono font-bold text-cream">{room.id}</span> para que se sumen los invitados.
                    </p>
                  ) : (
                    <p className="text-[10px] text-cream/60 font-serif italic text-center">
                      Puedes ir al tablero ahora o esperar a que se completen los {maxGuests} invitados.
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="p-3.5 bg-black/60 rounded-xl border border-gold/20 text-center space-y-1">
              <p className="text-xs text-gold font-serif italic animate-pulse flex items-center justify-center gap-2">
                <Sparkles size={14} />
                {isRoomFull
                  ? '¡Sala completa! El Mayordomo abrirá el tablero en un instante...'
                  : `Esperando a que el Mayordomo (${mayordomo?.name}) inicie y nos lleve al tablero...`}
              </p>
              <p className="text-[10px] text-cream/50 font-mono">
                Mantente en esta pantalla. Cuando el Mayordomo presione "Ir al Tablero", entrarás automáticamente.
              </p>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              sound.playClick();
              onLeaveRoom();
            }}
            className="w-full text-xs py-2.5"
          >
            Abandonar Sala
          </Button>
        </div>

        {/* Pie Ceremonial */}
        <div className="pt-1 border-t border-gold/15 text-center">
          <p className="text-[10px] text-cream/40 font-mono flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            La Casa de las Leyendas • Sala Sincronizada en Vivo
          </p>
        </div>
      </Card>
    </motion.div>
  );
};
