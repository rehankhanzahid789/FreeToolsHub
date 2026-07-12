/* =====================================================================
   FreeToolsHub — Adsterra ad configuration & injector
   =====================================================================
   HOW TO ADD / CHANGE / REMOVE ADS ON THE WHOLE SITE:
   Edit ONLY the ADS_CONFIG object below, then re-upload this one file.
   Every page (homepage + all 10 tools) loads this same script, so a
   single edit here updates ads across the entire site — no need to
   touch any of the individual tool HTML files.

   To fill in a real ad: paste the FULL code Adsterra gives you (both
   the <script>...atOptions...</script> block AND the
   <script src="...invoke.js"></script> line) into the matching `code`
   field below as a single string, and set enabled to true.

   IMPORTANT: every Adsterra "atOptions" ad code uses the SAME global
   variable name (atOptions). Running several on one page back-to-back
   makes each one silently overwrite the last one's config — so we
   load each ad inside its own isolated <iframe>, giving each one its
   own separate window.atOptions with no possibility of collision.

   One code maps to one slot: top / sidebar / bottom. Adsterra banners
   are fixed-pixel, not responsive — `width`/`height` below must match
   the ones in that code's atOptions so it can scale to fit narrow
   screens without overflowing or getting cut off.
   ===================================================================== */

window.ADS_CONFIG = {

  // Top slot — 728x90 banner
  top: {
    enabled: true,
    width: 728,
    height: 90,
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

  // Sidebar slot — 300x250 medium rectangle
  sidebar: {
    enabled: true,
    width: 300,
    height: 250,
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

  // Bottom slot — 320x50 mobile banner
  bottom: {
    enabled: true,
    width: 320,
    height: 50,
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
  }
};

/* ---- injector — you shouldn't need to edit anything below this line ---- */
(function () {
  // Each ad is loaded inside its own iframe via srcdoc, giving it a
  // completely separate window/global scope. This is the officially
  // documented fix for Adsterra's shared-atOptions collision when
  // running multiple ad units on one page.
  function injectIsolated(slotEl, cfg) {
    var outer = document.createElement("div");
    outer.style.width = "100%";
    outer.style.display = "flex";
    outer.style.justifyContent = "center";

    var iframe = document.createElement("iframe");
    iframe.title = "Advertisement";
    iframe.style.border = "none";
    iframe.style.display = "block";
    iframe.style.transformOrigin = "top center";
    iframe.setAttribute("scrolling", "no");
    iframe.width = cfg.width;
    iframe.height = cfg.height;

    var doc = "<!DOCTYPE html><html><head><style>*{margin:0;padding:0;}</style></head><body>" + cfg.code + "</body></html>";

    outer.appendChild(iframe);
    slotEl.innerHTML = "";
    slotEl.appendChild(outer);

    if ("srcdoc" in iframe) {
      iframe.srcdoc = doc;
    } else {
      var idoc = iframe.contentWindow.document;
      idoc.open();
      idoc.write(doc);
      idoc.close();
    }

    function rescale() {
      var available = slotEl.clientWidth || outer.clientWidth;
      var scale = Math.min(1, available / cfg.width);
      iframe.style.transform = "scale(" + scale + ")";
      outer.style.height = (cfg.height * scale) + "px";
    }

    rescale();
    window.addEventListener("resize", rescale);
  }

  function inject(selector, cfgKey) {
    var cfg = window.ADS_CONFIG[cfgKey];
    if (!cfg || !cfg.enabled || !cfg.code || !cfg.code.trim()) return;
    document.querySelectorAll(selector).forEach(function (slot) {
      injectIsolated(slot, cfg);
    });
  }

  function init() {
    inject(".ad-slot--top", "top");
    inject(".ad-slot--sidebar", "sidebar");
    inject(".ad-slot--bottom", "bottom");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
