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
import { getCharacterById } from '../data/characters';

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
      className="w-full max-w-lg mx-auto px-1.5 sm:px-4 py-2 sm:py-4 space-y-4 relative select-none"
    >
      <Card className="border-2 border-gold/70 backdrop-blur-xl bg-gradient-to-b from-[#1c150c]/98 via-[#130d07]/98 to-[#0b0704]/98 p-3.5 sm:p-6 rounded-3xl shadow-[0_0_50px_rgba(206,136,34,0.35),0_20px_50px_rgba(0,0,0,0.85)] space-y-4 sm:space-y-5 relative z-10 overflow-hidden text-[#FFF0C8]">
        
        {/* Halo áureo celestial superior */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-56 rounded-full bg-gradient-to-b from-amber-400/25 via-gold/15 to-transparent blur-3xl pointer-events-none" />

        {/* CABECERA CEREMONIAL CON LA LUNA SAGRADA (Luna.svg) */}
        <div className="relative text-center pt-1 pb-1 sm:pb-2 space-y-2 select-none">
          {/* Marco sagrado de la Luna Maya */}
          <div className="relative inline-block">
            <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-full p-1.5 bg-gradient-to-b from-amber-500/30 via-black to-[#1c150c] border-2 border-gold shadow-[0_0_25px_rgba(252,207,101,0.55)] flex items-center justify-center mx-auto overflow-hidden">
              <img 
                src={lunaSvg} 
                alt="Luna de las Leyendas" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(252,207,101,0.7)] transition-transform duration-500 hover:rotate-12 hover:scale-105" 
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#1a1208] border border-gold/80 rounded-full p-1 shadow-md">
              <Sparkles size={12} className="text-gold animate-spin" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950/80 border border-gold/60 text-amber-300 text-[10px] font-mono tracking-widest uppercase font-bold shadow-sm">
              <Crown size={12} className="text-gold" /> Sala del Mayordomo
            </div>
            <h2 className="font-display text-lg sm:text-2xl text-amber-200 font-extrabold tracking-wider mt-1 drop-shadow-sm leading-tight">
              CONVOCATORIA NOCTURNA
            </h2>
            <p className="text-[11px] sm:text-xs text-amber-100/75 font-serif italic max-w-xs mx-auto">
              Bajo la mirada celestial de la Luna, reúne a los 6 exploradores
            </p>
          </div>
        </div>

        {/* TARJETA CEREMONIAL: CÓDIGO DE SALA Y COMPARTIR */}
        <div className="text-center space-y-2.5">
          <div className="py-3 px-3 sm:px-4 bg-[#140e08]/95 border-2 border-gold/60 rounded-2xl space-y-2.5 shadow-inner">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300/80 block font-bold">
              Código de Sala para Convidar
            </span>

            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-[0.2em] text-amber-200 drop-shadow-[0_0_15px_rgba(252,207,101,0.6)]">
                {room.id}
              </h2>

              <button
                type="button"
                onClick={handleCopyCode}
                className="p-2.5 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/60 text-amber-200 transition-all active:scale-95 cursor-pointer shadow-sm"
                title="Copiar código de sala"
                aria-label="Copiar código de sala"
              >
                {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowQR(!showQR);
                }}
                className={`p-2.5 rounded-xl border transition-all active:scale-95 cursor-pointer shadow-sm ${
                  showQR ? 'bg-gold text-[#140e08] border-gold font-bold' : 'bg-gold/15 hover:bg-gold/25 border-gold/60 text-amber-200'
                }`}
                title="Mostrar código QR de convocatoria"
                aria-label="Mostrar código QR"
              >
                <QrIcon size={18} />
              </button>
            </div>

            {/* BOTONES DESTACADOS PARA COMPARTIR EN MÓVIL AL MÁXIMO ANCHO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <Button
                type="button"
                onClick={handleShareOtherApps}
                className="w-full py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-display tracking-wider rounded-xl bg-gold text-[#140e08] hover:bg-gold/90 font-bold shadow-md cursor-pointer active:scale-95"
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
              <div className="p-4 bg-[#140e08]/95 border-2 border-gold/50 rounded-2xl text-center space-y-2 shadow-xl">
                <div className="p-3 bg-white rounded-xl inline-block shadow-2xl border-2 border-gold mx-auto">
                  <QRCodeSVG value={inviteUrl} size={150} />
                </div>
                <p className="text-[11px] text-amber-200 font-mono font-medium">
                  Escanea para unirte a la sala en <span className="underline text-gold">lacasadelasleyendas.com/juego</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CUADRO INDICANDO A LOS JUGADORES QUE SE ESTÁN SUMANDO (1/6 JUGADORES) */}
        <div className="bg-[#140e08]/90 border border-gold/40 rounded-2xl p-3 sm:p-4 space-y-3 shadow-inner">
          <div className="flex items-center justify-between border-b border-gold/20 pb-2 flex-wrap gap-1">
            <div className="flex items-center gap-2">
              <Radio size={14} className="text-emerald-400 animate-pulse shrink-0" />
              <h3 className="font-display text-xs text-amber-200 uppercase tracking-wider font-bold">
                Convocatoria en Vivo ({room.players.length}/6 Jugadores)
              </h3>
            </div>
            
            {isRoomFull ? (
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-gold/25 text-amber-200 border border-gold font-bold animate-pulse shadow-sm">
                ¡SALA COMPLETA!
              </span>
            ) : (
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                {maxGuests - guestCount} {maxGuests - guestCount === 1 ? 'plaza restante' : 'plazas restantes'}
              </span>
            )}
          </div>

          {/* Tarjeta del Mayordomo */}
          <div className="p-2.5 sm:p-3 rounded-xl border-2 border-gold bg-gradient-to-r from-amber-950/70 via-[#23180d] to-amber-950/40 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-black/60 border border-gold/70 flex items-center justify-center text-amber-300 relative shadow-sm">
                <Crown size={17} />
                <img src={llaveOroPng} alt="Llave" className="w-4 h-4 absolute -bottom-1 -right-1" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-display text-xs sm:text-sm text-[#FFF0C8] font-bold">{mayordomo?.name}</span>
                  {mayordomo?.id === userId && (
                    <span className="text-[8px] font-mono bg-gold text-[#140e08] px-1.5 py-0.2 rounded font-bold">TÚ</span>
                  )}
                  {mayordomo?.characterId && (() => {
                    const hostChar = getCharacterById(mayordomo.characterId);
                    return (
                      <span className="text-[8px] font-mono bg-black/70 border border-gold/50 text-amber-300 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
                        {hostChar.avatarSvg ? (
                          <img src={hostChar.avatarSvg} alt="" className="w-3.5 h-3.5 object-contain" />
                        ) : (
                          <span>🎭</span>
                        )}
                        <span>{hostChar.name}</span>
                      </span>
                    );
                  })()}
                </div>
                <span className="text-[9px] text-amber-200/80 font-serif italic block">
                  👑 {mayordomo?.customTitle || 'Mayordomo de la Casa (Host)'}
                </span>
              </div>
            </div>
            <span className="text-[9px] font-mono text-amber-200 bg-gold/25 px-2.5 py-1 rounded-full border border-gold/50 font-bold whitespace-nowrap shadow-sm">
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
                const guestChar = getCharacterById(guest.characterId);

                return (
                  <motion.div
                    key={guest.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isCurrentGuest
                        ? 'border-gold bg-gradient-to-r from-amber-950/50 via-[#1f150c] to-transparent shadow-sm'
                        : 'border-gold/30 bg-[#161008]/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-emerald-950/80 border border-emerald-400/60 flex items-center justify-center text-emerald-300 font-mono text-[10px] font-bold shrink-0">
                          #{slotNumber}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-display text-xs text-[#FFF0C8] font-bold truncate">{guest.name}</span>
                            {isCurrentGuest && (
                              <span className="text-[8px] font-mono text-amber-300 font-bold">(TÚ)</span>
                            )}
                            <span className={`text-[8px] font-mono bg-black/70 border border-gold/30 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold ${guestChar.colorTheme.text}`}>
                              {guestChar.avatarSvg ? (
                                <img src={guestChar.avatarSvg} alt="" className="w-3.5 h-3.5 object-contain" />
                              ) : (
                                <span>🎭</span>
                              )}
                              <span>{guestChar.name}</span>
                            </span>
                          </div>
                          <span className="text-[9px] text-amber-100/70 font-serif italic block truncate">
                            ✨ {guest.customTitle || `Invitado #${slotNumber}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isHost && (
                          <button
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              setEditingPlayerId(isEditing ? null : guest.id);
                            }}
                            className="p-1 rounded border border-gold/40 hover:border-gold bg-gold/15 text-amber-200 text-[9px] font-mono flex items-center gap-1 cursor-pointer font-bold active:scale-95"
                            title="Designar rol ceremonial"
                          >
                            <Edit3 size={10} />
                            <span>Rol</span>
                          </button>
                        )}

                        <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold shadow-sm">
                          <CheckCircle2 size={10} /> Sumado
                        </span>
                      </div>
                    </div>

                    {/* Selector de rol por el Mayordomo */}
                    {isHost && isEditing && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 pt-2 border-t border-gold/30 space-y-2"
                      >
                        <span className="text-[9px] font-mono text-amber-300 block uppercase font-bold">
                          Designar Rol para {guest.name}:
                        </span>
                        
                        <div className="grid grid-cols-2 gap-1.5">
                          {CEREMONIAL_ROLES.map((r) => (
                            <button
                              key={r.title}
                              type="button"
                              onClick={() => handleAssignRole(guest.id, r.title)}
                              className="text-left p-1.5 rounded-lg border border-gold/30 hover:border-gold bg-[#120d07] hover:bg-gold/20 transition-all text-[9px] cursor-pointer"
                            >
                              <div className="font-display font-bold text-[#FFF0C8]">{r.title}</div>
                              <div className="text-[8px] text-amber-100/60 truncate font-serif italic">{r.desc}</div>
                            </button>
                          ))}
                        </div>

                        <div className="flex gap-1.5 pt-1">
                          <input
                            type="text"
                            value={customRoleInput}
                            onChange={(e) => setCustomRoleInput(e.target.value)}
                            placeholder="Escribe otro rol místico..."
                            maxLength={24}
                            className="flex-1 bg-[#120d07] border border-gold/40 rounded-lg px-2.5 py-1 text-xs text-[#FFF0C8] outline-none focus:border-gold"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (customRoleInput.trim()) {
                                handleAssignRole(guest.id, customRoleInput.trim());
                              }
                            }}
                            disabled={!customRoleInput.trim()}
                            className="px-3 py-1 rounded-lg bg-gold text-[#140e08] font-display text-[9px] font-bold uppercase disabled:opacity-40 cursor-pointer shadow-sm"
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
                  className="p-2 sm:p-2.5 rounded-xl border border-dashed border-gold/25 bg-[#120d07]/40 flex items-center justify-between text-[#F5EDE0]/40 text-[11px]"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border border-dashed border-gold/30 flex items-center justify-center font-mono text-[10px] text-gold/50">
                      #{slotNumber}
                    </div>
                    <span className="font-serif italic text-amber-100/40 text-[11px]">
                      Esperando que se una el explorador #{slotNumber}...
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-gold/60 font-bold">Libre</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTÓN PARA IR AL TABLERO AL ESTAR COMPLETA LA SALA */}
        <div className="space-y-2.5 pt-1">
          {isHost ? (
            <>
              {isRoomFull ? (
                // Sala Completa (5 invitados + Mayordomo)
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="space-y-2"
                >
                  <div className="p-2.5 rounded-xl bg-gold/20 border-2 border-gold text-center text-xs font-display text-amber-200 font-bold shadow-md">
                    ✨ ¡SALA COMPLETA! Los 5 invitados se han sumado.
                  </div>
                  <Button
                    onClick={() => {
                      sound.playMysticChime();
                      onStartGame();
                    }}
                    className="w-full min-h-[54px] sm:min-h-[58px] py-4 flex items-center justify-center gap-2 text-base font-display font-extrabold tracking-wider rounded-xl shadow-[0_0_30px_rgba(252,207,101,0.6)] border-2 border-gold text-[#140e08] bg-gradient-to-r from-amber-300 via-gold to-amber-300 hover:brightness-110 cursor-pointer"
                  >
                    <Play size={20} className="fill-current" />
                    <span>IR AL TABLERO DE JUEGO</span>
                    <ArrowRight size={20} />
                  </Button>
                </motion.div>
              ) : (
                // Aún no está completa, pero se puede iniciar si hay al menos 1 invitado
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      sound.playMysticChime();
                      onStartGame();
                    }}
                    className="w-full min-h-[50px] sm:min-h-[54px] py-3.5 flex items-center justify-center gap-2 text-sm sm:text-base font-display font-extrabold tracking-wider rounded-xl shadow-[0_4px_24px_rgba(190,141,44,0.4)] border-2 border-gold/70 cursor-pointer"
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
                    <p className="text-[11px] text-amber-200/80 font-serif italic text-center">
                      Comparte el código <span className="font-mono font-bold text-[#FFF0C8]">{room.id}</span> para que se sumen los invitados.
                    </p>
                  ) : (
                    <p className="text-[10px] text-amber-100/60 font-serif italic text-center">
                      Puedes ir al tablero ahora o esperar a que se completen los {maxGuests} invitados.
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="p-3.5 bg-[#140e08]/90 rounded-2xl border border-gold/40 text-center space-y-1.5 shadow-inner">
              <p className="text-xs text-amber-200 font-serif italic animate-pulse flex items-center justify-center gap-2">
                <Sparkles size={14} className="text-gold" />
                {isRoomFull
                  ? '¡Sala completa! El Mayordomo abrirá el tablero en un instante...'
                  : `Esperando a que el Mayordomo (${mayordomo?.name}) inicie y nos lleve al tablero...`}
              </p>
              <p className="text-[10px] text-amber-100/60 font-mono">
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
            className="w-full text-xs py-2.5 border-rose-500/40 text-rose-300 hover:bg-rose-950/40 hover:text-white cursor-pointer"
          >
            Abandonar Sala
          </Button>
        </div>

        {/* PIE DE PÁGINA SAGRADO CON EL VOLCÁN (volcan.svg) */}
        <div className="relative mt-2 -mx-3.5 sm:-mx-6 -mb-3.5 sm:-mb-6 pt-3 overflow-hidden pointer-events-none select-none border-t border-gold/30 bg-gradient-to-b from-[#140e08] to-[#090603]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#090603] via-transparent to-transparent z-10" />
          
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full flex justify-center"
          >
            <img 
              src={volcanSvg} 
              alt="Volcanes Sagrados de Guatemala" 
              className="w-full h-24 sm:h-32 object-cover object-bottom opacity-45 filter drop-shadow-[0_-6px_20px_rgba(206,136,34,0.35)]" 
            />
          </motion.div>

          <div className="relative z-20 text-center pb-2.5 -mt-3">
            <p className="text-[10px] sm:text-[11px] font-serif italic text-amber-200/70 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Tierra de Volcanes • La Casa de las Leyendas en Vivo
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
