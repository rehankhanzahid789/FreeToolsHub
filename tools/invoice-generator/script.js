/* Invoice Generator */
(function () {
  const fromEl = document.getElementById("inv-from");
  const toEl = document.getElementById("inv-to");
  const numberEl = document.getElementById("inv-number");
  const dateEl = document.getElementById("inv-date");
  const dueEl = document.getElementById("inv-due");
  const currencyEl = document.getElementById("inv-currency");
  const taxEl = document.getElementById("inv-tax");
  const discountEl = document.getElementById("inv-discount");
  const notesEl = document.getElementById("inv-notes");
  const itemsBody = document.getElementById("inv-items-body");
  const addItemBtn = document.getElementById("inv-add-item");
  const printBtn = document.getElementById("inv-print");

  let itemId = 0;

  function addRow(desc, qty, price) {
    itemId++;
    const tr = document.createElement("tr");
    tr.dataset.id = itemId;
    tr.innerHTML = `
      <td><input type="text" class="inv-desc" value="${desc || ""}" placeholder="Item or service" /></td>
      <td><input type="number" class="inv-qty" min="0" step="1" value="${qty ?? 1}" style="width:70px;" /></td>
      <td><input type="number" class="inv-price" min="0" step="0.01" value="${price ?? 0}" style="width:100px;" /></td>
      <td><button type="button" class="inv-remove-row" aria-label="Remove line item">✕</button></td>
    `;
    itemsBody.appendChild(tr);
    tr.querySelectorAll("input").forEach((inp) => inp.addEventListener("input", update));
    tr.querySelector(".inv-remove-row").addEventListener("click", () => {
      tr.remove();
      update();
    });
  }

  addItemBtn.addEventListener("click", () => { addRow("", 1, 0); update(); });

  function fmtMoney(n, symbol) {
    return symbol + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function fmtDate(str) {
    if (!str) return "—";
    const d = new Date(str + "T00:00:00");
    if (isNaN(d)) return "—";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  function update() {
    const symbol = currencyEl.value;
    document.getElementById("inv-p-number").textContent = "#" + (numberEl.value || "—");
    document.getElementById("inv-p-date").textContent = fmtDate(dateEl.value);
    document.getElementById("inv-p-due").textContent = fmtDate(dueEl.value);
    document.getElementById("inv-p-from").textContent = fromEl.value || "—";
    document.getElementById("inv-p-to").textContent = toEl.value || "—";
    document.getElementById("inv-p-notes").textContent = notesEl.value || "";

    const rows = Array.from(itemsBody.querySelectorAll("tr"));
    let subtotal = 0;
    const previewBody = document.getElementById("inv-p-items");
    previewBody.innerHTML = "";

    rows.forEach((tr) => {
      const desc = tr.querySelector(".inv-desc").value || "Untitled item";
      const qty = parseFloat(tr.querySelector(".inv-qty").value) || 0;
      const price = parseFloat(tr.querySelector(".inv-price").value) || 0;
      const amount = qty * price;
      subtotal += amount;

      const row = document.createElement("tr");
      row.innerHTML = `<td>${escapeHtml(desc)}</td><td class="num">${qty}</td><td class="num">${fmtMoney(price, symbol)}</td><td class="num">${fmtMoney(amount, symbol)}</td>`;
      previewBody.appendChild(row);
    });

    const discountPct = parseFloat(discountEl.value) || 0;
    const taxPct = parseFloat(taxEl.value) || 0;
    const discountAmt = subtotal * (discountPct / 100);
    const taxable = subtotal - discountAmt;
    const taxAmt = taxable * (taxPct / 100);
    const total = taxable + taxAmt;

    document.getElementById("inv-p-subtotal").textContent = fmtMoney(subtotal, symbol);
    document.getElementById("inv-p-discount").textContent = "-" + fmtMoney(discountAmt, symbol);
    document.getElementById("inv-p-discount-row").style.display = discountPct > 0 ? "flex" : "none";
    document.getElementById("inv-p-tax").textContent = fmtMoney(taxAmt, symbol);
    document.getElementById("inv-p-tax-row").style.display = taxPct > 0 ? "flex" : "none";
    document.getElementById("inv-p-total").textContent = fmtMoney(total, symbol);
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  printBtn.addEventListener("click", () => window.print());

  [fromEl, toEl, numberEl, dateEl, dueEl, currencyEl, taxEl, discountEl, notesEl].forEach((el) =>
    el.addEventListener("input", update)
  );
  currencyEl.addEventListener("change", update);

  // seed defaults
  const today = new Date();
  const in14 = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  dateEl.value = today.toISOString().slice(0, 10);
  dueEl.value = in14.toISOString().slice(0, 10);
  addRow("Website design", 1, 500);
  addRow("Hosting (monthly)", 1, 15);
  update();
})();
