(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('bookingForm');
    if (!form) return;

    var statusEl = document.getElementById('bookingStatus');
    var submitBtn = form.querySelector('button[type="submit"]');

    function showStatus(kind, message) {
      statusEl.textContent = message;
      statusEl.className = 'booking-status show ' + kind;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot: if filled, silently drop (bot)
      var honey = form.querySelector('input[name="_honey"]');
      if (honey && honey.value) return;

      var data = new FormData(form);
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            showStatus('ok', "Thanks — your booking request has been sent. We'll confirm by phone or WhatsApp shortly.");
          } else {
            showStatus('err', "Something went wrong sending that. Please try again, or message us directly on WhatsApp.");
          }
        })
        .catch(function () {
          showStatus('err', "Something went wrong sending that. Please try again, or message us directly on WhatsApp.");
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Request Booking';
        });
    });
  });
})();
