/* Acacio Barros — poetry site script. Shared by index.html and poems.html.

   1. PT / EN language switch. The chosen language is kept for the browser
      session so it survives moving between pages.
   2. Featured poem (homepage only). One poem per language is chosen at
      random from poems.html, kept stable for the session, and swapped into
      the [data-featured] slot. Without JavaScript, or if the fetch fails,
      the static default poem already in the slot simply stays. */

(function () {
  var root = document.documentElement;

  var store = {
    get: function (key) { try { return sessionStorage.getItem(key); } catch (e) { return null; } },
    set: function (key, value) { try { sessionStorage.setItem(key, value); } catch (e) {} }
  };

  /* ---------- Language switch ---------- */

  var buttons = document.querySelectorAll(".langswitch button");

  function setLang(lang) {
    root.classList.remove("lang-pt", "lang-en");
    root.classList.add("lang-" + lang);
    root.lang = lang;
    store.set("lang", lang);
  }

  // The inline head script has already applied the stored language; record it for the session.
  setLang(root.classList.contains("lang-en") ? "en" : "pt");

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      setLang(this.dataset.setLang);
    });
  }

  /* ---------- Featured poem ---------- */

  var slots = document.querySelectorAll("[data-featured]");
  if (!slots.length || !window.fetch || !window.DOMParser) return;

  fetch("poems.html")
    .then(function (response) { return response.ok ? response.text() : Promise.reject(); })
    .then(function (html) {
      var doc = new DOMParser().parseFromString(html, "text/html");

      for (var i = 0; i < slots.length; i++) {
        var slot = slots[i];
        var lang = slot.getAttribute("data-featured");
        var poems = doc.querySelectorAll('[data-lang="' + lang + '"] .poem[id]');
        if (!poems.length) continue;

        var key = "featured-" + lang;
        var storedId = store.get(key);
        var chosen = null;

        for (var j = 0; j < poems.length; j++) {
          if (poems[j].id === storedId) { chosen = poems[j]; break; }
        }
        if (!chosen) {
          chosen = poems[Math.floor(Math.random() * poems.length)];
          store.set(key, chosen.id);
        }

        while (slot.firstChild) slot.removeChild(slot.firstChild);
        slot.appendChild(document.importNode(chosen, true));
      }
    })
    .catch(function () { /* keep the static default poem */ });
})();
