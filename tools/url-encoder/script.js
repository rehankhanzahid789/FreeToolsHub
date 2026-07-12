/* URL Encoder / Decoder */
(function () {
  const input = document.getElementById("url-input");
  const output = document.getElementById("url-output");
  const component = document.getElementById("url-component");
  const errorBox = document.getElementById("url-error");
  const encodeBtn = document.getElementById("url-encode");
  const decodeBtn = document.getElementById("url-decode");
  const copyBtn = document.getElementById("url-copy");

  function showError(msg) {
    errorBox.hidden = false;
    errorBox.textContent = msg;
  }
  function clearError() {
    errorBox.hidden = true;
  }

  encodeBtn.addEventListener("click", () => {
    clearError();
    try {
      output.value = component.checked
        ? encodeURIComponent(input.value)
        : encodeURI(input.value);
    } catch (err) {
      showError("Could not encode: " + err.message);
    }
  });

  decodeBtn.addEventListener("click", () => {
    clearError();
    try {
      output.value = component.checked
        ? decodeURIComponent(input.value)
        : decodeURI(input.value);
    } catch (err) {
      showError("Could not decode — this doesn't look like valid percent-encoded text.");
    }
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
