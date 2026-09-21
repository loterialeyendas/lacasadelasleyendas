import { GameModule, Legend } from './legend';

export type KeyType = 'gold' | 'jade' | 'silver' | 'obsidian';

export interface PlayerKeys {
  gold: boolean;      // Llave de Oro (Trivia de Sabiduría)
  jade: boolean;      // Llave de Jade (Adivina el Personaje)
  silver: boolean;    // Llave de Plata (Mímica y Expresión)
  obsidian: boolean;  // Llave de Obsidiana (Retos en Redes Sociales)
}

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  keys?: PlayerKeys;
  totalKeys?: number;
  isWinner?: boolean;
  isReady?: boolean;
  isHost?: boolean;
  lastActive?: number;
}

export type RoomStatus = 'waiting' | 'playing' | 'round_end' | 'finished';

export interface GameRoom {
  id: string;
  hostId: string;
  hostName: string;
  createdAt: number;
  status: RoomStatus;
  currentRound: number;
  maxRounds: number;
  players: Player[];
  activeLegendId?: string;
  activeModule?: GameModule;
  roundExpiresAt?: number;
  winnerPlayerId?: string;
}

