/* ========================================
   ABC TRADERS ELITE — Main JavaScript
   ======================================== */

// ---- Navbar Scroll Effect ----
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.nav-mobile');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

// ---- Scroll Animations ----
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// ---- Counter Animation ----
function animateCounters() {
  const counters = document.querySelectorAll('[data-counter]');

  counters.forEach(counter => {
    const target = parseFloat(counter.dataset.counter);
    const suffix = counter.dataset.suffix || '';
    const prefix = counter.dataset.prefix || '';
    const decimals = counter.dataset.decimals ? parseInt(counter.dataset.decimals) : 0;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const interval = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(interval);
            }
            counter.textContent = prefix + current.toFixed(decimals) + suffix;
          }, 16);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(counter);
  });
}

// ---- Copy Signal to Clipboard ----
function copySignal(btn) {
  const row = btn.closest('tr');
  if (!row) return;

  const cells = row.querySelectorAll('td');
  const text = `${cells[0].textContent} | ${cells[1].textContent} | Entry: ${cells[2].textContent} | TP1: ${cells[3].textContent} | SL: ${cells[4].textContent} | RR: ${cells[5].textContent}`;

  navigator.clipboard.writeText(text).then(() => {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '✓';
    btn.style.background = 'rgba(0, 200, 83, 0.2)';
    btn.style.borderColor = 'rgba(0, 200, 83, 0.4)';
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.style.borderColor = '';
    }, 1500);
  });
}

// ---- Category Filter (Academy) ----
function initCategoryFilters() {
  const filters = document.querySelectorAll('.category-filter');
  const courses = document.querySelectorAll('.course-card');

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');

      const category = filter.dataset.category;

      courses.forEach(course => {
        if (category === 'all' || course.dataset.category === category) {
          course.style.display = '';
          setTimeout(() => {
            course.style.opacity = '1';
            course.style.transform = 'translateY(0)';
          }, 50);
        } else {
          course.style.opacity = '0';
          course.style.transform = 'translateY(20px)';
          setTimeout(() => {
            course.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// ---- Content Type Filter ----
function initContentFilters() {
  const filters = document.querySelectorAll('.content-filter');
  const items = document.querySelectorAll('.content-card');

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');

      const type = filter.dataset.type;

      items.forEach(item => {
        if (type === 'all' || item.dataset.type === type) {
          item.style.display = '';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// ---- Smooth Page Navigation (highlight active) ----
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ---- Newsletter Form ----
function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    const btn = form.querySelector('button');

    if (!input.value.includes('@')) return;

    btn.textContent = '✓ Suscrito';
    btn.style.background = 'var(--success)';
    input.value = '';

    setTimeout(() => {
      btn.textContent = 'Suscribirse';
      btn.style.background = '';
    }, 3000);
  });
}

// ---- Pricing Toggle (monthly/annual) ----
function initPricingToggle() {
  const toggle = document.querySelector('.pricing-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('annual');
    const prices = document.querySelectorAll('.plan-price .amount');
    prices.forEach(p => {
      const monthly = p.dataset.monthly;
      const annual = p.dataset.annual;
      p.textContent = toggle.classList.contains('annual') ? annual : monthly;
    });
  });
}

// ---- Typing Effect ----
function initTypingEffect() {
  const el = document.querySelector('[data-typing]');
  if (!el) return;

  const texts = JSON.parse(el.dataset.typing);
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      el.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentText.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      speed = 500;
    }

    setTimeout(type, speed);
  }

  type();
}

// ---- Live Signals Widget (Simulated) ----
function initLiveSignals() {
  const widget = document.querySelector('.live-signals-widget');
  if (!widget) return;

  const signals = [
    { pair: 'EUR/USD', direction: 'BUY', entry: '1.0845', time: 'Hace 2 min' },
    { pair: 'GBP/USD', direction: 'SELL', entry: '1.2634', time: 'Hace 15 min' },
    { pair: 'XAU/USD', direction: 'BUY', entry: '2312.50', time: 'Hace 32 min' },
    { pair: 'USD/JPY', direction: 'SELL', entry: '151.82', time: 'Hace 1h' },
    { pair: 'BTC/USD', direction: 'BUY', entry: '67,420', time: 'Hace 2h' },
  ];

  signals.forEach((signal, i) => {
    const row = document.createElement('div');
    row.className = 'widget-signal fade-in stagger-' + (i + 1);
    row.innerHTML = `
      <div class="flex-between" style="padding: 12px 0; border-bottom: 1px solid var(--border-color);">
        <div class="flex gap-md" style="align-items: center;">
          <span style="font-family: var(--font-mono); font-weight: 700;">${signal.pair}</span>
          <span class="signal-direction ${signal.direction.toLowerCase()}">${signal.direction}</span>
        </div>
        <div class="flex gap-md" style="align-items: center;">
          <span style="font-family: var(--font-mono); font-size: 0.85rem;">${signal.entry}</span>
          <span class="text-muted" style="font-size: 0.78rem;">${signal.time}</span>
        </div>
      </div>
    `;
    widget.appendChild(row);
  });

  initScrollAnimations();
}

// ---- Initialize all ----
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  animateCounters();
  initCategoryFilters();
  initContentFilters();
  setActiveNav();
  initNewsletter();
  initPricingToggle();
  initTypingEffect();
  initLiveSignals();
});
