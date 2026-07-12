/* Age Calculator */
(function () {
  const dobInput = document.getElementById("age-dob");
  const asOfInput = document.getElementById("age-asof");
  const errorBox = document.getElementById("age-error");
  const yearsEl = document.getElementById("age-years");
  const monthsEl = document.getElementById("age-months");
  const daysEl = document.getElementById("age-days");
  const totalDaysEl = document.getElementById("age-total-days");
  const nextEl = document.getElementById("age-next");

  const today = new Date();
  asOfInput.value = today.toISOString().slice(0, 10);

  function calc() {
    errorBox.hidden = true;
    const dobVal = dobInput.value;
    const asOfVal = asOfInput.value;
    if (!dobVal || !asOfVal) {
      [yearsEl, monthsEl, daysEl, totalDaysEl, nextEl].forEach((el) => (el.textContent = "—"));
      return;
    }

    const dob = new Date(dobVal + "T00:00:00");
    const asOf = new Date(asOfVal + "T00:00:00");

    if (dob > asOf) {
      errorBox.hidden = false;
      errorBox.textContent = "Date of birth must be before the 'as of' date.";
      [yearsEl, monthsEl, daysEl, totalDaysEl, nextEl].forEach((el) => (el.textContent = "—"));
      return;
    }

    let years = asOf.getFullYear() - dob.getFullYear();
    let months = asOf.getMonth() - dob.getMonth();
    let days = asOf.getDate() - dob.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const msPerDay = 24 * 60 * 60 * 1000;
    const totalDays = Math.floor((asOf - dob) / msPerDay);

    let nextBday = new Date(asOf.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBday < asOf || (nextBday.getTime() === asOf.getTime() && false)) {
      nextBday = new Date(asOf.getFullYear() + 1, dob.getMonth(), dob.getDate());
    }
    const daysToNext = Math.round((nextBday - asOf) / msPerDay);

    yearsEl.textContent = years;
    monthsEl.textContent = months;
    daysEl.textContent = days;
    totalDaysEl.textContent = totalDays.toLocaleString();
    nextEl.textContent = daysToNext === 0 ? "Today! 🎉" : daysToNext;
  }

  dobInput.addEventListener("input", calc);
  asOfInput.addEventListener("input", calc);
  calc();
})();
