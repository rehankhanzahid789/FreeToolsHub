/* Shared header + footer injector for tool pages.
   Each tool page includes this script with `data-root="../../"`
   so all links resolve correctly from any depth. */
(function () {
  const currentScript = document.currentScript;
  const root = (currentScript && currentScript.getAttribute("data-root")) || "";

  const header = `
    <header class="site-header">
      <div class="container site-header__inner">
        <a class="brand" href="${root}index.html">
          <img class="brand__mark" src="${root}assets/brand/logo-64.png" alt="FreeToolsHub logo" />
          <span>FreeToolsHub</span>
        </a>
        <div style="display:flex; align-items:center; gap:14px;">
          <a class="header-support-link" href="${root}support/index.html">Support</a>
          <a class="header-support-link" href="https://github.com/rehankhanzahid789/FreeToolsHub/issues/new?title=Bug%20report%3A%20&body=%23%23%20What%20happened%3F%0A%0A%0A%23%23%20Steps%20to%20reproduce%0A%0A%0A%23%23%20Expected%20behavior%0A%0A%0A%23%23%20Browser%20/%20device%20%28e.g.%20Chrome%20on%20Windows%2C%20Safari%20on%20iPhone%29%0A%0A%0A&labels=bug" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="8" width="10" height="11" rx="5"/><path d="M12 8V5"/><path d="M9 5 7.5 3.5M15 5l1.5-1.5"/><path d="M7 11H3M7 14H3M7 17H3"/><path d="M17 11h4M17 14h4M17 17h4"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>
            Report a Bug
          </a>
          <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Toggle dark mode" title="Toggle dark mode">
            <svg class="theme-toggle__icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>
            <svg class="theme-toggle__icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
          </button>
        </div>
      </div>
    </header>
  `;

  const footer = `
    <footer class="site-footer">
      <div class="container site-footer__inner">
        <span>© ${new Date().getFullYear()} FreeToolsHub — Free tools, no signup.</span>
        <span style="display:flex; gap:16px; flex-wrap:wrap;">
          <a href="${root}support/index.html">Support me</a>
          <a href="https://www.fiverr.com/s/42P9yR1" target="_blank" rel="noopener noreferrer">Request a tool</a>
          <a href="https://github.com/rehankhanzahid789/FreeToolsHub/issues/new?title=Bug%20report%3A%20&body=%23%23%20What%20happened%3F%0A%0A%0A%23%23%20Steps%20to%20reproduce%0A%0A%0A%23%23%20Expected%20behavior%0A%0A%0A%23%23%20Browser%20/%20device%20%28e.g.%20Chrome%20on%20Windows%2C%20Safari%20on%20iPhone%29%0A%0A%0A&labels=bug" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="8" width="10" height="11" rx="5"/><path d="M12 8V5"/><path d="M9 5 7.5 3.5M15 5l1.5-1.5"/><path d="M7 11H3M7 14H3M7 17H3"/><path d="M17 11h4M17 14h4M17 17h4"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>
            Report a bug
          </a>
          <a href="${root}index.html">Back to all tools</a>
        </span>
      </div>
    </footer>
  `;

  document.addEventListener("DOMContentLoaded", () => {
    const h = document.getElementById("site-header");
    const f = document.getElementById("site-footer");
    if (h) h.outerHTML = header;
    if (f) f.outerHTML = footer;
  });
})();
