/* Random Number & Item Picker */
(function () {
  const minInput = document.getElementById("rp-min");
  const maxInput = document.getElementById("rp-max");
  const rollBtn = document.getElementById("rp-roll");
  const numberResult = document.getElementById("rp-number-result");

  function randomInt(min, max) {
    const range = max - min + 1;
    const bytes = new Uint32Array(1);
    crypto.getRandomValues(bytes);
    return min + (bytes[0] % range);
  }

  rollBtn.addEventListener("click", () => {
    let min = parseInt(minInput.value, 10);
    let max = parseInt(maxInput.value, 10);
    if (isNaN(min) || isNaN(max)) return;
    if (min > max) [min, max] = [max, min];
    numberResult.textContent = randomInt(min, max);
  });

  const listInput = document.getElementById("rp-list");
  const pickBtn = document.getElementById("rp-pick");
  const listResult = document.getElementById("rp-list-result");

  pickBtn.addEventListener("click", () => {
    const items = listInput.value.split("\n").map((s) => s.trim()).filter(Boolean);
    if (!items.length) {
      listResult.textContent = "Add at least one item first";
      return;
    }
    const idx = randomInt(0, items.length - 1);
    listResult.textContent = items[idx];
  });
})();
