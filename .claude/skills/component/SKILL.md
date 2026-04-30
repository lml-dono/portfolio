---
name: component
description: Create a new Astro component following project conventions. Use when the user asks to create a new component, UI element, or reusable piece.
argument-hint: [ComponentName]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(npm run build)
---

# Create New Component

Create a new component named `$0`.

## Steps

1. **Check if it already exists**: Search `src/components/` for similar components
2. **Read a reference component** of similar complexity to match patterns
3. **Create the component** in `src/components/$0/`:

### File Structure
```
src/components/$0/
├── index.ts               # export { default as $0 } from "./$0.astro";
├── $0.astro               # Component file
└── $0CamelCase.module.scss # SCSS module (camelCase filename)
```

### Astro Component Rules
- `interface Props` with explicit types
- Default values for optional props in destructuring
- `class:list` for dynamic classes (not template literals)
- All visible text gets `data-t` attributes for i18n
- Semantic HTML (`section`, `nav`, `article`, `aside`, etc.)
- `data-*` attributes for JS targeting (not class selectors)

### SCSS Rules
- Import builders: `@use '@/styles/_builders'`
- BEM naming: `.Component__element--modifier`
- **Design tokens mandatory** — run `/design-tokens` if unsure:
  - Colors: `$text-primary-default`, `$bg-surface-default`, etc.
  - Spacing: `use-space("s0".."s10")`
  - Typography: `@include text-body-md`, `@include text-label-sm`, etc.
  - Z-index: `use-layer("modal"|"chat"|"navbar"|...)`
  - Radius: `@include radius($radius-m)`
  - Breakpoints: `@include for-screens-above("s"|"m"|"l"|"xl"|"2xl")`
- Use `rem`/`em` for sizes, `px` only for borders/shadows
- Max 3 levels nesting
- Mobile-first with `@include for-screens-above("m")`
- Never `!important`, IDs, or magic values

### If it needs client JS
- Use inline `<script>` tag (not separate .ts file for component logic)
- Init on `astro:page-load`, cleanup on `astro:before-swap`
- If React island: use `client:visible` or `client:idle` (never `client:load`)

### If it's a Spline 3D component
- Lazy-load with `IntersectionObserver` or `client:visible`
- Always provide `<noscript>` fallback with static image
- Canvas needs `aria-label` for accessibility
- Check `prefers-reduced-motion` — disable/simplify 3D if active
- Max 2 Spline scenes visible simultaneously
- Clean up `Application` instance on unmount

### If it's a Sidebar/Modal
- Reference: `ContactSidebar.astro`
- Wrapper: `position: fixed`, `z-index: use-layer("modal")`
- Panel: `role="dialog"`, `aria-label`, `aria-hidden="true"` when closed
- Backdrop: semi-transparent, close on click
- Lenis: `getLenis()?.stop()` on open, `getLenis()?.start()` on close
- Open/Close: via centralized event bus (`src/scripts/events.ts`)
- Focus: trap focus on open, restore on close
- Form: `form.reset()` + clear errors on reopen after submit

### If it has a form
- Reference: `ContactSidebar.astro`, `formValidation.ts`, `contact-api.ts`
- Double sanitization: `DOMPurify.sanitize()` + `sanitizeField()`
- Validation: pure functions in `src/scripts/utils/formValidation.ts`
- Error spans: `<span data-error-for="fieldName" aria-live="polite">`
- Error class: `.has-error` on input, `.is-visible` on error span
- Real-time clearing: `input` event clears field error
- API: AbortController + 10s timeout, return `{ success, error? }`
- i18n errors: `component.error.{field}.{type}` pattern
- Never `innerHTML` for error messages — always `textContent`

4. **Add i18n keys** if component has visible text (both `en.ts` and `es.ts`)
5. **Build** to verify: `npm run build`
