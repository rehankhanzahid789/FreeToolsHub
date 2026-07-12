/* Markdown Previewer — minimal, dependency-free Markdown → HTML */
(function () {
  const input = document.getElementById("md-input");
  const preview = document.getElementById("md-preview");

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function inline(text) {
    let s = escapeHtml(text);
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/__([^_]+)__/g, "<strong>$1</strong>");
    s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    s = s.replace(/(?<!_)_([^_]+)_(?!_)/g, "<em>$1</em>");
    s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">');
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    return s;
  }

  function render(md) {
    const lines = md.replace(/\r\n/g, "\n").split("\n");
    let html = "";
    let i = 0;
    let inUl = false, inOl = false, inCode = false, codeLang = "";
    let codeBuf = [];
    let paraBuf = [];

    function flushPara() {
      if (paraBuf.length) {
        html += `<p>${inline(paraBuf.join(" "))}</p>`;
        paraBuf = [];
      }
    }
    function closeLists() {
      if (inUl) { html += "</ul>"; inUl = false; }
      if (inOl) { html += "</ol>"; inOl = false; }
    }

    while (i < lines.length) {
      const line = lines[i];

      if (/^```/.test(line)) {
        if (!inCode) {
          flushPara(); closeLists();
          inCode = true;
          codeLang = line.replace(/^```/, "").trim();
          codeBuf = [];
        } else {
          html += `<pre><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`;
          inCode = false;
        }
        i++; continue;
      }
      if (inCode) { codeBuf.push(line); i++; continue; }

      if (/^\s*$/.test(line)) { flushPara(); closeLists(); i++; continue; }

      const h = line.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        flushPara(); closeLists();
        const level = h[1].length;
        html += `<h${level}>${inline(h[2])}</h${level}>`;
        i++; continue;
      }

      if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
        flushPara(); closeLists();
        html += "<hr>";
        i++; continue;
      }

      const bq = line.match(/^>\s?(.*)$/);
      if (bq) {
        flushPara(); closeLists();
        let bqLines = [bq[1]];
        i++;
        while (i < lines.length && /^>\s?/.test(lines[i])) {
          bqLines.push(lines[i].replace(/^>\s?/, ""));
          i++;
        }
        html += `<blockquote><p>${inline(bqLines.join(" "))}</p></blockquote>`;
        continue;
      }

      const ul = line.match(/^\s*[-*+]\s+(.*)$/);
      if (ul) {
        flushPara();
        if (inOl) { html += "</ol>"; inOl = false; }
        if (!inUl) { html += "<ul>"; inUl = true; }
        html += `<li>${inline(ul[1])}</li>`;
        i++; continue;
      }

      const ol = line.match(/^\s*\d+\.\s+(.*)$/);
      if (ol) {
        flushPara();
        if (inUl) { html += "</ul>"; inUl = false; }
        if (!inOl) { html += "<ol>"; inOl = true; }
        html += `<li>${inline(ol[1])}</li>`;
        i++; continue;
      }

      closeLists();
      paraBuf.push(line.trim());
      i++;
    }
    flushPara();
    closeLists();
    if (inCode) html += `<pre><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`;
    return html;
  }

  function update() {
    preview.innerHTML = render(input.value);
  }

  input.addEventListener("input", update);
  update();
})();
