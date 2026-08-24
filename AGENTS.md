# Guía de Proyecto: Casa de las Leyendas

Este repositorio contiene la aplicación web y PWA para **La Casa de las Leyendas**, una experiencia interactiva y educativa sobre las leyendas de Guatemala.

## Repositorio y Producción

* **GitHub Oficial:** `https://github.com/loterialeyendas/lacasadelasleyendas`
* **Rama Principal:** `main`
* **Dominio Oficial:** [https://lacasadelasleyendas.com](https://lacasadelasleyendas.com)
* **Firebase Hosting:** [https://casa-de-las-leyendas-gt.web.app](https://casa-de-las-leyendas-gt.web.app)
* **Proyecto Firebase:** `casa-de-las-leyendas-gt`

## Reglas Principales de Desarrollo

1. **Stack Tecnológico:**
   - Framework: React 19 + TypeScript + Vite + Tailwind CSS v4 + Motion.
   - Backend & Base de Datos: Firebase Authentication (anónimo / perfiles) + Cloud Firestore (sincronización de salas en tiempo real y pasaporte).
   - Lector QR: `html5-qrcode` con soporte de URL, ID y códigos cortos (`SOMB`, `CADE`, `LLOR`, `SIGU`, `TATU`, `CARR`, `CIPI`).
   - Sonido: Sintetizador Web Audio API en `src/lib/audio.ts`.

2. **Estructura Modular:**
   - Modelos y tipos en `src/types/`.
   - Servicios de datos en `src/services/` (`legendService.ts`, `passportService.ts`, `roomService.ts`).
   - Módulos interactivos en `src/views/modules/` (`TriviaModule`, `CharacterGuessModule`, `MimeChallengeModule`, `StoryApparitionModule`).
   - Pantallas en `src/views/` (`LandingPageView`, `WelcomeView`, `ExplorerView`, `ScannerView`, `LobbyView`, `GameRoomView`, `JoinRoomView`).
   - Componentes base en `src/components/` (`Theme.tsx`, `Navbar.tsx`, `Scanner.tsx`, `Login.tsx`).
   - Biblioteca vectorial SVG en `src/components/svgs/` (`MysticLock.tsx`, `MysticKey.tsx`, `MysticSun.tsx`, `PassportStampSvg.tsx`).

3. **Normas de Producción y Git:**
   - Todo cambio debe compilar con `npm run lint` y `npm run build` sin errores de tipo.
   - Enfoque Offline-First: El modo explorador guarda progreso en `localStorage` y sincroniza en la nube al detectar conexión.
   - Mantener la estética visual mística guatemalteca (Obsidian, Gold, Cream, Maya Red, Earth Brown).
   - Para desplegar a producción: `npm run build && npx firebase deploy --project casa-de-las-leyendas-gt`
   - Para subir cambios a GitHub: `git push origin main`
