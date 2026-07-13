/* Color Palette Generator — HSL-based harmony generation */
(function () {
  const baseInput = document.getElementById("cp-base");
  const groups = {
    shades: document.getElementById("cp-shades"),
    complementary: document.getElementById("cp-complementary"),
    analogous: document.getElementById("cp-analogous"),
    triadic: document.getElementById("cp-triadic"),
  };

  function hexToHsl(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        default: h = (r - g) / d + 4;
      }
      h /= 6;
    }
    return [h * 360, s * 100, l * 100];
  }

  function hslToHex(h, s, l) {
    h = ((h % 360) + 360) % 360;
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    const toHex = (v) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function renderSwatches(container, hexes) {
    container.innerHTML = "";
    hexes.forEach((hex) => {
      const swatch = document.createElement("div");
      swatch.className = "cp-swatch";
      swatch.title = "Click to copy";
      swatch.innerHTML = `<div class="cp-swatch__color" style="background:${hex}"></div><div class="cp-swatch__label">${hex}</div>`;
      swatch.addEventListener("click", () => {
        navigator.clipboard.writeText(hex).then(() => {
          const label = swatch.querySelector(".cp-swatch__label");
          const orig = label.textContent;
          label.textContent = "Copied!";
          setTimeout(() => (label.textContent = orig), 900);
        });
      });
      container.appendChild(swatch);
    });
  }

  function update() {
    const [h, s, l] = hexToHsl(baseInput.value);

    const shades = [20, 35, 50, 65, 80].map((lv) => hslToHex(h, s, lv));
    const complementary = [hslToHex(h, s, l), hslToHex(h + 180, s, l)];
    const analogous = [h - 30, h - 15, h, h + 15, h + 30].map((hv) => hslToHex(hv, s, l));
    const triadic = [h, h + 120, h + 240].map((hv) => hslToHex(hv, s, l));

    renderSwatches(groups.shades, shades);
    renderSwatches(groups.complementary, complementary);
    renderSwatches(groups.analogous, analogous);
    renderSwatches(groups.triadic, triadic);
  }

  baseInput.addEventListener("input", update);
  update();
})();
