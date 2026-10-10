import { db } from '../lib/firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot, 
  arrayUnion, 
  runTransaction,
  Unsubscribe 
} from 'firebase/firestore';
import { GameRoom, Player, PlayerRole } from '../types/game';
import { GameModule } from '../types/legend';

export const createGameRoom = async (hostId: string, hostName: string, hostCharacterId?: string): Promise<string> => {
  // Código alfanumérico amigable de 6 caracteres
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let roomId = '';
  for (let i = 0; i < 6; i++) {
    roomId += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const now = Date.now();
  const roomData: GameRoom = {
    id: roomId,
    hostId,
    hostName: hostName || 'Mayordomo',
    createdAt: now,
    expiresAt: now + 24 * 60 * 60 * 1000, // TTL de 24 horas para prevenir salas huérfanas
    status: 'waiting',
    currentRound: 1,
    maxRounds: 8,
    maxGuests: 5,
    players: [
      {
        id: hostId,
        name: hostName || 'Mayordomo',
        characterId: hostCharacterId || 'chancho',
        points: 0,
        isHost: true,
        role: 'mayordomo',
        customTitle: 'Mayordomo de la Casa',
        isReady: true,
        lastActive: now
      }
    ]
  };

  await setDoc(doc(db, 'rooms', roomId), roomData);
  return roomId;
};

export const joinGameRoom = async (
  roomId: string, 
  player: Player
): Promise<{ success: boolean; error?: string; assignedCharacterId?: string }> => {
  const cleanId = roomId.trim().toUpperCase();
  if (!cleanId) return { success: false, error: 'Código de sala inválido' };
  const roomRef = doc(db, 'rooms', cleanId);

  try {
    const result = await runTransaction(db, async (tx) => {
      const snap = await tx.get(roomRef);

      if (!snap.exists()) {
        return { success: false, error: 'Código de sala no encontrado' };
      }

      const data = snap.data() as GameRoom;

      // Validar si la sala expiró (más de 24 horas)
      const isExpired = 
        (data.expiresAt && Date.now() > data.expiresAt) ||
        (data.createdAt && Date.now() - data.createdAt > 24 * 60 * 60 * 1000);

      if (isExpired) {
        return { success: false, error: 'Esta sala ha expirado por antigüedad (máximo 24 horas).' };
      }

      if (data.status !== 'waiting') {
        return { success: false, error: 'El ritual ya comenzó o finalizó' };
      }

      const allTzipitioIds = ['chancho', 'chispuda', 'chinche', 'chilera', 'chela', 'chongo'];
      const otherPlayers = data.players.filter((p) => p.id !== player.id);
      const occupiedCharIds = new Set(otherPlayers.map((p) => p.characterId).filter(Boolean));

      let characterToUse = player.characterId || 'chancho';

      // Si el personaje ya está ocupado por otro explorador en la sala, reasignar al primer libre disponible
      if (occupiedCharIds.has(characterToUse)) {
        const freeCharId = allTzipitioIds.find((id) => !occupiedCharIds.has(id));
        if (!freeCharId) {
          return {
            success: false,
            error: 'La sala está completa y no quedan personajes disponibles.'
          };
        }
        characterToUse = freeCharId;
      }

      // Evitar duplicados si reconecta
      const existingPlayerIndex = data.players.findIndex((p) => p.id === player.id);
      if (existingPlayerIndex >= 0) {
        const updatedPlayers = [...data.players];
        updatedPlayers[existingPlayerIndex] = {
          ...updatedPlayers[existingPlayerIndex],
          name: player.name || updatedPlayers[existingPlayerIndex].name,
          characterId: characterToUse,
          lastActive: Date.now()
        };
        tx.update(roomRef, { players: updatedPlayers });
      } else {
        // Validar límite estricto de hasta 5 invitados (1 mayordomo + 5 invitados = 6 máx)
        const guestCount = data.players.filter((p) => !p.isHost && p.role !== 'mayordomo').length;
        if (guestCount >= 5 || data.players.length >= 6) {
          return { 
            success: false, 
            error: 'La sala del Mayordomo ya alcanzó el cupo máximo de 5 invitados convocados.' 
          };
        }

        const guestPlayer: Player = {
          ...player,
          characterId: characterToUse,
          role: 'invitado',
          customTitle: `Invitado #${guestCount + 1}`,
          isHost: false,
          isReady: true,
          lastActive: Date.now()
        };

        tx.update(roomRef, {
          players: [...data.players, guestPlayer]
        });
      }

      return { success: true, assignedCharacterId: characterToUse };
    });

    return result;
  } catch (err: any) {
    console.error('Error al unirse a la sala:', err);
    return { success: false, error: 'Error al unirse a la sala. Intenta de nuevo.' };
  }
};

export const updatePlayerCharacter = async (
  roomId: string,
  playerId: string,
  characterId: string
): Promise<{ success: boolean; error?: string }> => {
  const cleanId = roomId.trim().toUpperCase();
  if (!cleanId || !playerId) return { success: false, error: 'Datos no válidos' };
  const roomRef = doc(db, 'rooms', cleanId);

  try {
    return await runTransaction(db, async (tx) => {
      const snap = await tx.get(roomRef);
      if (!snap.exists()) return { success: false, error: 'Sala no encontrada' };

      const data = snap.data() as GameRoom;
      
      // Validar si otro jugador de la sala ya tiene ese personaje
      const isTaken = data.players.some((p) => p.id !== playerId && p.characterId === characterId);
      if (isTaken) {
        const occupant = data.players.find((p) => p.id !== playerId && p.characterId === characterId);
        return { 
          success: false, 
          error: `Ese personaje ya fue elegido por ${occupant?.name || 'otro jugador'} en esta sala.` 
        };
      }

      const updatedPlayers = data.players.map((p) => {
        if (p.id === playerId) {
          return {
            ...p,
            characterId,
            lastActive: Date.now()
          };
        }
        return p;
      });

      tx.update(roomRef, {
        players: updatedPlayers
      });

      return { success: true };
    });
  } catch (err: any) {
    console.error('Error al cambiar de personaje:', err);
    return { success: false, error: err.message || 'Error al cambiar personaje' };
  }
};

export const subscribeToRoom = (
  roomId: string,
  onUpdate: (room: GameRoom | null) => void,
  onError?: (err: Error) => void
): Unsubscribe => {
  const roomRef = doc(db, 'rooms', roomId.toUpperCase());
  return onSnapshot(
    roomRef,
    (snap) => {
      if (snap.exists()) {
        const room = snap.data() as GameRoom;
        const isExpired = 
          (room.expiresAt && Date.now() > room.expiresAt) ||
          (room.createdAt && Date.now() - room.createdAt > 24 * 60 * 60 * 1000);

        if (isExpired) {
          onUpdate(null);
        } else {
          onUpdate(room);
        }
      } else {
        onUpdate(null);
      }
    },
    (err) => {
      console.error('Error in room subscription:', err);
      if (onError) onError(err);
    }
  );
};

export const startRoomGame = async (roomId: string): Promise<void> => {
  const cleanId = roomId.trim().toUpperCase();
  if (!cleanId) return;
  const roomRef = doc(db, 'rooms', cleanId);
  await updateDoc(roomRef, {
    status: 'playing',
    currentRound: 1
  });
};

export const finishRoomGame = async (roomId: string): Promise<void> => {
  const cleanId = roomId.trim().toUpperCase();
  if (!cleanId) return;
  const roomRef = doc(db, 'rooms', cleanId);
  await updateDoc(roomRef, { status: 'finished' });
};

// El jugador abandona la sala: se elimina de la lista sin pisar cambios concurrentes.
// Si el anfitrión sale, transfiere el rol al primer jugador restante.
// Si la sala queda vacía, se elimina para no acumular salas fantasma.
export const leaveGameRoom = async (roomId: string, playerId: string): Promise<void> => {
  const cleanId = roomId.trim().toUpperCase();
  if (!cleanId || !playerId) return;
  const roomRef = doc(db, 'rooms', cleanId);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(roomRef);
    if (!snap.exists()) return;

    const data = snap.data() as GameRoom;
    const remaining = data.players.filter((p) => p.id !== playerId);

    if (remaining.length === 0) {
      tx.delete(roomRef);
      return;
    }

    const patch: Partial<GameRoom> = { players: remaining };

    if (data.hostId === playerId) {
      const newHost: Player = { 
        ...remaining[0], 
        isHost: true,
        role: 'mayordomo',
        customTitle: 'Mayordomo Sucesor'
      };
      patch.players = remaining.map((p, idx) => (idx === 0 ? newHost : p));
      patch.hostId = newHost.id;
      patch.hostName = newHost.name;
    }

    tx.update(roomRef, patch);
  });
};

