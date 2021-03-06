import * as canvasUtils from "./canvasUtils.js"
import { createMap, placeMines, Tile, neighboursMap, isInMap } from "./gameUtils.js"

import scoreBoard from "../assets/scoreboard.json" assert { type: "json" }

const pauseButton = document.getElementById("pause-button") as HTMLButtonElement
const restartButton = document.getElementById("restart-button") as HTMLButtonElement
const menuButton = document.getElementById("menu-button") as HTMLButtonElement

var canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D

function init(query: string): void {
    const container = document.querySelector(query)
    canvas = document.createElement("canvas")
    context = canvas.getContext("2d") as CanvasRenderingContext2D

    canvasUtils.init(canvas, context)

    canvas.addEventListener("contextmenu", (ev: MouseEvent) => ev.preventDefault())
    window.addEventListener("resize", windowResized)
    canvas.addEventListener("mousemove", mouseMove)
    canvas.addEventListener("mousedown", mouseClick)

    canvas.style.setProperty("width", "100%")
    canvas.style.setProperty("height", "100%")

    container?.appendChild(canvas)
    windowResized()

    context.textAlign = "center"
    context.textBaseline = "middle"
}

const images = {
    mine: canvasUtils.loadImage("./assets/mine.svg"),
    flag: canvasUtils.loadImage("./assets/flag.svg"),
    flagMaybe: canvasUtils.loadImage("./assets/maybe.svg"),
    flagIncorrect: canvasUtils.loadImage("./assets/incorrect.svg"),
    mineExploded: canvasUtils.loadImage("./assets/exploded.svg"),
}

const colors = {
    tileNormal: "#babdb6",
    tileNormalHover: "#d3d7cf",
    tileVisible: "#dededc",
    tileExplodedMine: "#d3d7cf",
    tileMine: "#888a85",
    1: "#ddfac3",
    2: "#ecedbf",
    3: "#eddab4",
    4: "#edc38a",
    5: "#f7a1a2",
    6: "#fea785",
    7: "#ff7d60",
    8: "#ff323c"
}

var width: number, height: number, numberOfMines: number,
    map: Tile[][],
    tileSize: number,
    imageSize: number,
    nCleared = 0,
    placedMines = false,
    exploded = false,
    flagsPlaced = 0,
    timer = 0,
    timerId = -1,
    timerStopped = false

function completed(): boolean {
    return width * height - numberOfMines == nCleared
}

function setup(_width: number, _height: number, _numberOfMines: number): void {
    width = _width
    height = _height
    numberOfMines = _numberOfMines
    map = createMap(width, height)
    calculateTileSize()
}

function calculateTileSize(): void {
    tileSize = Math.min(canvas.width / width, canvas.height / height) | 1
    imageSize = tileSize - tileSize / 3
    context.font = `${tileSize / 2}px Arial`
    context.textAlign = "center"
    context.textBaseline = "middle"
}

var mouseX: number, mouseY: number
function mouseMove(event: MouseEvent): void {
    const rect = canvas.getBoundingClientRect()
    mouseX = Math.round(event.clientX - rect.x)
    mouseY = Math.round(event.clientY - rect.y)
}

function windowResized(): void {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    calculateTileSize()
}

function getColorToFill(tile: Tile, ix: number, iy: number): string {
    // Determinate which color to fill the tile
    if (exploded && tile.hasMine && tile.flag == "None") {
        if (tile.exploded) {
            return colors.tileNormalHover
        }
        else {
            return colors.tileMine
        }
    }
    else if (!tile.cleared) {
        // On tile hover fill the tile with different color
        const mousePosition = mouseToTilePosition()
        if (mousePosition && mousePosition.x == ix && mousePosition.y == iy) {
            return colors.tileNormalHover
        }
        // Default color
        return colors.tileNormal
    }
    else if (tile.adjacentMines != 0 && !tile.exploded) {
        // If the tile is cleared and has got any adjacent mines,
        // fill it with the specific color based on the number of adjacent mines
        return colors[tile.adjacentMines as keyof typeof colors]
    }
    else {
        // Otherwise fill the tile with the default color
        return colors.tileVisible
    }
}

