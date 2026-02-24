/**
 * theme.js — Dark mode toggle for Hole 19 Golf Shop
 * Handles: toggle, localStorage persistence, icon + aria updates
 *
 * Split into two phases:
 *   Phase 1 (runs in <head>, before paint): sets data-theme on <html>
 *             to prevent any flash of the wrong theme.
 *   Phase 2 (runs after DOM ready): updates button aria + icon to match.
 */

const STORAGE_KEY = 'hole19-theme';
const DARK = 'dark';
const LIGHT = 'light';

// ─── LocalStorage helper (safe in private/incognito browsing) ────────────────

function getSavedTheme() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        // Validate against known constants — guards against "null" string
        // or any other corrupt value that may have been stored previously
        if (stored === DARK || stored === LIGHT) return stored;
        return null;
    } catch (e) {
        return null;
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
        // Silently fail — theme still applies for this session via data-theme
    }
}

// ─── OS preference (prefers-color-scheme) ────────────────────────────────────

function getOSPreference() {
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    return (mq && mq.matches) ? DARK : LIGHT;
}

// Returns: explicit user choice if set, otherwise OS preference, otherwise light
function getActiveTheme() {
    return getSavedTheme() || getOSPreference();
}

// ─── Phase 1: Apply data-theme immediately (runs in <head>) ──────────────────
// Only touches <html> — no DOM queries, safe before <body> exists.

function setThemeAttribute(theme) {
    if (theme === DARK) {
        document.documentElement.setAttribute('data-theme', DARK);
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

// ─── Phase 2: Sync button UI (runs after DOM is ready) ───────────────────────

function syncButtonUI(theme) {
    const isDark = theme === DARK;

    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });

    document.querySelectorAll('.theme-icon').forEach(icon => {
        icon.textContent = isDark ? '☀️' : '🌙';
    });
}

// ─── Toggle (called by button onclick) ───────────────────────────────────────

let transitionTimer = null;

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === DARK ? LIGHT : DARK;

    // Cancel any in-flight cleanup from a previous rapid click
    if (transitionTimer) {
        window.clearTimeout(transitionTimer);
    }

    // Add transition class just for this switch, remove it when done
    // so page-load doesn't animate from the wrong theme
    document.documentElement.classList.add('theme-transitioning');
    transitionTimer = window.setTimeout(function () {
        document.documentElement.classList.remove('theme-transitioning');
        transitionTimer = null;
    }, 300); // matches transition duration in CSS

    saveTheme(next);
    setThemeAttribute(next);
    syncButtonUI(next);
}

// ─── Init ─────────────────────────────────────────────────────────────────────

// Read once — used by both phases so localStorage is only accessed once
const initialTheme = getActiveTheme();

// Phase 1 — runs immediately, prevents flash
setThemeAttribute(initialTheme);

// Phase 2 — waits for DOM so querySelectorAll actually finds the buttons
document.addEventListener('DOMContentLoaded', function () {
    syncButtonUI(initialTheme);

    // Listen for OS dark mode changes (e.g. auto dark mode at sunset).
    // Only responds if the user has NOT made an explicit choice — their
    // saved preference always takes priority over the OS setting.
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            if (!getSavedTheme()) {
                const theme = e.matches ? DARK : LIGHT;
                setThemeAttribute(theme);
                syncButtonUI(theme);
            }
        });
    }
});
