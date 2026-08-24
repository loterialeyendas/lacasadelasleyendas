# Guía de Proyecto: Casa de las Leyendas

Este repositorio contiene la aplicación web y PWA para **La Casa de las Leyendas**, una experiencia interactiva y educativa sobre las leyendas de Guatemala.

## Reglas Principales de Desarrollo

1. **Stack Tecnológico:**
   - Framework: React 19 + TypeScript + Vite + Tailwind CSS v4 + Motion.
   - Backend & Base de Datos: Firebase Authentication (anónimo / perfiles) + Cloud Firestore (sincronización de salas en tiempo real y pasaporte).
   - Lector QR: `html5-qrcode` con soporte de URL, ID y códigos cortos (ej. `SOMB`, `LLOR`).
   - Sonido: Sintetizador Web Audio API en `src/lib/audio.ts`.

2. **Estructura Modular:**
   - Modelos y tipos en `src/types/`.
   - Servicios de datos en `src/services/` (`legendService.ts`, `passportService.ts`, `roomService.ts`).
   - Módulos interactivos en `src/views/modules/` (`TriviaModule`, `CharacterGuessModule`, `MimeChallengeModule`, `StoryApparitionModule`).
   - Pantallas en `src/views/` (`WelcomeView`, `ExplorerView`, `ScannerView`, `LobbyView`, `GameRoomView`, `JoinRoomView`).
   - Componentes base en `src/components/` (`Theme.tsx`, `Navbar.tsx`, `Scanner.tsx`, `Login.tsx`).

3. **Normas de Producción:**
   - Todo cambio debe compilar con `npm run lint` y `npm run build` sin errores de tipo.
   - Enfoque Offline-First: El modo explorador guarda progreso en `localStorage` y sincroniza en la nube al detectar conexión.
   - Mantener la estética visual mística guatemalteca (Obsidian, Gold, Cream, Maya Red, Earth Brown).
