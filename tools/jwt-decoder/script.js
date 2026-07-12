/* JWT Decoder — client-side only, does not verify signatures */
(function () {
  const input = document.getElementById("jwt-input");
  const errorBox = document.getElementById("jwt-error");
  const headerBox = document.getElementById("jwt-header");
  const payloadBox = document.getElementById("jwt-payload");
  const sigBox = document.getElementById("jwt-signature");

  function base64UrlDecode(str) {
    let s = str.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    const binary = atob(s);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder("utf-8").decode(bytes);
  }

  function update() {
    const token = input.value.trim();
    errorBox.hidden = true;

    if (!token) {
      headerBox.textContent = "—";
      payloadBox.textContent = "—";
      sigBox.textContent = "—";
      return;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      errorBox.hidden = false;
      errorBox.textContent = "This doesn't look like a valid JWT — expected three dot-separated parts (header.payload.signature).";
      headerBox.textContent = "—";
      payloadBox.textContent = "—";
      sigBox.textContent = "—";
      return;
    }

    try {
      const header = JSON.parse(base64UrlDecode(parts[0]));
      headerBox.textContent = JSON.stringify(header, null, 2);
    } catch (err) {
      headerBox.textContent = "Could not decode header: " + err.message;
    }

    try {
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      payloadBox.textContent = JSON.stringify(payload, null, 2);
    } catch (err) {
      payloadBox.textContent = "Could not decode payload: " + err.message;
    }

    sigBox.textContent = parts[2] || "—";
  }

  input.addEventListener("input", update);
  update();
})();
