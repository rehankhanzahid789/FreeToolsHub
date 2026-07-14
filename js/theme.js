/* Light/Dark theme toggle.
   Uses event delegation so it works whether the header is static (homepage)
   or injected later by layout.js (tool pages). Pairs with the small inline
   anti-flash snippet in each page's <head> that applies the saved theme
   before first paint. */
(function () {
  const STORAGE_KEY = "ftg-theme";

  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* localStorage unavailable (private mode etc.) — theme just won't persist */
    }
  }

  function current() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("#theme-toggle");
    if (!btn) return;
    apply(current() === "dark" ? "light" : "dark");
  });
})();
