document.addEventListener('DOMContentLoaded', () => {
  // 移动端导航开关
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.contains('max-h-96');
      menu.classList.toggle('max-h-0', isOpen);
      menu.classList.toggle('max-h-96', !isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  // Mega Menu (桌面端：hover，移动端：accordion)
  const megaTrigger = document.getElementById('mega-trigger');
  const megaPanel = document.getElementById('mega-panel');
  if (megaTrigger && megaPanel) {
    let hideTimer = null;
    const show = () => { clearTimeout(hideTimer); megaPanel.classList.add('is-open'); megaTrigger.setAttribute('aria-expanded', 'true'); };
    const hide = () => { hideTimer = setTimeout(() => { megaPanel.classList.remove('is-open'); megaTrigger.setAttribute('aria-expanded', 'false'); }, 120); };
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    if (supportsHover) {
      megaTrigger.addEventListener('mouseenter', show);
      megaTrigger.addEventListener('mouseleave', hide);
      megaPanel.addEventListener('mouseenter', () => clearTimeout(hideTimer));
      megaPanel.addEventListener('mouseleave', hide);
    }
    megaTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = megaPanel.classList.contains('is-open');
      if (!isOpen) { show(); return; }
      // already open: on hover-capable devices that was hover's doing, so a click shouldn't force it shut
      // (that mismatch was the original bug); on touch/no-hover devices, a second tap closes it
      if (!supportsHover) { clearTimeout(hideTimer); megaPanel.classList.remove('is-open'); megaTrigger.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && megaPanel.classList.contains('is-open')) {
        megaPanel.classList.remove('is-open');
        megaTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 移动端 mega menu accordion
  document.querySelectorAll('.mega-mobile-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const isOpen = target.classList.contains('is-open');
      target.classList.toggle('is-open', !isOpen);
      btn.classList.toggle('is-open', !isOpen);
    });
  });

  // 开场动画（仅首页）
  const overlay = document.getElementById('intro-overlay');
  if (overlay) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveals = document.querySelectorAll('.hero-reveal');
    if (reduceMotion) {
      overlay.remove();
      reveals.forEach((el) => el.classList.add('is-visible'));
    } else {
      document.documentElement.classList.add('intro-lock');
      const percentEl = document.getElementById('intro-percent');
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        if (percentEl) percentEl.textContent = String(Math.floor(progress * 100)).padStart(2, '0') + '%';
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          overlay.classList.add('is-hidden');
          document.documentElement.classList.remove('intro-lock');
          reveals.forEach((el) => el.classList.add('is-visible'));
          setTimeout(() => overlay.remove(), 650);
        }
      };
      requestAnimationFrame(tick);
    }
  }

  // 滚动淡入
  const targets = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    targets.forEach((el) => observer.observe(el));
  } else {
    targets.forEach((el) => el.classList.add('is-visible'));
  }
});
