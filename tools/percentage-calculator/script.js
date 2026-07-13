/* Percentage Calculator — three common percentage operations */
(function () {
  function fmt(n) {
    return Number(n.toFixed(4)).toString();
  }

  // A: X% of Y
  const aX = document.getElementById("pc-a-x");
  const aY = document.getElementById("pc-a-y");
  const aResult = document.getElementById("pc-a-result");
  function updateA() {
    const x = parseFloat(aX.value), y = parseFloat(aY.value);
    if (isNaN(x) || isNaN(y)) { aResult.textContent = "Result: —"; return; }
    aResult.textContent = `Result: ${fmt((x / 100) * y)}`;
  }
  aX.addEventListener("input", updateA);
  aY.addEventListener("input", updateA);

  // B: X is what % of Y
  const bX = document.getElementById("pc-b-x");
  const bY = document.getElementById("pc-b-y");
  const bResult = document.getElementById("pc-b-result");
  function updateB() {
    const x = parseFloat(bX.value), y = parseFloat(bY.value);
    if (isNaN(x) || isNaN(y) || y === 0) { bResult.textContent = "Result: —"; return; }
    bResult.textContent = `Result: ${fmt((x / y) * 100)}%`;
  }
  bX.addEventListener("input", updateB);
  bY.addEventListener("input", updateB);

  // C: percentage change from X to Y
  const cX = document.getElementById("pc-c-x");
  const cY = document.getElementById("pc-c-y");
  const cResult = document.getElementById("pc-c-result");
  function updateC() {
    const x = parseFloat(cX.value), y = parseFloat(cY.value);
    if (isNaN(x) || isNaN(y) || x === 0) { cResult.textContent = "Result: —"; return; }
    const change = ((y - x) / Math.abs(x)) * 100;
    const sign = change >= 0 ? "increase" : "decrease";
    cResult.textContent = `Result: ${fmt(Math.abs(change))}% ${sign}`;
  }
  cX.addEventListener("input", updateC);
  cY.addEventListener("input", updateC);
})();
