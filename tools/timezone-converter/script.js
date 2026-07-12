(function () {
  const COMMON_TZ = [
    "UTC","America/New_York","America/Chicago","America/Denver","America/Los_Angeles",
    "America/Sao_Paulo","Europe/London","Europe/Paris","Europe/Berlin","Europe/Moscow",
    "Africa/Cairo","Africa/Johannesburg","Asia/Dubai","Asia/Kolkata","Asia/Bangkok",
    "Asia/Shanghai","Asia/Tokyo","Asia/Singapore","Australia/Sydney","Pacific/Auckland"
  ];
  const zones = (typeof Intl.supportedValuesOf === "function") ? Intl.supportedValuesOf("timeZone") : COMMON_TZ.slice();
  if (!zones.includes("UTC")) zones.unshift("UTC");

  const dateEl = document.getElementById("tz-date");
  const source = document.getElementById("tz-source");
  const add = document.getElementById("tz-add");
  const addBtn = document.getElementById("tz-add-btn");
  const list = document.getElementById("tz-list");

  for (const z of zones) {
    source.append(new Option(z, z));
    add.append(new Option(z, z));
  }
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  source.value = zones.includes(localTz) ? localTz : "UTC";

  function nowLocalInput() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  dateEl.value = nowLocalInput();

  // Get the UTC instant for a wall-clock time in a given timezone.
  function zonedTimeToUTC(input, tz) {
    // input: "YYYY-MM-DDTHH:MM"
    const [datePart, timePart] = input.split("T");
    const [y, mo, d] = datePart.split("-").map(Number);
    const [h, mi] = timePart.split(":").map(Number);
    // Guess UTC = as-if-UTC, then correct by tz offset at that instant
    const asUTC = Date.UTC(y, mo - 1, d, h, mi);
    const tzDate = new Date(asUTC);
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
    });
    const parts = Object.fromEntries(fmt.formatToParts(tzDate).filter(p=>p.type!=="literal").map(p=>[p.type,p.value]));
    const tzAsUTC = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour % 24, +parts.minute, +parts.second);
    const offset = tzAsUTC - asUTC;
    return asUTC - offset;
  }

  function formatInTZ(utcMs, tz) {
    return new Intl.DateTimeFormat(undefined, {
      timeZone: tz, weekday: "short", year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: false, timeZoneName: "short"
    }).format(new Date(utcMs));
  }

  let selected = [localTz && zones.includes(localTz) ? localTz : "UTC", "UTC", "Europe/London", "Asia/Tokyo"]
    .filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

  function render() {
    if (!dateEl.value) return;
    const utc = zonedTimeToUTC(dateEl.value, source.value);
    list.innerHTML = "";
    for (const tz of selected) {
      const row = document.createElement("div");
      row.className = "tz-row";
      row.innerHTML = `
        <div>
          <div style="font-weight:600;color:var(--color-primary-dark);">${tz}</div>
          <div class="tz-row__time">${formatInTZ(utc, tz)}</div>
        </div>
        <button class="btn btn-outline" data-remove="${tz}">Remove</button>
      `;
      list.appendChild(row);
    }
    list.querySelectorAll("[data-remove]").forEach((b) => {
      b.addEventListener("click", () => {
        selected = selected.filter((x) => x !== b.dataset.remove);
        render();
      });
    });
  }

  addBtn.addEventListener("click", () => {
    if (add.value && !selected.includes(add.value)) selected.push(add.value);
    render();
  });
  [dateEl, source].forEach((el) => el.addEventListener("input", render));
  render();
})();
