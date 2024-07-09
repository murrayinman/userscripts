const hButton = document.createElement("button");
hButton.innerText = "H";
hButton.type = "button";
hButton.ariaLabel = "Toggle Atkinson Hyperlegible font";
hButton.id = "hButton";

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap";
document.head.appendChild(fontLink);

const styleElement = document.createElement("style");
const cssRules = `
  .atkinson-hyperlegible * {font-family: "Atkinson Hyperlegible", sans-serif !important; font-weight: 400; font-style: normal;}
  .atkinson-hyperlegible strong {font-weight: 700; font-style: normal;}
  .atkinson-hyperlegible em {font-style: italic;}
  .atkinson-hyperlegible strong em, .atkinson-hyperlegible em strong {font-weight: 700; font-style: italic;}
  #hButton {position: fixed; bottom: 5px; left: 5px; z-index: 1000; height: calc(2cap + 5px); width: calc(2cap + 5px); font-size: 1rem; padding: 5px; margin: 0; background: #b2222266; color: #fff; transition: border-radius .5s ease; font-weight: 700; border-radius: 3px; border: 1px solid #cccccc; aspect-ratio: 1 / 1; line-height: 1; font-family: ui-monospace;}
  .atkinson-hyperlegible #hButton {background: #00640066; border-radius: 50%;}
  `;
styleElement.textContent = cssRules;
document.head.appendChild(styleElement);

let isFontOn = false;
function toggleFont() {
  if (isFontOn) {
    document.body.classList.remove("atkinson-hyperlegible");
  } else {
    document.body.classList.add("atkinson-hyperlegible");
  }
  isFontOn = !isFontOn;
}

hButton.addEventListener("click", toggleFont);
document.body.appendChild(hButton);
