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
import { GameRoom, Player } from '../types/game';
import { GameModule } from '../types/legend';

export const createGameRoom = async (hostId: string, hostName: string): Promise<string> => {
  // Código alfanumérico amigable de 6 caracteres
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let roomId = '';
  for (let i = 0; i < 6; i++) {
    roomId += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const roomData: GameRoom = {
    id: roomId,
    hostId,
    hostName: hostName || 'Anfitrión',
    createdAt: Date.now(),
    status: 'waiting',
    currentRound: 1,
    maxRounds: 8,
    players: [
      {
        id: hostId,
        name: hostName || 'Anfitrión',
        points: 0,
        isHost: true,
        isReady: true,
        lastActive: Date.now()
      }
    ]
  };

  await setDoc(doc(db, 'rooms', roomId), roomData);
  return roomId;
};

export const joinGameRoom = async (roomId: string, player: Player): Promise<{ success: boolean; error?: string }> => {
  const cleanId = roomId.trim().toUpperCase();
  const roomRef = doc(db, 'rooms', cleanId);
  const snap = await getDoc(roomRef);

  if (!snap.exists()) {
    return { success: false, error: 'Código de sala no encontrado' };
  }

  const data = snap.data() as GameRoom;
  if (data.status !== 'waiting') {
    return { success: false, error: 'La partida ya comenzó o finalizó' };
  }

  // Evitar duplicados si reconecta
  const alreadyIn = data.players.some((p) => p.id === player.id);
  if (!alreadyIn) {
    await updateDoc(roomRef, {
      players: arrayUnion(player)
    });
  }

  return { success: true };
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
        onUpdate(snap.data() as GameRoom);
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
  const roomRef = doc(db, 'rooms', roomId);
  await updateDoc(roomRef, {
    status: 'playing',
    currentRound: 1
  });
};

export const finishRoomGame = async (roomId: string): Promise<void> => {
  const roomRef = doc(db, 'rooms', roomId);
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
      const newHost = { ...remaining[0], isHost: true };
      patch.players = remaining.map((p, idx) => (idx === 0 ? newHost : p));
      patch.hostId = newHost.id;
      patch.hostName = newHost.name;
    }

    tx.update(roomRef, patch);
  });
};

export const setRoomActiveLegend = async (
  roomId: string,
  legendId: string,
  module: GameModule
): Promise<void> => {
  const roomRef = doc(db, 'rooms', roomId);
  await updateDoc(roomRef, {
    activeLegendId: legendId,
    activeModule: module
  });
};

export const updatePlayerScore = async (
  roomId: string,
  playerId: string,
  pointsToAdd: number
): Promise<void> => {
  const roomRef = doc(db, 'rooms', roomId);
  const snap = await getDoc(roomRef);
  if (snap.exists()) {
    const data = snap.data() as GameRoom;
    const updatedPlayers = data.players.map((p) => {
      if (p.id === playerId) {
        return { ...p, points: (p.points || 0) + pointsToAdd };
      }
      return p;
    });

    await updateDoc(roomRef, {
      players: updatedPlayers
    });
  }
};
