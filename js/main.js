/**
 * VEXOR HUB — main.js
 * Navbar, FAQ, Tabs de Soluções (4 grupos), Circuito Método Vexor,
 * Modal Lightbox de Prints, Reveal, Mobile Menu
 * 100% em Português do Brasil, sem dependências externas.
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     1. NAVBAR — scroll + mobile menu
     ───────────────────────────────────────── */
  function initNavbar() {
    const header = document.getElementById('site-header');
    const toggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!header) return;

    // Scroll: adiciona classe "scrolled"
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 30);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile menu toggle
    if (toggle && mobileMenu) {
      toggle.addEventListener('click', () => {
        const isOpen = !mobileMenu.hidden;
        mobileMenu.hidden = isOpen;
        toggle.setAttribute('aria-expanded', String(!isOpen));

        // Animação do ícone
        const bars = toggle.querySelectorAll('.menu-bar');
        if (!isOpen) {
          bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          bars[1].style.opacity = '0';
          bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
          bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
        }
      });

      // Fecha ao clicar em qualquer link
      mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-cta').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.hidden = true;
          toggle.setAttribute('aria-expanded', 'false');
          const bars = toggle.querySelectorAll('.menu-bar');
          bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
        });
      });
    }
  }

  /* ─────────────────────────────────────────
     2. BARRA DE PROGRESSO DE SCROLL
     ───────────────────────────────────────── */
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) bar.style.width = ((window.scrollY / total) * 100) + '%';
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     3. SCROLL REVEAL — IntersectionObserver
     ───────────────────────────────────────── */
  function initReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
          const idx = siblings.indexOf(el);
          const delay = Math.min(idx * 80, 400);
          el.style.transitionDelay = delay + 'ms';
          el.classList.add('is-visible');
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  /* ─────────────────────────────────────────
     4. TABS DE SOLUÇÕES (4 GRUPOS)
     ───────────────────────────────────────── */
  function initSolutionsTabs() {
    const tabsContainer = document.getElementById('solutions-tabs');
    if (!tabsContainer) return;

    const tabs = tabsContainer.querySelectorAll('.sol-tab');
    const panels = document.querySelectorAll('.sol-panel');

    function showTab(targetTab) {
      tabs.forEach(t => {
        const isActive = t === targetTab;
        t.setAttribute('aria-selected', String(isActive));
        t.classList.toggle('sol-tab--active', isActive);
      });

      const targetId = targetTab.getAttribute('aria-controls');
      panels.forEach(panel => {
        const isTarget = panel.id === targetId;
        panel.hidden = !isTarget;
        if (isTarget) {
          panel.classList.add('sol-panel--active');
          panel.removeAttribute('hidden');
        } else {
          panel.classList.remove('sol-panel--active');
          panel.setAttribute('hidden', '');
        }
      });
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => showTab(tab));
      tab.addEventListener('keydown', e => {
        const tabList = Array.from(tabs);
        const idx = tabList.indexOf(tab);
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const next = tabList[(idx + 1) % tabList.length];
          next.focus();
          showTab(next);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prev = tabList[(idx - 1 + tabList.length) % tabList.length];
          prev.focus();
          showTab(prev);
        }
      });
    });

    if (tabs.length) showTab(tabs[0]);
  }

  /* ─────────────────────────────────────────
     5. CIRCUITO MÉTODO VEXOR — Interatividade
     ───────────────────────────────────────── */
  function initCircuitInteractive() {
    const nodes = document.querySelectorAll('.circuit-node');
    const cards = document.querySelectorAll('.method-step-card');
    if (!nodes.length || !cards.length) return;

    function selectStep(stepIndex) {
      nodes.forEach(n => {
        const isSelected = n.getAttribute('data-step') === String(stepIndex);
        n.classList.toggle('circuit-node--active', isSelected);
        n.setAttribute('aria-selected', String(isSelected));
      });

      cards.forEach(c => {
        const isSelected = c.getAttribute('data-step') === String(stepIndex);
        c.classList.toggle('method-step-card--active', isSelected);
        if (isSelected) {
          c.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
      });
    }

    nodes.forEach(node => {
      node.addEventListener('click', () => {
        const step = node.getAttribute('data-step');
        if (step !== null) selectStep(Number(step));
      });
    });

    cards.forEach(card => {
      card.addEventListener('click', () => {
        const step = card.getAttribute('data-step');
        if (step !== null) selectStep(Number(step));
      });
    });
  }

  /* ─────────────────────────────────────────
     6. MODAL LIGHTBOX PARA PRINTS
     ───────────────────────────────────────── */
  function initPrintModal() {
    const modal = document.getElementById('print-modal');
    const modalImg = document.getElementById('print-modal-img');
    const modalCaption = document.getElementById('print-modal-caption');
    const modalClose = document.getElementById('print-modal-close');
    const modalBackdrop = document.getElementById('print-modal-backdrop');
    const printCards = document.querySelectorAll('.zoomable-print');

    if (!modal || !modalImg) return;

    function openModal(src, caption) {
      modalImg.src = src;
      modalCaption.textContent = caption || '';
      modal.hidden = false;
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
      modalImg.src = '';
      document.body.style.overflow = '';
    }

    printCards.forEach(card => {
      card.addEventListener('click', () => {
        const src = card.getAttribute('data-image');
        const caption = card.getAttribute('data-caption');
        if (src) openModal(src, caption);
      });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });
  }

  /* ─────────────────────────────────────────
     7. FAQ ACCORDION (7 ITENS)
     ───────────────────────────────────────── */
  function initFaq() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Fecha todos
        items.forEach(i => {
          i.classList.remove('is-open');
          const t = i.querySelector('.faq-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        });

        // Abre o clicado se estava fechado
        if (!isOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ─────────────────────────────────────────
     8. SCROLL SUAVE — LINKS ÂNCORA
     ───────────────────────────────────────── */
  function initSmoothScroll() {
    const HEADER_HEIGHT = 72;
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ─────────────────────────────────────────
     9. BACK TO TOP
     ───────────────────────────────────────── */
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ─────────────────────────────────────────
     INIT
     ───────────────────────────────────────── */
  function init() {
    initNavbar();
    initScrollProgress();
    initReveal();
    initSolutionsTabs();
    initCircuitInteractive();
    initPrintModal();
    initFaq();
    initSmoothScroll();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
