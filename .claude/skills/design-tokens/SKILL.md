---
name: design-tokens
description: Look up available design tokens (colors, spacing, typography, z-index, radius, breakpoints) before writing SCSS. Use when creating or editing styles to ensure correct token usage.
allowed-tools: Read, Grep, Glob
---

# Design Tokens Reference

Verify and look up available design tokens before writing SCSS. This prevents hardcoded values and ensures design consistency.

## Steps

1. Read the token source files to find the exact token needed:

```
src/styles/builders/_variables.scss   → Colors, spacing, z-index, radius, transitions
src/styles/builders/_typo.scss        → Typography mixins
src/styles/builders/_mixins.scss      → Layout mixins (content-grid, radius, etc.)
src/styles/builders/_mediaqueries.scss → Breakpoints and responsive mixins
src/styles/builders/_functions.scss   → Helper functions (use-space, use-color, use-layer)
```

2. For each style property, find the correct token (see quick-ref below).
3. Report which tokens to use. Flag any values that don't have an existing token.

## Quick Reference

### Helper Functions
```scss
use-space("s3")         // → 1rem (16px)
use-color("base-green") // → #17ffac
use-layer("modal")      // → 200
```

### Spacing ($spaces map)
| Key | Value | Px |
|-----|-------|----|
| s0 | 0.25rem | 4px |
| s1 | 0.5rem | 8px |
| s2 | 0.75rem | 12px |
| s3 | 1rem | 16px |
| s4 | 1.25rem | 20px |
| s5 | 1.5rem | 24px |
| s6 | 2rem | 32px |
| s7 | 2.5rem | 40px |
| s8 | 3rem | 48px |
| s9 | 3.5rem | 56px |
| s10 | 4rem | 64px |

### Typography Mixins
| Mixin | Base size | Weight | Responsive |
|-------|-----------|--------|------------|
| `text-display-lg` | 3rem (48px) | 500 | 2rem → 2.5rem → 3rem |
| `text-heading-lg` | 2rem (32px) | 500 | 1.5rem → 1.75rem → 2rem |
| `text-title-md` | 1.5rem (24px) | 400 | 1.25rem → 1.5rem |
| `text-lead-md` | 1.125rem (18px) | 400 | 1rem → 1.125rem |
| `text-body-md` | 1rem (16px) | 400 | fixed |
| `text-label-md` | 1rem (16px) | 400 | fixed |
| `text-label-md-strong` | 1rem (16px) | 500 | fixed |
| `text-label-sm` | 0.875rem (14px) | 400 | fixed |
| `text-label-sm-strong` | 0.875rem (14px) | 500 | fixed |

### Colors — Semantic

#### Text
| Variable | Use for |
|----------|---------|
| `$text-primary-default` | Primary text (#fcfcfd) |
| `$text-secondary-default` | Secondary/muted text (#93a0b8) |
| `$text-secondary-default-muted` | Extra muted (75% opacity) |
| `$text-inverse-default` | Text on light backgrounds |
| `$text-input-default` | Input text |
| `$text-input-placeholder` | Placeholder text |
| `$text-link-default` / `$text-link-hover` | Links (green) |
| `$text-button-solid-default` | Solid button text |
| `$text-button-ghost-default` / `hover` | Ghost button text |
| `$text-button-nav-default` / `hover` / `active` | Nav button text |
| `$text-button-accent-default` | Accent button text |

#### Background
| Variable | Use for |
|----------|---------|
| `$bg-page-default` | Page background (#0e131c) |
| `$bg-input-default` / `hover` / `focus` | Input backgrounds |
| `$bg-button-solid-default` / `hover` | Solid button |
| `$bg-button-ghost-hover` | Ghost button hover |
| `$bg-button-accent-default` / `hover` | Accent button (gradient) |
| `$bg-navbar-sticky` | Sticky navbar |
| `$bg-surface-default` / `hover` | Surface/card |

#### Border
| Variable | Use for |
|----------|---------|
| `$border-input-default` / `hover` / `focus` | Input borders |
| `$border-navbar-sticky` | Navbar border |
| `$border-surface-default` | Surface/card border |

#### State
| Variable | Use for |
|----------|---------|
| `$base-red` | Error (#f3505c) |
| `$base-green` | Success (#17ffac) |
| `$base-dark-green` | Success hover (#1cbc83) |

#### Base (raw — prefer semantic above)
`$base-white` #fcfcfd, `$base-black` #101010, `$base-pure-black` #000, `$base-light-grey` #93a0b8, `$base-lighter-grey` #c0cade, `$base-darkest-navy` #0e131c, `$base-dark-navy` #0c172c, `$base-navy` #102958, `$base-light-green` #8cffd6, `$base-lighter-green` #c5fee9

#### Opacity
`$base-opacity-white-2|5|7|10|25|40`, `$base-opacity-navy-70`, `$base-opacity-transparent`

### Gradients
| Variable / Mixin | Use for |
|-----------------|---------|
| `$bg-button-accent-default` | Accent button gradient |
| `@include text-accent-default` | Accent text gradient |
| `@include text-accent-display-lg` | Display text gradient |

### Border Radius
| Token | Value |
|-------|-------|
| `$radius-s` | 0.75rem (12px) |
| `$radius-m` | 1rem (16px) |
| `$radius-l` | 1.25rem (20px) |
| `$radius-xl` | 1.5rem (24px) |
| Usage: `@include radius($radius-m)` | border-radius + corner-shape |

### Z-index Layers
| Key | Value | Used by |
|-----|-------|---------|
| `modal` | 200 | ContactSidebar, modals |
| `chat` | 100 | ChatInput floating |
| `cookies` | 3 | Cookie banner |
| `navbar` | 2 | Fixed navbar |
| `base` | 0 | Default |
| `back` | -1 | Behind content |

### Breakpoints
| Key | Value | Mixin |
|-----|-------|-------|
| xs | 1px | default/mobile |
| s | 768px | `@include for-screens-above("s")` |
| m | 1024px | `@include for-screens-above("m")` |
| l | 1200px | `@include for-screens-above("l")` |
| xl | 1440px | `@include for-screens-above("xl")` |
| 2xl | 1920px | `@include for-screens-above("2xl")` |
| Also: `for-screens-below()`, `for-screens-between()` | | |

### Layout Mixins
| Mixin | Description |
|-------|-------------|
| `@include content-grid` | 4→6→12 cols responsive |
| `@include content-span` | Responsive central column |
| `@include content-span-full` | grid-column: 1 / -1 |
| `@include grid-12` / `grid-6` / `grid-4` | Simple grids, 1rem gap |

### Transitions
| Variable | Value |
|----------|-------|
| `$transition-duration-button` | 0.45s |
| `$transition-easing-button` | cubic-bezier(0.16, 1, 0.3, 1) |

## Anti-patterns

- `z-index: 10` → `z-index: use-layer("navbar")`
- `color: #fcfcfd` → `color: $text-primary-default`
- `font-size: 1rem` → `@include text-body-md`
- `padding: 16px` → `padding: use-space("s3")`
- `border-radius: 16px` → `@include radius($radius-m)`
- `@media (min-width: 768px)` → `@include for-screens-above("s")`
- `background: rgba(255,255,255,0.05)` → `background: $bg-input-default`
