/* Readability Score Checker — Flesch Reading Ease / Flesch-Kincaid Grade Level */
(function () {
  const input = document.getElementById("rd-input");
  const easeEl = document.getElementById("rd-ease");
  const gradeEl = document.getElementById("rd-grade");
  const wordsEl = document.getElementById("rd-words");
  const sentencesEl = document.getElementById("rd-sentences");
  const summaryEl = document.getElementById("rd-summary");

  function countSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, "");
    if (!word) return 0;
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
    word = word.replace(/^y/, "");
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }

  function interpretEase(score) {
    if (score >= 90) return "Very easy — 5th grade level";
    if (score >= 80) return "Easy — 6th grade level";
    if (score >= 70) return "Fairly easy — 7th grade level";
    if (score >= 60) return "Standard — 8th–9th grade level";
    if (score >= 50) return "Fairly difficult — 10th–12th grade level";
    if (score >= 30) return "Difficult — college level";
    return "Very difficult — college graduate level";
  }

  function update() {
    const text = input.value.trim();
    if (!text) {
      easeEl.textContent = "—";
      gradeEl.textContent = "—";
      wordsEl.textContent = "—";
      sentencesEl.textContent = "—";
      summaryEl.textContent = "Paste some text above to get started.";
      return;
    }

    const words = text.match(/[A-Za-z0-9'-]+/g) || [];
    const sentenceMatches = text.match(/[^.!?]+[.!?]+/g);
    const sentences = sentenceMatches && sentenceMatches.length ? sentenceMatches.length : 1;
    const wordCount = words.length || 1;
    const syllableCount = words.reduce((sum, w) => sum + countSyllables(w), 0) || 1;

    const wordsPerSentence = wordCount / sentences;
    const syllablesPerWord = syllableCount / wordCount;

    const ease = 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;
    const grade = 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;

    easeEl.textContent = ease.toFixed(1);
    gradeEl.textContent = Math.max(0, grade).toFixed(1);
    wordsEl.textContent = wordCount.toLocaleString();
    sentencesEl.textContent = sentences.toLocaleString();
    summaryEl.textContent = `${interpretEase(ease)}. Average ${wordsPerSentence.toFixed(1)} words per sentence, ${syllablesPerWord.toFixed(2)} syllables per word.`;
  }

  input.addEventListener("input", update);
  update();
})();
