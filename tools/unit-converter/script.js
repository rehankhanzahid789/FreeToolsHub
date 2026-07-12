(function () {
  // Factors to base unit
  const UNITS = {
    length: { base: "m", units: {
      mm: 0.001, cm: 0.01, m: 1, km: 1000,
      in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344
    }},
    weight: { base: "g", units: {
      mg: 0.001, g: 1, kg: 1000, t: 1e6,
      oz: 28.3495, lb: 453.592
    }}
  };

  const cat = document.getElementById("uc-category");
  const fromVal = document.getElementById("uc-from-val");
  const toVal = document.getElementById("uc-to-val");
  const fromUnit = document.getElementById("uc-from-unit");
  const toUnit = document.getElementById("uc-to-unit");

  function fillUnits(list) {
    fromUnit.innerHTML = ""; toUnit.innerHTML = "";
    for (const u of list) {
      fromUnit.append(new Option(u, u));
      toUnit.append(new Option(u, u));
    }
    if (list.length > 1) toUnit.selectedIndex = 1;
  }

  function loadCategory() {
    if (cat.value === "temperature") {
      fillUnits(["C", "F", "K"]);
    } else {
      fillUnits(Object.keys(UNITS[cat.value].units));
    }
    convert();
  }

  function convert() {
    const v = parseFloat(fromVal.value);
    if (isNaN(v)) { toVal.value = ""; return; }
    if (cat.value === "temperature") {
      let c;
      switch (fromUnit.value) { case "C": c = v; break; case "F": c = (v-32)*5/9; break; case "K": c = v - 273.15; break; }
      let out;
      switch (toUnit.value) { case "C": out = c; break; case "F": out = c*9/5+32; break; case "K": out = c + 273.15; break; }
      toVal.value = +out.toFixed(6);
    } else {
      const u = UNITS[cat.value].units;
      const base = v * u[fromUnit.value];
      toVal.value = +(base / u[toUnit.value]).toFixed(8);
    }
  }

  cat.addEventListener("change", loadCategory);
  [fromVal, fromUnit, toUnit].forEach((el) => el.addEventListener("input", convert));
  loadCategory();
})();
