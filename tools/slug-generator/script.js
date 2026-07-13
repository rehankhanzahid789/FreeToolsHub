/* Slug Generator */
(function () {
  const input = document.getElementById("sg-input");
  const separatorSel = document.getElementById("sg-separator");
  const lowercaseChk = document.getElementById("sg-lowercase");
  const output = document.getElementById("sg-output");
  const copyBtn = document.getElementById("sg-copy");

  function slugify(str, sep, lowercase) {
    let s = str.normalize("NFKD").replace(/[\u0300-\u036f]/g, ""); // strip accents
    if (lowercase) s = s.toLowerCase();
    s = s.replace(/[^a-zA-Z0-9]+/g, sep);
    s = s.replace(new RegExp(`\\${sep}+`, "g"), sep);
    s = s.replace(new RegExp(`^\\${sep}+|\\${sep}+$`, "g"), "");
    return s;
  }

  function update() {
    output.value = slugify(input.value, separatorSel.value, lowercaseChk.checked);
  }

  input.addEventListener("input", update);
  separatorSel.addEventListener("change", update);
  lowercaseChk.addEventListener("change", update);

  copyBtn.addEventListener("click", () => {
    if (!output.value) return;
    navigator.clipboard.writeText(output.value).then(() => {
      const orig = copyBtn.textContent;
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = orig), 1200);
    });
  });
})();
