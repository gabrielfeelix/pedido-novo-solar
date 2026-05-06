/**
 * PCYES Theme Sync Script
 * Syncs the theme of injected HTML pages with the parent V2 site.
 * Listens for theme changes from the parent and applies light/dark mode.
 */
(function () {
  'use strict';

  // Detect current theme from parent site
  function getTheme() {
    try {
      // Check if parent window has theme info
      const root = document.documentElement;
      if (root.classList.contains('dark')) return 'dark';
      // Check localStorage (set by V2 site's ThemeProvider)
      const stored = localStorage.getItem('v2-theme');
      if (stored) return stored;
      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'dark';
    }
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    const bodies = document.querySelectorAll(
      '#pcyes-influencers, #pcyes-fale-conosco, #pcyes-reseller-locator, .landing-page, #pcyes-maringa-collab'
    );

    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      bodies.forEach(function (el) {
        el.classList.remove('dark');
        el.classList.add('light');
      });
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      bodies.forEach(function (el) {
        el.classList.remove('light');
        el.classList.add('dark');
      });
    }
  }

  // Apply initial theme
  applyTheme(getTheme());

  // Listen for theme changes from parent
  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'theme-change') {
      applyTheme(e.data.theme);
    }
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem('v2-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
})();
