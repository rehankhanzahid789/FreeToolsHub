(function () {
  const input = document.getElementById("wc-input");
  const words = document.getElementById("wc-words");
  const chars = document.getElementById("wc-chars");
  const charsNs = document.getElementById("wc-chars-ns");
  const sent = document.getElementById("wc-sent");
  const read = document.getElementById("wc-read");

  function update() {
    const t = input.value;
    const w = t.trim() ? t.trim().split(/\s+/).length : 0;
    chars.textContent = t.length;
    charsNs.textContent = t.replace(/\s/g, "").length;
    words.textContent = w;
    sent.textContent = t.trim() ? (t.match(/[^.!?\n]+[.!?]+(\s|$)|[^.!?\n]+$/g) || []).length : 0;
    const minutes = w / 220;
    read.textContent = minutes < 1 ? "<1m" : Math.round(minutes) + "m";
  }
  input.addEventListener("input", update);
  update();
})();
