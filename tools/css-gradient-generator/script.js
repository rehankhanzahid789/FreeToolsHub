/* CSS Gradient Generator */
(function () {
  const typeSel = document.getElementById("cg-type");
  const angleField = document.getElementById("cg-angle-field");
  const angle = document.getElementById("cg-angle");
  const angleVal = document.getElementById("cg-angle-val");
  const color1 = document.getElementById("cg-color1");
  const color2 = document.getElementById("cg-color2");
  const preview = document.getElementById("cg-preview");
  const output = document.getElementById("cg-output");
  const copyBtn = document.getElementById("cg-copy");

  function update() {
    angleVal.textContent = angle.value + "°";
    let css;
    if (typeSel.value === "linear") {
      angleField.hidden = false;
      css = `linear-gradient(${angle.value}deg, ${color1.value}, ${color2.value})`;
    } else {
      angleField.hidden = true;
      css = `radial-gradient(circle, ${color1.value}, ${color2.value})`;
    }
    preview.style.background = css;
    output.value = `background: ${css};`;
  }

  [typeSel, angle, color1, color2].forEach((el) => el.addEventListener("input", update));
  typeSel.addEventListener("change", update);

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
