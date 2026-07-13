/* BMI Calculator */
(function () {
  const unitsSel = document.getElementById("bmi-units");
  const metricFields = document.getElementById("bmi-metric-fields");
  const imperialFields = document.getElementById("bmi-imperial-fields");
  const weightKg = document.getElementById("bmi-weight-kg");
  const heightCm = document.getElementById("bmi-height-cm");
  const weightLb = document.getElementById("bmi-weight-lb");
  const heightIn = document.getElementById("bmi-height-in");
  const errorBox = document.getElementById("bmi-error");
  const valueEl = document.getElementById("bmi-value");
  const categoryEl = document.getElementById("bmi-category");

  function category(bmi) {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
  }

  function update() {
    errorBox.hidden = true;
    let bmi = null;

    if (unitsSel.value === "metric") {
      const w = parseFloat(weightKg.value);
      const h = parseFloat(heightCm.value);
      if (w > 0 && h > 0) {
        const hM = h / 100;
        bmi = w / (hM * hM);
      }
    } else {
      const w = parseFloat(weightLb.value);
      const h = parseFloat(heightIn.value);
      if (w > 0 && h > 0) {
        bmi = (703 * w) / (h * h);
      }
    }

    if (bmi === null || !isFinite(bmi)) {
      valueEl.textContent = "—";
      categoryEl.textContent = "—";
      return;
    }
    if (bmi <= 0 || bmi > 200) {
      errorBox.hidden = false;
      errorBox.textContent = "Please enter realistic height and weight values.";
      valueEl.textContent = "—";
      categoryEl.textContent = "—";
      return;
    }

    valueEl.textContent = bmi.toFixed(1);
    categoryEl.textContent = category(bmi);
  }

  unitsSel.addEventListener("change", () => {
    const isMetric = unitsSel.value === "metric";
    metricFields.hidden = !isMetric;
    imperialFields.hidden = isMetric;
    update();
  });

  [weightKg, heightCm, weightLb, heightIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
