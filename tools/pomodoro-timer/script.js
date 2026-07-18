/* Pomodoro Timer */
(function () {
  const phaseEl = document.getElementById("pm-phase");
  const displayEl = document.getElementById("pm-display");
  const sessionsEl = document.getElementById("pm-sessions");
  const startBtn = document.getElementById("pm-start");
  const pauseBtn = document.getElementById("pm-pause");
  const resetBtn = document.getElementById("pm-reset");
  const skipBtn = document.getElementById("pm-skip");

  const workInput = document.getElementById("pm-work");
  const shortInput = document.getElementById("pm-short");
  const longInput = document.getElementById("pm-long");
  const cyclesInput = document.getElementById("pm-cycles");

  const PHASES = { FOCUS: "Focus", SHORT: "Short break", LONG: "Long break" };

  let phase = PHASES.FOCUS;
  let completedFocusSessions = 0;
  let remainingMs = 0;
  let deadline = 0;
  let interval = null;
  let running = false;

  function minutesFor(currentPhase) {
    if (currentPhase === PHASES.FOCUS) return parseInt(workInput.value, 10) || 25;
    if (currentPhase === PHASES.SHORT) return parseInt(shortInput.value, 10) || 5;
    return parseInt(longInput.value, 10) || 15;
  }

  function formatMs(ms) {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function updateDisplay() {
    phaseEl.textContent = phase;
    displayEl.textContent = formatMs(remainingMs);
    sessionsEl.textContent = `Session ${completedFocusSessions + 1} · ${completedFocusSessions} completed`;
  }

  function resetPhaseTime() {
    remainingMs = minutesFor(phase) * 60 * 1000;
    updateDisplay();
  }

  function playChime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = phase === PHASES.FOCUS ? 660 : 990;
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) { /* audio unsupported */ }
  }

  function advancePhase() {
    if (phase === PHASES.FOCUS) {
      completedFocusSessions++;
      const cycles = parseInt(cyclesInput.value, 10) || 4;
      phase = (completedFocusSessions % cycles === 0) ? PHASES.LONG : PHASES.SHORT;
    } else {
      phase = PHASES.FOCUS;
    }
    resetPhaseTime();
  }

  function tick() {
    remainingMs = deadline - Date.now();
    if (remainingMs <= 0) {
      clearInterval(interval);
      running = false;
      startBtn.textContent = "Start";
      pauseBtn.disabled = true;
      playChime();
      advancePhase();
      return;
    }
    updateDisplay();
  }

  startBtn.addEventListener("click", () => {
    if (running) return;
    if (remainingMs <= 0) resetPhaseTime();
    deadline = Date.now() + remainingMs;
    running = true;
    startBtn.textContent = "Running…";
    pauseBtn.disabled = false;
    interval = setInterval(tick, 250);
  });

  pauseBtn.addEventListener("click", () => {
    if (!running) return;
    clearInterval(interval);
    running = false;
    startBtn.textContent = "Resume";
    pauseBtn.disabled = true;
  });

  resetBtn.addEventListener("click", () => {
    clearInterval(interval);
    running = false;
    phase = PHASES.FOCUS;
    completedFocusSessions = 0;
    startBtn.textContent = "Start";
    pauseBtn.disabled = true;
    resetPhaseTime();
  });

  skipBtn.addEventListener("click", () => {
    clearInterval(interval);
    running = false;
    startBtn.textContent = "Start";
    pauseBtn.disabled = true;
    advancePhase();
  });

  [workInput, shortInput, longInput].forEach((el) =>
    el.addEventListener("input", () => { if (!running) resetPhaseTime(); })
  );

  resetPhaseTime();
})();
