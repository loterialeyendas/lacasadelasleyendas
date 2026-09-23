import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  User, 
  Crown, 
  Play, 
  Copy, 
  Check, 
  QrCode as QrIcon, 
  Sparkles, 
  Shield, 
  KeyRound, 
  Edit3, 
  UserPlus, 
  CheckCircle2, 
  Share2 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { GameRoom, Player } from '../types/game';
import { Button, Card, MysticalTitle } from '../components/Theme';
import { sound } from '../lib/audio';
import { assignPlayerRole } from '../services/roomService';

import candadoOroPng from '../images/png/Candado oro.png';
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

  // Identificar al Mayordomo (Host) y a los Invitados (máx 5)
  const mayordomo = room.players.find((p) => p.isHost || p.role === 'mayordomo') || room.players[0];
  const guests = room.players.filter((p) => p.id !== mayordomo?.id);
  const guestCount = guests.length;
  const maxGuests = room.maxGuests || 5;

  const inviteUrl = `${window.location.origin}/juego?room=${room.id}`;

  const handleCopyCode = () => {
    sound.playClick();
    navigator.clipboard.writeText(room.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    sound.playClick();
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
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

  const canStart = room.players.length >= 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="w-full max-w-lg mx-auto px-2 sm:px-4 py-2 sm:py-4 space-y-4"
    >
      <Card className="border border-gold/40 backdrop-blur-xl bg-black/85 p-4 sm:p-6 rounded-2xl shadow-[0_0_35px_rgba(0,0,0,0.9)] space-y-5">
        
        {/* Cabecera Ceremonial: Código de Sala y Cupo */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold text-[10px] uppercase font-mono tracking-widest">
            <KeyRound size={12} />
            Sala de Convocatoria Mística
          </div>

          <div className="py-3 px-4 bg-black/60 border border-gold/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
            <div className="text-center sm:text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cream/60 block">
                Número de Sala
              </span>
              <h2 className="text-3xl sm:text-4xl font-display tracking-[0.25em] text-gold font-bold drop-shadow-[0_0_12px_rgba(252,207,101,0.5)]">
                {room.id}
              </h2>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-2.5 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-mono"
                title="Copiar código de sala"
              >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                <span className="hidden sm:inline">{copied ? '¡Copiado!' : 'Código'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2.5 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-mono"
                title="Copiar enlace de invitación"
              >
                {copiedLink ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
                <span className="hidden sm:inline">{copiedLink ? '¡Enlace!' : 'Enlace'}</span>
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
                title="Código QR para unirse"
              >
                <QrIcon size={16} />
              </button>
            </div>
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
                  Escanea para unirte directamente a la sala desde <span className="underline">lacasadelasleyendas.com/juego</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Indicador de Cupos: 1 Mayordomo + hasta 5 Invitados */}
        <div className="bg-black/50 border border-white/10 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-gold text-xs font-mono font-bold">
              <Crown size={15} /> 1 Mayordomo
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1 text-cream/90 text-xs font-mono">
              <Users size={15} className="text-emerald-400" /> {guestCount}/{maxGuests} Invitados
            </span>
          </div>

          <div>
            {guestCount >= maxGuests ? (
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-rose-950/70 border border-rose-500/60 text-rose-300">
                Cupo Lleno (5/5)
              </span>
            ) : (
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/60 text-emerald-300">
                {maxGuests - guestCount} {maxGuests - guestCount === 1 ? 'plaza disponible' : 'plazas disponibles'}
              </span>
            )}
          </div>
        </div>

        {/* TARJETA DEL MAYORDOMO (HOST) */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-gold/80 block px-1">
            Anfitrión del Ritual
          </span>

          <div className="p-3.5 rounded-xl border border-gold/60 bg-gradient-to-r from-gold/15 via-black/60 to-gold/10 relative overflow-hidden flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center text-gold shadow-[0_0_12px_rgba(252,207,101,0.5)]">
                  <Crown size={20} className="text-gold" />
                </div>
                <img 
                  src={llaveOroPng} 
                  alt="Llave Maestra" 
                  className="w-5 h-5 object-contain absolute -bottom-1 -right-1 drop-shadow" 
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-display text-sm text-cream font-bold">
                    {mayordomo?.name || 'Mayordomo'}
                  </h4>
                  {mayordomo?.id === userId && (
                    <span className="text-[9px] font-mono bg-gold text-obsidian px-1.5 py-0.2 rounded font-bold">
                      TÚ
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gold/90 font-serif italic">
                  {mayordomo?.customTitle || 'Mayordomo de la Casa'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-md bg-gold/20 border border-gold/40 text-gold block">
                Host / Director
              </span>
            </div>
          </div>
        </div>

        {/* LISTA DE 5 RANURAS DE INVITADOS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-cream/70 block">
              Invitados Convocados ({guestCount}/5)
            </span>
            {isHost && (
              <span className="text-[9px] text-gold/80 font-serif italic">
                * Puedes designar el rol de cada invitado
              </span>
            )}
          </div>

          <div className="space-y-2">
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
                    className={`p-3 rounded-xl border transition-all ${
                      isCurrentGuest
                        ? 'border-gold/50 bg-gold/10'
                        : 'border-white/15 bg-black/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-950/60 border border-emerald-400/50 flex items-center justify-center text-emerald-300 font-mono text-xs font-bold">
                          #{slotNumber}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-display text-xs text-cream font-medium">
                              {guest.name}
                            </span>
                            {isCurrentGuest && (
                              <span className="text-[9px] font-mono text-gold font-bold">
                                (TÚ)
                              </span>
                            )}
                          </div>
                          
                          <span className="inline-flex items-center gap-1 text-[10px] text-gold/80 font-serif italic">
                            <Sparkles size={10} className="text-gold" />
                            {guest.customTitle || `Invitado #${slotNumber}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Botón para que el Mayordomo designe el rol */}
                        {isHost && (
                          <button
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              setEditingPlayerId(isEditing ? null : guest.id);
                            }}
                            className="p-1.5 rounded-lg border border-gold/30 hover:border-gold bg-gold/10 text-gold text-[10px] font-mono flex items-center gap-1 cursor-pointer active:scale-95"
                            title="Designar rol ceremonial"
                          >
                            <Edit3 size={12} />
                            <span className="hidden sm:inline">Designar Rol</span>
                          </button>
                        )}

                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={10} /> Conectado
                        </span>
                      </div>
                    </div>

                    {/* Selector de Rol Ceremonial por el Mayordomo */}
                    {isHost && isEditing && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 pt-2.5 border-t border-gold/20 space-y-2"
                      >
                        <span className="text-[10px] font-mono text-gold block uppercase tracking-wider">
                          Asignar Rol a {guest.name}:
                        </span>
                        
                        <div className="grid grid-cols-2 gap-1.5">
                          {CEREMONIAL_ROLES.map((r) => (
                            <button
                              key={r.title}
                              type="button"
                              onClick={() => handleAssignRole(guest.id, r.title)}
                              className="text-left p-1.5 rounded-lg border border-gold/20 hover:border-gold bg-black/60 hover:bg-gold/15 transition-all text-[10px] cursor-pointer"
                            >
                              <div className="font-display text-cream font-medium">{r.title}</div>
                              <div className="text-[9px] text-cream/50 truncate font-serif italic">{r.desc}</div>
                            </button>
                          ))}
                        </div>

                        {/* Rol personalizado escrito */}
                        <div className="flex gap-1.5 pt-1">
                          <input
                            type="text"
                            value={customRoleInput}
                            onChange={(e) => setCustomRoleInput(e.target.value)}
                            placeholder="O escribe otro rol místico..."
                            maxLength={28}
                            className="flex-1 bg-black/60 border border-gold/30 rounded-lg px-2.5 py-1 text-xs text-cream placeholder:text-cream/30 outline-none focus:border-gold"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (customRoleInput.trim()) {
                                handleAssignRole(guest.id, customRoleInput.trim());
                              }
                            }}
                            disabled={!customRoleInput.trim()}
                            className="px-3 py-1 rounded-lg bg-gold text-obsidian font-display text-[10px] font-bold uppercase disabled:opacity-40 cursor-pointer"
                          >
                            Asignar
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              }

              // Ranura vacía disponible
              return (
                <div
                  key={`empty-${slotNumber}`}
                  className="p-3 rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex items-center justify-between text-cream/40"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full border border-dashed border-white/20 flex items-center justify-center font-mono text-xs">
                      #{slotNumber}
                    </div>
                    <div>
                      <span className="font-mono text-xs text-cream/50 block">
                        Ranura de Invitado Libre
                      </span>
                      <span className="text-[9px] font-serif italic text-cream/30">
                        Esperando que otro explorador ingrese el código {room.id}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="text-[10px] font-mono text-gold/60 hover:text-gold flex items-center gap-1 border border-gold/20 hover:border-gold/50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <UserPlus size={12} />
                    <span>Convidar</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Acciones del Ritual */}
        <div className="space-y-2.5 pt-3 border-t border-gold/20">
          {isHost ? (
            <>
              <Button
                onClick={() => {
                  sound.playMysticChime();
                  onStartGame();
                }}
                className="w-full min-h-[50px] py-3.5 flex items-center justify-center gap-2 text-sm sm:text-base font-display tracking-wider rounded-xl shadow-[0_4px_20px_rgba(190,141,44,0.35)]"
                disabled={!canStart}
              >
                <Play size={18} className="text-gold" />
                <span>Iniciar Ritual Místico</span>
              </Button>

              {!canStart && (
                <p className="text-[11px] text-gold/80 font-serif italic text-center">
                  ⏳ Convocatoria en curso: Espera a que al menos 1 invitado ingrese el código de sala ({room.id}).
                </p>
              )}
            </>
          ) : (
            <div className="p-3.5 bg-black/60 rounded-xl border border-gold/20 text-center space-y-1">
              <p className="text-xs text-gold font-serif italic animate-pulse flex items-center justify-center gap-2">
                <Sparkles size={14} />
                Esperando a que el Mayordomo ({mayordomo?.name}) inicie el ritual...
              </p>
              <p className="text-[10px] text-cream/50 font-mono">
                Mantente en esta pantalla. El portal se abrirá simultáneamente para todos.
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
      </Card>
    </motion.div>
  );
};
