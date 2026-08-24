import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Users, Sparkles, AlertCircle } from 'lucide-react';
import { Button, Card, MysticalTitle } from '../components/Theme';
import { sound } from '../lib/audio';

interface JoinRoomViewProps {
  onJoin: (roomCode: string) => void;
  onBack: () => void;
  isLoading?: boolean;
  error?: string;
  initialCode?: string;
}

export const JoinRoomView: React.FC<JoinRoomViewProps> = ({
  onJoin,
  onBack,
  isLoading = false,
  error = '',
  initialCode = ''
}) => {
  const [code, setCode] = useState(initialCode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    sound.playClick();
    onJoin(code.trim().toUpperCase());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-md mx-auto px-2 space-y-4"
    >
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onBack} aria-label="Volver" className="p-2 h-auto text-xs">
          <ArrowLeft size={16} />
        </Button>
        <h2 className="text-xs font-display text-gold tracking-widest uppercase">
          Unirse a Sala
        </h2>
      </div>

      <Card className="space-y-6">
        <div className="text-center space-y-2">
          <MysticalTitle className="text-2xl mb-1">CÓDIGO DE SALA</MysticalTitle>
          <p className="text-xs text-cream/70 font-serif italic">
            Ingresa el código de 6 caracteres compartido por el anfitrión.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="CÓDIGO"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full bg-black/50 border border-gold/30 rounded-xl p-4 text-center text-3xl tracking-[0.35em] text-gold font-display outline-none focus:border-gold shadow-inner"
            maxLength={6}
            autoFocus
          />

          {error && (
            <div className="p-3 bg-maya-red/20 border border-maya-red/40 rounded-lg flex items-center gap-2 text-xs text-red-200">
              <AlertCircle size={16} className="text-maya-red shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || code.length < 6}
            className="w-full py-4 flex items-center justify-center gap-2 text-xs"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles size={16} /> Vincular Almas
              </>
            )}
          </Button>
        </form>
      </Card>
    </motion.div>
  );
};
