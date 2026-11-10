// ==UserScript==
// @name         TEST environment favicons
// @namespace    https://riolearntest.co/
// @version      1.1
// @description  Marks Rio TEST sites (RioLearn, AMS, Matrix) with custom red favicons and a "[TEST]" title prefix
// @author       Murray Inman
// @match        https://www.riolearntest.co/*
// @match        https://ams.riolearntest.co/*
// @match        https://matrix.riolearntest.co/riowebapps/*
// @run-at       document-end
// @grant        none
// @noframes
// @updateURL    https://github.com/murrayinman/userscripts/raw/refs/heads/main/Matrix/rioTEST_redIcons.user.js
// @downloadURL  https://github.com/murrayinman/userscripts/raw/refs/heads/main/Matrix/rioTEST_redIcons.user.js
// ==/UserScript==

(function () {
  'use strict';

  const TITLE_PREFIX = '[TEST] ';

  // fontWeight accepts a number (100-900) or a keyword such as 'bold' or 'normal'
  const icon = (label, fontSize, spacing, fontWeight = 700) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">` +
    `<rect x="4.75" y="4.75" width="110.5" height="110.5" rx="20" fill="#6e0d0d" stroke="#FFF2AA" stroke-width="5"/>` +
    `<text x="60" y="61" fill="#FFF2AA" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="${fontWeight}" letter-spacing="${spacing}" text-anchor="middle" dominant-baseline="middle">${label}</text>` +
    `</svg>`;

  // Most specific rules first; path checks are case-insensitive prefixes
  // icon(label, fontSize, letterSpacing, fontWeight)
  const rules = [
    { host: 'matrix.riolearntest.co', path: '/riowebapps/rio.coursedefinition.ui', svg: icon('CD', 45, 2, 800) },
    { host: 'matrix.riolearntest.co', path: '/riowebapps/coursedef/lifecycle', svg: icon('LC', 45, 2, 800) },
    { host: 'ams.riolearntest.co', path: '/', svg: icon('AMS', 36, 1, 800) },
    { host: 'www.riolearntest.co', path: '/', svg: icon('RL', 45, 2, 800) },
  ];

  const currentRule = () => {
    const here = location.pathname.toLowerCase();
    return rules.find(r => location.hostname === r.host && here.startsWith(r.path)) || null;
  };

  let activeRule;

  // Text cue for tab lists, window titles, and screen readers (the favicon is visual only)
  function applyTitle() {
    if (document.title && !document.title.startsWith(TITLE_PREFIX)) {
      document.title = TITLE_PREFIX + document.title;
    }
  }

  function applyIcon() {
    const rule = currentRule();
    const ours = document.querySelector('link[data-rl-favicon]');

    if (!rule) {
      // No rule for this page (e.g. after in-app navigation): drop our icon, leave the page's alone
      if (ours) ours.remove();
      activeRule = null;
      return;
    }

    document.querySelectorAll('link[rel~="icon"]:not([data-rl-favicon])').forEach(el => el.remove());

    if (!ours || rule !== activeRule) {
      if (ours) ours.remove();
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/svg+xml';
      link.href = 'data:image/svg+xml,' + encodeURIComponent(rule.svg);
      link.setAttribute('data-rl-favicon', '');
      document.head.appendChild(link);
      activeRule = rule;
    }
  }

  function update() {
    applyIcon();
    applyTitle();
  }

  update();

  // Re-apply if the page swaps its own favicon back in or changes the title
  new MutationObserver(() => {
    const foreignIcon = activeRule && document.querySelector('link[rel~="icon"]:not([data-rl-favicon])');
    const titleLost = document.title && !document.title.startsWith(TITLE_PREFIX);
    if (foreignIcon || titleLost) update();
  }).observe(document.head, { childList: true, subtree: true, characterData: true });

  // Re-check the rule when the app navigates without a full page load
  let lastPath = location.pathname;
  const onNavigate = () => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      update();
    }
  };
  for (const method of ['pushState', 'replaceState']) {
    const original = history[method];
    history[method] = function (...args) {
      const result = original.apply(this, args);
      onNavigate();
      return result;
    };
  }
  window.addEventListener('popstate', onNavigate);
})();
