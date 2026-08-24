import { GameModule, Legend } from './legend';

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  points: number;
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
}
