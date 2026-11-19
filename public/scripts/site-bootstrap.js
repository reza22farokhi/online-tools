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
    }
  } catch (_) {
    // The page remains usable when browser storage is unavailable.
  }
})();
