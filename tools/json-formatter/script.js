(function () {
  const input = document.getElementById("json-input");
  const output = document.getElementById("json-output");
  const indent = document.getElementById("json-indent");
  const status = document.getElementById("json-status");
  const fmt = document.getElementById("json-format");
  const min = document.getElementById("json-minify");
  const copy = document.getElementById("json-copy");

  function setError(msg) {
    status.innerHTML = '<div class="error-box">' + msg + "</div>";
  }
  function setOk(msg) {
    status.innerHTML = '<div class="result-box" style="background:#EAF6EE;border-color:#B8E0C6;color:#1E7043;">✓ ' + msg + "</div>";
  }

  function parse() {
    try {
      return { ok: true, value: JSON.parse(input.value) };
    } catch (e) {
      const m = /position (\d+)/.exec(e.message);
      let extra = "";
      if (m) {
        const pos = +m[1];
        const before = input.value.slice(0, pos);
        const line = before.split("\n").length;
        const col = before.length - before.lastIndexOf("\n");
        extra = ` (line ${line}, column ${col})`;
      }
      return { ok: false, error: e.message + extra };
    }
  }

  function format() {
    if (!input.value.trim()) { output.value = ""; status.innerHTML = ""; return; }
    const r = parse();
    if (!r.ok) { output.value = ""; setError(r.error); return; }
    const ind = indent.value === "\\t" ? "\t" : parseInt(indent.value, 10);
    output.value = JSON.stringify(r.value, null, ind);
    setOk("Valid JSON");
  }
  function minify() {
    if (!input.value.trim()) { output.value = ""; status.innerHTML = ""; return; }
    const r = parse();
    if (!r.ok) { output.value = ""; setError(r.error); return; }
    output.value = JSON.stringify(r.value);
    setOk("Valid JSON (minified)");
  }

  fmt.addEventListener("click", format);
  min.addEventListener("click", minify);
  input.addEventListener("input", format);
  copy.addEventListener("click", async () => {
    if (!output.value) return;
    try { await navigator.clipboard.writeText(output.value); copy.textContent = "Copied!"; setTimeout(()=>copy.textContent="Copy result",1200); } catch(e){}
  });
})();
