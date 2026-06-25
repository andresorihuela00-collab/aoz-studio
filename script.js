// ============================================
// AOZ Studio — shared interactions
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  staggerLetters();
  initScrollReveal();
  initMobileMenu();
  initContactForm();
  markActiveNavLink();
  initHeroCarousel();
  initModelCarousel();
  initDrawingsCarousel();
  initArrowTapFlash();
  initHeroIntro();
  if (typeof initLangToggle === 'function') initLangToggle();
});

// ---------- Model image carousel (with arrows) — supports multiple on one page ----------
function initModelCarousel() {
  document.querySelectorAll('.model-carousel-wrap').forEach(wrap => {
    const slides = [...wrap.querySelectorAll('.model-carousel img')];
    const dots = [...wrap.querySelectorAll('.model-dots button')];
    const prevBtn = wrap.querySelector('.model-arrow.prev');
    const nextBtn = wrap.querySelector('.model-arrow.next');
    let current = 0;
    let timer;

    function goTo(index) {
      slides[current].classList.remove('is-active');
      dots[current] && dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current] && dots[current].classList.add('active');
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAutoplay() {
      clearInterval(timer);
      timer = setInterval(next, 3000);
    }

    nextBtn && nextBtn.addEventListener('click', () => { next(); startAutoplay(); });
    prevBtn && prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); startAutoplay(); });
    });

    startAutoplay();
  });
}

// ---------- Hero image carousel ----------
function initHeroCarousel() {
  const carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll('.ph')];
  const dots = [...document.querySelectorAll('.hero-dots button')];
  let current = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('is-active');
    dots[current] && dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('is-active');
    dots[current] && dots[current].classList.add('active');
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  function startAutoplay() {
    clearInterval(timer);
    timer = setInterval(next, 4000);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      startAutoplay();
    });
  });

  startAutoplay();
}

// ---------- Letter-by-letter fade in for hero titles ----------
function staggerLetters() {
  const targets = document.querySelectorAll('[data-letters]');

  targets.forEach((el) => {
    const text = el.textContent;
    el.textContent = '';
    el.classList.add('letters');

    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'letter';
      span.style.animationDelay = `${i * 45}ms`;
      span.textContent = char === ' ' ? ' ' : char;
      el.appendChild(span);
    });
  });
}

// ---------- Scroll reveal via IntersectionObserver ----------
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) || items.length === 0) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((el) => observer.observe(el));
}

// ---------- Mobile full-screen menu ----------
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    toggle.classList.toggle('is-open', isOpen);
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('is-open');
    });
  });
}

// ---------- Contact form (Formspree) ----------
function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const status = form.querySelector('.form-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Sending...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        status.textContent = 'Message sent. Thank you — we will be in touch shortly.';
        form.reset();
      } else {
        status.textContent = 'Something went wrong. Please email studio@aozstudio.com directly.';
      }
    } catch (err) {
      status.textContent = 'Something went wrong. Please email studio@aozstudio.com directly.';
    }
  });
}

// ---------- Highlight active nav link ----------
function markActiveNavLink() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === current) link.classList.add('active');
  });
}

// ---------- Hero intro sequence (index.html only) ----------
function initHeroIntro() {
  const overlay   = document.getElementById('hero-intro');
  if (!overlay) return;

  const text      = document.getElementById('hero-intro-text');
  const stage     = document.getElementById('intro-stage');
  const carousel  = document.getElementById('intro-carousel');
  const nav   = document.querySelector('.nav');
  const sideL = document.querySelector('.hero-side-left');
  const sideR = document.querySelector('.hero-side-right');
  const meta  = document.querySelector('.hero-meta');

  // Hide navbar and hero flanks during intro
  [nav, sideL, sideR, meta].forEach(el => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';
  });

  // Sequence exactly 3 intro slides with explicit timeouts — no looping
  // Slide 1 (SPIRULINA) is already is-active in HTML, color #1C1C1C is CSS default
  // Each slide is visible for 2s, anchored to when carousel fades in (t=950ms)
  if (carousel) {
    const slides = [...carousel.querySelectorAll('.intro-slide')];
    // → Slide 2 (Viehmarkt, white text) at t=950+2000
    setTimeout(() => {
      slides[0].classList.remove('is-active');
      slides[1].classList.add('is-active');
      text.style.color = '#FFFFFF';
    }, 2950);
    // → Slide 3 (La romita, dark text) at t=950+4000
    setTimeout(() => {
      slides[1].classList.remove('is-active');
      slides[2].classList.add('is-active');
      text.style.color = '#1C1C1C';
    }, 4950);
  }

  // Phase 1 — A·O·Z fades in (400ms fade, starts at ~50ms)
  setTimeout(() => { text.style.opacity = '1'; }, 50);

  // Phase 2 — carousel fades in, stage background dissolves
  // (400ms text fade + 500ms pause = 950ms)
  setTimeout(() => {
    if (carousel) carousel.classList.add('visible');
    if (stage)    stage.style.background = 'transparent';
  }, 950);

  // Phase 3 — fly A·O·Z to nav logo
  // (950ms carousel start + 3 slides × 2000ms = 6950ms)
  setTimeout(() => { _introFly(overlay, text, nav, sideL, sideR, meta); }, 6950);
}