function loop(): void {
    canvasUtils.clear()

    if (timerStopped && placedMines && !exploded && !completed()) {
        canvasUtils.fill(colors.tileExplodedMine)
        canvasUtils.rect(0, 0, canvas.width, canvas.height)
        canvasUtils.fill("#000")
        canvasUtils.text("Pause", canvas.width / 2, canvas.height / 2)

        window.requestAnimationFrame(loop)
        return
    }

    for (let iy = 0; iy < height; iy++) {
        for (let ix = 0; ix < width; ix++) {
            // Map the positions indexes (ix, iy) to the correct size
            let x = ix * tileSize
            let y = iy * tileSize
            // Offset the tile position so that it is centered
            if (width <= height) x += canvas.width / 2 - width / 2 * tileSize
            else y += canvas.height / 2 - height / 2 * tileSize

            const tile: Tile = map[iy][ix]
            const centerX = x + tileSize / 2
            const centerY = y + tileSize / 2

            canvasUtils.fill(getColorToFill(tile, ix, iy))
            canvasUtils.rect(x, y, tileSize, tileSize)

            // Draw Image
            if (exploded && tile.hasMine && tile.flag == "None") {
                if (tile.exploded) {
                    canvasUtils.image(images.mineExploded, centerX, centerY, imageSize, imageSize)
                }
                else {
                    canvasUtils.image(images.mine, centerX, centerY, imageSize, imageSize)
                }
            }

            // If this tile has a flag draw it
            if (tile.flag === "Flag") {
                canvasUtils.image(images.flag, centerX, centerY, imageSize, imageSize)
            }
            else if (tile.flag === "Maybe") {
                canvasUtils.image(images.flagMaybe, centerX, centerY, imageSize, imageSize)
            }

            // Draw the number if the tile is cleared and has adjacent mines
            if (tile.cleared && tile.adjacentMines != 0 && !tile.exploded) {
                canvasUtils.fill("#000")
                canvasUtils.text(tile.adjacentMines.toString(), centerX, centerY)
            }
        }
    }
    updateUI()
    window.requestAnimationFrame(loop)
}

function mouseToTilePosition(): {x: number, y: number} | undefined {
    if (width <= height) {
        const margin = canvas.width / 2 - width / 2 * tileSize
        if (mouseX - margin < 0 || mouseX + margin > canvas.width) return

        const x = Math.floor((mouseX - margin) / tileSize)
        const y = Math.floor(mouseY / tileSize)
        return {x, y}
    } else {
        const margin = canvas.height / 2 - height / 2 * tileSize
        if (mouseY - margin < 0 || mouseY + margin > canvas.height) return

        const x = Math.floor(mouseX / tileSize)
        const y = Math.floor((mouseY - margin) / tileSize)
        return {x, y}
    }
}

function clearMinesRecursive(tile: Tile): void {
    if (tile.cleared) return
    tile.cleared = true
    nCleared++

    if (tile.flag === "Flag") flagsPlaced--
    tile.flag = "None"

    if (!tile.hasMine && tile.adjacentMines === 0) {
        neighboursMap.forEach(neighbour => {
            const nx = tile.x + neighbour[0]
            const ny = tile.y + neighbour[1]
            if (isInMap(nx, ny, width, height)) {
                clearMinesRecursive(map[ny][nx])
            }
        })
    }
}

function clearMine(tile: Tile) {
    if (!placedMines) {
        placeMines(map, width, height, numberOfMines, tile.x, tile.y)
        placedMines = true
        startTimer()
        pauseButton.toggleAttribute("disabled")
        restartButton.toggleAttribute("disabled")
    }
    if (tile.cleared || tile.flag == "Flag") return

    clearMinesRecursive(tile)

    if (tile.hasMine && !exploded) {
        tile.exploded = true
        exploded = true
        stopTimer()
        pauseButton.toggleAttribute("disabled")
        return
    }

    if (completed() && !exploded) {
        stopTimer()
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (map[y][x].hasMine && map[y][x].flag != "Flag") {
                    map[y][x].flag = "Flag"
                    flagsPlaced++
                }
            }
        }
        pauseButton.toggleAttribute("disabled")
        let longest = 0
        for (const score of scoreBoard) {
            longest = Math.max(longest, score.time)
        }
        if (timer <= longest && scoreBoard.length <= 10) {
            addToScoreBoard()
        }
    }
}

const scoreBoardDiv = document.getElementById("scoreBoard") as HTMLDivElement
const scoreBoardCloseButton = document.getElementById("scoreBoardClose") as HTMLButtonElement
scoreBoardCloseButton.onclick = () => {
    scoreBoardDiv.classList.toggle("invisible")
    for (const score of scoreBoard) {
        if (score.name == "") {
            scoreBoard.splice(scoreBoard.indexOf(score), 1)
        }
    }
}

const scoresDiv = document.getElementById("scores") as HTMLTableElement

function addToScoreBoard() {
    scoreBoard.push({name: "", time: timer})
    scoreBoard.sort((a, b) => {
        return a.time - b.time
    })

    if (scoreBoard.length == 11) { scoreBoard.pop() }

    scoresDiv.replaceChildren() // clear table

    for (const score of scoreBoard) {
        const row = document.createElement("tr")

        const rank = document.createElement("td")
        rank.innerText = (scoreBoard.indexOf(score) + 1).toString()
        row.appendChild(rank)

        const time = document.createElement("td")
        time.innerText = score.time.toString()
        row.appendChild(time)

        if (score.name == "") {
            const input = document.createElement("input")
            input.type = "text"
            input.classList.add("scoreInput")
            input.autofocus = true
            input.onkeydown = (ev: KeyboardEvent) => {
                if (ev.key == "Enter" && input.value != "") {
                    ev.preventDefault()
                    score.name = input.value
                    row.removeChild(input)
                    const name = document.createElement("td")
                    name.innerText = input.value
                    row.appendChild(name)
                }
            }
            row.appendChild(input)
        }
        else {
            const name = document.createElement("td")
            name.innerText = score.name
            row.appendChild(name)
        }
        scoresDiv.appendChild(row)
    }
    scoreBoardDiv.classList.toggle("invisible")
}

