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

    var queryLang = new URLSearchParams(window.location.search).get('lang');
    var pathLang = /^\/en(?:\/|$)/.test(window.location.pathname) ? 'en' : null;
    var storedLang = readStorage('pot.lang');
    var lang = pathLang || (queryLang === 'fa' || queryLang === 'en' ? queryLang : storedLang);
    if (lang !== 'fa' && lang !== 'en') lang = 'fa';
    if (lang === 'fa' || lang === 'en') {
      var canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        var localizedCanonical = new URL(canonicalLink.href, window.location.origin);
        if (pathLang) {
          localizedCanonical.pathname = window.location.pathname;
          localizedCanonical.searchParams.delete('lang');
        } else if (lang === 'en') localizedCanonical.searchParams.set('lang', 'en');
        else localizedCanonical.searchParams.delete('lang');
        canonicalLink.href = localizedCanonical.href;
        var faPath = localizedCanonical.pathname.replace(/^\/en(?=\/|$)/, '') || '/';
        var enPath = '/en' + (faPath === '/' ? '/' : faPath);
        document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(function (link) {
          var locale = link.getAttribute('hreflang');
          var alternate = new URL(localizedCanonical.href);
          alternate.pathname = locale === 'en' ? enPath : faPath;
          alternate.searchParams.delete('lang');
          link.href = alternate.href;
        });
        var ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', localizedCanonical.href);
        var ogLocale = document.querySelector('meta[property="og:locale"]');
        if (ogLocale) ogLocale.setAttribute('content', lang === 'fa' ? 'fa_IR' : 'en_US');
      }
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');

      // Keep essential bilingual content usable when the larger UI bundle is unavailable offline.
      var applyLanguageContent = function () {
        var suffix = 'data-lang-' + lang;
        document.querySelectorAll('a[href]').forEach(function (anchor) {
          var raw = anchor.getAttribute('href');
          if (!raw || raw.charAt(0) === '#' || /^(mailto:|tel:|javascript:)/i.test(raw)) return;
          try {
            var target = new URL(raw, window.location.origin);
            if (target.origin !== window.location.origin) return;
            var path = target.pathname;
            if (lang === 'en' && !/^\/en(?:\/|$)/.test(path)) target.pathname = '/en' + (path.charAt(0) === '/' ? path : '/' + path);
            if (lang === 'fa' && /^\/en(?:\/|$)/.test(path)) target.pathname = path.replace(/^\/en(?=\/|$)/, '') || '/';
            anchor.setAttribute('href', target.pathname + target.search + target.hash);
          } catch (_) {}
        });

        document.querySelectorAll('script[data-jsonld-lang]').forEach(function (element) {
          element.setAttribute('type', element.getAttribute('data-jsonld-lang') === lang ? 'application/ld+json' : 'application/json');
        });

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
