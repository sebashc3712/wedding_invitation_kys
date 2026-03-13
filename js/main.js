// ============================================
// Wedding Invitation — Katia & Sebastián
// Countdown + Scroll Animations
// ============================================

(function () {
  'use strict';

  // --- Countdown Timer ---
  const WEDDING_DATE = new Date('2026-12-19T17:00:00-05:00');

  const countdownEls = {
    days: document.getElementById('countdown-days'),
    hours: document.getElementById('countdown-hours'),
    minutes: document.getElementById('countdown-minutes'),
    seconds: document.getElementById('countdown-seconds'),
  };

  const countdownMessage = document.getElementById('countdown-message');
  const countdownBoxes = document.querySelector('.countdown');

  function updateCountdown() {
    const now = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      // Event has started or passed
      if (countdownBoxes) countdownBoxes.style.display = 'none';
      if (countdownMessage) countdownMessage.classList.add('is-visible');
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    updateDigit(countdownEls.days, days);
    updateDigit(countdownEls.hours, hours);
    updateDigit(countdownEls.minutes, minutes);
    updateDigit(countdownEls.seconds, seconds);
  }

  function updateDigit(el, value) {
    if (!el) return;
    const str = String(value).padStart(2, '0');
    if (el.textContent !== str) {
      el.textContent = str;
      el.classList.remove('tick');
      // Force reflow to restart animation
      void el.offsetWidth;
      el.classList.add('tick');
    }
  }

  // Run immediately, then every second
  if (countdownEls.days) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // --- Scroll Animations (IntersectionObserver) ---
  const animatedEls = document.querySelectorAll('[data-animate]:not(.hero [data-animate])');

  if ('IntersectionObserver' in window && animatedEls.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    animatedEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: show everything
    animatedEls.forEach((el) => el.classList.add('is-visible'));
  }

  // --- Add to Calendar (.ics download) ---
  var calBtn = document.getElementById('add-to-calendar');
  if (calBtn) {
    calBtn.addEventListener('click', function () {
      var ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Katia & Sebastian Wedding//EN',
        'BEGIN:VEVENT',
        'DTSTART:20261219T220000Z',
        'DTEND:20261220T060000Z',
        'SUMMARY:Boda Katia & Sebastián',
        'LOCATION:Hacienda Villa Mariana\\, KM 4 vía Cristo Rey\\, Cali\\, Colombia',
        'DESCRIPTION:Wedding celebration of Katia & Sebastián',
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n');

      var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'boda-katia-sebastian.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // --- Smooth Scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
