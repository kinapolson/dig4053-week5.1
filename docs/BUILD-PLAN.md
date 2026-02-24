# Dark Mode Implementation Plan

Great project! Here's a breakdown into small, reviewable steps:

---

**Step 1 — CSS Custom Properties (Variables)**
Refactor `styles.css` to use CSS variables for all colors (backgrounds, text, borders, accents). This is the foundation everything else builds on. No visual change yet — just a refactor.
*Test: Site looks identical to before.*

---

**Step 2 — Define a `[data-theme="dark"]` color palette**
Add a second set of CSS variable values that override the light ones when a `data-theme="dark"` attribute is on the `<html>` element. Green scheme inverted to dark backgrounds, light text.
*Test: Manually add `data-theme="dark"` to `<html>` in DevTools and confirm the page goes dark.*

---

**Step 3 — Add the toggle button to the nav**
Add a sun/moon icon button to the `<nav>` in all HTML files. Style it to match the existing nav aesthetic.
*Test: Button appears correctly on all pages, desktop and mobile.*

---

**Step 4 — Wire up the JavaScript toggle**
Write a small JS function that toggles `data-theme="dark"` on `<html>` and saves the preference to `localStorage`.
*Test: Clicking the button switches modes. Refresh the page — it remembers your choice.*

---

**Step 5 — Honor system preference (`prefers-color-scheme`)**
Add a media query so users who have dark mode set at the OS level get dark mode automatically on first visit (before they've ever clicked the toggle).
*Test: Change your OS/browser dark mode setting and reload — the site should follow it.*

---

**Step 6 — Polish & edge cases**
Check images, the hero section, cards, forms, and the footer. Add subtle adjustments like reduced image brightness in dark mode and smooth color transitions.
*Test: Walk through every page in both modes looking for anything that looks off.*
