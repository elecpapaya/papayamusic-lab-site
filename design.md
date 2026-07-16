# Design — PapayaMusic Lab

A locked design system for this site. Every page reads this file before visual changes. Preserve product claims, routes, form behaviour, analytics, the Papaya accent, Pretendard, and the existing production-suite photograph.

## Genre

Atmospheric — a late-night production control room with technical restraint. The page feels occupied and useful, not decorative.

## Macrostructure family

- Marketing pages: **Narrative Workflow**, using H6 Photographic Fold and F4 Step Sequence.
- Form pages: **Split Studio**, with guidance on one side and the working form on the other.
- Content pages: **Long Document**, with S4 Inline heads and C3 Typographic links.

## Theme

- `--color-paper` `oklch(14% 0.014 42)`
- `--color-paper-2` `oklch(18% 0.016 42)`
- `--color-paper-3` `oklch(23% 0.018 42)`
- `--color-ink` `oklch(94% 0.008 68)`
- `--color-ink-2` `oklch(76% 0.010 58)`
- `--color-rule` `oklch(32% 0.018 42)`
- `--color-accent` `oklch(70% 0.14 42)`
- `--color-focus` `oklch(78% 0.18 48)`

Accent is a signal, capped at roughly 3% of each viewport. Elevated surfaces become lighter rather than gaining glow shadows.

## Typography

- Display: Pretendard Variable, weight 800, roman.
- Body: Pretendard Variable, weight 350.
- Outlier: Pretendard Variable, weight 600, used only for technical labels and the wordmark.
- Display tracking: `-0.04em`.
- Type-scale anchor: `--text-display = clamp(2.75rem, 5.5vw, 5.25rem)`.

The single-family choice is deliberate: Korean, Japanese, and English keep one glyph voice across the product. Hierarchy comes from extreme weight and scale contrast.

## Spacing

4-point named scale in `tokens.css`. Components use named tokens, never new raw spacing values.

## Motion

- Easings: `--ease-out`, `--ease-in`, and `--ease-in-out` from `tokens.css`.
- Reveal: one hero fade on first load.
- Repeated interaction: CTA press/hover only.
- Reduced-motion fallback: opacity-only, at most 150ms.

## Microinteractions stance

- Silent success for form completion already visible in the interface.
- Focus appears instantly with a 2px high-contrast ring.
- Hover changes are available only to fine pointers and always have focus equivalents.
- Controls cover default, hover, focus, active, disabled, loading, error, and success states.

## CTA voice

- Primary: ink-filled on the dark canvas, compact and rectangular, verb-led copy.
- Secondary: transparent with a rule border.
- Editorial/content CTAs: C3 Typographic link with a thickening underline.

## Navigation and footer

- Navigation: **N9 Edge-aligned minimal** — wordmark left, one product action right, language control as utility.
- Footer: **Ft5 Statement** — the existing product description closes the page; legal and contact links sit in the metadata row.

## Per-page allowances

- Marketing pages may use the existing production-suite photograph. No additional generated imagery.
- Form pages use no enrichment; the form is the artefact.
- Content pages are typography-only except existing article media.

## What pages MUST share

- Wordmark, dark warm canvas, Papaya accent placement, Pretendard, CTA geometry, focus ring, and section-heading rhythm.
- `html` and `body` use `overflow-x: clip`.
- Interactive labels never wrap; hit targets are at least 44px.

## What pages MAY differ on

- Marketing sections may alternate dense workflow records and open photographic space.
- Form pages may reverse the Split Studio columns.
- Content indexes may widen beyond article measure for real lists.

## Exports

### tokens.css

`tokens.css` at the project root is the source of truth.

### Tailwind v4 `@theme`

```css
@theme {
  --color-paper: oklch(14% 0.014 42);
  --color-paper-2: oklch(18% 0.016 42);
  --color-paper-3: oklch(23% 0.018 42);
  --color-ink: oklch(94% 0.008 68);
  --color-ink-2: oklch(76% 0.010 58);
  --color-rule: oklch(32% 0.018 42);
  --color-accent: oklch(70% 0.14 42);
  --font-display: "Pretendard Variable", Pretendard, sans-serif;
  --font-body: "Pretendard Variable", Pretendard, sans-serif;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  --text-md: 1.125rem;
  --text-xl: 1.75rem;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --radius-card: 0.25rem;
}
```

### DTCG `tokens.json`

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "color": {
    "paper": { "$value": "oklch(14% 0.014 42)", "$type": "color" },
    "paper-2": { "$value": "oklch(18% 0.016 42)", "$type": "color" },
    "paper-3": { "$value": "oklch(23% 0.018 42)", "$type": "color" },
    "ink": { "$value": "oklch(94% 0.008 68)", "$type": "color" },
    "accent": { "$value": "oklch(70% 0.14 42)", "$type": "color" }
  },
  "font": {
    "display": { "$value": "Pretendard Variable, Pretendard, sans-serif", "$type": "fontFamily" },
    "body": { "$value": "Pretendard Variable, Pretendard, sans-serif", "$type": "fontFamily" }
  },
  "space": {
    "md": { "$value": "1.5rem", "$type": "dimension" },
    "xl": { "$value": "3rem", "$type": "dimension" }
  },
  "duration": {
    "micro": { "$value": "120ms", "$type": "duration" },
    "short": { "$value": "220ms", "$type": "duration" },
    "long": { "$value": "420ms", "$type": "duration" }
  }
}
```

### shadcn/ui CSS variables

```css
:root {
  --background: 14% 0.014 42;
  --foreground: 94% 0.008 68;
  --card: 18% 0.016 42;
  --card-foreground: 94% 0.008 68;
  --popover: 18% 0.016 42;
  --popover-foreground: 94% 0.008 68;
  --primary: 70% 0.14 42;
  --primary-foreground: 16% 0.014 42;
  --secondary: 23% 0.018 42;
  --secondary-foreground: 94% 0.008 68;
  --muted: 32% 0.018 42;
  --muted-foreground: 68% 0.010 52;
  --accent: 70% 0.14 42;
  --accent-foreground: 16% 0.014 42;
  --destructive: 68% 0.16 25;
  --destructive-foreground: 95% 0.010 68;
  --border: 32% 0.018 42;
  --input: 32% 0.018 42;
  --ring: 78% 0.18 48;
  --radius: 0.25rem;
}
```
