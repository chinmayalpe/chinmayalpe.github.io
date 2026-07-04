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
   LIGHTBOX
   ============================================================ */
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lightboxImg   = lightbox.querySelector('.lightbox-img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-item[data-src]').forEach(item => {
    item.addEventListener('click', () => {
      lightboxImg.src = item.dataset.src;
      lightboxImg.alt = item.querySelector('img').alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

/* ============================================================
   PROJECT MODAL
   ============================================================ */
const projectModal = document.getElementById('projectModal');
if (projectModal) {
  const modalBody  = projectModal.querySelector('.project-modal-body');
  const modalClose = projectModal.querySelector('.project-modal-close');

  document.querySelectorAll('.project-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      modalBody.innerHTML = card.innerHTML;
      projectModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeProjectModal() {
    projectModal.classList.remove('open');
    document.body.style.overflow = '';
    modalBody.innerHTML = '';
  }

  modalClose.addEventListener('click', closeProjectModal);
  projectModal.addEventListener('click', e => { if (e.target === projectModal) closeProjectModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeProjectModal(); });
}
