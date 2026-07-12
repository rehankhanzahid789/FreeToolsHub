(function () {
  const input = document.getElementById("b64-input");
  const output = document.getElementById("b64-output");
  const copy = document.getElementById("b64-copy");
  const clear = document.getElementById("b64-clear");
  const modes = document.querySelectorAll('input[name="b64-mode"]');

  function getMode() { return document.querySelector('input[name="b64-mode"]:checked').value; }

  function encode(str) {
    return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
  }
  function decode(str) {
    const bin = atob(str.trim());
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  function run() {
    const v = input.value;
    if (!v) { output.value = ""; return; }
    try { output.value = getMode() === "encode" ? encode(v) : decode(v); }
    catch (e) { output.value = "Error: invalid input for decoding."; }
  }

  input.addEventListener("input", run);
  modes.forEach((m) => m.addEventListener("change", run));
  copy.addEventListener("click", async () => {
    if (!output.value) return;
    try { await navigator.clipboard.writeText(output.value); copy.textContent = "Copied!"; setTimeout(()=>copy.textContent="Copy output",1200); } catch(e){}
  });
  clear.addEventListener("click", () => { input.value = ""; output.value = ""; });
})();
