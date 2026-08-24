# Directrices de Proyecto: Casa de las Leyendas (Producción)

Este documento define la arquitectura, normas de calidad, diseño y protocolos de producción para la aplicación web **La Casa de las Leyendas**. Todo agente o desarrollador debe respetar estas pautas para mantener la solidez y coherencia del sistema.

---

## 1. Repositorio y Entornos

* **GitHub:** `https://github.com/loterialeyendas/lacasadelasleyendas` (Rama: `main`)
* **Dominio Oficial:** [https://lacasadelasleyendas.com](https://lacasadelasleyendas.com)
* **Firebase Hosting:** [https://casa-de-las-leyendas-gt.web.app](https://casa-de-las-leyendas-gt.web.app)
* **Proyecto Firebase:** `casa-de-las-leyendas-gt`

---

## 2. Arquitectura y Organización del Código

El proyecto sigue una arquitectura modular en capas:

* `src/types/`: Definiciones estrictas de TypeScript (`legend.ts`, `game.ts`). Todo modelo de datos debe estar tipado sin uso de `any`.
* `src/services/`: Capa de datos y lógica de negocio desacoplada de la interfaz gráfica:
  * `legendService.ts`: Catálogo de leyendas, trivias, acertijos y resolución de códigos QR.
  * `passportService.ts`: Persistencia de sellos, progreso y puntuación (enfoque Offline-First con sincronización en Firestore).
  * `roomService.ts`: Lógica de salas multijugador en tiempo real.
* `src/views/`: Pantallas principales de la aplicación (`LandingPageView`, `WelcomeView`, `ExplorerView`, `ScannerView`, `LobbyView`, `GameRoomView`).
* `src/views/modules/`: Dinámicas educativas interactivas (`TriviaModule`, `CharacterGuessModule`, `MimeChallengeModule`, `StoryApparitionModule`).
* `src/components/`: Componentes atómicos y reutilizables (`Theme.tsx`, `Navbar.tsx`, `Scanner.tsx`, `SoundToggle.tsx`).
* `src/components/svgs/`: Componentes vectoriales SVG nativos optimizados (`MysticLock`, `MysticKey`, `MysticSun`, `PassportStampSvg`).
* `src/lib/`: Configuración externa y utilitarios (`firebase.ts`, `audio.ts`, `utils.ts`).

---

## 3. Sistema de Diseño e Identidad Visual (Mística Guatemalteca)

* **Paleta de Colores Obligatoria**:
  * **Obsidian**: `#000000` (Fondo y contraste principal).
  * **Gold**: `#be8d2c` (Bordes místicos, títulos, puntos y acentos principales).
  * **Cream**: `#ffeeaa` (Texto legible, pergamino y detalles finos).
  * **Maya Red**: `#c83737` (Alertas, espectros de sangre y acentos dramáticos).
  * **Earth Brown**: `#7a3108` (Cajas de texto narrativo, botones primarios y sombras).
* **Tipografías**:
  * Títulos y encabezados: `font-display` (`Cinzel`, serif).
  * Narrativa, relatos y citas: `font-serif` (`Crimson Pro`, serif italic).
  * Interfaz y botones: `font-sans` (`Inter`).
* **Enfoque Mobile-First**:
  * La aplicación está diseñada para ser utilizada principalmente en smartphones mientras el visitante recorre el museo o juega en mesa.

---

## 4. Dinámicas y Manejo de Códigos QR

* **Compatibilidad de Códigos**:
  * Formato URL completa: `https://lacasadelasleyendas.com/?legend=sombreron`
  * Formato ID directo: `sombreron`, `cadejo`, etc.
  * Formato Código Corto de 4 letras: `SOMB`, `CADE`, `LLOR`, `SIGU`, `TATU`, `CARR`, `CIPI`.
* **Fallback Manual Obligatorio**:
  * Toda pantalla de escaneo debe incluir la opción de ingresar el código alfanumérico manualmente por teclado en caso de baja iluminación ambiental o cámaras sin soporte.
* **Ciclo de Vida de la Cámara**:
  * Todo lector QR debe liberar y detener el flujo de video (`stream.stop()`) al salir de la pantalla para evitar sobrecalentamiento y consumo de batería.

---

## 5. Control de Calidad y Flujo de Despliegue

Antes de dar por completado cualquier cambio:
1. Validar tipos de TypeScript: `npm run lint`.
2. Construir y desplegar a Firebase Hosting: `npm run build && npx firebase deploy --project casa-de-las-leyendas-gt`.
3. Hacer push al repositorio GitHub: `git add . && git commit -m "..." && git push origin main`.
