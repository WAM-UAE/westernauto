(function () {
  var container = document.querySelector('.review-cards');
  if (!container) return;

  var star = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.2 21 12 17.6 5.8 21 7 14.14l-5-4.87 7.1-1.01z"/></svg>';

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function stars(container, n) {
    var svgs = container.querySelectorAll('svg');
    for (var i = 0; i < svgs.length; i++) svgs[i].style.opacity = i < n ? '' : '0.25';
  }

  function preview(text) {
    var first = text.split(/(?<=[.!?])\s/)[0] || text;
    if (first.length > 160) first = first.slice(0, 157).replace(/\s+\S*$/, '') + '…';
    return first;
  }

  function card(r) {
    var n = Math.max(1, Math.min(5, Math.round(r.rating)));
    var full = r.text.split(/\n+/).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    var el = document.createElement('button');
    el.type = 'button';
    el.className = 'review-card';
    el.setAttribute('data-avatar', r.author.charAt(0).toUpperCase());
    el.setAttribute('data-name', r.author);
    el.setAttribute('data-meta', 'Google review');
    el.innerHTML =
      '<div class="reviewer"><div class="reviewer-avatar">' + esc(r.author.charAt(0).toUpperCase()) + '</div>' +
      '<div><div class="reviewer-name">' + esc(r.author) + '</div>' +
      '<div class="reviewer-meta">Google review' + (r.when ? ' &middot; ' + esc(r.when) : '') + '</div></div></div>' +
      '<div class="stars">' + new Array(6).join(star) + '</div>' +
      '<p class="review-preview">' + esc(preview(r.text)) + '</p>' +
      '<span class="review-cta">Read full review &rarr;</span>' +
      '<template class="review-full">' + full + '</template>';
    stars(el.querySelector('.stars'), n);
    return el;
  }

  fetch('data/reviews.json', { cache: 'no-cache' })
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (data) {
      if (!data) return;

      var known = {};
      Array.prototype.forEach.call(container.querySelectorAll('.review-card'), function (c) {
        known[(c.getAttribute('data-name') || '').toLowerCase()] = true;
      });

      var fresh = (data.reviews || [])
        .filter(function (r) { return r.text && !known[r.author.toLowerCase()]; })
        .sort(function (a, b) { return (b.published || '').localeCompare(a.published || ''); });

      for (var i = fresh.length - 1; i >= 0; i--) container.insertBefore(card(fresh[i]), container.firstChild);

      if (data.rating) {
        var num = document.querySelector('.rating-summary .rating-num');
        if (num) num.textContent = Number(data.rating).toFixed(1);
        var sum = document.querySelector('.rating-summary .stars');
        if (sum) stars(sum, Math.round(data.rating));
      }
      if (data.count) {
        var cnt = document.querySelector('.rating-summary .rating-count');
        if (cnt) cnt.textContent = 'Based on ' + data.count + ' Google Reviews';
      }
    })
    .catch(function () {});
})();
