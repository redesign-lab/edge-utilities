(() => {
  'use strict';

  const header = document.getElementById('site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const toastEl = document.getElementById('copy-toast');
  let toastTimer = null;

  /* ------------------------------------------------------------------------
     Sticky Header Scroll State
     ------------------------------------------------------------------------ */
  const updateHeaderState = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', updateHeaderState, { passive: true });
  updateHeaderState();

  /* ------------------------------------------------------------------------
     Mobile Navigation Drawer
     ------------------------------------------------------------------------ */
  const setMenuOpen = (isOpen) => {
    if (!menuToggle || !mobileNav) return;
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    mobileNav.hidden = !isOpen;
  };

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const current = menuToggle.getAttribute('aria-expanded') === 'true';
      setMenuOpen(!current);
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
        menuToggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    });
  }

  /* ------------------------------------------------------------------------
     Toast Feedback & Clipboard Helper
     ------------------------------------------------------------------------ */
  const showToast = (message) => {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.hidden = true;
    }, 2600);
  };

  const copyToClipboard = async (text, successMsg) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const temp = document.createElement('textarea');
        temp.value = text;
        temp.setAttribute('readonly', '');
        temp.style.position = 'fixed';
        temp.style.left = '-9999px';
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
      }
      showToast(successMsg);
    } catch {
      showToast('Copy failed — please select text manually.');
    }
  };

  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-copy');
      if (val) {
        copyToClipboard(val, `Copied: ${val}`);
      }
    });
  });

  /* ------------------------------------------------------------------------
     Core Division Filter Tabs
     ------------------------------------------------------------------------ */
  const filterTabs = document.querySelectorAll('.filter-tab[data-filter]');
  const serviceRows = document.querySelectorAll('.service-row[data-division]');

  const applyDivisionFilter = (division) => {
    filterTabs.forEach((tab) => {
      const active = tab.getAttribute('data-filter') === division;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });

    serviceRows.forEach((row) => {
      const matches = division === 'all' || row.getAttribute('data-division') === division;
      row.hidden = !matches;
    });
  };

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      applyDivisionFilter(tab.getAttribute('data-filter') || 'all');
    });
  });

  document.querySelectorAll('[data-filter-trigger]').forEach((link) => {
    link.addEventListener('click', () => {
      const div = link.getAttribute('data-filter-trigger');
      if (div) applyDivisionFilter(div);
    });
  });

  /* ------------------------------------------------------------------------
     Process Stepper Tabs (Mobile & Tablet Interactive View)
     ------------------------------------------------------------------------ */
  const stepTabs = document.querySelectorAll('.step-tab[data-step]');
  const stepPanels = document.querySelectorAll('.process-step[data-step-panel]');

  const selectStep = (stepNum) => {
    stepTabs.forEach((tab) => {
      const active = tab.getAttribute('data-step') === stepNum;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });

    stepPanels.forEach((panel) => {
      const active = panel.getAttribute('data-step-panel') === stepNum;
      panel.classList.toggle('is-active-step', active);
    });
  };

  stepTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      selectStep(tab.getAttribute('data-step') || '1');
    });
  });

  /* ------------------------------------------------------------------------
     Interactive Corridor Map & City Selector
     ------------------------------------------------------------------------ */
  const CORRIDOR_DATA = {
    hattiesburg: {
      name: 'Hattiesburg & Oak Grove Dispatch Hub',
      route: 'I-59 · US-49 · US-98 Hub',
      desc: 'Home yard and office at 52 Cherry Laurel Loop (Lamar County) supporting municipal public works, commercial developments, and regional utility districts.'
    },
    petal: {
      name: 'Petal & Forrest County Corridor',
      route: 'US-42 · Evelyn Gandy Pkwy',
      desc: 'Direct access across the Leaf River into Petal and Forrest County for municipal water mains, sanitary sewer upgrades, and storm drainage.'
    },
    purvis: {
      name: 'Purvis, Lumberton & South I-59',
      route: 'I-59 South · US-11 Corridor',
      desc: 'Serving Lamar and Pearl River County utility associations, rural waterline extensions, and trenchless highway directional bores.'
    },
    laurel: {
      name: 'Laurel & Jones County (I-59 North)',
      route: 'I-59 North · US-84',
      desc: 'Mobilizing excavation iron and pipe crews north along I-59 for municipal distribution loops, sewer force mains, and lift stations.'
    },
    columbia: {
      name: 'Columbia, Sumrall & US-98 West',
      route: 'US-98 West · MS-13',
      desc: 'Supporting Marion County and western Lamar County water system improvements, ARPA utility contracts, and HDPE road crossings.'
    },
    wiggins: {
      name: 'Wiggins, Stone County & US-49 South',
      route: 'US-49 South Corridor',
      desc: 'Rapid heavy-civil dispatch south along Highway 49 for municipal sewer, commercial site drainage, and long-run directional boring.'
    }
  };

  const corridorChips = document.querySelectorAll('.corridor-chip[data-corridor]');
  const mapNodes = document.querySelectorAll('.map-node[data-corridor]');
  const corridorNameEl = document.getElementById('corridor-name');
  const corridorRouteEl = document.getElementById('corridor-route');
  const corridorDescEl = document.getElementById('corridor-desc');

  const selectCorridor = (key) => {
    const info = CORRIDOR_DATA[key];
    if (!info) return;

    corridorChips.forEach((chip) => {
      chip.classList.toggle('is-active', chip.getAttribute('data-corridor') === key);
    });
    mapNodes.forEach((node) => {
      node.classList.toggle('is-active', node.getAttribute('data-corridor') === key);
    });

    if (corridorNameEl) corridorNameEl.textContent = info.name;
    if (corridorRouteEl) corridorRouteEl.textContent = info.route;
    if (corridorDescEl) corridorDescEl.textContent = info.desc;
  };

  corridorChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      selectCorridor(chip.getAttribute('data-corridor') || 'hattiesburg');
    });
  });

  mapNodes.forEach((node) => {
    node.addEventListener('click', () => {
      selectCorridor(node.getAttribute('data-corridor') || 'hattiesburg');
    });
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectCorridor(node.getAttribute('data-corridor') || 'hattiesburg');
      }
    });
  });

  /* ------------------------------------------------------------------------
     FAQ Accordion
     ------------------------------------------------------------------------ */
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const panelId = btn.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      btn.setAttribute('aria-expanded', String(!expanded));
      if (panel) {
        panel.hidden = expanded;
      }
    });
  });

  /* ------------------------------------------------------------------------
     Interactive Bid-Scope Brief Builder
     ------------------------------------------------------------------------ */
  const scopeChecks = document.querySelectorAll('input[name="scope-division"]');
  const projectTypeEl = document.getElementById('project-type');
  const projectCityEl = document.getElementById('project-city');
  const projectNotesEl = document.getElementById('project-notes');
  const scopePreviewEl = document.getElementById('scope-preview-text');
  const copyScopeBtn = document.getElementById('copy-scope-btn');

  const updateScopeBrief = () => {
    if (!scopePreviewEl) return;
    const selected = Array.from(scopeChecks)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    const sector = projectTypeEl ? projectTypeEl.value : 'Municipal / Public Works';
    const city = projectCityEl && projectCityEl.value.trim()
      ? projectCityEl.value.trim()
      : 'Hattiesburg / South MS (TBD)';
    const notes = projectNotesEl && projectNotesEl.value.trim()
      ? projectNotesEl.value.trim()
      : 'Plans & linear footage available upon call';

    const divisionsText = selected.length > 0
      ? selected.join(', ')
      : 'Water / Sewer / Drainage / Directional Bore (Select divisions above)';

    scopePreviewEl.textContent =
      `EDGE UTILITIES, INC. — PROJECT SCOPE BRIEF\n` +
      `Divisions: ${divisionsText}\n` +
      `Sector: ${sector}\n` +
      `Location: ${city}\n` +
      `Details: ${notes}\n` +
      `Office Dispatch: (601) 606-8838 · Lic #25895-MC`;
  };

  scopeChecks.forEach((cb) => cb.addEventListener('change', updateScopeBrief));
  if (projectTypeEl) projectTypeEl.addEventListener('change', updateScopeBrief);
  if (projectCityEl) projectCityEl.addEventListener('input', updateScopeBrief);
  if (projectNotesEl) projectNotesEl.addEventListener('input', updateScopeBrief);

  document.querySelectorAll('[data-scope-select]').forEach((link) => {
    link.addEventListener('click', () => {
      const targetVal = link.getAttribute('data-scope-select');
      if (!targetVal) return;
      scopeChecks.forEach((cb) => {
        if (cb.value === targetVal) {
          cb.checked = true;
        }
      });
      updateScopeBrief();
      showToast(`Added "${targetVal}" to your Scope Brief`);
    });
  });

  if (copyScopeBtn && scopePreviewEl) {
    copyScopeBtn.addEventListener('click', () => {
      copyToClipboard(scopePreviewEl.textContent, 'Scope brief copied to clipboard');
    });
  }

  updateScopeBrief();
})();
