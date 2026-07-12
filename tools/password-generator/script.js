(function () {
  const out = document.getElementById("pw-out");
  const copy = document.getElementById("pw-copy");
  const bar = document.getElementById("pw-bar");
  const label = document.getElementById("pw-strength");
  const length = document.getElementById("pw-length");
  const lengthVal = document.getElementById("pw-length-val");
  const upper = document.getElementById("pw-upper");
  const lower = document.getElementById("pw-lower");
  const num = document.getElementById("pw-num");
  const sym = document.getElementById("pw-sym");
  const gen = document.getElementById("pw-gen");

  const U = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const L = "abcdefghijklmnopqrstuvwxyz";
  const N = "0123456789";
  const S = "!@#$%^&*()-_=+[]{};:,.<>/?";

  function randChar(str) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return str[arr[0] % str.length];
  }

  function generate() {
    let pool = "";
    const required = [];
    if (upper.checked) { pool += U; required.push(U); }
    if (lower.checked) { pool += L; required.push(L); }
    if (num.checked)   { pool += N; required.push(N); }
    if (sym.checked)   { pool += S; required.push(S); }
    if (!pool) { out.value = ""; updateStrength(""); return; }
    const len = Math.max(required.length, parseInt(length.value, 10));
    let chars = required.map(randChar);
    while (chars.length < len) chars.push(randChar(pool));
    // shuffle
    for (let i = chars.length - 1; i > 0; i--) {
      const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    out.value = chars.join("");
    updateStrength(out.value);
  }

  function updateStrength(pw) {
    let pool = 0;
    if (/[a-z]/.test(pw)) pool += 26;
    if (/[A-Z]/.test(pw)) pool += 26;
    if (/[0-9]/.test(pw)) pool += 10;
    if (/[^A-Za-z0-9]/.test(pw)) pool += 26;
    const entropy = pw.length * Math.log2(pool || 1);
    let level = 0, name = "—", color = "#C0392B";
    if (!pw) { name = "—"; }
    else if (entropy < 40) { level = 25; name = "Weak"; color = "#C0392B"; }
    else if (entropy < 60) { level = 50; name = "Medium"; color = "#E67E22"; }
    else if (entropy < 80) { level = 75; name = "Strong"; color = "#2E8B57"; }
    else { level = 100; name = "Very strong"; color = "#1E7043"; }
    bar.style.width = level + "%";
    bar.style.background = color;
    label.textContent = "Strength: " + name + (pw ? " (~" + Math.round(entropy) + " bits)" : "");
  }

  length.addEventListener("input", () => { lengthVal.textContent = length.value; generate(); });
  [upper, lower, num, sym].forEach((el) => el.addEventListener("change", generate));
  gen.addEventListener("click", generate);
  copy.addEventListener("click", async () => {
    if (!out.value) return;
    try { await navigator.clipboard.writeText(out.value); copy.textContent = "Copied!"; setTimeout(()=>copy.textContent="Copy",1200); } catch (e) {}
  });

  generate();
})();
