// ==UserScript==
// @name         TEST environment favicons
// @namespace    https://riolearntest.co/
// @version      1.0
// @description  Forces custom favicons on test environment sites
// @match        https://www.riolearntest.co/*
// @match        https://ams.riolearntest.co/*
// @match        https://matrix.riolearntest.co/riowebapps/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // fontWeight accepts a number (100-900) or a keyword such as 'bold' or 'normal'
  const icon = (label, fontSize, spacing, fontWeight = 700) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">` +
    `<rect x="4.75" y="4.75" width="110.5" height="110.5" rx="20" fill="#6e0d0d" stroke="#FFF2AA" stroke-width="1.5"/>` +
    `<text x="60" y="61" fill="#FFF2AA" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="${fontWeight}" letter-spacing="${spacing}" text-anchor="middle" dominant-baseline="middle">${label}</text>` +
    `</svg>`;

  // Most specific rules first; path checks are case-insensitive prefixes
  // icon(label, fontSize, letterSpacing, fontWeight)
  const rules = [
    { host: 'matrix.riolearntest.co', path: '/riowebapps/rio.coursedefinition.ui', svg: icon('CD', 40, 2, 700) },
    { host: 'matrix.riolearntest.co', path: '/riowebapps/coursedef/lifecycle', svg: icon('LC', 40, 2, 700) },
    { host: 'ams.riolearntest.co', path: '/', svg: icon('AMS', 34, 1, 700) },
    { host: 'www.riolearntest.co', path: '/', svg: icon('RL', 40, 2, 700) },
  ];

  const here = location.pathname.toLowerCase();
  const rule = rules.find(r => location.hostname === r.host && here.startsWith(r.path));
  if (!rule) return;

  const href = 'data:image/svg+xml,' + encodeURIComponent(rule.svg);

  function applyIcon() {
    document.querySelectorAll('link[rel~="icon"]:not([data-rl-favicon])').forEach(el => el.remove());
    if (!document.querySelector('link[data-rl-favicon]')) {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/svg+xml';
      link.href = href;
      link.setAttribute('data-rl-favicon', '');
      document.head.appendChild(link);
    }
  }

  applyIcon();

  // Re-apply if the page swaps its own favicon back in later
  new MutationObserver(() => {
    if (document.querySelector('link[rel~="icon"]:not([data-rl-favicon])')) applyIcon();
  }).observe(document.head, { childList: true });
})();