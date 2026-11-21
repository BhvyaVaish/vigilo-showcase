/* ============================================================
   VIGILO WEBSITE — script.js
   ============================================================ */

/* ── Nav: scroll state + active link ─────────────────────── */
const nav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav-link:not(.nav-mobile .nav-link)');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled class for backdrop blur
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  // Active nav link highlighting
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href && href === '#' + current) {
      link.classList.add('active');
    }
  });
}, { passive: true });

/* ── Mobile hamburger ─────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');

if (hamburger && navMobile) {
  hamburger.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
  });

  // Close mobile menu when a link is clicked
  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMobile.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ── Fade-up on scroll (IntersectionObserver) ─────────────── */
const fadeElements = document.querySelectorAll('.fade-up');

if ('IntersectionObserver' in window) {
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings in the same grid/row
        const siblings = entry.target.parentElement.querySelectorAll('.fade-up:not(.visible)');
        siblings.forEach((el, idx) => {
          if (el === entry.target) {
            setTimeout(() => el.classList.add('visible'), idx * 80);
          }
        });
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeElements.forEach(el => fadeObserver.observe(el));
} else {
  // Fallback: show all
  fadeElements.forEach(el => el.classList.add('visible'));
}

/* ── Contact Form ─────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formFields  = document.getElementById('formFields');
const formSuccess = document.getElementById('formSuccess');
const submitBtn   = document.getElementById('formSubmitBtn');

let iframeHasLoaded = false;

// Track iframe load (fires on FormSubmit redirect/response)
window.iframeLoaded = function () {
  if (iframeHasLoaded) {
    showSuccess();
  }
  iframeHasLoaded = true; // first load is page-load, second is after submit
};

function showSuccess() {
  if (formFields && formSuccess) {
    formFields.style.display = 'none';
    formSuccess.style.display = 'block';
  }
}

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    // Don't prevent default — let the form submit to FormSubmit via the hidden iframe
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    // Show success after a short delay (FormSubmit is fast, iframe will load)
    setTimeout(() => {
      showSuccess();
    }, 2000);
  });
}

/* ── Business page form ────────────────────────────────────── */
const bizForm    = document.getElementById('bizContactForm');
const bizFields  = document.getElementById('bizFormFields');
const bizSuccess = document.getElementById('bizFormSuccess');
const bizBtn     = document.getElementById('bizSubmitBtn');

if (bizForm) {
  bizForm.addEventListener('submit', function () {
    if (bizBtn) {
      bizBtn.disabled = true;
      bizBtn.textContent = 'Sending...';
    }
    setTimeout(() => {
      if (bizFields && bizSuccess) {
        bizFields.style.display = 'none';
        bizSuccess.style.display = 'block';
      }
    }, 2000);
  });
}

/* ── Smooth scroll for anchor links ─────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 68;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
