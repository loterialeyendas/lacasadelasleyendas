# Estándar Oficial de Diseño: La Casa de las Leyendas

Este documento establece el **Estándar Visual Obligatorio** para todas las pantallas, módulos interactivos, menús y componentes de la plataforma web y PWA de **La Casa de las Leyendas**.

---

## 1. Filosofía Visual: El Juego Híbrido en Mesa Ceremonial

La estética representa la unión entre el mundo físico y el digital:
- **El Lienzo General:** Es la noche mística y el paño ceremonial maya/colonial. Siempre debe ser **Negro Obsidiana profundo (`#0b0907` / `#000000`)**, adornado con resplandores áureos, polvo de estrellas y los símbolos celestiales (Sol ancestral y nubes).
- **Las Fichas, Cuadros y Contenedores:** Representan el **cartón físico impreso del juego de mesa y los pergaminos sagrados**. Su fondo siempre debe ser el **Beige Ancestral (`#fbf7ee` o `#faf4e6`)**, con bordes dorados dobles de 2px, esquinas redondeadas y sombras físicas con relieve táctil.
- **La Tipografía Interior:** Al estar sobre un fondo beige claro, **nunca se deben usar textos blancos ni crema desvaídos**. Toda la tipografía interna debe tener **alto contraste con tonos oscuros** (ébano, tierra colonial, marrón cacao, verde jade profundo y rojo maya oscuro).

---

## 2. Paleta de Colores Oficial

### Fondos
| Elemento | Token / Hex | Propósito |
| :--- | :--- | :--- |
| **Fondo Base Global** | `#0b0907` (`bg-obsidian`) | Fondo nocturno general de toda la aplicación |
| **Fichas y Contenedores** | `#fbf7ee` / `#faf4e6` | Cartón físico de las cartas, fichas, podios y módulos |
| **Cajas y Bloques Internos** | `#ede1c7` / `#f0e4cd` | Cajas de preguntas, datos curiosos, citas o detalles |
| **Resplandores / Halos** | `rgba(203, 161, 67, 0.25)` | Brillo ceremonial de fondo |

### Bordes y Metales Sagrados
| Elemento | Token / Hex | Propósito |
| :--- | :--- | :--- |
| **Oro Ceremonial** | `#cba143` (`border-gold`) | Borde perimetral principal de 2px de toda ficha |
| **Oro Brillante** | `#f5d78e` (`border-gold-light`) | Realces, estados activos y hover |
| **Líneas Divisorias Internas** | `rgba(203, 161, 67, 0.4)` | Separadores sutiles dentro de tarjetas beige |

### Tipografía y Contraste sobre Fichas Beige
| Jerarquía | Clase / Hex | Descripción |
| :--- | :--- | :--- |
| **Títulos Principales** | `text-[#1f1309]` (Cinzel font-bold) | Ébano cálido, máxima jerarquía y nitidez |
| **Subtítulos y Epítetos** | `text-amber-900` / `text-[#4a3421]` (Crimson Pro italic) | Marrón tierra y café colonial distinguido |
| **Cuerpo y Párrafos** | `text-[#3a2717]` (Inter / Crimson Pro) | Texto oscuro sumamente descansado para la lectura |
| **Badges e Insignias** | `bg-amber-200/80 text-amber-950 border border-amber-600/40` | Cápsulas de estado y dificultad |
| **Detalles y Leyendas** | `text-[#241508]` | Respuestas ancestrales y datos históricos |

---

## 3. Especificaciones de Componentes

### Tarjetas y Fichas de Juego (`Game Card`)
```tsx
className="p-5 sm:p-6 rounded-2xl bg-[#fbf7ee] border-2 border-gold/70 shadow-[0_12px_35px_rgba(0,0,0,0.6)] text-[#1f1309] hover:border-gold transition-all"
```

### Cajas Secundarias Interiores (Preguntas, Citas, Retos)
```tsx
className="p-3.5 bg-[#ede1c7] rounded-xl border border-[#d6be96] text-[#241508] font-serif italic shadow-inner"
```

### Botones Principales sobre Fichas Beige
```tsx
className="px-6 py-3 bg-earth-brown hover:bg-gold text-cream hover:text-obsidian font-display font-bold rounded-xl border border-gold shadow-md transition-all active:scale-95 cursor-pointer"
```

### Menús y Paneles Desplegables
- El **contenedor maestro** puede deslizarse sobre el fondo negro con backdrop desenfocado (`bg-black/80 backdrop-blur-sm`).
- Todos los **botones, módulos y opciones internas** deben presentarse como fichas en beige `#fbf7ee` con bordes dorados, iconos destacados y textos en ébano `#1f1309`.

---

## 4. Regla de Oro de Desarrollo

> **Cualquier nueva vista, módulo interactivo (Trivia, Mímica, Adivinanza, Historia) o menú que se agregue al proyecto debe seguir estrictamente este estándar: Fondo negro general de fondo + fichas y contenedores en beige del juego con textos oscuros legibles.**
