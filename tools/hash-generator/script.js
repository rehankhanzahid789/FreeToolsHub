/* Hash Generator — MD5 (pure JS) + SHA-1/256/512 (Web Crypto API) */
(function () {
  const input = document.getElementById("hg-input");
  const out = {
    md5: document.getElementById("hg-md5"),
    sha1: document.getElementById("hg-sha1"),
    sha256: document.getElementById("hg-sha256"),
    sha512: document.getElementById("hg-sha512"),
  };

  // --- Minimal MD5 implementation (RFC 1321) ---
  function md5(str) {
    function rotl(x, c) { return (x << c) | (x >>> (32 - c)); }
    function toHex(num) {
      let s = "";
      for (let i = 0; i < 4; i++) {
        s += ((num >> (i * 8)) & 0xff).toString(16).padStart(2, "0");
      }
      return s;
    }
    const K = new Array(64);
    for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0;
    const S = [
      7,12,17,22, 7,12,17,22, 7,12,17,22, 7,12,17,22,
      5, 9,14,20, 5, 9,14,20, 5, 9,14,20, 5, 9,14,20,
      4,11,16,23, 4,11,16,23, 4,11,16,23, 4,11,16,23,
      6,10,15,21, 6,10,15,21, 6,10,15,21, 6,10,15,21
    ];
    const bytes = new TextEncoder().encode(str);
    const origLenBits = bytes.length * 8;
    const withOne = new Uint8Array(((bytes.length + 8) >> 6) * 64 + 64);
    withOne.set(bytes);
    withOne[bytes.length] = 0x80;
    const view = new DataView(withOne.buffer);
    view.setUint32(withOne.length - 8, origLenBits >>> 0, true);
    view.setUint32(withOne.length - 4, Math.floor(origLenBits / 4294967296), true);

    let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;

    for (let chunk = 0; chunk < withOne.length; chunk += 64) {
      const M = new Array(16);
      for (let i = 0; i < 16; i++) M[i] = view.getUint32(chunk + i * 4, true);
      let A = a0, B = b0, C = c0, D = d0;
      for (let i = 0; i < 64; i++) {
        let F, g;
        if (i < 16) { F = (B & C) | (~B & D); g = i; }
        else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
        else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
        else { F = C ^ (B | ~D); g = (7 * i) % 16; }
        F = (F + A + K[i] + M[g]) >>> 0;
        A = D; D = C; C = B;
        B = (B + rotl(F, S[i])) >>> 0;
      }
      a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0; c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
    }
    return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
  }

  async function sha(algo, str) {
    const data = new TextEncoder().encode(str);
    const buf = await crypto.subtle.digest(algo, data);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  async function update() {
    const text = input.value;
    if (!text) {
      Object.values(out).forEach((el) => (el.value = ""));
      return;
    }
    out.md5.value = md5(text);
    out.sha1.value = await sha("SHA-1", text);
    out.sha256.value = await sha("SHA-256", text);
    out.sha512.value = await sha("SHA-512", text);
  }

  input.addEventListener("input", update);

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const el = document.getElementById(btn.getAttribute("data-copy"));
      if (!el.value) return;
      navigator.clipboard.writeText(el.value).then(() => {
        const orig = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = orig), 1200);
      });
    });
  });
})();
