const hButton = document.createElement("button");
hButton.innerText = "H";
hButton.type = "button";
hButton.ariaLabel = "Toggle Atkinson Hyperlegible font";
hButton.id = "hButton";

const linkMHStylesheet = document.createElement("link");
linkMHStylesheet.rel = "stylesheet";
linkMHStylesheet.href = "https://raw.githubusercontent.com/murrayinman/userscripts/main/general/MakeHyperlegible.css";
document.head.appendChild(linkMHStylesheet);

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
