/* Stopwatch & Timer */
(function () {
  // --- Tabs ---
  const tabStopwatch = document.getElementById("sw-tab-stopwatch");
  const tabTimer = document.getElementById("sw-tab-timer");
  const panelStopwatch = document.getElementById("sw-stopwatch-panel");
  const panelTimer = document.getElementById("sw-timer-panel");

  tabStopwatch.addEventListener("click", () => {
    tabStopwatch.classList.add("active");
    tabTimer.classList.remove("active");
    panelStopwatch.hidden = false;
    panelTimer.hidden = true;
  });
  tabTimer.addEventListener("click", () => {
    tabTimer.classList.add("active");
    tabStopwatch.classList.remove("active");
    panelTimer.hidden = false;
    panelStopwatch.hidden = true;
  });

  // --- Stopwatch ---
  const display = document.getElementById("sw-display");
  const startBtn = document.getElementById("sw-start");
  const lapBtn = document.getElementById("sw-lap");
  const resetBtn = document.getElementById("sw-reset");
  const lapsEl = document.getElementById("sw-laps");

  let running = false;
  let startTime = 0;
  let elapsed = 0;
  let rafId = null;
  let lapCount = 0;

  function formatTime(ms) {
    const totalCentis = Math.floor(ms / 10);
    const centis = totalCentis % 100;
    const totalSeconds = Math.floor(ms / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);
    const pad = (n, len) => String(n).padStart(len, "0");
    return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}.${pad(centis, 2)}`;
  }

  function tick() {
    display.textContent = formatTime(elapsed + (Date.now() - startTime));
    rafId = requestAnimationFrame(tick);
  }

  startBtn.addEventListener("click", () => {
    if (!running) {
      running = true;
      startTime = Date.now();
      startBtn.textContent = "Pause";
      lapBtn.disabled = false;
      tick();
    } else {
      running = false;
      elapsed += Date.now() - startTime;
      cancelAnimationFrame(rafId);
      startBtn.textContent = "Resume";
      lapBtn.disabled = true;
    }
  });

  lapBtn.addEventListener("click", () => {
    lapCount++;
    const row = document.createElement("div");
    row.className = "sw-lap";
    const current = elapsed + (Date.now() - startTime);
    row.innerHTML = `<span>Lap ${lapCount}</span><span>${formatTime(current)}</span>`;
    lapsEl.prepend(row);
  });

  resetBtn.addEventListener("click", () => {
    running = false;
    elapsed = 0;
    lapCount = 0;
    cancelAnimationFrame(rafId);
    display.textContent = "00:00:00.00";
    startBtn.textContent = "Start";
    lapBtn.disabled = true;
    lapsEl.innerHTML = "";
  });

  // --- Timer ---
  const hInput = document.getElementById("tm-h");
  const mInput = document.getElementById("tm-m");
  const sInput = document.getElementById("tm-s");
  const tmDisplay = document.getElementById("tm-display");
  const tmStart = document.getElementById("tm-start");
  const tmPause = document.getElementById("tm-pause");
  const tmReset = document.getElementById("tm-reset");
  const tmStatus = document.getElementById("tm-status");

  let timerInterval = null;
  let remainingMs = 0;
  let timerRunning = false;

  function formatCountdown(ms) {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  function getInputMs() {
    const h = parseInt(hInput.value, 10) || 0;
    const m = parseInt(mInput.value, 10) || 0;
    const s = parseInt(sInput.value, 10) || 0;
    return (h * 3600 + m * 60 + s) * 1000;
  }

  function updateDisplayFromInputs() {
    if (!timerRunning) tmDisplay.textContent = formatCountdown(getInputMs());
  }
  [hInput, mInput, sInput].forEach((el) => el.addEventListener("input", updateDisplayFromInputs));

  function playAlarm() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 880;
        osc.connect(gain);
        gain.connect(ctx.destination);
        const t0 = ctx.currentTime + i * 0.5;
        gain.gain.setValueAtTime(0.2, t0);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.4);
        osc.start(t0);
        osc.stop(t0 + 0.4);
      }
    } catch (e) { /* audio unsupported */ }
  }

  let deadline = 0;
  function timerTick() {
    remainingMs = deadline - Date.now();
    if (remainingMs <= 0) {
      remainingMs = 0;
      tmDisplay.textContent = formatCountdown(0);
      clearInterval(timerInterval);
      timerRunning = false;
      tmStart.textContent = "Start";
      tmPause.disabled = true;
      tmStatus.textContent = "Time's up!";
      playAlarm();
      return;
    }
    tmDisplay.textContent = formatCountdown(remainingMs);
  }

  tmStart.addEventListener("click", () => {
    if (!timerRunning) {
      if (remainingMs <= 0) remainingMs = getInputMs();
      if (remainingMs <= 0) return;
      deadline = Date.now() + remainingMs;
      timerRunning = true;
      tmStatus.textContent = "";
      tmStart.textContent = "Running…";
      tmPause.disabled = false;
      timerInterval = setInterval(timerTick, 200);
    }
  });

  tmPause.addEventListener("click", () => {
    if (timerRunning) {
      clearInterval(timerInterval);
      timerRunning = false;
      tmStart.textContent = "Resume";
      tmPause.disabled = true;
    }
  });

  tmReset.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerRunning = false;
    remainingMs = 0;
    tmStart.textContent = "Start";
    tmPause.disabled = true;
    tmStatus.textContent = "";
    updateDisplayFromInputs();
  });

  updateDisplayFromInputs();
})();
