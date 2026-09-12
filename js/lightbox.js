(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item img'));
  if (!items.length) return;

  var overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.innerHTML =
    '<button class="lightbox-close" aria-label="Close">&times;</button>' +
    '<button class="lightbox-prev" aria-label="Previous image">&#8249;</button>' +
    '<img class="lightbox-img" src="" alt="">' +
    '<button class="lightbox-next" aria-label="Next image">&#8250;</button>' +
    '<div class="lightbox-counter"></div>';
  document.body.appendChild(overlay);

  var imgEl = overlay.querySelector('.lightbox-img');
  var counterEl = overlay.querySelector('.lightbox-counter');
  var closeBtn = overlay.querySelector('.lightbox-close');
  var prevBtn = overlay.querySelector('.lightbox-prev');
  var nextBtn = overlay.querySelector('.lightbox-next');
  var currentIndex = 0;

  function show(index) {
    currentIndex = (index + items.length) % items.length;
    var el = items[currentIndex];
    imgEl.src = el.currentSrc || el.src;
    imgEl.alt = el.alt || '';
    counterEl.textContent = (currentIndex + 1) + ' / ' + items.length;
  }

  function open(index) {
    show(index);
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  items.forEach(function (el, index) {
    el.parentElement.addEventListener('click', function () {
      open(index);
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { show(currentIndex - 1); });
  nextBtn.addEventListener('click', function () { show(currentIndex + 1); });

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(currentIndex - 1);
    if (e.key === 'ArrowRight') show(currentIndex + 1);
  });
})();
