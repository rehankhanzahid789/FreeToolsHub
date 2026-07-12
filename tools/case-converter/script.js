(function () {
  const input = document.getElementById("cc-input");
  const output = document.getElementById("cc-output");
  const copy = document.getElementById("cc-copy");

  function words(t) {
    return t
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/[_\-]+/g, " ")
      .split(/\s+/)
      .filter(Boolean);
  }

  const CASES = {
    upper: (t) => t.toUpperCase(),
    lower: (t) => t.toLowerCase(),
    title: (t) => t.toLowerCase().replace(/\b([a-z])/g, (m) => m.toUpperCase()),
    sentence: (t) => {
      const lower = t.toLowerCase();
      return lower.replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (m) => m.toUpperCase());
    },
    camel: (t) => {
      const w = words(t).map((s) => s.toLowerCase());
      return w.map((s, i) => (i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1))).join("");
    },
    pascal: (t) => words(t).map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(""),
    snake: (t) => words(t).map((s) => s.toLowerCase()).join("_"),
    kebab: (t) => words(t).map((s) => s.toLowerCase()).join("-"),
  };

  document.querySelectorAll("[data-case]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const fn = CASES[btn.dataset.case];
      output.value = fn ? fn(input.value) : input.value;
    });
  });

  copy.addEventListener("click", async () => {
    if (!output.value) return;
    try { await navigator.clipboard.writeText(output.value); copy.textContent = "Copied!"; setTimeout(()=>copy.textContent="Copy result",1200); } catch(e){}
  });
})();
