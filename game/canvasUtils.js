var canvas, context;
export function init(_canvas, _context) {
    canvas = _canvas;
    context = _context;
}
export function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
export function fill(hex) {
    context.fillStyle = hex;
}
export function rect(x, y, w, h) {
    context.fillRect(x, y, w, h);
    context.strokeRect(x, y, w, h);
}
export function loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}
export function image(img, x, y, w, h) {
    context.drawImage(img, x - w / 2, y - w / 2, w, h);
}
export function text(txt, x, y) {
    context.fillText(txt, x, y);
}
