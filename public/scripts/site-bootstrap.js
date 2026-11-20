(function () {
  try {
    var theme = localStorage.getItem('pot.theme');
    if (theme !== 'light' && theme !== 'dark') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);

    var queryLang = new URLSearchParams(window.location.search).get('lang');
    var lang = queryLang === 'fa' || queryLang === 'en' ? queryLang : localStorage.getItem('pot.lang');
    if (lang === 'fa' || lang === 'en') {
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');

      // Keep essential bilingual content usable when the larger UI bundle is unavailable offline.
      var applyLanguageContent = function () {
        var suffix = 'data-lang-' + lang;

        document.querySelectorAll('[data-lang-only]').forEach(function (element) {
          element.hidden = element.getAttribute('data-lang-only') !== lang;
        });

        document.querySelectorAll('body [data-lang-fa][data-lang-en]').forEach(function (element) {
          if (element.children.length !== 0) return;
          var value = element.getAttribute(suffix);
          if (value !== null) element.textContent = value;
        });

        document.querySelectorAll('[data-lang-placeholder-fa][data-lang-placeholder-en]').forEach(function (element) {
          var value = element.getAttribute('data-lang-placeholder-' + lang);
          if (value !== null) element.setAttribute('placeholder', value);
        });

        document.querySelectorAll('[data-lang-aria-fa][data-lang-aria-en]').forEach(function (element) {
          var value = element.getAttribute('data-lang-aria-' + lang);
          if (value !== null) element.setAttribute('aria-label', value);
        });

        document.querySelectorAll('[data-lang-title-fa][data-lang-title-en]').forEach(function (element) {
          var value = element.getAttribute('data-lang-title-' + lang);
          if (value !== null) element.setAttribute('title', value);
        });

        var title = document.querySelector('title');
        if (title) {
          var titleValue = title.getAttribute(suffix);
          if (titleValue !== null) document.title = titleValue;
        }

        document.querySelectorAll('meta[data-lang-fa][data-lang-en]').forEach(function (element) {
          var value = element.getAttribute(suffix);
          if (value !== null) element.setAttribute('content', value);
        });
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyLanguageContent, { once: true });
      } else {
        applyLanguageContent();
      }
    }
  } catch (_) {
    // The page remains usable when browser storage is unavailable.
  }
})();
