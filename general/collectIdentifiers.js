// Long term plans:
// 1. turn this script into a userscript that can be run on any webpage
// 2. add the ability to trigger the script via a bookmarklet
// 3. add a dialog to allow the user to specify the root element selector and prefix if desired - default to `body` with no prefix.
// 4. append the results to the following Google Sheet: https://docs.google.com/spreadsheets/d/1OX3EO9cBsP0e9BOTdR1JwosCEqCWtHEwlGVuz6grN6M/
// 5. if possible, only append new unique IDs/class names that are not already in the sheet


// This script collects all unique IDs and class names on a webpage

const data = (() => {
  const prefix = 'qm';  // Prefix to look for in IDs and class names

  const targetElement = document.querySelector('body#qm_QUESTION');  // Change to the root element selector
  if (!targetElement) {
    return { uniqueIdentifiers: [] };
  }

  const prefixedIdentifiers = new Set();

  // Check the target element itself
  if (targetElement.id.startsWith(prefix)) {
    prefixedIdentifiers.add(`#${targetElement.id}`);
  }
  Array.from(targetElement.classList).forEach(cls => {
    if (cls.startsWith(prefix)) {
      prefixedIdentifiers.add(`.${cls}`);
    }
  });

  // Check all descendant elements
  targetElement.querySelectorAll('*').forEach(el => {
    if (el.id.startsWith(prefix)) {
      prefixedIdentifiers.add(`#${el.id}`);
    }
    Array.from(el.classList).forEach(cls => {
      if (cls.startsWith(prefix)) {
        prefixedIdentifiers.add(`.${cls}`);
      }
    });
  });

  return { uniqueIdentifiers: Array.from(prefixedIdentifiers).sort() };
})();