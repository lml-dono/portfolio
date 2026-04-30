# CLAUDE.md — Portfolio Personal

## Stack

- **Framework:** Astro (SSG) — **Estilos:** SCSS Modules — **Componentes:** React (interactividad real únicamente)
- **Animaciones:** GSAP (ScrollTrigger, Timeline — NO SplitText) — **Scroll:** Lenis
- **Transiciones:** Astro View Transitions API nativo — **Tipografía:** Geist + Geist Mono (@fontsource)
- **Deploy:** Vercel — **Entorno:** VS Code + Claude Code

---

## 1. Estructura del Proyecto

```
src/
├── components/
│   ├── ui/            # Button
│   ├── layout/        # Navigation
│   └── sections/      # Hero, Work, About, Contact
├── layouts/           # Layout base
├── pages/             # Rutas (sin <style>, solo componen layouts + componentes)
├── scripts/
│   ├── utils/         # Helpers reutilizables
│   ├── lenis.client.ts    # Instancia única de Lenis
│   └── gsap.client.ts     # Bridge Lenis ↔ ScrollTrigger
├── styles/
│   └── builders/      # _variables, _functions, _mixins, _typo, _mediaqueries
├── data/              # JSON, constantes estáticas
└── types/             # Tipos TypeScript compartidos
```

---

## 2. Reglas Críticas (Bugs de producción)

### NUNCA

1. `scroller: document.body` en ScrollTrigger — Lenis sincroniza globalmente
2. SplitType / split-type — causa conflictos con ScrollTrigger pin
3. `requestAnimationFrame` loop propio para Lenis — solo `gsap.ticker`
4. `start: "center center"` para secciones pinneadas — siempre `"top top"`
5. `scrollTrigger.kill()` manual — siempre `gsap.context()` + `ctx.revert()`
6. `innerHTML` con datos de usuario — siempre `textContent`
7. Hardcodear colores, spacing, font-size, z-index, radius — siempre tokens
8. `markers: true` en producción — envolver en `import.meta.env.DEV`
9. Instalar dependencias sin explicar y confirmar
10. Modificar `astro.config.mjs` o `tsconfig.json` sin explicar

### SIEMPRE

1. `gsap.context()` para encapsular animaciones + cleanup con `ctx.revert()`
2. Init en `astro:page-load`, cleanup en `astro:before-swap`
3. Comprobar `prefers-reduced-motion` — return early si activo
4. Hold tween al final de timelines pinneadas: `tl.to({}, { duration: 0.2 })`
5. TypeScript estricto con tipos explícitos, nunca `any`
6. `@include content-grid` en secciones, `@include content-span` en wrappers
7. `use-layer()` para z-index, nunca valores mágicos
8. Pausar Lenis al abrir modales: `getLenis()?.stop()` / `getLenis()?.start()`

---

## 3. Design Tokens — Quick Reference

Todos en `src/styles/builders/`. Importar: `@use '@/styles/_builders'`.

**Usar `/design-tokens` para catálogo completo.** Aquí solo el quick-ref:

```scss
// Funciones helper (OBLIGATORIO usar en vez de valores directos)
use-space("s3")          // → 1rem — s0:4px s1:8px s2:12px s3:16px ... s10:64px
use-color("base-amber")  // → #f59e0b
use-layer("navbar")      // → z-index value

// Tipografía — Geist para display/body, Geist Mono para labels
@include text-display-lg      // títulos hero, peso heavy
@include text-heading-lg      // headings de sección
@include text-title-md        // subtítulos
@include text-body-md         // cuerpo de texto
@include text-label-md        // Geist Mono, uppercase, letter-spacing generoso
@include text-label-sm        // Geist Mono, metadata, opacidad reducida

// Breakpoints (mobile-first)
@include for-screens-above("s"|"m"|"l"|"xl"|"2xl") // s:768 m:1024 l:1200 xl:1440 2xl:1920

// Radius (bordes redondeados consistentes en tarjetas, botones, imágenes)
@include radius($radius-s|$radius-m|$radius-l|$radius-xl) // 12px|16px|20px|24px

// Z-index layers
use-layer("navbar":2|"base":0|"back":-1)

// Layout
@include content-grid   // columnas responsive
@include content-span   // columna central
```

