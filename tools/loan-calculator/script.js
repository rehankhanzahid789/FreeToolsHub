/* Loan / EMI Calculator — standard amortization formula */
(function () {
  const principalInput = document.getElementById("lc-principal");
  const rateInput = document.getElementById("lc-rate");
  const termInput = document.getElementById("lc-term");
  const termUnitSel = document.getElementById("lc-term-unit");
  const errorBox = document.getElementById("lc-error");
  const paymentEl = document.getElementById("lc-payment");
  const totalInterestEl = document.getElementById("lc-total-interest");
  const totalPaidEl = document.getElementById("lc-total-paid");

  function fmt(n) {
    return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function update() {
    errorBox.hidden = true;
    const principal = parseFloat(principalInput.value);
    const annualRate = parseFloat(rateInput.value);
    const term = parseFloat(termInput.value);

    if (!(principal > 0) || !(term > 0) || isNaN(annualRate) || annualRate < 0) {
      paymentEl.textContent = "—";
      totalInterestEl.textContent = "—";
      totalPaidEl.textContent = "—";
      return;
    }

    const months = termUnitSel.value === "years" ? term * 12 : term;
    const monthlyRate = annualRate / 100 / 12;

    let payment;
    if (monthlyRate === 0) {
      payment = principal / months;
    } else {
      const factor = Math.pow(1 + monthlyRate, months);
      payment = (principal * monthlyRate * factor) / (factor - 1);
    }

    if (!isFinite(payment)) {
      errorBox.hidden = false;
      errorBox.textContent = "Please check your inputs — the numbers entered don't produce a valid result.";
      paymentEl.textContent = "—";
      totalInterestEl.textContent = "—";
      totalPaidEl.textContent = "—";
      return;
    }

    const totalPaid = payment * months;
    const totalInterest = totalPaid - principal;

    paymentEl.textContent = fmt(payment);
    totalInterestEl.textContent = fmt(totalInterest);
    totalPaidEl.textContent = fmt(totalPaid);
  }

  [principalInput, rateInput, termInput].forEach((el) => el.addEventListener("input", update));
  termUnitSel.addEventListener("change", update);
  update();
})();
