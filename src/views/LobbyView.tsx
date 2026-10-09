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
      className="w-full max-w-lg mx-auto px-2 sm:px-4 py-3 sm:py-5 space-y-4 relative select-none"
    >
      {/* Contenedor Principal: Ficha de Cartón Beige Ancestral del Juego */}
      <div className="p-5 sm:p-7 rounded-3xl bg-[#fbf7ee] border-2 border-gold shadow-[0_15px_45px_rgba(0,0,0,0.75)] text-[#1f1309] space-y-5 relative z-10 overflow-hidden">
        
        {/* CABECERA CEREMONIAL CON LA LUNA SAGRADA (Luna.svg) */}
        <div className="relative text-center pt-1 pb-1 sm:pb-2 space-y-2.5 select-none">
          {/* Marco sagrado de la Luna */}
          <div className="relative inline-block">
            <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-full p-1.5 bg-[#140e08] border-2 border-gold shadow-md flex items-center justify-center mx-auto overflow-hidden">
              <img 
                src={lunaSvg} 
                alt="Luna de las Leyendas" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(252,207,101,0.6)] transition-transform duration-500 hover:rotate-12 hover:scale-105" 
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#1a1208] border border-gold/80 rounded-full p-1 shadow-md">
              <Sparkles size={13} className="text-gold animate-spin" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/90 border border-gold/70 text-amber-950 text-[10px] font-mono tracking-widest uppercase font-black shadow-sm">
              <Crown size={12} className="text-amber-900" /> Sala del Mayordomo
            </div>
            <h2 className="font-display text-xl sm:text-2xl text-[#1f1309] font-black tracking-wider mt-1.5 leading-tight">
              CONVOCATORIA NOCTURNA
            </h2>
            <p className="text-xs sm:text-sm text-[#4a3421] font-serif italic max-w-xs mx-auto">
              Bajo la mirada celestial de la Luna, reúne a los 6 exploradores
            </p>
          </div>
        </div>

        {/* TARJETA CEREMONIAL: CÓDIGO DE SALA Y COMPARTIR */}
        <div className="text-center space-y-2.5">
          <div className="py-4 px-3 sm:px-4 bg-[#ede1c7] border-2 border-gold rounded-2xl space-y-2.5 shadow-inner">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-900 block font-black">
              Código de Sala para Convidar
            </span>

            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <h2 className="text-4xl sm:text-5xl font-mono font-black tracking-[0.2em] text-amber-950 drop-shadow-sm">
                {room.id}
              </h2>

              <button
                type="button"
                onClick={handleCopyCode}
                className="p-2.5 rounded-xl bg-gold/25 hover:bg-gold/40 border border-gold/70 text-amber-950 transition-all active:scale-95 cursor-pointer shadow-sm"
                title="Copiar código de sala"
                aria-label="Copiar código de sala"
              >
                {copied ? <Check size={18} className="text-emerald-700" /> : <Copy size={18} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowQR(!showQR);
                }}
                className={`p-2.5 rounded-xl border transition-all active:scale-95 cursor-pointer shadow-sm ${
                  showQR ? 'bg-gold text-[#140e08] border-gold font-bold' : 'bg-gold/25 hover:bg-gold/40 border-gold/70 text-amber-950'
                }`}
                title="Mostrar código QR de convocatoria"
                aria-label="Mostrar código QR"
              >
                <QrIcon size={18} />
              </button>
            </div>

            {/* BOTONES DESTACADOS PARA COMPARTIR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleShareOtherApps}
                className="w-full py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-display tracking-wider rounded-xl bg-earth-brown text-cream hover:bg-gold hover:text-obsidian font-bold shadow-md cursor-pointer transition-all active:scale-95 border border-gold"
              >
                <Share2 size={16} />
                <span>Compartir Código</span>
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="w-full py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-display tracking-wider rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <MessageCircle size={16} />
                <span>Enviar por WhatsApp</span>
              </button>
            </div>

            {copiedLink && (
              <span className="text-[10px] text-emerald-800 font-mono font-bold block">
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
              <div className="p-4 bg-[#ede1c7] border-2 border-gold rounded-2xl text-center space-y-2 shadow-md">
                <div className="p-3 bg-white rounded-xl inline-block shadow-md border-2 border-gold mx-auto">
                  <QRCodeSVG value={inviteUrl} size={150} />
                </div>
                <p className="text-xs text-[#241508] font-mono font-semibold">
                  Escanea para unirte a la sala en <span className="underline font-bold text-amber-900">lacasadelasleyendas.com/juego</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CUADRO INDICANDO A LOS JUGADORES QUE SE ESTÁN SUMANDO (1/6 JUGADORES) */}
        <div className="bg-[#ede1c7] border border-[#d6be96] rounded-2xl p-3 sm:p-4 space-y-3 shadow-inner">
          <div className="flex items-center justify-between border-b border-[#d6be96] pb-2 flex-wrap gap-1">
            <div className="flex items-center gap-2">
              <Radio size={14} className="text-emerald-700 animate-pulse shrink-0" />
              <h3 className="font-display text-xs text-[#1f1309] uppercase tracking-wider font-black">
                Convocatoria en Vivo ({room.players.length}/6 Jugadores)
              </h3>
            </div>
            
            {isRoomFull ? (
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-200/90 text-amber-950 border border-gold font-bold shadow-sm">
                ¡SALA COMPLETA!
              </span>
            ) : (
              <span className="text-[10px] font-mono text-emerald-800 font-bold">
                {maxGuests - guestCount} {maxGuests - guestCount === 1 ? 'plaza restante' : 'plazas restantes'}
              </span>
            )}
          </div>

          {/* Tarjeta del Mayordomo */}
          <div className="p-3 rounded-xl border-2 border-gold bg-amber-200/90 flex items-center justify-between shadow-sm text-[#1f1309]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gold/30 border border-gold flex items-center justify-center text-amber-900 relative shadow-sm">
                <Crown size={17} />
                <img src={llaveOroPng} alt="Llave" className="w-4 h-4 absolute -bottom-1 -right-1 filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-display text-xs sm:text-sm text-[#1f1309] font-black">{mayordomo?.name}</span>
                  {mayordomo?.id === userId && (
                    <span className="text-[8px] font-mono bg-amber-950 text-white px-1.5 py-0.2 rounded font-bold">TÚ</span>
                  )}
                  {mayordomo?.characterId && (() => {
                    const hostChar = getCharacterById(mayordomo.characterId);
                    return (
                      <span className="text-[8px] font-mono bg-white border border-gold/70 text-[#1f1309] px-1.5 py-0.5 rounded flex items-center gap-1 font-bold shadow-sm">
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
                <span className="text-[9px] text-amber-900 font-serif italic block">
                  👑 {mayordomo?.customTitle || 'Mayordomo de la Casa (Host)'}
                </span>
              </div>
            </div>
            <span className="text-[9px] font-mono text-amber-950 bg-gold/35 px-2.5 py-1 rounded-full border border-gold font-bold whitespace-nowrap shadow-sm">
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
                    className={`p-2.5 rounded-xl border-2 transition-all ${
                      isCurrentGuest
                        ? 'border-gold bg-[#fbf7ee] text-[#1f1309] shadow-sm'
                        : 'border-[#d6be96] bg-[#f4ebd8] text-[#241508]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-emerald-200 border border-emerald-600 flex items-center justify-center text-emerald-950 font-mono text-[10px] font-bold shrink-0">
                          #{slotNumber}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-display text-xs text-[#1f1309] font-bold truncate">{guest.name}</span>
                            {isCurrentGuest && (
                              <span className="text-[8px] font-mono text-amber-900 font-black">(TÚ)</span>
                            )}
                            <span className="text-[8px] font-mono bg-white border border-gold/60 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold text-[#1f1309] shadow-sm">
                              {guestChar.avatarSvg ? (
                                <img src={guestChar.avatarSvg} alt="" className="w-3.5 h-3.5 object-contain" />
                              ) : (
                                <span>🎭</span>
                              )}
                              <span>{guestChar.name}</span>
                            </span>
                          </div>
                          <span className="text-[9px] text-[#4a3421] font-serif italic block truncate">
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
                            className="p-1 rounded border border-gold bg-[#ede1c7] hover:bg-gold/20 text-[#1f1309] text-[9px] font-mono flex items-center gap-1 cursor-pointer font-bold active:scale-95"
                            title="Designar rol ceremonial"
                          >
                            <Edit3 size={10} />
                            <span>Rol</span>
                          </button>
                        )}

                        <span className="text-[9px] font-mono text-emerald-950 bg-emerald-200/90 border border-emerald-600/40 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold shadow-sm">
                          <CheckCircle2 size={10} className="text-emerald-800" /> Sumado
                        </span>
                      </div>
                    </div>

                    {/* Selector de rol por el Mayordomo */}
                    {isHost && isEditing && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 pt-2 border-t border-[#d6be96] space-y-2"
                      >
                        <span className="text-[9px] font-mono text-amber-900 block uppercase font-black">
                          Designar Rol para {guest.name}:
                        </span>
                        
                        <div className="grid grid-cols-2 gap-1.5">
                          {CEREMONIAL_ROLES.map((r) => (
                            <button
                              key={r.title}
                              type="button"
                              onClick={() => handleAssignRole(guest.id, r.title)}
                              className="text-left p-1.5 rounded-lg border border-[#d6be96] hover:border-gold bg-[#fbf7ee] hover:bg-gold/20 transition-all text-[9px] cursor-pointer"
                            >
                              <div className="font-display font-bold text-[#1f1309]">{r.title}</div>
                              <div className="text-[8px] text-[#4a3421] truncate font-serif italic">{r.desc}</div>
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
                            className="flex-1 bg-white border border-gold/70 rounded-lg px-2.5 py-1 text-xs text-[#1f1309] outline-none focus:border-gold"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (customRoleInput.trim()) {
                                handleAssignRole(guest.id, customRoleInput.trim());
                              }
                            }}
                            disabled={!customRoleInput.trim()}
                            className="px-3 py-1 rounded-lg bg-earth-brown text-cream font-display text-[9px] font-bold uppercase disabled:opacity-40 cursor-pointer shadow-sm"
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
                  className="p-2 sm:p-2.5 rounded-xl border border-dashed border-[#d6be96] bg-[#faf4e6] flex items-center justify-between text-[#7a624a] text-[11px]"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border border-dashed border-[#d6be96] flex items-center justify-center font-mono text-[10px] text-amber-900 font-bold">
                      #{slotNumber}
                    </div>
                    <span className="font-serif italic text-[#4a3421] text-[11px]">
                      Esperando que se una el explorador #{slotNumber}...
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-amber-900 font-bold">Libre</span>
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
                  <div className="p-2.5 rounded-xl bg-amber-200/90 border-2 border-gold text-center text-xs font-display text-amber-950 font-bold shadow-sm">
                    ✨ ¡SALA COMPLETA! Los 5 invitados se han sumado.
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playMysticChime();
                      onStartGame();
                    }}
                    className="w-full min-h-[54px] sm:min-h-[58px] py-4 flex items-center justify-center gap-2 text-sm sm:text-base font-display font-bold uppercase tracking-wider rounded-xl shadow-md border-2 border-gold text-cream hover:text-obsidian bg-earth-brown hover:bg-gold transition-all cursor-pointer active:scale-95"
                  >
                    <Play size={20} className="fill-current" />
                    <span>IR AL TABLERO DE JUEGO</span>
                    <ArrowRight size={20} />
                  </button>
                </motion.div>
              ) : (
                // Aún no está completa, pero se puede iniciar si hay al menos 1 invitado
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playMysticChime();
                      onStartGame();
                    }}
                    disabled={!canStart}
                    className="w-full min-h-[50px] sm:min-h-[54px] py-3.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-display font-bold uppercase tracking-wider rounded-xl shadow-md border-2 border-gold text-cream hover:text-obsidian bg-earth-brown hover:bg-gold transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    <Play size={18} />
                    <span>
                      {canStart
                        ? `Ir al Tablero (${room.players.length} Jugadores)`
                        : 'Esperando al menos 1 invitado...'}
                    </span>
                    {canStart && <ArrowRight size={18} />}
                  </button>

                  {!canStart ? (
                    <p className="text-[11px] text-[#4a3421] font-serif italic text-center">
                      Comparte el código <span className="font-mono font-black text-[#1f1309]">{room.id}</span> para que se sumen los invitados.
                    </p>
                  ) : (
                    <p className="text-[10px] text-[#4a3421] font-serif italic text-center">
                      Puedes ir al tablero ahora o esperar a que se completen los {maxGuests} invitados.
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="p-3.5 bg-[#ede1c7] rounded-2xl border border-[#d6be96] text-center space-y-1.5 shadow-inner">
              <p className="text-xs text-[#1f1309] font-serif italic animate-pulse flex items-center justify-center gap-2 font-bold">
                <Sparkles size={14} className="text-amber-900" />
                {isRoomFull
                  ? '¡Sala completa! El Mayordomo abrirá el tablero en un instante...'
                  : `Esperando a que el Mayordomo (${mayordomo?.name}) inicie y nos lleve al tablero...`}
              </p>
              <p className="text-[10px] text-[#4a3421] font-mono">
                Mantente en esta pantalla. Cuando el Mayordomo presione "Ir al Tablero", entrarás automáticamente.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onLeaveRoom();
            }}
            className="w-full py-2.5 px-3 text-xs font-display font-bold uppercase tracking-wider rounded-xl border border-rose-600/50 text-rose-800 hover:bg-rose-100 transition-all cursor-pointer active:scale-95"
          >
            Abandonar Sala
          </button>
        </div>

        {/* PIE DE PÁGINA SAGRADO CON EL VOLCÁN (volcan.svg) */}
        <div className="relative mt-2 -mx-5 sm:-mx-7 -mb-5 sm:-mb-7 pt-3 overflow-hidden pointer-events-none select-none border-t border-gold/30 bg-[#ede1c7]">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full flex justify-center"
          >
            <img 
              src={volcanSvg} 
              alt="Volcanes Sagrados de Guatemala" 
              className="w-full h-24 sm:h-28 object-cover object-bottom opacity-35 filter drop-shadow-[0_-4px_12px_rgba(206,136,34,0.3)]" 
            />
          </motion.div>

          <div className="relative z-20 text-center pb-2.5 -mt-3">
            <p className="text-[10px] sm:text-[11px] font-serif italic text-[#4a3421] font-semibold flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Tierra de Volcanes • La Casa de las Leyendas en Vivo
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
