function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: 'en', includedLanguages: 'ar', autoDisplay: false },
    'google_translate_element'
  );
}

(function () {
  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function setCookie(name, value) {
    document.cookie = name + '=' + value + '; path=/';
    var host = window.location.hostname;
    var parts = host.split('.');
    if (parts.length > 2) {
      document.cookie = name + '=' + value + '; path=/; domain=.' + parts.slice(-2).join('.');
    }
  }

  function clearCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    var host = window.location.hostname;
    var parts = host.split('.');
    if (parts.length > 2) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + parts.slice(-2).join('.');
    }
  }

  function isArabicActive() {
    var c = getCookie('googtrans');
    return !!(c && c.indexOf('/ar') !== -1);
  }

  function updateButton(btn) {
    if (isArabicActive()) {
      btn.textContent = '🇬🇧';
      btn.title = 'Switch back to English';
      btn.setAttribute('aria-label', 'Switch back to English');
    } else {
      btn.textContent = '🇦🇪';
      btn.title = 'ترجمة إلى العربية — Translate to Arabic';
      btn.setAttribute('aria-label', 'Translate to Arabic');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('langToggle');
    if (!btn) return;
    updateButton(btn);
    btn.addEventListener('click', function () {
      if (isArabicActive()) {
        clearCookie('googtrans');
      } else {
        setCookie('googtrans', '/en/ar');
      }
      location.reload();
    });
  });
})();
