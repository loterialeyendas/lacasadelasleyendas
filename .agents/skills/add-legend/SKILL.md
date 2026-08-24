---
name: add-legend
description: Guía paso a paso para añadir una nueva leyenda, trivia, acertijo o reto físico a la base de datos de la Casa de las Leyendas.
---

# Guía para Añadir Nuevas Leyendas y Dinámicas

Sigue este procedimiento para incorporar una nueva leyenda guatemalteca al catálogo de la aplicación:

## 1. Localizar el Archivo de Datos

Abre `src/services/legendService.ts`.

## 2. Definir la Estructura de la Leyenda

Añade un nuevo objeto al arreglo `LEYENDAS_DATA` con el formato:

```typescript
{
  id: 'identificador_unico',      // Ej: 'duende_mina'
  code: 'DUEN',                   // Código alfanumérico único de 4 letras para QR y manual
  name: 'El Duende de la Mina',   // Nombre oficial
  title: 'El Custodio del Oro',   // Título místico
  category: 'character',          // 'trivia' | 'character' | 'mime' | 'social' | 'apparition'
  shortDescription: 'Descripción breve de una o dos oraciones para la tarjeta.',
  fullStory: 'Relato narrativo completo de la leyenda.',
  culturalOrigin: 'Región de origen y época histórica.',
  didYouKnow: 'Dato curioso educativo.',
  difficulty: 'fácil' | 'medio' | 'difícil',
  icon: 'Shield',
  pointsReward: 300,
  // Según la categoría elegida, agrega su dinámica:
  trivia: {
    question: 'Pregunta sobre la leyenda',
    options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
    answer: 1, // Índice de la respuesta correcta (0-3)
    explanation: 'Explicación cultural al responder.',
    timeLimit: 20
  },
  riddle: {
    hints: ['Pista 1...', 'Pista 2...', 'Pista 3...'],
    options: ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4'],
    correctAnswer: 'El Duende de la Mina',
    revealedInfo: 'Dato revelado al adivinar.'
  },
  challenge: {
    title: 'Nombre del Reto',
    instructions: 'Instrucciones para el participante.',
    roleDescription: 'Rol del jugador y de los observadores.',
    timeLimit: 45,
    points: 300
  }
}
```

## 3. Generación del Código QR Físico

El código QR en la estación física debe contener simplemente:
- El código corto (ej: `DUEN`) o
- La URL completa: `https://tudominio.com/?legend=duen`

## 4. Validar Compilación

Ejecuta:
```bash
npm run lint
```
para asegurar que la nueva entrada cumpla con todos los tipos de `Legend`.
