(function () {
  'use strict';
  try {
    var el = document.querySelector('[data-tool-slug]');
    if (!el) return;
    var slug = el.getAttribute('data-tool-slug');
    if (!slug) return;

    var key = 'pot.recent';
    var raw = localStorage.getItem(key);
    var list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) list = [];
    list = list.filter(function (item) { return item !== slug; });
    list.unshift(slug);
    localStorage.setItem(key, JSON.stringify(list.slice(0, 6)));
  } catch (_) {
    // Recent tools are an enhancement and must not affect the tool itself.
  }
})();
