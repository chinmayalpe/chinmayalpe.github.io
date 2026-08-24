/* ============================================================
   NAV — scroll effect + mobile toggle
   ============================================================ */
const nav       = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const open = navToggle.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 90);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   COUNT-UP ANIMATION
   ============================================================ */
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = +el.dataset.target;
    const step   = target / (1400 / 16);
    let current  = 0;

    const tick = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        clearInterval(tick);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 16);

    countObserver.unobserve(el);
  });
}, { threshold: 0.6 });

document.querySelectorAll('.count').forEach(el => countObserver.observe(el));

/* ============================================================
   ACTIVE NAV LINK HIGHLIGHTING
   ============================================================ */
const sections    = document.querySelectorAll('section[id]');
const navLinkEls  = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: '-48% 0px -48% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ============================================================
   SECTION NAV — jump to previous/next section on this page
   ============================================================ */
const pageSections = Array.from(sections);

if (pageSections.length > 1) {
  const sectionNav = document.createElement('div');
  sectionNav.className = 'section-nav';
  sectionNav.innerHTML = `
    <button class="section-nav-btn section-nav-prev" type="button" aria-label="Previous section">↑</button>
    <button class="section-nav-btn section-nav-next" type="button" aria-label="Next section">↓</button>
  `;
  document.body.appendChild(sectionNav);

  const prevBtn = sectionNav.querySelector('.section-nav-prev');
  const nextBtn = sectionNav.querySelector('.section-nav-next');

  const currentSectionIndex = () => {
    const scrollPos = window.scrollY + window.innerHeight * 0.3;
    let idx = 0;
    pageSections.forEach((sec, i) => {
      if (sec.offsetTop <= scrollPos) idx = i;
    });
    return idx;
  };

  const goToSection = (i) => {
    const navHeight = nav ? nav.offsetHeight : 0;
    const top = pageSections[i].offsetTop - navHeight - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const updateSectionNav = () => {
    const idx = currentSectionIndex();
    prevBtn.classList.toggle('is-hidden', idx === 0);
    nextBtn.classList.toggle('is-hidden', idx === pageSections.length - 1);
  };

  prevBtn.addEventListener('click', () => {
    const idx = currentSectionIndex();
    if (idx > 0) goToSection(idx - 1);
  });
  nextBtn.addEventListener('click', () => {
    const idx = currentSectionIndex();
    if (idx < pageSections.length - 1) goToSection(idx + 1);
  });

  window.addEventListener('scroll', updateSectionNav, { passive: true });
  updateSectionNav();
}
