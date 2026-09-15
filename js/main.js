/**
 * VEXOR HUB — main.js
 * Navbar, FAQ, Tabs, Reveal, Carrossel, Mobile Menu
 * Sem cursor personalizado, sem Three.js, sem GSAP pesado.
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
    onScroll(); // estado inicial

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

      // Fecha ao clicar em link
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
     REGRA: conteúdo NUNCA fica invisível se o
     observer falhar (CSS já define opacity: 0,
     JS adiciona "is-visible")
     ───────────────────────────────────────── */
  function initReveal() {
    // Se prefers-reduced-motion, marcar tudo como visível imediatamente
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('is-visible');
      });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      // Fallback: mostra tudo
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger para elementos irmãos no grid
          const el = entry.target;
          const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
          const idx = siblings.indexOf(el);
          const delay = Math.min(idx * 80, 400); // máx 400ms de delay
          el.style.transitionDelay = delay + 'ms';
          el.classList.add('is-visible');
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  /* ─────────────────────────────────────────
     4. TABS DE SOLUÇÕES
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
      // Acessibilidade: setas do teclado
      tab.addEventListener('keydown', e => {
        const tabList = Array.from(tabs);
        const idx = tabList.indexOf(tab);
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          tabList[(idx + 1) % tabList.length].focus();
          showTab(tabList[(idx + 1) % tabList.length]);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          tabList[(idx - 1 + tabList.length) % tabList.length].focus();
          showTab(tabList[(idx - 1 + tabList.length) % tabList.length]);
        }
      });
    });

    // Inicializa: primeira tab ativa
    if (tabs.length) showTab(tabs[0]);
  }

  /* ─────────────────────────────────────────
     5. FAQ ACCORDION
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

        // Abre o clicado (se estava fechado)
        if (!isOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ─────────────────────────────────────────
     6. SCROLL SUAVE — links âncora
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
     7. BACK TO TOP
     ───────────────────────────────────────── */
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ─────────────────────────────────────────
     8. CARROSSEL DE TECNOLOGIA
     ───────────────────────────────────────── */
  function initTechCarousel() {
    const inner = document.getElementById('tech-carousel-inner');
    if (!inner) return;

    // Pausa no hover via JS (reforço além do CSS)
    inner.addEventListener('mouseenter', () => inner.style.animationPlayState = 'paused');
    inner.addEventListener('mouseleave', () => inner.style.animationPlayState = 'running');
  }

  /* ─────────────────────────────────────────
     INIT
     ───────────────────────────────────────── */
  function init() {
    initNavbar();
    initScrollProgress();
    initReveal();
    initSolutionsTabs();
    initFaq();
    initSmoothScroll();
    initBackToTop();
    initTechCarousel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
