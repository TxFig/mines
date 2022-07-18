const customMenu = document.getElementById("custom-menu")
const customMenuButton = document.getElementById("custom-menu-button")
const customMenuButtonIcon = document.getElementById("custom-menu-button-icon")
const customMenuWidth = document.getElementById("custom-menu-width") as HTMLInputElement
const customMenuHeight = document.getElementById("custom-menu-height") as HTMLInputElement
const customMenuSlider = document.getElementById("custom-menu-slider") as HTMLInputElement
const customMenuSliderText = document.getElementById("custom-menu-slider-text") as HTMLParagraphElement
const customMenuPlay = document.getElementById("custom-menu-play")

customMenuButton?.addEventListener("click", () => {
    customMenuWidth.toggleAttribute("disabled")
    customMenuHeight.toggleAttribute("disabled")
    customMenuSlider.toggleAttribute("disabled")
    customMenuPlay?.toggleAttribute("disabled")
    customMenuButtonIcon?.classList.toggle("rotate-180")
    customMenu?.classList.toggle("opacity-0")
})

customMenuSlider?.addEventListener("input", () => {
    customMenuSliderText.innerText = customMenuSlider.value + "%"
})

customMenuPlay?.addEventListener("click", () => {
    const width: number = +customMenuWidth.value | 10
    const height: number = +customMenuHeight.value | 10
    const pm: number = +customMenuSlider.value
    window.location.href = `/Mines/game?width=${width}&height=${height}&pm=${pm}`
})
