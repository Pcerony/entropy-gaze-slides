import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { cropGrid, selectPeaks } from './structure.mjs';

const PALETTES = {
  info: ['#e3f1ed', '#21866e'],
  gaze: ['#fff0ed', '#ce252e'],
  combined: ['#183c79', '#40b5a9', '#f9d452']
};

function colorAt(value, type) {
  const colors = PALETTES[type].map(c => new THREE.Color(c));
  const f = Math.max(0, Math.min(1, value)) * (colors.length - 1);
  const i = Math.min(colors.length - 2, Math.floor(f));
  return colors[i].clone().lerp(colors[i + 1], f - i);
}

/**
 * Mount the interactive 3-layer WebGL eye-tracking terrain inside Slide 04.
 * Supports dynamic resize when switching into Slide 04 and live language updates.
 */
export async function initTerrainViewer({ root, getCopy }) {
  const data = window.__ENTROPY_DATA__ || await fetch('./fields.json').then(r => r.json());
  const canvas = root.querySelector('#gaze-scene');
  const stage = root.querySelector('#gaze-stage');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0xfafaf8);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-4, 4, 5, -5, 0.1, 100);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.minZoom = 0.6;
  controls.maxZoom = 2.6;

  // Prevent 3D orbit/zoom gestures from triggering parent slide navigation
  stage.addEventListener('wheel', e => e.stopPropagation(), { passive: true });
  stage.addEventListener('pointerdown', e => e.stopPropagation());
  stage.addEventListener('touchstart', e => e.stopPropagation(), { passive: true });

  scene.add(new THREE.AmbientLight(0xffffff, 1));
  const light = new THREE.DirectionalLight(0xffffff, 1.3);
  light.position.set(-3, 8, 5);
  scene.add(light);

  const combinedMax = Object.fromEntries(
    ['10s', 'full'].map(key => [key, Math.max(...data.samples.flatMap(s => s.windows[key].combined))])
  );

  let current = 0;
  let windowKey = 'full';
  let heightScale = 1.0;
  let spacing = 1.5;
  let group = null;
  let markedPeaks = [];

  const crop = cropGrid(data.samples[0].information, data.width, data.height);
  const planeWidth = 2.75;
  const planeDepth = planeWidth * (crop.bounds[3] - crop.bounds[1]) * 210 / ((crop.bounds[2] - crop.bounds[0]) * 297);

  const textures = {};
  for (const key of ['a2', 'b2']) {
    const texSrc = window.__ENTROPY_TEXTURES__?.[key] || `./assets/${key}.webp`;
    const tex = await new THREE.TextureLoader().loadAsync(texSrc);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.offset.set(crop.bounds[0], 1 - crop.bounds[3]);
    tex.repeat.set(crop.bounds[2] - crop.bounds[0], crop.bounds[3] - crop.bounds[1]);
    textures[key] = tex;
  }

  function makeText(text, background = false) {
    const c = document.createElement('canvas');
    c.width = background ? 160 : 680;
    c.height = 100;
    const ctx = c.getContext('2d');
    if (background) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, c.width, c.height);
    }
    ctx.font = background
      ? 'bold 58px "Noto Sans SC", "Hiragino Sans", sans-serif'
      : 'bold 34px "Noto Sans SC", "Hiragino Sans", sans-serif';
    ctx.fillStyle = '#182b31';
    ctx.fillText(text, 12, background ? 70 : 62);
    const texture = new THREE.CanvasTexture(c);
    texture.colorSpace = THREE.SRGBColorSpace;
    return new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true }));
  }

  function addLayerLabel(text, base) {
    const sprite = makeText(text, false);
    sprite.scale.set(1.3, 0.192, 1);
    sprite.position.set(-2.12, base + 0.05, 0);
    group.add(sprite);
  }

  function addSurface(values, max, base, type) {
    const cropped = cropGrid(values, data.width, data.height);
    const { width, height } = cropped;
    const vals = cropped.values;
    const positions = [];
    const colors = [];
    const indices = [];

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const v = vals[row * width + col] / max;
        const colRgb = colorAt(v, type);
        positions.push((col / (width - 1) - 0.5) * planeWidth, base + v * 0.7 * heightScale, (row / (height - 1) - 0.5) * planeDepth);
        colors.push(colRgb.r, colRgb.g, colRgb.b);
      }
    }

    for (let r = 0; r < height - 1; r++) {
      for (let c = 0; c < width - 1; c++) {
        const a = r * width + c;
        const b = a + width;
        indices.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    group.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    })));

    const lines = [];
    for (let r = 0; r < height; r += 4) {
      for (let c = 0; c < width - 1; c++) {
        const i = (r * width + c) * 3;
        lines.push(...positions.slice(i, i + 3), ...positions.slice(i + 3, i + 6));
      }
    }
    for (let c = 0; c < width; c += 4) {
      for (let r = 0; r < height - 1; r++) {
        const i = (r * width + c) * 3;
        const j = i + width * 3;
        lines.push(...positions.slice(i, i + 3), ...positions.slice(j, j + 3));
      }
    }
    group.add(new THREE.LineSegments(
      new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(lines, 3)),
      new THREE.LineBasicMaterial({ color: type === 'combined' ? 0xe9f6fb : 0x28444c, transparent: true, opacity: 0.42 })
    ));

    const nodes = [];
    for (let r = 0; r < height; r += 4) {
      for (let c = 0; c < width; c += 4) {
        const i = (r * width + c) * 3;
        nodes.push(positions[i], positions[i + 1] + 0.005, positions[i + 2]);
      }
    }
    group.add(new THREE.Points(
      new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(nodes, 3)),
      new THREE.PointsMaterial({ color: type === 'combined' ? 0xf0fbff : 0x183b46, size: 0.022, sizeAttenuation: true })
    ));

    const prefix = { info: 'I', gaze: 'D', combined: 'C' }[type];
    const peaks = selectPeaks(vals, width, height, 3, 13);
    peaks.forEach((peak, n) => {
      const i = (peak.row * width + peak.col) * 3;
      const point = new THREE.Vector3(...positions.slice(i, i + 3));
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 8), new THREE.MeshBasicMaterial({ color: 0x152e37 }));
      ball.position.copy(point);
      ball.position.y += 0.032;
      group.add(ball);

      const end = point.clone();
      end.y += 0.22 + n * 0.055;
      group.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([point, end]),
        new THREE.LineBasicMaterial({ color: 0x152e37 })
      ));

      const marker = makeText(`${prefix}${n + 1}`, true);
      marker.scale.set(0.25, 0.155, 1);
      marker.position.copy(end);
      marker.position.y += 0.075;
      group.add(marker);

      markedPeaks.push({
        layer: type,
        id: `${prefix}${n + 1}`,
        value: peak.value,
        x: crop.bounds[0] + peak.col / (width - 1) * (crop.bounds[2] - crop.bounds[0]),
        y: crop.bounds[1] + peak.row / (height - 1) * (crop.bounds[3] - crop.bounds[1])
      });
    });
  }

  function updateDomTelemetry(sample, win, copy) {
    root.querySelectorAll('.sample-btn').forEach((btn, idx) => btn.classList.toggle('active', idx === current));

    const stimText = sample.stimulus === 'a2' ? copy.s4Stats.stimA2 : copy.s4Stats.stimB2;
    const stimEl = root.querySelector('#terrain-stimulus');
    if (stimEl) stimEl.textContent = stimText;

    const infoMaxEl = root.querySelector('#terrain-info-max');
    const gazeMaxEl = root.querySelector('#terrain-gaze-max');
    const combMaxEl = root.querySelector('#terrain-comb-max');
    if (infoMaxEl) infoMaxEl.textContent = `${data.informationMax.toFixed(2)} bits`;
    if (gazeMaxEl) gazeMaxEl.textContent = `${data.attentionMax[windowKey].toExponential(2)} s/mm²`;
    if (combMaxEl) combMaxEl.textContent = `${combinedMax[windowKey].toFixed(3)}`;

    for (const type of ['info', 'gaze', 'combined']) {
      const peaksEl = root.querySelector(`#peaks-${type}`);
      if (!peaksEl) continue;
      peaksEl.textContent = markedPeaks
        .filter(p => p.layer === type)
        .map(p => `${p.id} ${type === 'gaze' ? p.value.toExponential(2) : p.value.toFixed(3)}`)
        .join(' · ');
    }

    const dMaxSample = Math.max(...win.density).toExponential(2);
    const cMaxSample = Math.max(...win.combined).toFixed(3);
    const statsEl = root.querySelector('#terrain-stats');
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="stat-pill"><span>${copy.s4Stats.observed}</span><strong>${win.observedSeconds.toFixed(2)} s</strong><small>/ ${win.end.toFixed(1)} s</small></div>
        <div class="stat-pill"><span>${copy.s4Stats.points}</span><strong>${win.pointCount - win.offPaperCount}</strong><small>/ ${win.pointCount}</small></div>
        <div class="stat-pill"><span>${copy.s4Stats.dmax}</span><strong>${dMaxSample}</strong><small>s/mm²</small></div>
        <div class="stat-pill"><span>${copy.s4Stats.cmax}</span><strong>${cMaxSample}</strong><small>0–1</small></div>
      `;
    }
  }

  function rebuild() {
    if (group) {
      scene.remove(group);
      group.traverse(o => {
        o.geometry?.dispose();
        if (o.material) {
          if (o.isSprite) o.material.map?.dispose();
          o.material.dispose();
        }
      });
    }

    group = new THREE.Group();
    scene.add(group);
    const sample = data.samples[current];
    const win = sample.windows[windowKey];
    const bottom = -spacing * 1.5;
    const levels = [bottom, bottom + spacing, bottom + spacing * 2, bottom + spacing * 3];
    markedPeaks = [];

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(planeWidth, planeDepth),
      new THREE.MeshBasicMaterial({ map: textures[sample.stimulus], side: THREE.DoubleSide })
    );
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = bottom;
    group.add(plane);

    addSurface(sample.information, data.informationMax, levels[1], 'info');
    addSurface(win.density, data.attentionMax[windowKey], levels[2], 'gaze');
    addSurface(win.combined, combinedMax[windowKey], levels[3], 'combined');

    const copy = getCopy();
    [copy.s4Sprites.l00, copy.s4Sprites.l01, copy.s4Sprites.l02, copy.s4Sprites.l03].forEach((txt, i) => {
      addLayerLabel(txt, levels[i]);
    });

    for (const x of [-planeWidth / 2, planeWidth / 2]) {
      for (const z of [-planeDepth / 2, planeDepth / 2]) {
        const geo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x, bottom, z),
          new THREE.Vector3(x, levels[3], z)
        ]);
        const line = new THREE.Line(
          geo,
          new THREE.LineDashedMaterial({ color: 0x8ca6af, dashSize: 0.04, gapSize: 0.06, transparent: true, opacity: 0.68 })
        );
        line.computeLineDistances();
        group.add(line);
      }
    }

    for (const y of levels) {
      const x = planeWidth / 2;
      const z = planeDepth / 2;
      const pts = [[-x, y, -z], [x, y, -z], [x, y, z], [-x, y, z], [-x, y, -z]].map(p => new THREE.Vector3(...p));
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x7997a2 })));
    }

    updateDomTelemetry(sample, win, copy);
    renderer.render(scene, camera);
  }

  function resize() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;
    const span = Math.max(6.8, 5.2 * h / w);
    camera.left = -span * w / h / 2;
    camera.right = span * w / h / 2;
    camera.top = span / 2;
    camera.bottom = -span / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    renderer.render(scene, camera);
  }

  function reset() {
    camera.position.set(4, 4.5, 14);
    controls.target.set(0, 0.3, 0);
    camera.zoom = 1;
    camera.lookAt(controls.target);
    controls.update();
    resize();
  }

  function exportFigure() {
    camera.left = -3.45 * 1800 / 2100;
    camera.right = 3.45 * 1800 / 2100;
    camera.top = 3.45;
    camera.bottom = -3.45;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(1);
    renderer.setSize(1800, 2100, false);
    renderer.render(scene, camera);

    const out = document.createElement('canvas');
    out.width = 1800;
    out.height = 2480;
    const ctx = out.getContext('2d');
    ctx.fillStyle = '#fafaf8';
    ctx.fillRect(0, 0, 1800, 2480);
    ctx.drawImage(canvas, 0, 120, 1800, 2100);

    const sample = data.samples[current];
    const win = sample.windows[windowKey];
    ctx.fillStyle = '#182b31';
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText(`${sample.id} / ${sample.stimulus.toUpperCase()} · 3-Layer Spatial Attention`, 60, 68);
    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#5a6c72';
    ctx.fillText(`${win.end.toFixed(2)}s window · observed ${win.observedSeconds.toFixed(2)}s · ROI x 44–96%, y 3–97%`, 60, 104);

    const legend = [
      ['Layer 01 Text Proxy (I)', 'info', `${data.informationMax.toFixed(2)} bits`],
      ['Layer 02 Dwell Density (D)', 'gaze', `${data.attentionMax[windowKey].toExponential(2)} s/mm²`],
      ['Layer 03 Coupling (C)', 'combined', `${combinedMax[windowKey].toFixed(3)}`]
    ];
    legend.forEach(([title, type, max], i) => {
      const x = 60 + i * 580;
      const y = 2210;
      ctx.fillStyle = '#182b31';
      ctx.font = '22px sans-serif';
      ctx.fillText(title, x, y);
      ctx.fillStyle = '#68797f';
      ctx.font = '18px sans-serif';
      ctx.fillText(`0 — ${max}`, x, y + 54);
      const grad = ctx.createLinearGradient(x, 0, x + 460, 0);
      PALETTES[type].forEach((c, j) => grad.addColorStop(j / (PALETTES[type].length - 1), c));
      ctx.fillStyle = grad;
      ctx.fillRect(x, y + 18, 460, 12);
    });

    const url = out.toDataURL('image/png');
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    resize();
    return url;
  }

  // Populate sample buttons
  const samplesContainer = root.querySelector('#terrain-samples');
  samplesContainer.replaceChildren();
  data.samples.forEach((s, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sample-btn';
    btn.innerHTML = `<img src="./assets/${s.stimulus}.webp" alt="${s.id} ${s.stimulus.toUpperCase()}"><div><strong>${s.id}</strong><span>${s.stimulus.toUpperCase()} · ${s.duration.toFixed(1)}s</span></div>`;
    btn.onclick = () => {
      current = i;
      rebuild();
    };
    samplesContainer.appendChild(btn);
  });

  const winSelect = root.querySelector('#terrain-window');
  const heightInput = root.querySelector('#terrain-height');
  const heightOut = root.querySelector('#terrain-height-val');
  const spacingInput = root.querySelector('#terrain-spacing');
  const spacingOut = root.querySelector('#terrain-spacing-val');
  const resetBtn = root.querySelector('#terrain-reset');
  const saveBtn = root.querySelector('#terrain-save');

  winSelect.value = windowKey;
  heightInput.value = String(heightScale);
  heightOut.textContent = heightScale.toFixed(1);
  spacingInput.value = String(spacing);
  spacingOut.textContent = spacing.toFixed(1);

  winSelect.onchange = e => {
    windowKey = e.target.value;
    rebuild();
  };
  heightInput.oninput = e => {
    heightScale = Number(e.target.value);
    heightOut.textContent = heightScale.toFixed(1);
    rebuild();
  };
  spacingInput.oninput = e => {
    spacing = Number(e.target.value);
    spacingOut.textContent = spacing.toFixed(1);
    rebuild();
  };
  resetBtn.onclick = reset;
  saveBtn.onclick = () => {
    const a = document.createElement('a');
    a.href = exportFigure();
    a.download = `${data.samples[current].id}-${windowKey}-3layer.png`;
    a.click();
  };

  new ResizeObserver(resize).observe(stage);
  reset();
  rebuild();

  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });

  const api = {
    selectSample(i) {
      if (i >= 0 && i < data.samples.length) {
        current = i;
        rebuild();
      }
    },
    setWindow(key) {
      if (key === '10s' || key === 'full') {
        windowKey = key;
        winSelect.value = key;
        rebuild();
      }
    },
    refreshLanguage() {
      rebuild();
    },
    resize,
    reset,
    exportFigure,
    stats: () => data.samples[current].windows[windowKey],
    structure: () => ({ crop: crop.bounds, peaks: markedPeaks, order: ['stimulus', 'info', 'gaze', 'combined'] })
  };

  window.previewApi = api;
  window.previewReady = true;
  return api;
}
