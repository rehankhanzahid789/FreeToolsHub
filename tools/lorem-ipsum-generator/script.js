/* Lorem Ipsum Generator */
(function () {
  const WORDS = ("lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor "
    + "incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation "
    + "ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit "
    + "voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non "
    + "proident sunt culpa qui officia deserunt mollit anim id est laborum curabitur vel "
    + "hendrerit libero eleifend blandit nunc ornare odio ut sagittis tortor").split(" ");

  const typeSel = document.getElementById("li-type");
  const countInput = document.getElementById("li-count");
  const classicChk = document.getElementById("li-classic");
  const generateBtn = document.getElementById("li-generate");
  const copyBtn = document.getElementById("li-copy");
  const output = document.getElementById("li-output");

  function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function makeSentence(minW, maxW) {
    const len = minW + Math.floor(Math.random() * (maxW - minW + 1));
    const words = [];
    for (let i = 0; i < len; i++) words.push(rand(WORDS));
    return capitalize(words.join(" ")) + ".";
  }

  function makeParagraph(sentCount) {
    const sentences = [];
    for (let i = 0; i < sentCount; i++) sentences.push(makeSentence(6, 14));
    return sentences.join(" ");
  }

  function generate() {
    const type = typeSel.value;
    let count = parseInt(countInput.value, 10);
    if (!count || count < 1) count = 1;
    if (count > 50) count = 50;

    let result = "";
    if (type === "words") {
      const words = [];
      for (let i = 0; i < count; i++) words.push(rand(WORDS));
      if (classicChk.checked) {
        const classic = "lorem ipsum dolor sit amet".split(" ").slice(0, count);
        result = capitalize(classic.join(" "));
      } else {
        result = capitalize(words.join(" "));
      }
    } else if (type === "sentences") {
      const sentences = [];
      for (let i = 0; i < count; i++) sentences.push(makeSentence(6, 14));
      if (classicChk.checked && sentences.length) {
        sentences[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
      }
      result = sentences.join(" ");
    } else {
      const paragraphs = [];
      for (let i = 0; i < count; i++) paragraphs.push(makeParagraph(4 + Math.floor(Math.random() * 3)));
      if (classicChk.checked && paragraphs.length) {
        paragraphs[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " + paragraphs[0];
      }
      result = paragraphs.join("\n\n");
    }
    output.textContent = result;
  }

  generateBtn.addEventListener("click", generate);
  copyBtn.addEventListener("click", () => {
    if (!output.textContent) return;
    navigator.clipboard.writeText(output.textContent).then(() => {
      const orig = copyBtn.textContent;
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = orig), 1200);
    });
  });

  generate();
})();
