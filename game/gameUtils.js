export class Tile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.hasMine = false;
        this.cleared = false;
        this.flag = "None";
        this.adjacentMines = 0;
        this.exploded = false;
    }
}
export function createMap(width, height) {
    const arr = [];
    for (let y = 0; y < height; y++) {
        arr.push([]);
        for (let x = 0; x < width; x++) {
            arr[y].push(new Tile(x, y));
        }
    }
    return arr;
}
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
export const neighboursMap = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [0, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1]
];
export function placeMines(map, width, height, numberOfMines, x, y) {
    for (let n = 0; n < numberOfMines;) {
        // Select random tile
        const rx = Math.floor(random(0, width - 1));
        const ry = Math.floor(random(0, height - 1));
        // If selected tile equals clicked tile continue (retry)
        if (rx == x && ry == y)
            continue;
        if (!map[ry][rx].hasMine) {
            // Find out if random tile is adjecent to clicked tile
            let adjacentToClick = false;
            for (const neighbour of neighboursMap)
                if (rx == x + neighbour[0] && ry == y + neighbour[1]) {
                    adjacentToClick = true;
                    break;
                }
            // If isn't adjacent to clicked tile place mine and update surronding tiles
            if (!adjacentToClick) {
                map[ry][rx].hasMine = true;
                for (const neighbour of neighboursMap) {
                    const nx = rx + neighbour[0];
                    const ny = ry + neighbour[1];
                    if (isInMap(nx, ny, width, height))
                        map[ny][nx].adjacentMines++;
                }
                n++;
            }
        }
    }
}
export function isInMap(x, y, width, height) {
    return x >= 0 && y >= 0 && x < width && y < height;
}
