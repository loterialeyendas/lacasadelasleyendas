import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, UserPlus, Ghost } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInAnonymously, updateProfile } from 'firebase/auth';
import { Button, Card, MysticalTitle } from './Theme';

import logo from '../images/logo.png';

interface LoginProps {
  onLogin: (user: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await signInAnonymously(auth);
      await updateProfile(userCredential.user, {
        displayName: name
      });
      onLogin(userCredential.user);
    } catch (err: any) {
      console.error(err);
      setError('Error al iniciar sesión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full px-4"
    >
      <Card className="space-y-6 border-gold/30 backdrop-blur-md bg-black/60 p-6">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img src={logo} alt="Logo Leyendas" width={96} height={96} className="w-24 h-24 mx-auto drop-shadow-[0_0_15px_rgba(190,141,44,0.3)] object-contain" />
          </motion.div>
          <div className="space-y-1">
            <MysticalTitle className="text-2xl mb-1">BIENVENIDO</MysticalTitle>
            <p className="text-cream/60 italic text-xs font-serif leading-tight px-4">Tu nombre será recordado en las leyendas...</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-gold text-[10px] uppercase tracking-widest block px-1">Nombre del Jugador</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. El Cadejo"
              className="w-full bg-black/40 border border-gold/20 rounded-lg p-3 text-cream text-sm placeholder:text-cream/20 focus:border-gold/50 outline-none transition-colors"
              maxLength={20}
            />
          </div>

          {error && <p className="text-maya-red text-[10px] italic text-center leading-tight">{error}</p>}

          <Button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 py-4"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={20} /> Iniciar Ritual
              </>
            )}
          </Button>
        </form>

        <p className="text-[10px] text-cream/30 text-center uppercase tracking-tighter">
          Al entrar, aceptas los términos del destino y las leyendas de Guatemala.
        </p>
      </Card>
    </motion.div>
  );
};
