import { DICT, METRICS } from './i18n.mjs';
import { initTerrainViewer } from './terrain-viewer.mjs';

let langMode = 'zh';
let activeSlide = 0;
let terrainApi = null;
let terrainError = false;

const slides = Array.from(document.querySelectorAll('.slide'));
const TOTAL = slides.length;

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function getActiveDict() {
  return DICT[langMode] || DICT.zh;
}

function setText(selector, key) {
  const el = document.querySelector(selector);
  if (el) el.textContent = getActiveDict()[key];
}

function renderNav() {
  const nav = document.querySelector('#chapter-nav');
  const d = getActiveDict();
  nav.innerHTML = d.navTabs
    .map((tab, i) => `
      <button type="button" class="chapter-btn${i === activeSlide ? ' active' : ''}" data-go="${i}">
        <span class="nav-num">${tab.num}</span>
        <span>${escapeHtml(tab.short)}</span>
      </button>
    `)
    .join('');

  nav.querySelectorAll('.chapter-btn').forEach(btn => {
    btn.onclick = () => goTo(Number(btn.dataset.go));
  });
}

function renderPairedChart() {
  const wrap = document.querySelector('#s4-paired-chart');
  const legend = document.querySelector('#s4-chart-legend');
  if (!wrap || !legend) return;
  const d = getActiveDict();

  legend.innerHTML = `
    <span class="leg-chip"><i class="dot ctrl"></i>${escapeHtml(d.s4ChartLegendCtrl)}</span>
    <span class="leg-chip"><i class="dot int"></i>${escapeHtml(d.s4ChartLegendInt)}</span>
  `;

  const maxVal = 1.6;
  const rowH = 64;
  const width = 540;
  const height = METRICS.length * rowH + 22;
  const trackX0 = 122;
  const trackX1 = 388;
  const mapX = v => trackX0 + (Math.min(v, maxVal) / maxVal) * (trackX1 - trackX0);

  const rows = METRICS.map((m, idx) => {
    const y = 30 + idx * rowH;
    const x0 = mapX(m.control);
    const x1 = mapX(m.intervention);
    const lineColor = m.significant ? '#0b5d3b' : '#8a948f';
    const closePair = Math.abs(x1 - x0) < 56;
    const ctrlY = closePair ? y + 20 : y - 12;
    const intY = y - 12;

    return `
      <g class="chart-row">
        <line x1="${trackX0}" y1="${y}" x2="${trackX1}" y2="${y}" stroke="#e3e6e1" stroke-width="2" />
        <text x="4" y="${y + 5}" class="svg-sym">${escapeHtml(m.symbol)}</text>
        <line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${lineColor}" stroke-width="3.5" stroke-linecap="round" />
        <circle cx="${x0}" cy="${y}" r="6" fill="#fafaf8" stroke="#5f6c66" stroke-width="2.2" />
        <circle cx="${x1}" cy="${y}" r="7" fill="${lineColor}" />
        <text x="${x0}" y="${ctrlY}" text-anchor="middle" class="svg-val">${m.control.toFixed(3)}</text>
        <text x="${x1}" y="${intY}" text-anchor="middle" class="svg-val strong">${m.intervention.toFixed(3)}</text>
        <text x="${trackX1 + 14}" y="${y - 2}" class="svg-delta ${m.significant ? 'sig' : 'ns'}">${escapeHtml(m.pct)}</text>
        <text x="${trackX1 + 14}" y="${y + 14}" class="svg-p">p=${escapeHtml(m.pText)} · dz=${m.dz}</text>
      </g>
    `;
  }).join('');

  wrap.innerHTML = `<svg viewBox="0 0 ${width} ${height}" class="paired-svg" role="img" aria-label="N=13 Paired Metrics">${rows}</svg>`;
}

function refreshTooltips() {
  const d = getActiveDict();
  document.querySelectorAll('.info-btn').forEach(btn => {
    const key = btn.dataset.tip;
    const pop = btn.parentElement.querySelector('.info-popover');
    if (key && pop) pop.textContent = d[key];
  });
}

