---
name: i18n
description: Add or update internationalization keys for a component. Use when adding text translations or when the user mentions i18n, translations, or localization.
argument-hint: [component-name]
allowed-tools: Read, Edit, Grep
---

# Add/Update i18n Keys

Add or update i18n keys for the `$ARGUMENTS` component.

## Steps

1. **Read current locale files**:
   - `src/i18n/locales/en.ts`
   - `src/i18n/locales/es.ts`

2. **Read the component** to find all `data-t`, `data-t-placeholder`, and `data-t-aria-label` attributes

3. **Check which keys are missing** from the locale files

4. **Add missing keys** to both `en.ts` and `es.ts`:
   - Group under a `// ComponentName` comment
   - Use `componentName.elementName` key format (camelCase namespace)
   - EN values = English text from the component
   - ES values = Spanish translation

5. **Verify** no duplicate keys exist

## Key Format Convention
```
namespace.element          → "statement.tagline"
namespace.element.property → "missions.card1.title"
```

## Attribute Mapping
| Attribute | i18n applies to |
|-----------|----------------|
| `data-t` | `textContent` |
| `data-t-placeholder` | `placeholder` attribute |
| `data-t-aria-label` | `aria-label` attribute |
