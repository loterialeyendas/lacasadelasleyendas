export type GameModule = 'trivia' | 'character' | 'social' | 'mime' | 'apparition';

export interface TriviaQuestion {
  question: string;
  options: string[];
  answer: number; // Índice de la respuesta correcta (0-3)
  explanation: string; // Explicación educativa/histórica
  timeLimit?: number; // Segundos (default 20)
}

export interface CharacterRiddle {
  hints: string[]; // Lista de pistas progresivas (mínimo 3)
  options: string[]; // Opciones de adivinanza
  correctAnswer: string;
  revealedInfo: string; // Información cultural al resolver
}

export interface ActionChallenge {
  title: string;
  instructions: string;
  roleDescription: string;
  timeLimit?: number; // Segundos para completar
  points: number;
}

export interface Legend {
  id: string;
  code: string; // Código corto para QR/manual (ej: "LLOR", "SOMB", "CADE")
  name: string;
  title: string; // Ej: "El Espanto de los Ríos"
  category: GameModule;
  shortDescription: string;
  fullStory: string;
  culturalOrigin: string; // Región o época histórica (ej: "Santiago de Guatemala, siglo XVII")
  didYouKnow: string; // Dato curioso cultural
  difficulty: 'fácil' | 'medio' | 'difícil';
  icon: string; // Nombre del icono para la UI
  trivia?: TriviaQuestion;
  riddle?: CharacterRiddle;
  challenge?: ActionChallenge;
  pointsReward: number;
}

export interface Stamp {
  legendId: string;
  legendName: string;
  unlockedAt: number; // Timestamp
  pointsEarned: number;
  mode: 'explorer' | 'room';
}
