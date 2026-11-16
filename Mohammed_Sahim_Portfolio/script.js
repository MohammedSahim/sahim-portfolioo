/**
 * Mohammed Sahim — Portfolio Scripts
 * Handles Theme Toggle, Navigation, Skills Filtering, Interactive Demos, Copy-to-Clipboard, and Contact Form
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DYNAMIC YEAR
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. THEME TOGGLE (Dark / Light)
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  
  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('sahim-portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  } else if (!systemPrefersDark) {
    html.setAttribute('data-theme', 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('sahim-portfolio-theme', newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  // 3. MOBILE MENU TOGGLE
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile nav when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 4. ACTIVE SECTION SCROLL SPY
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  function updateActiveNav() {
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav);

  // 5. SKILLS FILTERING
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 6. COPY TO CLIPBOARD WITH TOAST
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          showToast('Failed to copy. Please manually copy.');
        });
      }
    });
  });

  // 7. TOAST NOTIFICATION UTILITY
  function showToast(message) {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // 8. INTERACTIVE PROJECT DEMOS (MODAL)
  const demoButtons = document.querySelectorAll('.demo-btn');
  const modal = document.getElementById('demoModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  const demoTemplates = {
    agri: {
      title: 'AgriSakhi — Live AI Crop Diagnostic Simulator',
      html: `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          <p style="font-size:0.9rem; color:var(--text-secondary);">
            Select a simulated sample scenario to observe how AgriSakhi's computer vision and classification pipeline identifies disease signatures and generates treatment guidance.
          </p>

          <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;">
            <button class="agri-sample-btn active" data-sample="tomato" style="padding:0.75rem; border:1px solid var(--accent-primary); border-radius:8px; background:rgba(34,197,94,0.1); color:var(--text-primary); cursor:pointer; font-size:0.8rem; font-weight:600;">
              🍅 Tomato (Blight)
            </button>
            <button class="agri-sample-btn" data-sample="potato" style="padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-card); color:var(--text-secondary); cursor:pointer; font-size:0.8rem; font-weight:600;">
              🥔 Potato (Scab)
            </button>
            <button class="agri-sample-btn" data-sample="rice" style="padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-card); color:var(--text-secondary); cursor:pointer; font-size:0.8rem; font-weight:600;">
              🌾 Rice (Healthy)
            </button>
          </div>

          <div id="agriDemoOutput" style="background:#0d120f; border:1px solid var(--border-color); border-radius:10px; padding:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-primary);">ANALYSIS STATUS: COMPLETE</span>
              <span style="font-family:var(--font-mono); font-size:0.75rem; color:#86efac; background:rgba(34,197,94,0.15); padding:2px 8px; border-radius:12px;">Model: CNN / Scikit-learn</span>
            </div>
            <h4 style="font-size:1.1rem; color:#f87171; margin-bottom:0.35rem;">Early Blight (Alternaria solani) Detected</h4>
            <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1rem;">
              Confidence: <strong>96.8%</strong> · Severity: <strong>Moderate (Stage 2)</strong> · Affected Area: <strong>~18% leaf surface</strong>
            </p>
            <div style="background:rgba(255,255,255,0.03); padding:0.85rem; border-radius:6px; font-size:0.8rem; line-height:1.6;">
              <strong style="color:var(--accent-primary); display:block; margin-bottom:4px;">Recommended Farmer Action:</strong>
              1. Discontinue overhead watering to reduce canopy humidity.<br>
              2. Apply certified copper-based organic fungicide spray within 48 hours.<br>
              3. Remove and burn heavily infected foliage to prevent fungal sporulation.
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end;">
            <button id="reRunAgri" class="btn btn-sm btn-primary">
              Run Re-Analysis
            </button>
          </div>
        </div>
      `
    },
    audex: {
      title: 'Audexify — Web Accessibility Audit Engine',
      html: `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          <p style="font-size:0.9rem; color:var(--text-secondary);">
            Audexify parses webpage DOM nodes, visual contrast ratios, and ARIA roles against WCAG 2.1 standards. Test with a sample target below:
          </p>

          <div style="display:flex; gap:0.5rem;">
            <input type="text" id="demoAuditUrl" value="https://myschoolportal.edu/academics" style="flex:1; background:rgba(255,255,255,0.05); border:1px solid var(--border-color); padding:0.65rem 0.9rem; border-radius:6px; color:var(--text-primary); font-family:var(--font-mono); font-size:0.82rem;" />
            <button id="runAudexBtn" class="btn btn-sm btn-primary">Audit URL</button>
          </div>

          <div id="audexAuditResults" style="background:#0d120f; border:1px solid var(--border-color); border-radius:10px; padding:1.25rem;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
              <div>
                <span style="font-size:1.6rem; font-weight:800; font-family:var(--font-mono); color:var(--accent-primary);">94</span>
                <span style="font-size:0.8rem; color:var(--text-muted);">/100 A11Y Score</span>
              </div>
              <span style="font-family:var(--font-mono); font-size:0.75rem; color:#38bdf8; background:rgba(56,189,248,0.15); padding:3px 9px; border-radius:12px;">WCAG 2.1 AA</span>
            </div>

            <div style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.8rem;">
              <div style="display:flex; justify-content:space-between; padding:0.5rem; background:rgba(255,255,255,0.02); border-radius:4px;">
                <span>✅ Text Contrast Ratios (Minimum 4.5:1)</span>
                <strong style="color:var(--accent-primary);">100% Passed</strong>
              </div>
              <div style="display:flex; justify-content:space-between; padding:0.5rem; background:rgba(255,255,255,0.02); border-radius:4px;">
                <span>✅ Interactive Focus Indicators</span>
                <strong style="color:var(--accent-primary);">Passed</strong>
              </div>
              <div style="display:flex; justify-content:space-between; padding:0.5rem; background:rgba(245,158,11,0.08); border-radius:4px; border-left:3px solid #f59e0b;">
                <span>⚠️ Missing Alt Attributes on 2 Image Elements</span>
                <strong style="color:#f59e0b;">Action Required</strong>
              </div>
            </div>

            <div style="margin-top:1rem; padding:0.75rem; background:rgba(56,189,248,0.08); border-radius:6px; font-size:0.78rem; color:var(--text-secondary);">
              <strong style="color:#38bdf8; display:block; margin-bottom:2px;">✨ AI Accessibility Recommendation:</strong>
              Two decorative banners inside <code>&lt;header&gt;</code> lack alt tags. Add <code>alt=""</code> or <code>aria-hidden="true"</code> so screen readers can skip non-semantic illustrations smoothly.
            </div>
          </div>
        </div>
      `
    }
  };

  function openModal(type) {
    const data = demoTemplates[type];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.html;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');

    // Attach internal demo listeners
    if (type === 'agri') {
      setupAgriDemoListeners();
    } else if (type === 'audex') {
      setupAudexDemoListeners();
    }
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  demoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const demoType = btn.getAttribute('data-demo');
      openModal(demoType);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Simulator Logic for AgriSakhi
  function setupAgriDemoListeners() {
    const sampleButtons = modalBody.querySelectorAll('.agri-sample-btn');
    const output = modalBody.getElementById('agriDemoOutput');
    const reRunBtn = modalBody.getElementById('reRunAgri');

    const sampleData = {
      tomato: {
        disease: 'Early Blight (Alternaria solani)',
        color: '#f87171',
        conf: '96.8%',
        severity: 'Moderate (Stage 2)',
        area: '~18% leaf surface',
        action: '1. Discontinue overhead watering to reduce canopy humidity.<br>2. Apply certified copper-based organic fungicide spray within 48 hours.<br>3. Remove heavily infected lower leaves.'
      },
      potato: {
        disease: 'Common Potato Scab (Streptomyces scabies)',
        color: '#fbbf24',
        conf: '92.4%',
        severity: 'Mild (Surface lesions)',
        area: '~9% tuber area',
        action: '1. Maintain soil moisture levels between 80-85% during tuber formation.<br>2. Avoid applying fresh manure prior to planting; lower soil pH below 5.2.'
      },
      rice: {
        disease: 'Healthy Leaf — No Pathogen Detected',
        color: '#4ade80',
        conf: '99.1%',
        severity: 'None (Healthy)',
        area: '0%',
        action: 'Crop vitality is optimal. Continue scheduled organic fertilization and monitor weekly irrigation schedule.'
      }
    };

    function renderAgriSample(key) {
      const d = sampleData[key];
      output.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-primary);">ANALYSIS STATUS: COMPLETE</span>
          <span style="font-family:var(--font-mono); font-size:0.75rem; color:#86efac; background:rgba(34,197,94,0.15); padding:2px 8px; border-radius:12px;">Model: CNN / Scikit-learn</span>
        </div>
        <h4 style="font-size:1.1rem; color:${d.color}; margin-bottom:0.35rem;">${d.disease}</h4>
        <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1rem;">
          Confidence: <strong>${d.conf}</strong> · Severity: <strong>${d.severity}</strong> · Affected Area: <strong>${d.area}</strong>
        </p>
        <div style="background:rgba(255,255,255,0.03); padding:0.85rem; border-radius:6px; font-size:0.8rem; line-height:1.6;">
          <strong style="color:var(--accent-primary); display:block; margin-bottom:4px;">Recommended Farmer Action:</strong>
          ${d.action}
        </div>
      `;
    }

    sampleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        sampleButtons.forEach(b => {
          b.style.borderColor = 'var(--border-color)';
          b.style.background = 'var(--bg-card)';
          b.style.color = 'var(--text-secondary)';
        });
        btn.style.borderColor = 'var(--accent-primary)';
        btn.style.background = 'rgba(34,197,94,0.1)';
        btn.style.color = 'var(--text-primary)';

        const sampleKey = btn.getAttribute('data-sample');
        renderAgriSample(sampleKey);
      });
    });

    if (reRunBtn) {
      reRunBtn.addEventListener('click', () => {
        output.innerHTML = `<div style="text-align:center; padding:1.5rem; color:var(--accent-primary); font-family:var(--font-mono); font-size:0.85rem;">🔄 Extracting leaf contours and running ML classifier...</div>`;
        setTimeout(() => {
          renderAgriSample('tomato');
        }, 600);
      });
    }
  }

  // Simulator Logic for Audexify
  function setupAudexDemoListeners() {
    const runBtn = modalBody.getElementById('runAudexBtn');
    const urlInput = modalBody.getElementById('demoAuditUrl');
    const resultsBox = modalBody.getElementById('audexAuditResults');

    if (runBtn) {
      runBtn.addEventListener('click', () => {
        const url = urlInput.value.trim() || 'https://target-site.edu';
        resultsBox.innerHTML = `
          <div style="text-align:center; padding:1.5rem; color:#38bdf8; font-family:var(--font-mono); font-size:0.85rem;">
            ⚡ Crawling DOM nodes and verifying contrast ratios for <code>${url}</code>...
          </div>
        `;

        setTimeout(() => {
          resultsBox.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
              <div>
                <span style="font-size:1.6rem; font-weight:800; font-family:var(--font-mono); color:var(--accent-primary);">96</span>
                <span style="font-size:0.8rem; color:var(--text-muted);">/100 A11Y Score</span>
              </div>
              <span style="font-family:var(--font-mono); font-size:0.75rem; color:#86efac; background:rgba(34,197,94,0.15); padding:3px 9px; border-radius:12px;">WCAG 2.1 AA Passed</span>
            </div>

            <div style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.8rem;">
              <div style="display:flex; justify-content:space-between; padding:0.5rem; background:rgba(255,255,255,0.02); border-radius:4px;">
                <span>✅ Heading Hierarchy (H1 through H4)</span>
                <strong style="color:var(--accent-primary);">Valid</strong>
              </div>
              <div style="display:flex; justify-content:space-between; padding:0.5rem; background:rgba(255,255,255,0.02); border-radius:4px;">
                <span>✅ Form Labels & ARIA Relationships</span>
                <strong style="color:var(--accent-primary);">Compliant</strong>
              </div>
              <div style="display:flex; justify-content:space-between; padding:0.5rem; background:rgba(56,189,248,0.06); border-radius:4px; border-left:3px solid #38bdf8;">
                <span>ℹ️ 1 Link with Ambiguous "Click Here" Anchor</span>
                <strong style="color:#38bdf8;">Optimization Notice</strong>
              </div>
            </div>

            <div style="margin-top:1rem; padding:0.75rem; background:rgba(56,189,248,0.08); border-radius:6px; font-size:0.78rem; color:var(--text-secondary);">
              <strong style="color:#38bdf8; display:block; margin-bottom:2px;">✨ AI Accessibility Guidance:</strong>
              Replace generic anchor text <em>"click here"</em> in footer with descriptive target like <em>"Download Student Handbook PDF"</em> to enhance screen reader contextual navigation.
            </div>
          `;
        }, 700);
      });
    }
  }

  // 9. CONTACT FORM DISPATCH
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const subject = document.getElementById('senderSubject').value.trim();
      const message = document.getElementById('senderMessage').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in your name, email, and message.');
        return;
      }

      // Prepare mailto link
      const emailRecipient = 'mohammedsahim18@gmail.com';
      const mailtoSubject = encodeURIComponent(subject || `Message from ${name}`);
      const mailtoBody = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n(Sent via Mohammed Sahim Portfolio Website)`
      );

      const mailtoUrl = `mailto:${emailRecipient}?subject=${mailtoSubject}&body=${mailtoBody}`;

      showToast('Opening your email client to send message...');
      
      // Delay slightly for toast feedback before redirecting
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 500);
    });
  }
});
