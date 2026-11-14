/**
 * TaskFlow — Main JavaScript
 * Vanilla ES6+. No frameworks, no libraries.
 * All logic is split into small, named functions called from init().
 */

'use strict';

/* ─────────────────────────────────────────
   1. Mobile Navigation Menu
   Handles hamburger toggle, link-click close,
   and click-outside close.
───────────────────────────────────────── */
function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  /** Open / close the menu and sync ARIA state */
  const openMenu  = () => {
    menu.classList.add('nav__menu--open');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    menu.classList.remove('nav__menu--open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const isOpen = () => menu.classList.contains('nav__menu--open');

  // Hamburger button click
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen() ? closeMenu() : openMenu();
  });

  // Close when any nav link inside the menu is clicked
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  // Close when clicking outside the navbar
  document.addEventListener('click', (e) => {
    const navbar = document.getElementById('navbar');
    if (navbar && !navbar.contains(e.target)) {
      closeMenu();
    }
  });
}

/* ─────────────────────────────────────────
   2. Scroll Spy
   Highlights the active nav link based on
   which section is currently visible.
───────────────────────────────────────── */
function initScrollSpy() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__list a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      if (link.getAttribute('href') === `#${id}`) {
        link.classList.add('nav__link--active');
      } else {
        link.classList.remove('nav__link--active');
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    {
      threshold:  0,
      rootMargin: '-72px 0px -40% 0px',
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ─────────────────────────────────────────
   3. Navbar Scroll Shadow
   Adds a shadow/background to the navbar
   once the user scrolls past 10 px.
───────────────────────────────────────── */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 10) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  // Run once on load in case the page is already scrolled
  onScroll();
}

/* ─────────────────────────────────────────
   4. Back-to-Top Button
   Shows / hides the button and scrolls to
   the top when clicked.
───────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const onScroll = () => {
    if (window.scrollY > 400) {
      btn.classList.add('back-to-top--visible');
    } else {
      btn.classList.remove('back-to-top--visible');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Run once on load
  onScroll();
}

/* ─────────────────────────────────────────
   5. Pricing Plan Pre-selection
   When a pricing CTA is clicked, write its
   plan name into the contact form's hidden
   plan field so the form knows which plan
   the user chose.
───────────────────────────────────────── */
function initPricingButtons() {
  const planField = document.querySelector('#plan');
  const buttons   = document.querySelectorAll('a[data-plan]');
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const plan = btn.getAttribute('data-plan');
      if (planField) {
        planField.value = plan;
      }
    });
  });
}

/* ─────────────────────────────────────────
   6. Contact Form Validation
   Real-time + on-submit validation with
   inline error messages and a success state.
───────────────────────────────────────── */
function initFormValidation() {
  const form       = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  if (!form) return;

  // Validation rules for required fields
  const rules = {
    name: {
      validate: (v) => v.trim().length >= 2,
      message:  'Please enter your full name (at least 2 characters).',
    },
    email: {
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message:  'Please enter a valid email address.',
    },
    message: {
      validate: (v) => v.trim().length >= 10,
      message:  'Message must be at least 10 characters.',
    },
    // company and plan are optional — no rules
  };

  /** Mark a field as invalid and display its error message */
  const showError = (fieldId, message) => {
    const field   = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}-error`);
    if (!field || !errorEl) return;
    field.closest('.form__group').classList.add('is-invalid');
    errorEl.textContent = message;
  };

  /** Remove the invalid state from a field */
  const clearError = (fieldId) => {
    const field   = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}-error`);
    if (!field || !errorEl) return;
    field.closest('.form__group').classList.remove('is-invalid');
    errorEl.textContent = '';
  };

  // Live validation — clear error as soon as the field becomes valid
  ['name', 'email', 'message'].forEach((id) => {
    const field = document.getElementById(id);
    if (!field) return;
    field.addEventListener('input', () => {
      if (rules[id].validate(field.value)) {
        clearError(id);
      }
    });
  });

  // On submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Validate each required field
    ['name', 'email', 'message'].forEach((id) => {
      const field = document.getElementById(id);
      if (!field) return;
      if (!rules[id].validate(field.value)) {
        showError(id, rules[id].message);
        valid = false;
      } else {
        clearError(id);
      }
    });

    if (!valid) return;

    // Show success state
    form.reset();
    form.hidden = true;
    if (successMsg) {
      successMsg.hidden = false;
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Reset after 6 seconds
    setTimeout(() => {
      if (successMsg) successMsg.hidden = true;
      form.hidden = false;
    }, 6000);
  });
}

/* ─────────────────────────────────────────
   7. Fade-In Animations
   Uses IntersectionObserver to trigger CSS
   fade-in transitions when elements enter
   the viewport.
───────────────────────────────────────── */
function initFadeInAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  // Mark document as JS-enabled for scroll animations
  document.documentElement.classList.add('js');

  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('fade-in--visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in--visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px 40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ─────────────────────────────────────────
   8. Dark / Light Theme Toggle
   Persists the user's preference in
   localStorage and applies it on load.
───────────────────────────────────────── */
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  /** Apply a theme to <html> and update the button's ARIA label */
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      btn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      document.documentElement.removeAttribute('data-theme');
      btn.setAttribute('aria-label', 'Switch to dark mode');
    }
  };

  // Apply saved preference on page load
  const saved = localStorage.getItem('theme') || 'light';
  applyTheme(saved);

  // Toggle on button click
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });
}

/* ─────────────────────────────────────────
   9. Init — entry point
   Called once the DOM is fully parsed.
───────────────────────────────────────── */
function init() {
  initMobileMenu();
  initScrollSpy();
  initNavbarScroll();
  initBackToTop();
  initPricingButtons();
  initFormValidation();
  initFadeInAnimations();
  initThemeToggle();
}

document.addEventListener('DOMContentLoaded', init);
