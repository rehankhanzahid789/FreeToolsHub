/* Discount Calculator */
(function () {
  const priceInput = document.getElementById("dc-price");
  const percentInput = document.getElementById("dc-percent");
  const errorBox = document.getElementById("dc-error");
  const finalEl = document.getElementById("dc-final");
  const savedEl = document.getElementById("dc-saved");

  function fmt(n) {
    return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function update() {
    errorBox.hidden = true;
    const price = parseFloat(priceInput.value);
    const percent = parseFloat(percentInput.value);

    if (!(price >= 0) || !(percent >= 0)) {
      finalEl.textContent = "—";
      savedEl.textContent = "—";
      return;
    }
    if (percent > 100) {
      errorBox.hidden = false;
      errorBox.textContent = "Discount percentage can't be more than 100%.";
      finalEl.textContent = "—";
      savedEl.textContent = "—";
      return;
    }

    const saved = price * (percent / 100);
    const final = price - saved;

    finalEl.textContent = fmt(final);
    savedEl.textContent = fmt(saved);
  }

  priceInput.addEventListener("input", update);
  percentInput.addEventListener("input", update);
  update();
})();
