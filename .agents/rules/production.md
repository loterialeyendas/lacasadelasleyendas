# Directrices de Proyecto: Casa de las Leyendas (Producción)

Este documento define la arquitectura, normas de calidad, diseño y protocolos de producción para la aplicación web **La Casa de las Leyendas**. Todo agente o desarrollador debe respetar estas pautas para mantener la solidez y coherencia del sistema.

---

## 1. Arquitectura y Organización del Código

El proyecto sigue una arquitectura modular en capas:

* `src/types/`: Definiciones estrictas de TypeScript (`legend.ts`, `game.ts`). Todo modelo de datos debe estar tipado sin uso de `any`.
* `src/services/`: Capa de datos y lógica de negocio desacoplada de la interfaz gráfica:
  * `legendService.ts`: Catálogo de leyendas, trivias, acertijos y resolución de códigos QR.
  * `passportService.ts`: Persistencia de sellos, progreso y puntuación (enfoque Offline-First con sincronización en Firestore).
  * `roomService.ts`: Lógica de salas multijugador en tiempo real.
* `src/views/`: Pantallas principales de la aplicación (`WelcomeView`, `ExplorerView`, `ScannerView`, `LobbyView`, `GameRoomView`).
* `src/views/modules/`: Dinámicas educativas interactivas (`TriviaModule`, `CharacterGuessModule`, `MimeChallengeModule`, `StoryApparitionModule`).
* `src/components/`: Componentes atómicos y reutilizables (`Theme.tsx`, `Navbar.tsx`, `Scanner.tsx`, `SoundToggle.tsx`).
* `src/lib/`: Configuración externa y utilitarios (`firebase.ts`, `audio.ts`, `utils.ts`).

---

## 2. Sistema de Diseño e Identidad Visual (Mística Guatemalteca)

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
  * Mantener zonas táctiles amplias (mínimo 44px de altura) y textos con contraste accesible.

---

## 3. Dinámicas y Manejo de Códigos QR

* **Compatibilidad de Códigos**:
  * Formato URL completa: `https://.../?legend=sombreron`
  * Formato ID directo: `sombreron`, `cadejo`, etc.
  * Formato Código Corto de 4 letras: `SOMB`, `CADE`, `LLOR`, `SIGU`, `TATU`, `CARR`, `CIPI`.
* **Fallback Manual Obligatorio**:
  * Toda pantalla de escaneo debe incluir la opción de ingresar el código alfanumérico manualmente por teclado en caso de baja iluminación ambiental o cámaras sin soporte.
* **Ciclo de Vida de la Cámara**:
  * Todo lector QR debe liberar y detener el flujo de video (`stream.stop()`) al salir de la pantalla para evitar sobrecalentamiento y consumo de batería.

---

## 4. Audio y Rendimiento Offline

* **Efectos de Audio**:
  * Utilizar `src/lib/audio.ts` (Web Audio API sintetizado) para retroalimentación instantánea sin requerir descargas de archivos `.mp3` pesados.
  * Respetar siempre el estado de silencio (`sound.getIsMuted()`) guardado en `localStorage`.
* **Modo Offline**:
  * El modo explorador y pasaporte debe funcionar sin conexión a internet activa una vez cargada la PWA. Los sellos se guardan en `localStorage` primero y se sincronizan con Firebase cuando haya red.

---

## 5. Control de Calidad y Despliegue a Producción

Antes de dar por completado cualquier cambio o despliegue:
1. Validar tipos de TypeScript: `npm run lint` (debe compilar sin errores).
2. Construir el paquete de producción: `npm run build`.
3. Verificar que las variables de entorno de Firebase en `.env` estén configuradas adecuadamente y que las reglas de `firestore.rules` mantengan la seguridad de las salas y usuarios.
