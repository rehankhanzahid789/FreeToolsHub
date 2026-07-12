/* Text Diff Checker — LCS-based line diff */
(function () {
  const a = document.getElementById("diff-a");
  const b = document.getElementById("diff-b");
  const runBtn = document.getElementById("diff-run");
  const result = document.getElementById("diff-result");
  const addedCount = document.getElementById("diff-added-count");
  const removedCount = document.getElementById("diff-removed-count");

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function diffLines(oldLines, newLines) {
    const n = oldLines.length, m = newLines.length;
    const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        dp[i][j] = oldLines[i] === newLines[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    const ops = [];
    let i = 0, j = 0;
    while (i < n && j < m) {
      if (oldLines[i] === newLines[j]) { ops.push({ type: "same", text: oldLines[i] }); i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push({ type: "removed", text: oldLines[i] }); i++; }
      else { ops.push({ type: "added", text: newLines[j] }); j++; }
    }
    while (i < n) { ops.push({ type: "removed", text: oldLines[i] }); i++; }
    while (j < m) { ops.push({ type: "added", text: newLines[j] }); j++; }
    return ops;
  }

  function run() {
    const oldLines = a.value.replace(/\r\n/g, "\n").split("\n");
    const newLines = b.value.replace(/\r\n/g, "\n").split("\n");
    const ops = diffLines(oldLines, newLines);

    let added = 0, removed = 0;
    let html = "";
    for (const op of ops) {
      const text = escapeHtml(op.text) || "&nbsp;";
      if (op.type === "added") { added++; html += `<div class="diff-line diff-added">+ ${text}</div>`; }
      else if (op.type === "removed") { removed++; html += `<div class="diff-line diff-removed">- ${text}</div>`; }
      else { html += `<div class="diff-line diff-same">&nbsp;&nbsp;${text}</div>`; }
    }
    result.innerHTML = html || "<em>Nothing to compare yet.</em>";
    addedCount.textContent = added;
    removedCount.textContent = removed;
  }

  runBtn.addEventListener("click", run);
  a.addEventListener("input", run);
  b.addEventListener("input", run);
})();
