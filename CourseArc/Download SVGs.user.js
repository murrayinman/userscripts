// ==UserScript==
// @name         Download SVGs (CourseArc)
// @namespace    http://tampermonkey.net/
// @version      2025.11.20.1
// @description  Downloads the SVGs from a page by clicking the button in the bottom-right corner.
// @author       Murray Inman
// @match        https://riosalado.coursearc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coursearc.com
// @grant        none
// @run-at       document-idle
// @noframes
// @updateURL    https://github.com/murrayinman/userscripts/raw/refs/heads/main/CourseArc/Download%20SVGs.user.js
// @downloadURL  https://github.com/murrayinman/userscripts/raw/refs/heads/main/CourseArc/Download%20SVGs.user.js
// ==/UserScript==

(function () {
  'use strict';

  if (document.getElementById('svg-dl-button')) return;

  const btn = document.createElement('button');
  btn.id = 'svg-dl-button';
  btn.textContent = 'SVG DL';
  btn.title = 'Download all inline SVGs on this page';

  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '16px',
    right: '16px',
    padding: '8px 12px',
    fontSize: '12px',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    background: '#222',
    color: '#fff',
    border: '1px solid #555',
    borderRadius: '4px',
    cursor: 'pointer',
    zIndex: 999999,
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
  });

  document.body.appendChild(btn);

  const importantProps = [
    'fill', 'fill-opacity',
    'stroke', 'stroke-opacity', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset',
    'opacity',
    'font', 'font-family', 'font-size', 'font-weight', 'font-style',
    'text-anchor', 'dominant-baseline', 'letter-spacing', 'word-spacing',
    'paint-order', 'vector-effect',
    'stop-color', 'stop-opacity'
  ];

  function ensureNamespaces(svg) {
    if (!svg.getAttribute('xmlns')) {
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
    const needsXlink = svg.querySelector('[xlink\\:href],use[xlink\\:href],use[href]');
    if (!svg.getAttribute('xmlns:xlink') && needsXlink) {
      svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    }
  }

  // Inline computed styles from the original DOM nodes into the cloned nodes
  function inlineComputedStyles(originalRoot, cloneRoot) {
    const origNodes = [originalRoot, ...originalRoot.querySelectorAll('*')];
    const cloneNodes = [cloneRoot, ...cloneRoot.querySelectorAll('*')];
    const count = Math.min(origNodes.length, cloneNodes.length);

    for (let i = 0; i < count; i++) {
      const o = origNodes[i];
      const c = cloneNodes[i];
      const cs = getComputedStyle(o);

      let styles = '';
      for (const prop of importantProps) {
        const val = cs.getPropertyValue(prop);
        if (!val) continue;
        if (val === 'none' || val === 'normal' || val === 'initial') continue;
        styles += `${prop}:${val};`;
      }
      if (styles) {
        const existing = c.getAttribute('style');
        c.setAttribute('style', existing ? `${existing};${styles}` : styles);
      }
    }
  }

  function setViewBoxIfNeeded(clone, original) {
    if (!clone.hasAttribute('viewBox')) {
      const r = original.getBoundingClientRect();
      const w = r.width || Number(original.getAttribute('width')) || 0;
      const h = r.height || Number(original.getAttribute('height')) || 0;
      if (w > 0 && h > 0) {
        clone.setAttribute('viewBox', `0 0 ${w} ${h}`);
        if (!clone.hasAttribute('width')) clone.setAttribute('width', String(Math.round(w)));
        if (!clone.hasAttribute('height')) clone.setAttribute('height', String(Math.round(h)));
      }
    }
  }

  function sanitize(name) {
    return (name || '').replace(/[\\/:*?"<>|]+/g, '').trim();
  }

  function nameFor(svg, index) {
    const title = sanitize(document.title || 'page').slice(0, 60) || 'page';
    const idLike = sanitize(svg.id || svg.getAttribute('aria-label') || svg.getAttribute('data-name') || '');
    const ix = String(index + 1).padStart(2, '0');
    const base = idLike ? `${title}-${idLike}` : `${title}-inline-svg-${ix}`;
    return `${base}.svg`;
  }

  async function downloadOne(svg, index, serializer) {
    const clone = svg.cloneNode(true);
    ensureNamespaces(clone);
    setViewBoxIfNeeded(clone, svg);
    inlineComputedStyles(svg, clone);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` + serializer.serializeToString(clone);
    const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = nameFor(svg, index);
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      URL.revokeObjectURL(url);
      await new Promise(r => setTimeout(r, 350)); // polite throttle
    }
  }

  btn.addEventListener('click', async () => {
    if (btn.dataset.busy === '1') return;

    const all = Array.from(document.querySelectorAll('svg'));
    const svgs = all.filter(s => {
      const r = s.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });

    if (!svgs.length) {
      alert('No visible <svg> elements found on this page.');
      return;
    }

    const originalText = btn.textContent;
    btn.dataset.busy = '1';
    btn.textContent = 'Downloading...';
    btn.style.opacity = '0.7';
    btn.style.pointerEvents = 'none';

    const serializer = new XMLSerializer();

    try {
      for (let i = 0; i < svgs.length; i++) {
        btn.textContent = `SVG DL (${i + 1}/${svgs.length})`;
        await downloadOne(svgs[i], i, serializer);
      }
    } catch (err) {
      console.error('[SVG DL] Download failed:', err);
      alert('SVG download failed. See console for details.');
    } finally {
      btn.textContent = originalText;
      btn.dataset.busy = '0';
      btn.style.opacity = '';
      btn.style.pointerEvents = '';
    }
  });
})();