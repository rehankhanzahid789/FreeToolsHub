/* Box Shadow Generator */
(function () {
  const box = document.getElementById("bs-box");
  const output = document.getElementById("bs-output");
  const copyBtn = document.getElementById("bs-copy");
  const inset = document.getElementById("bs-inset");
  const color = document.getElementById("bs-color");

  const sliders = ["x", "y", "blur", "spread", "opacity"].map((id) => ({
    id,
    el: document.getElementById("bs-" + id),
    valEl: document.getElementById("bs-" + id + "-val"),
  }));

  function hexToRgb(hex) {
    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }

  function update() {
    const vals = {};
    sliders.forEach((s) => (vals[s.id] = parseFloat(s.el.value)));
    sliders.forEach((s) => {
      s.valEl.textContent = s.id === "opacity" ? s.el.value + "%" : s.el.value + "px";
    });

    const rgb = hexToRgb(color.value);
    const alpha = (vals.opacity / 100).toFixed(2);
    const shadow = `${inset.checked ? "inset " : ""}${vals.x}px ${vals.y}px ${vals.blur}px ${vals.spread}px rgba(${rgb}, ${alpha})`;

    box.style.boxShadow = shadow;
    output.value = `box-shadow: ${shadow};`;
  }

  sliders.forEach((s) => s.el.addEventListener("input", update));
  inset.addEventListener("change", update);
  color.addEventListener("input", update);

  copyBtn.addEventListener("click", () => {
    if (!output.value) return;
    navigator.clipboard.writeText(output.value).then(() => {
      const orig = copyBtn.textContent;
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = orig), 1200);
    });
  });

  update();
})();
