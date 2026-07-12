/* =====================================================================
   FreeToolsHub — Adsterra ad configuration & injector
   =====================================================================
   HOW TO ADD / CHANGE / REMOVE ADS ON THE WHOLE SITE:
   Edit ONLY the ADS_CONFIG object below, then re-upload this one file.
   Every page (homepage + all 10 tools) loads this same script, so a
   single edit here updates ads across the entire site — no need to
   touch any of the individual tool HTML files.

   To fill in a real ad: paste the FULL code Adsterra gives you
   (both the <script>...atOptions...</script> block AND the
   <script src="...invoke.js"></script> line) into the matching
   `code` field below as a single string, and set enabled to true.

   Adsterra banners are NOT responsive — each size is a fixed image.
   That's why "top" has two separate slots (desktop vs mobile) that
   swap automatically based on screen width.
   ===================================================================== */

window.ADS_CONFIG = {

  // 728x90 desktop leaderboard — shown in the top slot on screens > 480px
  topDesktop: {
    enabled: true,
    code: `
      <script>
        atOptions = {
          'key' : 'd789b0a23c93bfb48ca2506e425fae37',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      </script>
      <script src="https://www.highperformanceformat.com/d789b0a23c93bfb48ca2506e425fae37/invoke.js"></script>
    `
  },

  // 320x50 mobile banner — shown in the top slot on screens <= 480px
  topMobile: {
    enabled: true,
    code: `
      <script>
        atOptions = {
          'key' : '6a68ef2fd103a9abfb89b9567cccbcc5',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      </script>
      <script src="https://www.highperformanceformat.com/6a68ef2fd103a9abfb89b9567cccbcc5/invoke.js"></script>
    `
  },

  // 300x250 medium rectangle — shown in the sidebar slot
  sidebar: {
    enabled: true,
    code: `
      <script>
        atOptions = {
          'key' : 'ce36abea79a7002de0a0faee8778ebec',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
      </script>
      <script src="https://www.highperformanceformat.com/ce36abea79a7002de0a0faee8778ebec/invoke.js"></script>
    `
  },

  // No ad unit requested for this yet. Leave enabled:false — the bottom
  // slot will simply stay invisible (collapsed) until you add one.
  // NOTE: Adsterra asks publishers not to place the identical ad code
  // twice on the same page, so don't just copy the sidebar or top code
  // in here — request a separate ad unit from Adsterra first.
  bottom: {
    enabled: false,
    code: ``
  }
};

/* ---- injector — you shouldn't need to edit anything below this line ---- */
(function () {
  function runScriptsIn(container) {
    // innerHTML-inserted <script> tags don't execute automatically,
    // so we clone and replace each one to force execution.
    container.querySelectorAll("script").forEach(function (oldScript) {
      var newScript = document.createElement("script");
      for (var i = 0; i < oldScript.attributes.length; i++) {
        var attr = oldScript.attributes[i];
        newScript.setAttribute(attr.name, attr.value);
      }
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }

  function inject(selector, cfgKey) {
    var cfg = window.ADS_CONFIG[cfgKey];
    if (!cfg || !cfg.enabled || !cfg.code || !cfg.code.trim()) return;
    document.querySelectorAll(selector).forEach(function (el) {
      el.innerHTML = cfg.code;
      runScriptsIn(el);
    });
  }

  function init() {
    var isMobile = window.matchMedia("(max-width: 480px)").matches;
    inject(".ad-slot--top", isMobile ? "topMobile" : "topDesktop");
    inject(".ad-slot--sidebar", "sidebar");
    inject(".ad-slot--bottom", "bottom");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
