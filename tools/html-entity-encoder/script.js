/* HTML Entity Encoder / Decoder */
(function () {
  const input = document.getElementById("he-input");
  const output = document.getElementById("he-output");
  const encodeBtn = document.getElementById("he-encode");
  const decodeBtn = document.getElementById("he-decode");
  const copyBtn = document.getElementById("he-copy");

  const namedEntities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  function encode(str) {
    return str.replace(/[&<>"']/g, (c) => namedEntities[c]);
  }

  function decode(str) {
    const el = document.createElement("textarea");
    el.innerHTML = str;
    return el.value;
  }

  encodeBtn.addEventListener("click", () => {
    output.value = encode(input.value);
  });

  decodeBtn.addEventListener("click", () => {
    output.value = decode(input.value);
  });

  copyBtn.addEventListener("click", () => {
    if (!output.value) return;
    navigator.clipboard.writeText(output.value).then(() => {
      const orig = copyBtn.textContent;
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = orig), 1200);
    });
  });
})();
