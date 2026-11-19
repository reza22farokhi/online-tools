(function () {
  'use strict';

  function showGlobalError(messageFa, messageEn) {
    var isEnglish = document.documentElement.lang === 'en';
    console.error(isEnglish ? messageEn : messageFa);
    var el = document.getElementById('global-error-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'global-error-toast';
      el.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#ef4444;color:white;padding:12px 24px;border-radius:8px;z-index:9999;font-family:inherit;box-shadow:0 4px 12px rgba(0,0,0,0.15);max-width:calc(100vw - 32px);';
      document.body.appendChild(el);
    }
    el.style.direction = isEnglish ? 'ltr' : 'rtl';
    el.style.textAlign = isEnglish ? 'left' : 'right';
    el.textContent = isEnglish ? messageEn : messageFa;
    window.setTimeout(function () { if (el && el.isConnected) el.remove(); }, 5000);
  }

  window.addEventListener('error', function () {
    showGlobalError(
      'یک خطای غیرمنتظره رخ داد. لطفاً صفحه را رفرش کنید.',
      'An unexpected error occurred. Please refresh the page.'
    );
  });

  window.addEventListener('unhandledrejection', function () {
    showGlobalError(
      'در اجرای بخشی از صفحه خطایی رخ داد. لطفاً دوباره تلاش کنید.',
      'A page operation failed. Please try again.'
    );
  });
})();
