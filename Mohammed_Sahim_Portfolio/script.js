/* ══════════════════════════════════════════════════════════════════════
   MOHAMMED SAHIM — ACID BRUTAL PORTFOLIO  |  script.js
   Pure Vanilla JS — No frameworks, no libraries
   ══════════════════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════
   1. LOADER
══════════════════════════════════════ */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Hide loader after page ready + short delay
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = 'visible';
    }, 1800);
  });

  // Fallback
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 3500);
})();

/* ══════════════════════════════════════
   2. CUSTOM CURSOR
══════════════════════════════════════ */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower via rAF
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    raf = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effect on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .cta-button, .project-item, .mockup-window, .tools-list li');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      follower.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      follower.classList.remove('hovering');
    });
  });

  // Hide cursor when it leaves window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '0.6';
  });
})();

/* ══════════════════════════════════════
   3. NAVBAR — Scroll opacity / blur
══════════════════════════════════════ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScrollY = 0;
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollY > 60) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        lastScrollY = scrollY;
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ══════════════════════════════════════
   4. MOBILE MENU TOGGLE
══════════════════════════════════════ */
(function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  let open = false;

  toggle.addEventListener('click', () => {
    open = !open;
    links.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';

    // Animate hamburger → X
    const spans = toggle.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      open = false;
      links.classList.remove('open');
      document.body.style.overflow = '';
      toggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
})();

/* ══════════════════════════════════════
   5. SCROLL REVEAL  (IntersectionObserver)
══════════════════════════════════════ */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // fire once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
})();

/* ══════════════════════════════════════
   6. SKILLS MATRIX ANIMATED FILL
══════════════════════════════════════ */
(function initSkillsMatrix() {
  const matrix = document.querySelector('.skills-matrix');
  if (!matrix) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');

        // Staggered per-block delay
        const rows = entry.target.querySelectorAll('.matrix-row');
        rows.forEach((row, rowIdx) => {
          const blocks = row.querySelectorAll('.mb:not(.empty)');
          blocks.forEach((block, blockIdx) => {
            block.style.transitionDelay = `${(rowIdx * 0.08) + (blockIdx * 0.04)}s`;
          });
        });

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(matrix);
})();

/* ══════════════════════════════════════
   7. COUNTER ANIMATION
══════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1200;
    const start    = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease out expo
      const eased = 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ══════════════════════════════════════
   8. GLITCH / TYPEWRITER on hero name
══════════════════════════════════════ */
(function initHeroTypewriter() {
  const displayWords = document.querySelectorAll('.display-word');
  if (!displayWords.length) return;

  // Characters for scramble effect
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

  function scrambleText(el, finalText, duration = 800) {
    const totalFrames = Math.round(duration / 40);
    let frame = 0;

    const interval = setInterval(() => {
      const progress = frame / totalFrames;
      const revealedCount = Math.floor(progress * finalText.length);

      let display = '';
      for (let i = 0; i < finalText.length; i++) {
        if (i < revealedCount) {
          display += finalText[i];
        } else {
          display += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      // Keep existing ::before via data-glitch, update visible text
      el.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) node.textContent = display;
      });

      frame++;
      if (frame >= totalFrames) {
        clearInterval(interval);
        // Restore clean text node
        el.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) node.textContent = finalText;
        });
      }
    }, 40);
  }

  // Run scramble after loader hides
  setTimeout(() => {
    displayWords.forEach((word, i) => {
      const finalText = word.getAttribute('data-glitch') || word.textContent.trim();
      setTimeout(() => scrambleText(word, finalText, 1000), i * 200);
    });
  }, 2000);
})();

/* ══════════════════════════════════════
   9. SMOOTH SCROLL for anchor links
══════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight || 70;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ══════════════════════════════════════
   10. BARCODE DECORATIVE — dynamic generation
══════════════════════════════════════ */
(function initBarcodes() {
  const barcodes = document.querySelectorAll('.barcode-deco');
  barcodes.forEach(bc => {
    // Inject a few random thin bars as child divs for extra detail
    for (let i = 0; i < 20; i++) {
      const bar = document.createElement('div');
      const h = Math.random() * 60 + 40;
      const w = Math.random() < 0.3 ? 3 : 1;
      bar.style.cssText = `
        display: inline-block;
        width: ${w}px;
        height: ${h}%;
        background: rgba(255,255,255,${0.1 + Math.random() * 0.25});
        align-self: flex-end;
        flex-shrink: 0;
      `;
      bc.appendChild(bar);
    }
    // Clear pseudo-element content by overriding via inline style
    bc.style.setProperty('--clear', 'none');
  });
})();

/* ══════════════════════════════════════
   11. SECTION ACTIVE HIGHLIGHT in Navbar
══════════════════════════════════════ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navItems.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === '#' + id) {
            a.style.color = '#A8FF00';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

/* ══════════════════════════════════════
   12. PARALLAX tilt on portrait circle
══════════════════════════════════════ */
(function initParallax() {
  const portrait = document.querySelector('.portrait-circle');
  if (!portrait) return;

  document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const rx = ((clientY / innerHeight) - 0.5) * 10;
    const ry = ((clientX / innerWidth) - 0.5) * -10;
    portrait.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });

  document.addEventListener('mouseleave', () => {
    portrait.style.transform = '';
  });
})();

/* ══════════════════════════════════════
   13. CTA BUTTON magnetic effect
══════════════════════════════════════ */
(function initMagneticButton() {
  const btn = document.querySelector('.cta-button');
  if (!btn) return;

  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) * 0.3;
    const dy = (e.clientY - cy) * 0.3;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
    setTimeout(() => { btn.style.transition = ''; }, 400);
  });
})();

/* ══════════════════════════════════════
   14. SCROLL PROGRESS indicator (optional thin bar at top)
══════════════════════════════════════ */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    width: 0%;
    background: #A8FF00;
    z-index: 9999;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = pct + '%';
  }, { passive: true });
})();

/* ══════════════════════════════════════
   INIT LOG
══════════════════════════════════════ */
console.log('%cMOHAMMED SAHIM — PORTFOLIO', 'color:#A8FF00;font-family:monospace;font-size:16px;font-weight:bold;');
console.log('%cAI/ML DEVELOPER | KARNATAKA, INDIA', 'color:#888;font-family:monospace;font-size:11px;');
console.log('%cmohammedsahim18@gmail.com', 'color:#A8FF00;font-family:monospace;font-size:11px;');
