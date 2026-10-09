---
name: motion-animations
description: Guía y patrones de animación fluida y de alto rendimiento con Motion (Framer Motion) y Tailwind CSS para La Casa de las Leyendas.
---

# Guía de Animación de Alto Rendimiento: Motion & Micro-interacciones

Este skill proporciona la guía técnica y los patrones recomendados para implementar movimiento visual, fluidez y micro-interacciones cinematográficas en la aplicación **La Casa de las Leyendas** sin degradar el rendimiento móvil.

---

## 1. Stack de Animación del Proyecto

El proyecto ya cuenta con las herramientas más modernas del ecosistema:

* **Librería Principal:** `motion` (`motion/react`, v12+ - Framer Motion moderna).
* **Entorno:** React 19 + TypeScript + Vite + Tailwind CSS v4.
* **Aceleración:** GPU-accelerated CSS transforms (`transform`, `opacity`, `scale`, `rotate`).

---

## 2. Los 4 Principios de Rendimiento Móvil

Para que una animación deslumbre al usuario sin consumir batería ni causar tirones de frames (jank):

1. **Animar solo propiedades compuestas por GPU:**
   - ✅ `transform` (`x`, `y`, `scale`, `rotate`)
   - ✅ `opacity`
   - ❌ Evitar animar `height`, `width`, `top`, `left`, `margin` o `padding` de forma continua (provocan *layout recalculations*).

2. **Scroll Reveals con `once: true`:**
   Al usar `whileInView`, siempre configura `viewport={{ once: true, margin: '-40px' }}` para que el navegador solo anime la entrada una vez y libere los recursos al continuar navegando.

3. **`AnimatePresence mode="wait"`:**
   Para transiciones de cambio de pantalla o modales, utiliza siempre `<AnimatePresence mode="wait">` para garantizar que el elemento saliente termine de desmontarse antes de montar el nuevo.

4. **Respetar preferencias del sistema (`prefers-reduced-motion`):**
   Garantiza que usuarios con sensibilidad al movimiento reciban transiciones suaves basadas solo en opacidad.

---

## 3. Catálogo de Patrones del Proyecto

### A. Elementos Celestiales Flotantes (Nubes, Sol, Talismanes)
Animación continua con interpolación suave (`easeInOut`):

```tsx
<motion.img
  src={solPng}
  alt="Sol Ancestral"
  animate={{ rotate: 360 }}
  transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
  className="w-36 h-36 object-contain drop-shadow-[0_0_30px_rgba(252,207,101,0.5)] select-none"
/>
```

### B. Scroll Reveal Escalonado (Stagger de Tarjetas)
Aparece fluidamente conforme el usuario baja por la página:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
  className="mystical-card p-6"
>
  {/* Contenido */}
</motion.div>
```

### C. Botón Ceremonial con Micro-interacción Táctil
Respuesta inmediata al tacto y cursor:

```tsx
<motion.button
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.96 }}
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
  className="px-6 py-3 bg-gradient-to-r from-gold via-cream to-gold text-obsidian font-display font-bold rounded-xl shadow-lg"
>
  ENTRAR AL JUEGO
</motion.button>
```

### D. Giro de Llave y Apertura de Candados (Reveal Expandible)
Apertura ceremonial con rotación de llave y contenido expandible:

```tsx
<motion.div
  animate={{ rotate: isTurned ? 90 : 0 }}
  transition={{ duration: 0.4, type: 'spring' }}
>
  <MysticKey />
</motion.div>

<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      {/* Información oculta */}
    </motion.div>
  )}
</AnimatePresence>
```

---

## 4. Cómo expandir o agregar nuevas librerías

Si en el futuro se desean efectos más complejos:

* **Partículas Místicas o Chispas:** `@tsparticles/react` o canvas 2D nativo (como el generador de estrellas y polvo de oro).
* **Modelos 3D Interactivos del Tablero:** `@react-three/fiber` + `@react-three/drei` (WebGL para girar la caja en 3D).
* **Confeti de Victoria:** `canvas-confetti` (para el momento en que se completan las 4 llaves sagradas).
