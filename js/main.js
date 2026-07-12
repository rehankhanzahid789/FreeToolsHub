/* Homepage — renders tool cards from tools.json */
(async function () {
  const grid = document.getElementById("tools-grid");
  const search = document.getElementById("tool-search");
  const empty = document.getElementById("empty-state");
  if (!grid) return;

  let tools = [];
  try {
    const res = await fetch("js/tools.json", { cache: "no-cache" });
    tools = await res.json();
  } catch (err) {
    grid.innerHTML = '<p class="empty-state">Could not load tools list.</p>';
    console.error(err);
    return;
  }

  function iconFallback() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 12h8M12 8v8"/></svg>';
  }

  function render(list) {
    grid.innerHTML = "";
    if (!list.length) {
      empty.hidden = false;
      return;
    }
    empty.hidden = true;
    for (const t of list) {
      const a = document.createElement("a");
      a.className = "tool-card";
      a.href = t.folder;
      a.innerHTML = `
        <div class="tool-card__icon" aria-hidden="true">${iconFallback()}</div>
        <h3 class="tool-card__title">${t.name}</h3>
        <p class="tool-card__desc">${t.description}</p>
        <span class="tool-card__cta">Open tool →</span>
      `;
      // Try loading a real icon if present
      if (t.icon) {
        fetch("assets/icons/" + t.icon)
          .then((r) => (r.ok ? r.text() : null))
          .then((svg) => {
            if (svg && svg.trim().startsWith("<svg")) {
              const iconEl = a.querySelector(".tool-card__icon");
              if (iconEl) iconEl.innerHTML = svg;
            }
          })
          .catch(() => {});
      }
      grid.appendChild(a);
    }
  }

  render(tools);

  if (search) {
    search.addEventListener("input", () => {
      const q = search.value.trim().toLowerCase();
      const filtered = tools.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.slug.toLowerCase().includes(q)
      );
      render(filtered);
    });
  }
})();
