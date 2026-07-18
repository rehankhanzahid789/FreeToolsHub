/* Aspect Ratio Calculator */
(function () {
  const origW = document.getElementById("ar-orig-w");
  const origH = document.getElementById("ar-orig-h");
  const newW = document.getElementById("ar-new-w");
  const newH = document.getElementById("ar-new-h");
  const result = document.getElementById("ar-result");
  const ratioBtns = document.querySelectorAll("[data-ratio]");

  function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

  let lastEdited = null;
  [newW, newH].forEach((el) => el.addEventListener("focus", () => (lastEdited = el)));

  function update() {
    const ow = parseFloat(origW.value);
    const oh = parseFloat(origH.value);

    if (!(ow > 0) || !(oh > 0)) {
      result.textContent = "Enter an original size and one new dimension.";
      return;
    }

    const ratio = ow / oh;
    const g = gcd(Math.round(ow), Math.round(oh));
    const ratioLabel = g ? `${Math.round(ow / g)}:${Math.round(oh / g)}` : "";

    const nwVal = parseFloat(newW.value);
    const nhVal = parseFloat(newH.value);

    if (lastEdited === newH && nhVal > 0) {
      const calcW = nhVal * ratio;
      newW.value = calcW.toFixed(2).replace(/\.00$/, "");
      result.textContent = `Ratio ${ratioLabel} — width should be ${calcW.toFixed(2)}px`;
    } else if (nwVal > 0) {
      const calcH = nwVal / ratio;
      newH.value = calcH.toFixed(2).replace(/\.00$/, "");
      result.textContent = `Ratio ${ratioLabel} — height should be ${calcH.toFixed(2)}px`;
    } else {
      result.textContent = `Ratio: ${ratioLabel} (${ratio.toFixed(4)})`;
    }
  }

  [origW, origH, newW, newH].forEach((el) => el.addEventListener("input", update));

  ratioBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const [w, h] = btn.getAttribute("data-ratio").split(":").map(Number);
      origW.value = 1000;
      origH.value = Math.round((1000 * h) / w);
      newW.value = "";
      newH.value = "";
      update();
    });
  });

  update();
})();
