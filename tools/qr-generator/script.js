(function () {
  const input = document.getElementById("qr-input");
  const size = document.getElementById("qr-size");
  const ec = document.getElementById("qr-ec");
  const genBtn = document.getElementById("qr-generate");
  const dlBtn = document.getElementById("qr-download");
  const out = document.getElementById("qr-output");

  function generate() {
    const text = input.value.trim();
    out.innerHTML = "";
    dlBtn.disabled = true;
    if (!text) {
      out.innerHTML = '<p class="error-box">Please enter some text or a URL.</p>';
      return;
    }
    if (typeof QRCode === "undefined") {
      out.innerHTML = '<p class="error-box">The QR library hasn\'t finished loading yet. Please wait a second and try again, or check your internet connection / ad blocker.</p>';
      return;
    }
    const canvas = document.createElement("canvas");
    const px = Math.max(128, Math.min(1024, parseInt(size.value, 10) || 320));
    QRCode.toCanvas(canvas, text, { width: px, errorCorrectionLevel: ec.value, margin: 2, color: { dark: "#2F4F6F", light: "#FFFFFF" } }, function (err) {
      if (err) {
        out.innerHTML = '<p class="error-box">Could not generate QR code.</p>';
        return;
      }
      out.appendChild(canvas);
      dlBtn.disabled = false;
      dlBtn.onclick = function () {
        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = "qrcode.png";
        a.click();
      };
    });
  }

  genBtn.addEventListener("click", generate);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate();
  });
})();