function switchFlag(tile: Tile): void {
    switch (tile.flag) {
        case "None":
            tile.flag = "Flag"
            flagsPlaced++
            break
        case "Flag":
            tile.flag = "Maybe"
            break
        case "Maybe":
            tile.flag = "None"
            flagsPlaced--
            break
    }
}

function tryClear(tile: Tile) {
    let Nflags = 0
    neighboursMap.forEach((neighbour) => {
        const nx = tile.x + neighbour[0]
        const ny = tile.y + neighbour[1]
        if (isInMap(nx, ny, width, height) && map[ny][nx].flag == "Flag")
            Nflags++
    })

    if (!(tile.adjacentMines == Nflags)) return

    neighboursMap.forEach((neighbour) => {
        const nx = tile.x + neighbour[0]
        const ny = tile.y + neighbour[1]
        if (isInMap(nx, ny, width, height) && map[ny][nx].flag != "Flag") {
            clearMine(map[ny][nx])
            if (completed()) return
        }
    })
}

function mouseClick(event: MouseEvent): void {
    const position = mouseToTilePosition()
    if (!position || exploded) return

    const tile: Tile = map[position.y][position.x]
    // On mouse left click
    if (event.button == 0) {
        if (tile.cleared) {
            tryClear(tile)
        }
        else {
            clearMine(tile)
        }
    }
    // On mouse right click
    else if (event.button == 2) {
        if (tile.cleared) return
        switchFlag(tile)
    }
}

function restartGame() {
    map = createMap(width, height)
    nCleared = 0
    placedMines = false
    exploded = false
    flagsPlaced = 0
    stopTimer()
    timer = 0
    pauseButton.disabled = true
    restartButton.disabled = true
}

function startTimer(): void {
    if (timerId != -1) return // Prevent from having multiple timers
    timerStopped = false
    timerId = setInterval(() => timer++, 1000)
}

function stopTimer(): void {
    timerStopped = true
    clearInterval(timerId)
    timerId = -1
}

function getTime(timer: number): {minutes: number, seconds: number} {
    const minutes = Math.floor(timer / 60)
    const seconds = timer - minutes * 60
    return {minutes, seconds}
}

function addZeros(number: number, length: number): string {
    return String(number).padStart(length, "0")
}

const flagsText = document.getElementById("flagsText") as HTMLParagraphElement
const timerText = document.getElementById("timerText") as HTMLParagraphElement
function updateUI() {
    flagsText.innerText = `${flagsPlaced} / ${numberOfMines}`
    const time = getTime(timer)
    timerText.innerText = `${addZeros(time.minutes, 2)} : ${addZeros(time.seconds, 2)}`
}

pauseButton.onclick = () => {
    if (timerStopped) {
        startTimer()
        pauseButton.innerText = "Pause"
    } else {
        stopTimer()
        pauseButton.innerText = "Resume"
    }
}

function keepGamePrompt(newGameCallback: () => void) {
    stopTimer()
    showPrompt(
        "Do you want to start a new game?",
        "If you start a new game, your current progress will be lost.",
        ["Keep Current Game", "Start New Game"],
        (index) => {
            switch (index) {
                case 0: startTimer(); break
                case 1: newGameCallback()
            }
        }
    )
}

restartButton.onclick = () => {
    if (placedMines && !exploded && !completed()) keepGamePrompt(restartGame)
    else restartGame()
}

menuButton.onclick = () => {
    if (placedMines && !exploded && !completed()) keepGamePrompt(goToHomePage)
    else goToHomePage()
}

const prompt = document.getElementById("prompt") as HTMLDivElement
const promptTitle = document.getElementById("prompt-title") as HTMLHeadingElement
const promptText = document.getElementById("prompt-text") as HTMLParagraphElement
const promptOptions = document.getElementById("prompt-options") as HTMLDivElement

function showPrompt(title: string, text: string, options: string[], callback: (index: number) => void): void {
    promptTitle.innerText = title
    promptText.innerText = text
    promptOptions.replaceChildren()
    for (const option of options) {
        const button = document.createElement("button")
        button.innerText = option
        button.classList.add("prompt-option")
        button.onclick = () => {
            Array(...promptOptions.children).map((el) => {
                el.classList.toggle("invisible")
            })
            prompt.classList.toggle("invisible")
            callback(options.indexOf(option))
        }
        promptOptions.appendChild(button)
    }
    prompt.classList.toggle("invisible")
}

function goToHomePage() {
    window.location.href = `/Mines/`
}

window.onload = () => {
    init("#canvasContainer")

    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const width = urlParams.get("width")
    const height = urlParams.get("height")
    const percentageOfMines = urlParams.get("pm")
    if (width && height && percentageOfMines) {
        const numberOfMines = Math.round(+width * +height * +percentageOfMines / 100)
        setup(+width, +height, numberOfMines)
        loop()
    } else {
        showPrompt("Invalid Arguments", "Invalid Arguments were used in the page URL", ["Back"], goToHomePage)
    }
}
