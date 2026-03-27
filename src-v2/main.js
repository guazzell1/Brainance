/* ============================================================
   Brainance — main.js
   Interactions: Nav scroll, reveal animations, counters,
   FAQ accordion, form validation
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Nav: always visible, scrolled state on scroll ---------- */
  const nav = document.getElementById('nav');
  nav.classList.add('is-visible');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ---------- Nav: mobile burger ---------- */
  const burger    = document.getElementById('burger');
  const navMobile = document.getElementById('nav-mobile');

  burger.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(isOpen));

    const spans = burger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMobile.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      const spans = burger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  function animateCounter(el, target, duration, prefix, suffix) {
    const startTime  = performance.now();
    const isLarge    = target >= 10000;
    const formatNum  = (n) => {
      if (target >= 500000000) {
        return 'R$ ' + (n / 1000000).toFixed(0) + 'M';
      }
      if (target >= 10000) {
        return n.toLocaleString('pt-BR');
      }
      return String(Math.round(n));
    };

    function step(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const value    = eased * target;

      el.textContent = formatNum(value);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatNum(target);
      }
    }

    requestAnimationFrame(step);
  }

  /* Hero stat counters */
  const heroCounters = document.querySelectorAll('.hero__stat-num[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target, 1800, '', '');
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  heroCounters.forEach(el => counterObserver.observe(el));

  /* Resultados big numbers */
  const resultadoCounters = document.querySelectorAll('.resultados__number[data-target]');

  const resultadoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target, 2000, '', '');
        resultadoObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  resultadoCounters.forEach(el => resultadoObserver.observe(el));

  /* ---------- FAQ accordion ---------- */
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // close all
      faqItems.forEach(i => {
        i.classList.remove('is-open');
        i.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      // toggle clicked
      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Contact form ---------- */
  const form       = document.getElementById('contato-form');
  const btnText    = document.getElementById('form-btn-text');
  const btnIcon    = document.getElementById('form-btn-icon');
  const successMsg = document.getElementById('form-success');

  if (form) {
    /* WhatsApp mask */
    const whatsappInput = document.getElementById('whatsapp');
    if (whatsappInput) {
      whatsappInput.addEventListener('input', () => {
        let v = whatsappInput.value.replace(/\D/g, '').slice(0, 11);
        if (v.length > 6) {
          v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
        } else if (v.length > 2) {
          v = `(${v.slice(0,2)}) ${v.slice(2)}`;
        } else if (v.length > 0) {
          v = `(${v}`;
        }
        whatsappInput.value = v;
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      /* Basic validation */
      const requiredFields = form.querySelectorAll('[required]');
      let valid = true;

      requiredFields.forEach(field => {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });

      if (!valid) {
        form.querySelectorAll('.error')[0]?.focus();
        return;
      }

      /* Simulate submission */
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled  = true;
      btnText.textContent = 'Enviando...';
      btnIcon.style.display = 'none';

      await new Promise(resolve => setTimeout(resolve, 1500));

      successMsg.classList.add('is-visible');

      /* Reset after showing success */
      setTimeout(() => {
        form.reset();
        submitBtn.disabled    = false;
        btnText.textContent   = 'Quero Meu Diagnóstico Gratuito';
        btnIcon.style.display = '';
        successMsg.classList.remove('is-visible');
      }, 5000);
    });
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
