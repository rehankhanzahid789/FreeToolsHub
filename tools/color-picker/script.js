(function () {
  const input = document.getElementById("cp-input");
  const swatch = document.getElementById("cp-swatch");
  const hex = document.getElementById("cp-hex");
  const rgb = document.getElementById("cp-rgb");
  const hsl = document.getElementById("cp-hsl");

  function hexToRgb(h) {
    const m = h.replace("#", "");
    return { r: parseInt(m.slice(0, 2), 16), g: parseInt(m.slice(2, 4), 16), b: parseInt(m.slice(4, 6), 16) };
  }
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    let h = 0, s = 0, l = (mx + mn) / 2;
    if (mx !== mn) {
      const d = mx - mn;
      s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      switch (mx) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h *= 60;
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function update() {
    const value = input.value;
    swatch.style.background = value;
    hex.value = value.toUpperCase();
    const c = hexToRgb(value);
    rgb.value = `rgb(${c.r}, ${c.g}, ${c.b})`;
    const h = rgbToHsl(c.r, c.g, c.b);
    hsl.value = `hsl(${h.h}, ${h.s}%, ${h.l}%)`;
  }

  input.addEventListener("input", update);

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const el = document.getElementById(btn.dataset.copy);
      try { await navigator.clipboard.writeText(el.value); btn.textContent = "Copied!"; setTimeout(()=>btn.textContent="Copy",1200); } catch(e){}
    });
  });

  update();
})();
