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
