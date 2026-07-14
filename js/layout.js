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
        <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Toggle dark mode" title="Toggle dark mode">
          <svg class="theme-toggle__icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>
          <svg class="theme-toggle__icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
        </button>
      </div>
    </header>
  `;

  const footer = `
    <footer class="site-footer">
      <div class="container site-footer__inner">
        <span>© ${new Date().getFullYear()} FreeToolsHub — Free tools, no signup.</span>
        <span><a href="${root}index.html">Back to all tools</a></span>
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
