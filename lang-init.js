/* Initial language. Loaded in the <head> of every page so the right language
   is applied before first paint.

   1. A language chosen with the site's own switch during this browser
      session (kept in sessionStorage) always wins.
   2. Otherwise the browser's preferred languages are read locally, in the
      order the browser lists them; the first that is Portuguese or English
      decides. If neither appears, English.

   Nothing is stored here and nothing leaves the browser. */

(function () {
  var lang = null;

  try {
    var chosen = sessionStorage.getItem("lang");
    if (chosen === "pt" || chosen === "en") lang = chosen;
  } catch (e) {}

  if (!lang) {
    var prefs = (navigator.languages && navigator.languages.length)
      ? navigator.languages
      : [navigator.language || ""];

    for (var i = 0; i < prefs.length && !lang; i++) {
      var code = String(prefs[i]).toLowerCase();
      if (code === "pt" || code.indexOf("pt-") === 0) lang = "pt";
      else if (code === "en" || code.indexOf("en-") === 0) lang = "en";
    }
  }

  if (!lang) lang = "en";

  document.documentElement.className = "js lang-" + lang;
  document.documentElement.lang = lang;
})();
