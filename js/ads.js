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

   One code maps to one slot: top / sidebar / bottom.
   Adsterra banners are fixed-pixel, not responsive — the `width`
   field below must match the `width` in that code's atOptions so the
   scaling wrapper can shrink it to fit narrow screens without it
   overflowing or getting cut off.
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

  // Adsterra banners render at a fixed pixel size. On a narrow screen a
  // 728px-wide banner would either overflow or get clipped. Instead we
  // wrap the ad in a box sized exactly to its real dimensions, then
  // CSS-scale that whole box down to fit the slot's actual width —
  // the ad still renders normally, it just displays smaller.
  function injectScaled(selector, cfgKey) {
    var cfg = window.ADS_CONFIG[cfgKey];
    if (!cfg || !cfg.enabled || !cfg.code || !cfg.code.trim()) return;

    document.querySelectorAll(selector).forEach(function (slot) {
      var outer = document.createElement("div");
      outer.style.width = "100%";
      outer.style.display = "flex";
      outer.style.justifyContent = "center";

      var scaleBox = document.createElement("div");
      scaleBox.style.width = cfg.width + "px";
      scaleBox.style.height = cfg.height + "px";
      scaleBox.style.transformOrigin = "top center";
      scaleBox.innerHTML = cfg.code;

      outer.appendChild(scaleBox);
      slot.innerHTML = "";
      slot.appendChild(outer);
      runScriptsIn(scaleBox);

      function rescale() {
        var available = slot.clientWidth || outer.clientWidth;
        var scale = Math.min(1, available / cfg.width);
        scaleBox.style.transform = "scale(" + scale + ")";
        outer.style.height = (cfg.height * scale) + "px";
      }

      rescale();
      window.addEventListener("resize", rescale);
    });
  }

  function init() {
    injectScaled(".ad-slot--top", "top");
    injectScaled(".ad-slot--sidebar", "sidebar");
    injectScaled(".ad-slot--bottom", "bottom");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
