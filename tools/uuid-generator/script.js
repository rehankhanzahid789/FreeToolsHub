/* UUID v4 Generator */
(function () {
  const countInput = document.getElementById("uuid-count");
  const caseSel = document.getElementById("uuid-case");
  const hyphensChk = document.getElementById("uuid-hyphens");
  const generateBtn = document.getElementById("uuid-generate");
  const copyBtn = document.getElementById("uuid-copy");
  const output = document.getElementById("uuid-output");

  function uuidv4() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0"));
    return `${hex.slice(0,4).join("")}-${hex.slice(4,6).join("")}-${hex.slice(6,8).join("")}-${hex.slice(8,10).join("")}-${hex.slice(10,16).join("")}`;
  }

  function generate() {
    let count = parseInt(countInput.value, 10);
    if (!count || count < 1) count = 1;
    if (count > 200) count = 200;

    const lines = [];
    for (let i = 0; i < count; i++) {
      let id = uuidv4();
      if (!hyphensChk.checked) id = id.replace(/-/g, "");
      if (caseSel.value === "upper") id = id.toUpperCase();
      lines.push(id);
    }
    output.value = lines.join("\n");
  }

  generateBtn.addEventListener("click", generate);
  copyBtn.addEventListener("click", () => {
    if (!output.value) return;
    navigator.clipboard.writeText(output.value).then(() => {
      const orig = copyBtn.textContent;
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = orig), 1200);
    });
  });

  generate();
})();
