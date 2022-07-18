"use strict";
const customMenu = document.getElementById("custom-menu");
const customMenuButton = document.getElementById("custom-menu-button");
const customMenuButtonIcon = document.getElementById("custom-menu-button-icon");
const customMenuWidth = document.getElementById("custom-menu-width");
const customMenuHeight = document.getElementById("custom-menu-height");
const customMenuSlider = document.getElementById("custom-menu-slider");
const customMenuSliderText = document.getElementById("custom-menu-slider-text");
const customMenuPlay = document.getElementById("custom-menu-play");
customMenuButton === null || customMenuButton === void 0 ? void 0 : customMenuButton.addEventListener("click", () => {
    customMenuWidth.toggleAttribute("disabled");
    customMenuHeight.toggleAttribute("disabled");
    customMenuSlider.toggleAttribute("disabled");
    customMenuPlay === null || customMenuPlay === void 0 ? void 0 : customMenuPlay.toggleAttribute("disabled");
    customMenuButtonIcon === null || customMenuButtonIcon === void 0 ? void 0 : customMenuButtonIcon.classList.toggle("rotate-180");
    customMenu === null || customMenu === void 0 ? void 0 : customMenu.classList.toggle("opacity-0");
});
customMenuSlider === null || customMenuSlider === void 0 ? void 0 : customMenuSlider.addEventListener("input", () => {
    customMenuSliderText.innerText = customMenuSlider.value + "%";
});
customMenuPlay === null || customMenuPlay === void 0 ? void 0 : customMenuPlay.addEventListener("click", () => {
    const width = +customMenuWidth.value | 10;
    const height = +customMenuHeight.value | 10;
    const pm = +customMenuSlider.value;
    window.location.href = `/Mines/game?width=${width}&height=${height}&pm=${pm}`;
});