function _introFly(overlay, text, nav, sideL, sideR, meta) {
  // Fade out the active intro slide simultaneously with the fly,
  // restoring the #F7F5F1 stage background so it dissolves cleanly underneath
  const stage = document.getElementById('intro-stage');
  const activeSlide = document.querySelector('#intro-carousel .intro-slide.is-active');
  if (stage) stage.style.background = 'var(--bg)';
  if (activeSlide) {
    activeSlide.style.transition = 'opacity 600ms ease';
    activeSlide.style.opacity = '0';
  }

  const navLogo = document.querySelector('.nav-logo');
  const lR = navLogo ? navLogo.getBoundingClientRect() : null;
  const tR = text.getBoundingClientRect();

  if (lR) {
    const logoCX = lR.left + lR.width  / 2;
    const logoCY = lR.top  + lR.height / 2;
    const textCX = tR.left + tR.width  / 2;
    const textCY = tR.top  + tR.height / 2;
    const dx = logoCX - textCX;
    const dy = logoCY - textCY;
    const sc = lR.height / tR.height;

    text.style.transition = 'transform 900ms cubic-bezier(0.42,0,0.58,1), opacity 600ms ease 300ms';
    text.style.transform  = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${sc})`;
    text.style.opacity    = '0';
  } else {
    text.style.transition = 'opacity 600ms ease';
    text.style.opacity    = '0';
  }

  // Navbar fades in at t+400ms over 400ms
  if (nav) {
    setTimeout(() => {
      nav.style.pointerEvents = '';
      nav.style.transition = 'opacity 400ms ease';
      nav.style.opacity = '1';
    }, 400);
  }

  // Studio, AOZ title, meta fade in after navbar (t+800ms, 300ms)
  [sideL, sideR, meta].forEach(el => {
    if (!el) return;
    el.style.pointerEvents = '';
    el.style.transition = 'opacity 300ms ease';
    setTimeout(() => { el.style.opacity = '1'; }, 800);
  });

  // Remove overlay
  setTimeout(() => { overlay.classList.add('hidden'); }, 1100);
}

// ---------- Arrow tap flash — olive colour for 300ms on click ----------
function initArrowTapFlash() {
  document.querySelectorAll('.drawing-arrow, .model-arrow').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.style.color = '#6B7A5E';
      btn.style.opacity = '1';
      setTimeout(() => {
        btn.style.color = '';
        btn.style.opacity = '';
      }, 300);
    });
  });
}

// ---------- Drawings carousel (architectural drawings with captions) ----------
function initDrawingsCarousel() {
  document.querySelectorAll('.drawings-carousel-wrap').forEach(wrap => {
  const slides = [...wrap.querySelectorAll('.drawing-slide')];
  const dots = [...wrap.querySelectorAll('.drawing-dots button')];
  const prevBtn = wrap.querySelector('.drawing-arrow.prev');
  const nextBtn = wrap.querySelector('.drawing-arrow.next');
  let current = 0;

  function goTo(index) {
    slides[current].classList.remove('is-active');
    dots[current] && dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    dots[current] && dots[current].classList.add('active');
  }

  nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));
  prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
  });
}
