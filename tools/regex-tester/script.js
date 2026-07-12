/* Regex Tester — live matching + highlighting */
(function () {
  const pattern = document.getElementById("rx-pattern");
  const flags = document.getElementById("rx-flags");
  const text = document.getElementById("rx-text");
  const errorBox = document.getElementById("rx-error");
  const highlight = document.getElementById("rx-highlight");
  const matchesBox = document.getElementById("rx-matches");
  const countLabel = document.getElementById("rx-count-label");

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function update() {
    errorBox.hidden = true;
    const p = pattern.value;
    const t = text.value;
    let f = flags.value.replace(/[^gimsuy]/g, "");
    if (!f.includes("g")) f += "g"; // need global to iterate all matches

    if (!p) {
      highlight.textContent = t;
      matchesBox.textContent = "—";
      countLabel.textContent = "Matches";
      return;
    }

    let re;
    try {
      re = new RegExp(p, f);
    } catch (err) {
      errorBox.hidden = false;
      errorBox.textContent = "Invalid pattern: " + err.message;
      highlight.textContent = t;
      matchesBox.textContent = "—";
      return;
    }

    let lastIndex = 0;
    let html = "";
    let count = 0;
    let details = [];
    let m;
    let guard = 0;
    while ((m = re.exec(t)) !== null && guard < 5000) {
      guard++;
      count++;
      html += escapeHtml(t.slice(lastIndex, m.index));
      html += `<mark style="background:var(--color-primary-light);color:var(--color-primary-dark);border-radius:3px;">${escapeHtml(m[0] || "")}</mark>`;
      lastIndex = m.index + (m[0] ? m[0].length : 1);
      if (m[0] === "") re.lastIndex++;

      let groupInfo = "";
      if (m.length > 1) {
        groupInfo = " → groups: " + m.slice(1).map((g, i) => `[${i + 1}]="${g ?? ""}"`).join(", ");
      }
      details.push(`#${count} at index ${m.index}: "${m[0]}"${groupInfo}`);
    }
    html += escapeHtml(t.slice(lastIndex));

    highlight.innerHTML = html || "&nbsp;";
    countLabel.textContent = `Matches (${count})`;
    matchesBox.textContent = count ? details.join("\n") : "No matches";
  }

  [pattern, flags, text].forEach((el) => el.addEventListener("input", update));
  update();
})();
