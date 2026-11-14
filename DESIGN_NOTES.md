# Design Notes – TaskFlow Landing Page

## Color Palette

The primary color is **Indigo Blue (#5B5FED)** — chosen because it conveys trust, focus and technology, common in modern SaaS tools (Notion, Linear, Vercel). It contrasts well on both white and the light-indigo background tint (#EEF0FF). The accent is **Warm Orange (#F97316)**, used sparingly for highlights, so it draws attention without overwhelming. Text is near-black (#1E1E2E) for strong contrast; muted text (#64748B) keeps secondary copy readable but visually quieter.

## Typography

Inter (Google Fonts) was chosen because it is designed for screen readability, has a wide weight range (400–800) and is free. Body text is 16 px with a 1.6 line-height for comfortable reading. Headings use weights 700–800 and a tighter line-height (1.2) so large display text stays compact. Font sizes follow a modular scale (sm → base → lg → xl → 2xl → 3xl → 4xl → 5xl) defined as CSS variables, making global resizing trivial.

## Layout Approach

Mobile-first CSS Grid and Flexbox: single-column stacks on mobile (320 px), two- and three-column grids from 768 px, and a four-column feature grid from 1024 px. A consistent 8 px spacing scale (`--space-1` through `--space-7`) keeps vertical rhythm predictable. The `.container` class caps content at 1200 px and adds 16 px side padding, preventing wide-screen text from stretching uncomfortably.

## Responsiveness Strategy

`scroll-margin-top: var(--navbar-height)` on every `<section>` offsets anchor jumps so the sticky navbar never hides the section heading. The hamburger menu uses `transform: translateY(-110%)` to hide off-screen (not `display: none`) so the CSS transition still fires. At 1024 px the hamburger disappears and the nav links display inline — no JavaScript is needed for the layout change.

## Challenges Solved

**Sticky navbar offset:** Without `scroll-margin-top`, clicking a nav anchor would scroll the section heading behind the sticky bar. The fix is a single CSS rule `section { scroll-margin-top: var(--navbar-height); }`.

**Mobile menu closing on outside click:** A `document`-level click handler checks `!navbar.contains(e.target)` and closes the menu. Without this, tapping the page content while the menu is open doesn't close it.

**Pricing → form plan preselect:** Each pricing CTA carries a `data-plan="Free|Pro|Team"` attribute. `initPricingButtons()` reads this attribute on click and sets `#plan.value` before the page scrolls to the form, so the user arrives with the right plan already selected.

**Form validation UX:** Errors appear only on submit (not while typing), but clear as soon as the user fixes a field (`input` event listener). This avoids the frustrating "error on every keystroke" anti-pattern while still giving immediate positive feedback.

**Dark theme without flash:** The theme is applied by toggling `data-theme="dark"` on `<html>` and all colors are CSS variables, so the entire page updates in one repaint. `localStorage` persists the preference; the JS reads it immediately on `DOMContentLoaded` before the first paint in most browsers.
