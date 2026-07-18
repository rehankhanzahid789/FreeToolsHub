/* Tip Calculator */
(function () {
  const bill = document.getElementById("tip-bill");
  const percent = document.getElementById("tip-percent");
  const percentVal = document.getElementById("tip-percent-val");
  const people = document.getElementById("tip-people");
  const amountEl = document.getElementById("tip-amount");
  const totalEl = document.getElementById("tip-total");
  const perPersonEl = document.getElementById("tip-per-person");
  const presetBtns = document.querySelectorAll("[data-tip]");

  function fmt(n) {
    return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function update() {
    percentVal.textContent = percent.value + "%";
    const b = parseFloat(bill.value);
    const p = parseFloat(percent.value);
    let n = parseInt(people.value, 10);
    if (!n || n < 1) n = 1;

    if (!(b >= 0)) {
      amountEl.textContent = "—";
      totalEl.textContent = "—";
      perPersonEl.textContent = "—";
      return;
    }

    const tip = b * (p / 100);
    const total = b + tip;
    const perPerson = total / n;

    amountEl.textContent = fmt(tip);
    totalEl.textContent = fmt(total);
    perPersonEl.textContent = fmt(perPerson);
  }

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      percent.value = btn.getAttribute("data-tip");
      update();
    });
  });

  [bill, percent, people].forEach((el) => el.addEventListener("input", update));
  update();
})();
