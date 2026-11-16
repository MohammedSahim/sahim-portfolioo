/* ══════════════════════════════════════════════════════════════════════
   MOHAMMED SAHIM — ACID BRUTAL PORTFOLIO JAVASCRIPT
   Pure Vanilla JS — Animations, Interactive Matrix, Project Modal & Soundless Interactions
   ══════════════════════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════
     01. CUSTOM ACID CURSOR
  ══════════════════════════════════════ */
  const cursor = document.getElementById('acidCursor');
  const cursorDot = document.getElementById('acidCursorDot');

  if (cursor && cursorDot && window.matchMedia('(hover: hover)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function renderCursor() {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Hover effect on clickable elements
    const hoverables = document.querySelectorAll('a, button, .project-entry, .matrix-cell, .work-together-btn');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

  /* ══════════════════════════════════════
     02. SKILLS PIXEL MATRIX BUILDER & ANIMATION
  ══════════════════════════════════════ */
  const matrixContainer = document.getElementById('pixelMatrix');
  if (matrixContainer) {
    // Stepped equalizer levels corresponding to template pattern
    const rowLevels = [
      9, // Python & C++
      9, // Machine Learning
      8, // Computer Vision
      7, // NLP & LLMs
      8, // Agentic AI
      9, // Data Analytics
      9, // Scikit & Pandas
      8  // DSA & OOP
    ];

    rowLevels.forEach((level, rIdx) => {
      const row = document.createElement('div');
      row.className = 'matrix-row';

      for (let c = 0; c < 10; c++) {
        const cell = document.createElement('div');
        cell.className = 'matrix-cell';
        if (c < level) {
          // Delay stagger for wave illumination
          setTimeout(() => {
            cell.classList.add('filled');
          }, (rIdx * 70) + (c * 35));
        }

        // Interactive hover reaction
        cell.addEventListener('mouseenter', () => {
          cell.style.transform = 'scale(1.4)';
          cell.style.backgroundColor = '#FFFFFF';
        });
        cell.addEventListener('mouseleave', () => {
          cell.style.transform = '';
          cell.style.backgroundColor = '';
        });

        row.appendChild(cell);
      }
      matrixContainer.appendChild(row);
    });
  }

  /* ══════════════════════════════════════
     03. KINETIC TEXT SCRAMBLE ANIMATION
  ══════════════════════════════════════ */
  const scrambleElements = document.querySelectorAll('[data-scramble]');
  const glyphs = 'ABCDEFGHIKLMNOPQRSTUVWXYZ0123456789!<>_+-~';

  function scrambleText(element) {
    const originalText = element.getAttribute('data-scramble') || element.textContent.trim();
    const distressSpan = element.querySelector('.distress-text') || element;
    let iteration = 0;
    const maxIterations = originalText.length * 2.5;

    const interval = setInterval(() => {
      distressSpan.textContent = originalText
        .split('')
        .map((char, index) => {
          if (index < iteration / 2.5) {
            return originalText[index];
          }
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join('');

      if (iteration >= maxIterations) {
        distressSpan.textContent = originalText;
        clearInterval(interval);
      }
      iteration++;
    }, 30);
  }

  // Initial scramble on load
  scrambleElements.forEach((el, i) => {
    setTimeout(() => scrambleText(el), 300 + (i * 250));
    el.addEventListener('mouseenter', () => scrambleText(el));
  });

  /* ══════════════════════════════════════
     04. PORTRAIT PARALLAX 3D TILT
  ══════════════════════════════════════ */
  const portraitStage = document.getElementById('portraitStage');
  if (portraitStage && window.matchMedia('(hover: hover)').matches) {
    portraitStage.addEventListener('mousemove', (e) => {
      const rect = portraitStage.getBoundingClientRect();
      const x = e.clientX - rect.left - (rect.width / 2);
      const y = e.clientY - rect.top - (rect.height / 2);
      
      const tiltX = (y / (rect.height / 2)) * -6;
      const tiltY = (x / (rect.width / 2)) * 6;

      portraitStage.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    portraitStage.addEventListener('mouseleave', () => {
      portraitStage.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      portraitStage.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    portraitStage.addEventListener('mouseenter', () => {
      portraitStage.style.transition = 'none';
    });
  }

  /* ══════════════════════════════════════
     05. MAGNETIC "WORK TOGETHER" BUTTON
  ══════════════════════════════════════ */
  const workBtn = document.getElementById('workTogetherBtn');
  if (workBtn && window.matchMedia('(hover: hover)').matches) {
    workBtn.addEventListener('mousemove', (e) => {
      const rect = workBtn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      workBtn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });

    workBtn.addEventListener('mouseleave', () => {
      workBtn.style.transform = 'translate(0px, 0px)';
      workBtn.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      setTimeout(() => { workBtn.style.transition = ''; }, 400);
    });
  }

  /* ══════════════════════════════════════
     06. INTERACTIVE PROJECT DETAILS MODAL
  ══════════════════════════════════════ */
  const projectModal = document.getElementById('projectModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');
  const modalId = document.getElementById('modalId');
  const modalBody = document.getElementById('modalBody');

  const projectData = {
    agrisakhi: {
      id: 'PROJECT // 01',
      title: 'AGRISAKHI',
      tagline: 'AI-Based Agricultural Assistance Application',
      desc: 'Developed an AI-driven agricultural decision-support application to empower regional farmers with real-time crop disease classification, soil moisture evaluation, and actionable prescriptive insights.',
      bullets: [
        'Developed end-to-end computer vision and classification models to detect crop pathologies with 96.8% accuracy.',
        'Applied predictive machine learning models to generate tailored fertilizer and irrigation recommendations.',
        'Engineered an intuitive, high-contrast multilingual interface designed specifically for field conditions.',
        'Implemented data pipelines preprocessing multimodal soil, weather, and sensor telemetry metrics.'
      ],
      tech: ['Python', 'Machine Learning', 'Scikit-learn', 'Computer Vision', 'Data Analytics', 'Pandas'],
      repo: 'https://github.com/MohammedSahim'
    },
    audexify: {
      id: 'PROJECT // 02',
      title: 'AUDEXIFY',
      tagline: 'AI-Powered Web Accessibility Auditor',
      desc: 'Engineered an intelligent automated web accessibility platform that audits websites against WCAG 2.1 AA/AAA guidelines, detects structural flaws, and provides AI-generated plain-language remediation instructions.',
      bullets: [
        'Implemented webpage DOM parser and automated contrast ratio verification (identifying color legibility flaws).',
        'Built automated AI pipeline for analyzing visual hierarchies and diagnosing screen reader accessibility gaps.',
        'Generates actionable remediation summaries with live HTML/CSS fix recommendations for developers.',
        'Designed URL submission dashboard with live compliance breakdown and scoring metrics.'
      ],
      tech: ['Python', 'Artificial Intelligence', 'Web Tech', 'NLP', 'Computer Vision', 'WCAG 2.1'],
      repo: 'https://github.com/MohammedSahim'
    },
    pinnacle: {
      id: 'PROJECT // 03',
      title: 'PINNACLE 2026',
      tagline: 'Event Coordinator · International Technical Symposium & AI Summit',
      desc: 'Led organizational activities and technical competitions at Pinnacle 2026, coordinating hackathons, AI workshops, and project showcases for hundreds of engineering participants.',
      bullets: [
        'Coordinated event logistics and multi-track competitive hackathons for 50+ development teams.',
        'Spearheaded AI Summit technical sessions covering Machine Learning, Computer Vision, and Agentic AI.',
        'Presented practical AI application benchmarks and mentored student teams on model development.',
        'Organized collaborative technical challenges emphasizing teamwork and fast-paced engineering.'
      ],
      tech: ['Leadership', 'Event Coordination', 'Technical Workshops', 'Hackathon Mentorship'],
      repo: 'https://github.com/MohammedSahim'
    }
  };

  function openProjectModal(key) {
    const data = projectData[key];
    if (!data) return;

    modalId.textContent = data.id;
    modalBody.innerHTML = `
      <h3 class="modal-title">${data.title}</h3>
      <p class="modal-tagline">${data.tagline}</p>
      <p class="modal-desc">${data.desc}</p>
      <ul class="modal-bullets">
        ${data.bullets.map(b => `<li>${b}</li>`).join('')}
      </ul>
      <div class="modal-tech-stack">
        ${data.tech.map(t => `<span class="modal-pill">${t}</span>`).join('')}
      </div>
      <div class="modal-actions">
        <a href="${data.repo}" target="_blank" rel="noopener" class="modal-action-btn">
          <span>VIEW ON GITHUB</span>
          <span>↗</span>
        </a>
      </div>
    `;

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-entry').forEach(entry => {
    entry.addEventListener('click', () => {
      const pKey = entry.getAttribute('data-project');
      openProjectModal(pKey);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeProjectModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('open')) {
      closeProjectModal();
    }
  });

  /* ══════════════════════════════════════
     07. CLICK-TO-COPY TOAST NOTIFICATION
  ══════════════════════════════════════ */
  const toast = document.getElementById('acidToast');
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  const copyEmail = document.querySelector('.link-email');
  if (copyEmail) {
    copyEmail.addEventListener('click', (e) => {
      // Copy to clipboard
      navigator.clipboard.writeText('mohammedsahim18@gmail.com').then(() => {
        showToast('COPIED TO CLIPBOARD: mohammedsahim18@gmail.com');
      }).catch(() => {});
    });
  }

  const copyPhone = document.querySelector('.link-phone');
  if (copyPhone) {
    copyPhone.addEventListener('click', (e) => {
      navigator.clipboard.writeText('+91 9880167028').then(() => {
        showToast('COPIED TO CLIPBOARD: +91 9880167028');
      }).catch(() => {});
    });
  }

  console.log('%c ACID BRUTAL PORTFOLIO LOADED ', 'background: #BAFF00; color: #000; font-weight: bold; padding: 4px 8px;');
});
