(function () {
  const file = document.getElementById("qr-file");
  const startBtn = document.getElementById("qr-cam-start");
  const stopBtn = document.getElementById("qr-cam-stop");
  const video = document.getElementById("qr-video");
  const canvas = document.getElementById("qr-canvas");
  const ctx = canvas.getContext("2d");
  const resultWrap = document.getElementById("qr-result-wrap");
  const result = document.getElementById("qr-result");
  const copyBtn = document.getElementById("qr-copy");
  const status = document.getElementById("qr-status");

  let stream = null;
  let rafId = null;

  function showResult(text) {
    resultWrap.style.display = "block";
    result.value = text;
    status.textContent = "QR decoded successfully.";
  }

  copyBtn.addEventListener("click", async () => {
    if (!result.value) return;
    try { await navigator.clipboard.writeText(result.value); copyBtn.textContent = "Copied!"; setTimeout(()=>copyBtn.textContent="Copy",1200);} catch(e){}
  });

  file.addEventListener("change", () => {
    const f = file.files && file.files[0];
    if (!f) return;
    if (typeof jsQR === "undefined") {
      status.textContent = "The QR scanner library hasn't finished loading yet. Please wait a second and try again, or check your internet connection / ad blocker.";
      return;
    }
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width; canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(data.data, data.width, data.height);
      if (code) showResult(code.data);
      else { status.textContent = "No QR code found in image."; resultWrap.style.display = "none"; }
    };
    img.src = URL.createObjectURL(f);
  });

  function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(data.data, data.width, data.height, { inversionAttempts: "dontInvert" });
      if (code) {
        showResult(code.data);
        stopCam();
        return;
      }
    }
    rafId = requestAnimationFrame(tick);
  }

  async function startCam() {
    if (typeof jsQR === "undefined") {
      status.textContent = "The QR scanner library hasn't finished loading yet. Please wait a second and try again, or check your internet connection / ad blocker.";
      return;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      video.srcObject = stream;
      video.setAttribute("playsinline", true);
      await video.play();
      video.style.display = "block";
      startBtn.disabled = true; stopBtn.disabled = false;
      status.textContent = "Point your camera at a QR code…";
      tick();
    } catch (e) {
      status.textContent = "Could not access webcam: " + e.message;
    }
  }

  function stopCam() {
    if (rafId) cancelAnimationFrame(rafId);
    if (stream) stream.getTracks().forEach((t) => t.stop());
    stream = null;
    video.style.display = "none";
    startBtn.disabled = false; stopBtn.disabled = true;
  }

  startBtn.addEventListener("click", startCam);
  stopBtn.addEventListener("click", stopCam);
})();
