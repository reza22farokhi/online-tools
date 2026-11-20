(function () {
  try {
    var readStorage = function (key) {
      try { return window.localStorage.getItem(key); } catch (_) { return null; }
    };
    var theme = readStorage('pot.theme');
    if (theme !== 'light' && theme !== 'dark') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);

    var params = new URLSearchParams(window.location.search);
    var requestedLang = params.get('lang');
    if ((requestedLang === 'fa' || requestedLang === 'en') && !window.location.pathname.startsWith('/offline/')) {
      var localizedUrl = new URL(window.location.href);
      localizedUrl.searchParams.delete('lang');
      if (requestedLang === 'en' && !localizedUrl.pathname.startsWith('/en/')) {
        localizedUrl.pathname = '/en' + (localizedUrl.pathname === '/' ? '/' : localizedUrl.pathname);
      } else if (requestedLang === 'fa' && localizedUrl.pathname.startsWith('/en/')) {
        localizedUrl.pathname = localizedUrl.pathname.slice(3) || '/';
      }
      if (localizedUrl.href !== window.location.href) {
        window.location.replace(localizedUrl.href);
        return;
      }
    }

    var pathLang = window.location.pathname === '/en' || window.location.pathname.startsWith('/en/') ? 'en' : null;
    var queryLang = new URLSearchParams(window.location.search).get('lang');
    var lang = pathLang || (queryLang === 'fa' || queryLang === 'en' ? queryLang : readStorage('pot.lang'));
    if (pathLang) {
      try { window.localStorage.setItem('pot.lang', pathLang); } catch (_) {}
    }
    if (lang === 'fa' || lang === 'en') {
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');

      // Keep essential bilingual content usable when the larger UI bundle is unavailable offline.
      var applyLanguageContent = function () {
        var suffix = 'data-lang-' + lang;

        if (pathLang === 'en') {
          document.querySelectorAll('a[href^="/"]').forEach(function (link) {
            var href = link.getAttribute('href');
            if (href && !href.startsWith('/en/') && href !== '/en/' && !href.startsWith('/#') && !href.startsWith('//')) {
              link.setAttribute('href', '/en' + href);
            }
          });
        }

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