// Asignar rol o título honorífico al jugador mediante transacción atómica
export const assignPlayerRole = async (
  roomId: string,
  targetPlayerId: string,
  customTitle: string,
  newRole?: PlayerRole
): Promise<void> => {
  const cleanId = roomId.trim().toUpperCase();
  if (!cleanId || !targetPlayerId) return;
  const roomRef = doc(db, 'rooms', cleanId);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(roomRef);
    if (!snap.exists()) return;

    const data = snap.data() as GameRoom;
    const updatedPlayers = data.players.map((p) => {
      if (p.id === targetPlayerId) {
        return {
          ...p,
          role: newRole || p.role || 'invitado',
          customTitle: customTitle.trim(),
          lastActive: Date.now()
        };
      }
      return p;
    });

    tx.update(roomRef, {
      players: updatedPlayers
    });
  });
};

export const setRoomActiveLegend = async (
  roomId: string,
  legendId: string,
  module: GameModule
): Promise<void> => {
  const cleanId = roomId.trim().toUpperCase();
  if (!cleanId) return;
  const roomRef = doc(db, 'rooms', cleanId);
  await updateDoc(roomRef, {
    activeLegendId: legendId,
    activeModule: module
  });
};

// Actualizar puntuación mediante transacción atómica (evita pérdida de puntos entre jugadores simultáneos)
export const updatePlayerScore = async (
  roomId: string,
  playerId: string,
  pointsToAdd: number
): Promise<void> => {
  const cleanId = roomId.trim().toUpperCase();
  if (!cleanId || !playerId) return;
  const roomRef = doc(db, 'rooms', cleanId);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(roomRef);
    if (!snap.exists()) return;

    const data = snap.data() as GameRoom;
    const updatedPlayers = data.players.map((p) => {
      if (p.id === playerId) {
        return { 
          ...p, 
          points: (p.points || 0) + pointsToAdd,
          lastActive: Date.now()
        };
      }
      return p;
    });

    tx.update(roomRef, {
      players: updatedPlayers
    });
  });
};
