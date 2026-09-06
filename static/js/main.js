(function () {
  var header = document.getElementById('site-header');
  var toggle = document.getElementById('navToggle');
  var backdrop = document.getElementById('navBackdrop');
  var navLinks = document.getElementById('navLinks');

  /* Header menyatu (transparan) di hero, jadi solid + shadow saat discroll */
  function updateHeaderOnScroll() {
    if (!header) return;
    if (window.scrollY > 12) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  updateHeaderOnScroll();
  window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });

  /* Hamburger menu: buka/tutup drawer kanan */
  function openNav() {
    document.body.classList.add('nav-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
  }
  function closeNav() {
    document.body.classList.remove('nav-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }
  function toggleNav() {
    if (document.body.classList.contains('nav-open')) {
      closeNav();
    } else {
      openNav();
    }
  }

  if (toggle) toggle.addEventListener('click', toggleNav);

  /* Klik di area luar menu (backdrop buram) menutup menu */
  if (backdrop) backdrop.addEventListener('click', closeNav);

  /* Klik salah satu link menu juga menutup drawer */
  if (navLinks) {
    var links = navLinks.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', closeNav);
    }
  }

  /* Tombol Escape menutup menu */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* Jika layar dilebarkan kembali ke ukuran desktop saat drawer terbuka, tutup otomatis */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 767 && document.body.classList.contains('nav-open')) {
      closeNav();
    }
  });

  /* Angka statistik di hero dihitung naik dari 0 ke nilai aslinya (mis. "10+") */
  function animateCounter(el) {
    var target = el.getAttribute('data-target') || el.textContent;
    var match = target.match(/^(\d+)/);
    if (!match) {
      el.textContent = target;
      return;
    }
    var end = parseInt(match[1], 10);
    var suffix = target.slice(match[0].length);
    var duration = 1200;
    var startTime = null;

    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); /* ease-out */
      var current = Math.floor(eased * end);
      el.textContent = current + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    window.requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('.js-counter');
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var counterObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { counterObserver.observe(el); });
    } else {
      counters.forEach(function (el) { el.textContent = el.getAttribute('data-target') || el.textContent; });
    }
  }

  /* Kata di judul hero berganti otomatis (mis. Management / Digital / Web Development / Digital Support) */
  var rotatingEl = document.querySelector('.rotating-text');
  if (rotatingEl) {
    var words = (rotatingEl.getAttribute('data-words') || '').split('|').filter(Boolean);
    if (words.length > 1) {
      var wordIndex = 0;
      setInterval(function () {
        rotatingEl.classList.add('is-swapping');
        setTimeout(function () {
          wordIndex = (wordIndex + 1) % words.length;
          rotatingEl.textContent = words[wordIndex] + '.';
          rotatingEl.classList.remove('is-swapping');
        }, 350);
      }, 2200);
    }
  }

  /* Animasi reveal saat discroll: item bergerak masuk saat terlihat,
     dan reset lagi saat keluar layar, baik scroll ke bawah maupun ke atas. */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }
})();
