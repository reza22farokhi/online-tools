(function () {
  try {
    // Storage can be unavailable in private browsing or hardened contexts.
    // Keep URL-selected language functional even when localStorage throws.
    var readStorage = function (key) {
      try {
        return window.localStorage.getItem(key);
      } catch (_) {
        return null;
      }
    };
    var theme = readStorage('pot.theme');
    if (theme !== 'light' && theme !== 'dark') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);

    var queryLang = new URLSearchParams(window.location.search).get('lang');
    var lang = queryLang === 'fa' || queryLang === 'en' ? queryLang : readStorage('pot.lang');
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

        // Keep SEO metadata synchronized with the language actually rendered.
        // This lives in the same-origin external bootstrap so the strict CSP
        // (script-src 'self') does not block it.
        var canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonicalLink) {
          var localizedCanonical = new URL(canonicalLink.href, window.location.origin);
          localizedCanonical.searchParams.set('lang', lang);
          canonicalLink.setAttribute('href', localizedCanonical.href);
        }

        var canonicalUrl = canonicalLink ? canonicalLink.href : window.location.href;
        var ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

        var ogLocale = document.querySelector('meta[property="og:locale"]');
        if (ogLocale) ogLocale.setAttribute('content', lang === 'fa' ? 'fa_IR' : 'en_US');

        var heading = document.querySelector('main h1, h1');
        var descriptionMeta = document.querySelector('meta[name="description"]');
        var siteNameMeta = document.querySelector('meta[property="og:site_name"]');
        var headingText = heading ? heading.textContent.trim() : '';
        var descriptionText = descriptionMeta ? descriptionMeta.getAttribute('content') || '' : '';
        var siteNameText = siteNameMeta ? siteNameMeta.getAttribute('content') || '' : '';

        document.querySelectorAll('script[type="application/ld+json"]').forEach(function (script) {
          try {
            var data = JSON.parse(script.textContent || '');
            var breadcrumbs = Array.from(document.querySelectorAll('.breadcrumb li')).map(function (item) {
              return item.textContent.trim();
            });
            var updateNode = function (node) {
              if (Array.isArray(node)) {
                node.forEach(updateNode);
                return;
              }
              if (!node || typeof node !== 'object') return;
              if (Object.prototype.hasOwnProperty.call(node, 'inLanguage')) node.inLanguage = lang;
              var type = node['@type'];
              if (type === 'WebSite' || type === 'WebApplication' || type === 'BlogPosting') {
                node.inLanguage = lang;
              }
              if (type === 'WebSite') {
                if (siteNameText) node.name = siteNameText;
                if (descriptionText) node.description = descriptionText;
              } else if (type === 'WebApplication') {
                if (headingText) node.name = headingText;
                if (descriptionText) node.description = descriptionText;
              } else if (type === 'BlogPosting') {
                if (headingText) node.headline = headingText;
                if (descriptionText) node.description = descriptionText;
                if (node.publisher && node.publisher.name === 'ابزارهای آنلاین') {
                  node.publisher.name = 'Online Tools';
                }
              } else if (type === 'BreadcrumbList' && Array.isArray(node.itemListElement)) {
                node.itemListElement.forEach(function (item, index) {
                  if (breadcrumbs[index]) item.name = breadcrumbs[index];
                });
              }
              Object.keys(node).forEach(function (key) {
                if (key !== 'itemListElement') updateNode(node[key]);
              });
            };
            updateNode(data);
            script.textContent = JSON.stringify(data);
          } catch (_) {
            // Preserve malformed third-party or page JSON-LD rather than breaking the page.
          }
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
