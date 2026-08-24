
export const COLORS = {
  cream: '#ffeeaa',
  gold: '#be8d2c',
  mayaRed: '#c83737',
  earthBrown: '#7a3108',
  obsidian: '#000000',
};

export type GameModule = 'trivia' | 'character' | 'social' | 'mime' | 'apparition';

export interface Legend {
  id: string;
  name: string;
  description: string;
  category: GameModule;
  hints?: string[];
  trivia?: {
    question: string;
    options: string[];
    answer: number;
  };
}

export const LEYENDAS: Legend[] = [
  {
    id: 'llorona',
    name: 'La Llorona',
    description: 'El alma en pena de una mujer que busca a sus hijos cerca de fuentes de agua.',
    category: 'apparition',
  },
  {
    id: 'sombreron',
    name: 'El Sombrerón',
    description: 'Un hombre pequeño con un sombrero enorme que toca la mandolina para enamorar a las jóvenes.',
    category: 'character',
    hints: ['Usa un sombrero muy grande', 'Le gusta trenzar el pelo de los caballos', 'Toca música de noche'],
  },
  {
    id: 'siguanaba',
    name: 'La Siguanaba',
    description: 'Una mujer hermosa que atrae a los hombres a barrancos, revelando su rostro de caballo.',
    category: 'apparition',
  },
  {
    id: 'cadejo',
    name: 'El Cadejo',
    description: 'Perros fantasmales, uno blanco que protege y uno negro que acecha.',
    category: 'trivia',
    trivia: {
      question: '¿De qué color es el Cadejo que protege a los caminantes?',
      options: ['Negro', 'Blanco', 'Gris', 'Café'],
      answer: 1,
    },
  },
  {
    id: 'tatuana',
    name: 'La Tatuana',
    description: 'Una mujer acusada de brujería que escapó de su celda en un barco dibujado con carbón.',
    category: 'social',
  },
    {
    id: 'carreton',
    name: 'El Carretón de la Muerte',
    description: 'Se escucha el sonido de madera y cadenas en las calles vacías de la noche.',
    category: 'mime',
  }
];
