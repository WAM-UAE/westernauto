(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll('.review-card'));
  if (!cards.length) return;

  var starSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.2 21 12 17.6 5.8 21 7 14.14l-5-4.87 7.1-1.01z"/></svg>';

  var overlay = document.createElement('div');
  overlay.className = 'review-modal';
  overlay.innerHTML =
    '<div class="review-modal-card" role="dialog" aria-modal="true">' +
      '<button type="button" class="review-modal-close" aria-label="Close">&times;</button>' +
      '<div class="reviewer">' +
        '<div class="reviewer-avatar"></div>' +
        '<div>' +
          '<div class="reviewer-name"></div>' +
          '<div class="reviewer-meta"></div>' +
        '</div>' +
      '</div>' +
      '<div class="stars">' + starSvg + starSvg + starSvg + starSvg + starSvg + '</div>' +
      '<blockquote></blockquote>' +
    '</div>';
  document.body.appendChild(overlay);

  var avatarEl = overlay.querySelector('.reviewer-avatar');
  var nameEl = overlay.querySelector('.reviewer-name');
  var metaEl = overlay.querySelector('.reviewer-meta');
  var quoteEl = overlay.querySelector('blockquote');
  var closeBtn = overlay.querySelector('.review-modal-close');

  function open(card) {
    avatarEl.textContent = card.getAttribute('data-avatar') || '';
    nameEl.textContent = card.getAttribute('data-name') || '';
    metaEl.innerHTML = card.getAttribute('data-meta') || '';
    var template = card.querySelector('.review-full');
    quoteEl.innerHTML = template ? template.innerHTML : '';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  cards.forEach(function (card) {
    card.addEventListener('click', function () { open(card); });
  });

  closeBtn.addEventListener('click', close);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') close();
  });
})();