function applyContent() {
  const d = getActiveDict();
  document.documentElement.lang = langMode === 'ja' ? 'ja' : langMode === 'en' ? 'en' : 'zh-CN';
  document.title = d.pageTitle;

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === langMode);
  });

  renderNav();

  // Slide 01: Problem & Objective
  setText('#s1-kicker', 's1Kicker');
  setText('#s1-title', 's1Title');
  setText('#s1-prob-heading', 's1ProbHeading');
  setText('#s1-dur-label', 's1DurLabel');
  setText('#s1-dur-val', 's1DurVal');
  setText('#s1-dur-meta', 's1DurMeta');
  setText('#s1-dur-note', 's1DurNote');
  setText('#s1-share-label', 's1ShareLabel');
  setText('#s1-share-val', 's1ShareVal');
  setText('#s1-share-meta', 's1ShareMeta');
  setText('#s1-share-note', 's1ShareNote');
  setText('#s1-goal-heading', 's1GoalHeading');

  document.querySelector('#s1-goal-list').innerHTML = d.s1GoalSteps
    .map(step => `
      <li class="goal-step">
        <span class="num-index">${step.num}</span>
        <div>
          <div class="t-year">${escapeHtml(step.tag)}</div>
          <div class="item-title">${escapeHtml(step.title)}</div>
          <p class="item-desc">${escapeHtml(step.desc)}</p>
        </div>
      </li>
    `).join('');

  // Slide 02: Method
  setText('#s2-kicker', 's2Kicker');
  setText('#s2-title', 's2Title');
  setText('#s2-macro-heading', 's2MacroHeading');
  setText('#s2-terrain-heading', 's2TerrainHeading');

  document.querySelector('#s2-macro-list').innerHTML = d.s2MacroItems
    .map(item => `
      <li class="formula-item">
        <code>${escapeHtml(item.sym)}</code>
        <span>${escapeHtml(item.desc)}</span>
      </li>
    `).join('');

  document.querySelector('#s2-layer-list').innerHTML = d.s2Layers
    .map(layer => `
      <div class="layer-step ${layer.cls}">
        <span class="layer-dot" aria-hidden="true"></span>
        <div>
          <div class="item-title">${escapeHtml(layer.title)}</div>
          <p class="item-desc">${escapeHtml(layer.desc)}</p>
        </div>
      </div>
    `).join('');

  // Slide 03: Results · Terrain
  setText('#s3-kicker', 's3Kicker');
  setText('#s3-title', 's3Title');
  setText('#s3-samples-title', 's3SamplesTitle');
  setText('#s3-window-label', 's3WindowLabel');
  const winSel = document.querySelector('#terrain-window');
  winSel.options[0].textContent = d.s3Win10s;
  winSel.options[1].textContent = d.s3WinFull;
  setText('#s3-height-label', 's3HeightLabel');
  setText('#s3-spacing-label', 's3SpacingLabel');
  setText('#s3-reset-text', 's3ResetBtn');
  setText('#s3-save-text', 's3SaveBtn');
  setText('#s3-stamp', 's3Stamp');
  setText('#s3-legend-title', 's3LegendTitle');
  setText('#s3-layer00-title', 's3Layer00Title');
  setText('#s3-layer01-title', 's3Layer01Title');
  setText('#s3-layer01-desc', 's3Layer01Desc');
  setText('#s3-layer02-title', 's3Layer02Title');
  setText('#s3-layer02-desc', 's3Layer02Desc');
  setText('#s3-layer03-title', 's3Layer03Title');
  setText('#s3-layer03-desc', 's3Layer03Desc');

  // Slide 04: Discussion & Conclusion
  setText('#s4-kicker', 's4Kicker');
  setText('#s4-title', 's4Title');
  setText('#s4-chart-heading', 's4ChartHeading');
  setText('#s4-conc-heading', 's4ConcHeading');
  setText('#s4-conc-lead', 's4ConcLead');
  setText('#s4-limits-heading', 's4LimitsHeading');
  renderPairedChart();

  document.querySelector('#s4-limits-list').innerHTML = d.s4Limits
    .map(item => `
      <li class="num-item">
        <span class="num-index">${item.num}</span>
        <div>
          <div class="item-title">${escapeHtml(item.title)}</div>
          <p class="item-desc">${escapeHtml(item.desc)}</p>
        </div>
      </li>
    `).join('');

  refreshTooltips();
  terrainApi?.refreshLanguage();
  if (terrainError) {
    document.querySelector('#gaze-stage').innerHTML = `<div class="webgl-fallback">WebGL Error</div>`;
  }
}

function goTo(index) {
  const target = Math.max(0, Math.min(TOTAL - 1, index));
  activeSlide = target;
  slides.forEach((sec, i) => {
    const active = i === activeSlide;
    sec.classList.toggle('active', active);
    sec.hidden = !active;
  });

  document.querySelectorAll('.chapter-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === activeSlide);
  });

  if (history.replaceState) {
    history.replaceState(null, '', `#s${activeSlide + 1}`);
  }

  if (activeSlide === 2 && terrainApi) {
    requestAnimationFrame(() => terrainApi.resize());
  }
}

function closeAllTooltips() {
  document.querySelectorAll('.info-wrap.open').forEach(w => {
    w.classList.remove('open');
    w.querySelector('.info-btn')?.setAttribute('aria-expanded', 'false');
  });
}

function bindEvents() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.onclick = () => {
      langMode = btn.dataset.lang;
      applyContent();
    };
  });

  document.addEventListener('keydown', e => {
    if (e.target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') goTo(activeSlide + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') goTo(activeSlide - 1);
    else if (e.key >= '1' && e.key <= String(TOTAL)) goTo(Number(e.key) - 1);
    else if (e.key === 'Escape') closeAllTooltips();
  });

  document.querySelectorAll('.info-btn').forEach(btn => {
    btn.onclick = e => {
      e.stopPropagation();
      const wrap = btn.closest('.info-wrap');
      const willOpen = !wrap.classList.contains('open');
      closeAllTooltips();
      wrap.classList.toggle('open', willOpen);
      btn.setAttribute('aria-expanded', String(willOpen));
    };
  });

  document.addEventListener('click', closeAllTooltips);
}

async function boot() {
  const hashMatch = location.hash.match(/^#s([1-4])$/);
  if (hashMatch) activeSlide = Number(hashMatch[1]) - 1;

  bindEvents();
  applyContent();
  goTo(activeSlide);

  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }

  try {
    terrainApi = await initTerrainViewer({
      root: document.querySelector('.slide-terrain'),
      getCopy: getActiveDict
    });
    if (activeSlide === 2) terrainApi.resize();
  } catch (err) {
    console.error('Terrain init failed:', err);
    terrainError = true;
    applyContent();
  }
}

boot();
