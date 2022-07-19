type Flag = "None" | "Flag" | "Maybe"
export class Tile { // TODO: Convert to dictionary
    x: number
    y: number
    hasMine: boolean
    cleared: boolean
    flag: Flag
    adjacentMines: number
    exploded: boolean

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.hasMine = false
        this.cleared = false
        this.flag = "None"
        this.adjacentMines = 0
        this.exploded = false
    }
}

export function createMap(width: number, height: number): Tile[][] {
    const arr: Tile[][] = []
    for (let y = 0; y < height; y++) {
        arr.push([])
        for (let x = 0; x < width; x++) {
            arr[y].push(new Tile(x, y))
        }
    }
    return arr
}


function random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export const neighboursMap = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [0, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1]
]

export function placeMines(map: Tile[][], width: number, height: number, numberOfMines: number, x: number, y: number): void {
    for (let n = 0; n < numberOfMines;) {

        // Select random tile
        const rx = Math.floor(random(0, width-1))
        const ry = Math.floor(random(0, height-1))

        // If selected tile equals clicked tile continue (retry)
        if (rx == x && ry == y) continue

        if (!map[ry][rx].hasMine) {
            // Find out if random tile is adjecent to clicked tile
            let adjacentToClick = false
            for (const neighbour of neighboursMap)
                if (rx == x + neighbour[0] && ry == y + neighbour[1]) {
                    adjacentToClick = true
                    break
                }
            // If isn't adjacent to clicked tile place mine and update surronding tiles
            if (!adjacentToClick) {
                map[ry][rx].hasMine = true
                for (const neighbour of neighboursMap) {
                    const nx = rx + neighbour[0]
                    const ny = ry + neighbour[1]
                    if (isInMap(nx, ny, width, height))
                        map[ny][nx].adjacentMines++
                }
                n++
            }
        }
    }
}


export function isInMap(x: number, y: number, width: number, height: number): boolean {
    return x >= 0 && y >= 0 && x < width && y < height
}