### Paleta de colores

```scss
// Fondo
$bg-page-default: #0a0a0a       // negro profundo, nunca puro
$bg-surface-default: #111111
$bg-surface-elevated: #161616

// Bordes
$border-default: #1f1f1f

// Texto
$text-primary-default: #ededed
$text-secondary-default: #a0a0a0
$text-tertiary-default: #525252

// Acento — usar con máxima restricción
// Solo señales funcionales: estado activo en nav, cursor de boot
// NUNCA decorativo
$base-amber: #f59e0b
$base-amber-dim: #92400e
```

---

## 4. SCSS — Reglas

- **BEM** naming: `.Block__element--modifier`
- **`@use` y `@forward`** — nunca `@import`
- **`rem`/`em`** para tamaños — solo `px` para borders
- **Max 3 niveles** de anidamiento
- **Mobile-first**: estilos base → `@include for-screens-above("m")`
- **Nunca** `!important`, IDs para estilar, ni valores mágicos
- **`@use 'sass:map'`** — nunca `map-get()` global, usar `map.get()`

---

## 5. Naming

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Componentes | PascalCase dir + .astro | `Hero/Hero.astro` |
| SCSS modules | camelCase | `hero.module.scss` |
| Scripts | camelCase | `scrollUtils.ts` |
| SCSS partials | kebab-case + `_` | `_variables.scss` |
| Variables/funciones | camelCase | `getScrollProgress()` |
| Tipos/Interfaces | PascalCase | `ProjectEntry` |
| CSS clases | BEM kebab-case | `hero__title--highlighted` |

---

## 6. Estética y criterios de diseño

El portfolio sigue un sistema de **minimalismo técnico con energía contenida**:

- **Tensión intencional**: tipografía dura (Geist heavy en títulos) + bordes redondeados (`border-radius: 8px`) — contradicción que define la personalidad
- **Grain de fondo**: persistente y sutil, como textura del sistema
- **Glitch**: ocasional y controlado — un momento puntual al cargar, nunca decorativo en bucle
- **Acento ámbar**: una sola cosa activa a la vez (el cursor del boot, el link activo en nav)
- **Labels en Geist Mono**: uppercase, letter-spacing generoso, opacidad reducida — metadata del sistema, no navegación convencional
- **Espaciado generoso**: el aire es parte del diseño

---

## 7. Animaciones — Patrones

- **Boot sequence del hero**: animación de entrada única al cargar — no se repite
- **ScrollTrigger**: siempre con `gsap.context()`, init en `astro:page-load`
- **Lenis**: instancia única via `getLenis()`, nunca instanciar directamente
- **View Transitions**: usar Astro nativo, no Barba.js

```astro
// En Layout base — habilitar View Transitions
import { ViewTransitions } from 'astro:transitions';
<ViewTransitions />
```

---

## 8. Git

- **Conventional Commits**: `feat:`, `fix:`, `refactor:`, `style:`, `perf:`, `docs:`, `chore:`
- **Scope**: `feat(hero): add boot sequence animation`
- **No commitear**: `node_modules/`, `.env`, `dist/`

---

## 9. Skills (Slash Commands)

| Comando | Cuándo usar |
|---------|------------|
| `/component ComponentName` | Crear nuevo componente Astro con estructura completa |
| `/design-tokens` | Consultar catálogo completo de tokens antes de escribir SCSS |

---

## 10. Workflow para Claude Code

1. **Antes de crear** un componente → verificar si existe en `src/components/`
2. **Antes de escribir SCSS** → consultar sección 3 o `/design-tokens`
3. **Antes de animar** → respetar reglas de la sección 2 y 7
4. **JS de cliente** → `<script>` inline en `.astro`; extraer a `src/scripts/` solo lógica reutilizable
5. **Tras modificar animaciones** → `npm run build`
6. **Usar skills** cuando la tarea encaje con su propósito
