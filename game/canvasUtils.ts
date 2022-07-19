var canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D

export function init(_canvas: HTMLCanvasElement, _context: CanvasRenderingContext2D): void {
    canvas = _canvas
    context = _context
}

export function clear(): void {
    context.clearRect(0, 0, canvas.width, canvas.height)
}

export function fill(hex: string): void {
    context.fillStyle = hex
}

export function rect(x: number, y: number, w: number, h: number): void {
    context.fillRect(x, y, w, h)
    context.strokeRect(x, y, w, h)
}

export type Image = HTMLImageElement | SVGImageElement
export function loadImage(src: string): Image {
    const img = new Image()
    img.src = src
    return img
}

export function image(img: Image, x: number, y: number, w: number, h: number): void {
    context.drawImage(img, x - w / 2, y - w / 2, w, h)
}

export function text(txt: string, x: number, y: number): void {
    context.fillText(txt, x, y)
}
