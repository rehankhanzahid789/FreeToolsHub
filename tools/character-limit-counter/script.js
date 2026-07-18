/* Character Limit Counter */
(function () {
  const input = document.getElementById("cl-input");
  const container = document.getElementById("cl-platforms");

  const PLATFORMS = [
    { name: "X / Twitter post", limit: 280 },
    { name: "Instagram caption", limit: 2200 },
    { name: "Facebook post", limit: 63206 },
    { name: "YouTube title", limit: 100 },
    { name: "YouTube description", limit: 5000 },
    { name: "TikTok caption", limit: 2200 },
    { name: "LinkedIn post", limit: 3000 },
    { name: "Meta description (SEO)", limit: 160 },
    { name: "Title tag (SEO)", limit: 60 },
    { name: "SMS (single segment)", limit: 160 },
  ];

  function build() {
    container.innerHTML = PLATFORMS.map((p, i) => `
      <div class="cl-platform">
        <div style="flex:1;">
          <div class="cl-platform__name">${p.name}</div>
          <div class="cl-bar-track"><div class="cl-bar-fill" id="cl-bar-${i}"></div></div>
        </div>
        <div class="cl-platform__count" id="cl-count-${i}" style="margin-left:14px;white-space:nowrap;">0 / ${p.limit}</div>
      </div>
    `).join("");
  }

  function update() {
    const len = input.value.length;
    PLATFORMS.forEach((p, i) => {
      const bar = document.getElementById(`cl-bar-${i}`);
      const count = document.getElementById(`cl-count-${i}`);
      const pct = Math.min(100, (len / p.limit) * 100);
      const over = len > p.limit;
      bar.style.width = pct + "%";
      bar.classList.toggle("over", over);
      count.classList.toggle("over", over);
      count.textContent = `${len.toLocaleString()} / ${p.limit.toLocaleString()}${over ? "  (over by " + (len - p.limit).toLocaleString() + ")" : ""}`;
    });
  }

  build();
  input.addEventListener("input", update);
  update();
})();
