// ==UserScript==
// @name         Make it Hyperlegible
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds a tiny "H" button in the bottom left to toggle the Atkinson Hyperlegible font.
// @author       Murray Inman
// @updateURL    https://github.com/murrayinman/userscripts/raw/main/general/Hyperlegible.user.js
// @downloadURL  https://github.com/murrayinman/userscripts/raw/main/general/Hyperlegible.user.js
// @match        https://*/*
// @grant        none
// @supportURL   https://github.com/murrayinman/userscripts/issues
// @license      CC0-1.0
// ==/UserScript==

(function() {
  'use strict';

  // Create the "H" button
  const hButton = document.createElement('button');
  hButton.innerText = 'H';
  hButton.type = 'button';
  hButton.ariaLabel = 'Toggle Atkinson Hyperlegible font';
  hButton.id = 'hButton';


  // Import the Atkinson Hyperlegible font
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap';
  document.head.appendChild(fontLink);
  console.log ("AH font is linked.");

  // Create a <style> element
  const styleElement = document.createElement('style');

  // Define the CSS rules
  const cssRules = `
  .atkinson-hyperlegible * {font-family: "Atkinson Hyperlegible", sans-serif !important; font-weight: 400; font-style: normal;}
  .atkinson-hyperlegible strong {font-weight: 700; font-style: normal;}
  .atkinson-hyperlegible em {font-style: italic;}
  .atkinson-hyperlegible strong em, .atkinson-hyperlegible em strong {font-weight: 700; font-style: italic;}
  #hButton {position: fixed; bottom: 5px; left: 5px; z-index: 1000; height: calc(2cap + 5px); width: calc(2cap + 5px); font-size: 1rem; padding: 5px; margin: 0; background-color: #b2222266; color: #fff; transition: border-radius .5s ease; font-weight: 700; border-radius: 3px; border: 1px solid #cccccc; aspect-ratio: 1 / 1; line-height: 1; font-family: ui-monospace;}
  .atkinson-hyperlegible #hButton {background-color: #00640066; border-radius: 50%;}
  `;

  // Set the CSS rules in the <style> element
  styleElement.textContent = cssRules;

  // Append the <style> element to the <head>
  document.head.appendChild(styleElement);
  console.log ("AH styles defined.");

  // Initialize a flag to track font state
  let isFontOn = false;
  console.log ("Is AH font on? ", isFontOn);

  // Function to toggle the font
  function toggleFont() {
      console.log ("hButton clicked when the status was isFontOn = ", isFontOn);
      if (isFontOn) {
          document.body.classList.remove('atkinson-hyperlegible'); // Remove the class
          // console.log ("fontFamily set to (orig) ", document.body.classList);
      } else {
          document.body.classList.add('atkinson-hyperlegible'); // Add the class
          // console.log ("fontFamily set to (AH) ", document.body.classList);
      }
      isFontOn = !isFontOn;
      console.log ("Is AH font on? ", isFontOn);
  }

  // Add click event listener to the button
  hButton.addEventListener('click', toggleFont);

  // Append the button to the body
  document.body.appendChild(hButton);

})();