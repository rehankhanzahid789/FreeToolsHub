/* CSV to JSON Converter */
(function () {
  const input = document.getElementById("cj-input");
  const output = document.getElementById("cj-output");
  const delimiterSel = document.getElementById("cj-delimiter");
  const errorBox = document.getElementById("cj-error");
  const convertBtn = document.getElementById("cj-convert");
  const copyBtn = document.getElementById("cj-copy");
  const downloadBtn = document.getElementById("cj-download");

  function parseCSV(text, delimiter) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;
    let i = 0;
    const s = text.replace(/\r\n/g, "\n");

    while (i < s.length) {
      const c = s[i];
      if (inQuotes) {
        if (c === '"') {
          if (s[i + 1] === '"') { field += '"'; i += 2; continue; }
          inQuotes = false; i++; continue;
        }
        field += c; i++; continue;
      }
      if (c === '"') { inQuotes = true; i++; continue; }
      if (c === delimiter) { row.push(field); field = ""; i++; continue; }
      if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
      field += c; i++;
    }
    row.push(field);
    rows.push(row);
    return rows.filter((r) => !(r.length === 1 && r[0] === ""));
  }

  function convert() {
    errorBox.hidden = true;
    const text = input.value;
    if (!text.trim()) {
      output.value = "";
      return;
    }
    const delim = delimiterSel.value === "\\t" ? "\t" : delimiterSel.value;

    try {
      const rows = parseCSV(text, delim);
      if (rows.length < 1) throw new Error("No data found.");
      const headers = rows[0].map((h) => h.trim());
      const data = rows.slice(1).map((r) => {
        const obj = {};
        headers.forEach((h, idx) => { obj[h] = r[idx] !== undefined ? r[idx] : ""; });
        return obj;
      });
      output.value = JSON.stringify(data, null, 2);
    } catch (err) {
      errorBox.hidden = false;
      errorBox.textContent = "Could not parse CSV: " + err.message;
      output.value = "";
    }
  }

  convertBtn.addEventListener("click", convert);
  input.addEventListener("input", convert);
  delimiterSel.addEventListener("change", convert);

  copyBtn.addEventListener("click", () => {
    if (!output.value) return;
    navigator.clipboard.writeText(output.value).then(() => {
      const orig = copyBtn.textContent;
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = orig), 1200);
    });
  });

  downloadBtn.addEventListener("click", () => {
    if (!output.value) return;
    const blob = new Blob([output.value], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  });
})();
