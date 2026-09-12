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

  var UAE_FLAG_SVG = '<svg class="flag-icon" viewBox="0 0 60 40" width="22" height="15" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="60" height="40" fill="#fff"/><rect width="60" height="13.33" fill="#00732f"/><rect y="26.67" width="60" height="13.33" fill="#000"/><rect width="15" height="40" fill="#ef3340"/></svg>';
  var UK_FLAG_SVG = '<svg class="flag-icon" viewBox="0 0 60 30" width="22" height="15" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="60" height="30" fill="#00247d"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L27,13.5 M60,0 L33,13.5 M0,30 L27,16.5 M60,30 L33,16.5" stroke="#cf142b" stroke-width="2"/><path d="M30,0 V30 M0,15 H60" stroke="#fff" stroke-width="10"/><path d="M30,0 V30 M0,15 H60" stroke="#cf142b" stroke-width="6"/></svg>';

  function updateButton(btn) {
    if (isArabicActive()) {
      btn.innerHTML = UK_FLAG_SVG;
      btn.title = 'Switch back to English';
      btn.setAttribute('aria-label', 'Switch back to English');
    } else {
      btn.innerHTML = UAE_FLAG_SVG;
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
