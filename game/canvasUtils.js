"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.text = exports.image = exports.loadImage = exports.rect = exports.fill = exports.clear = exports.init = void 0;
var canvas, context;
function init(_canvas, _context) {
    canvas = _canvas;
    context = _context;
}
exports.init = init;
function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
exports.clear = clear;
function fill(hex) {
    context.fillStyle = hex;
}
exports.fill = fill;
function rect(x, y, w, h) {
    context.fillRect(x, y, w, h);
    context.strokeRect(x, y, w, h);
}
exports.rect = rect;
function loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}
exports.loadImage = loadImage;
function image(img, x, y, w, h) {
    context.drawImage(img, x - w / 2, y - w / 2, w, h);
}
exports.image = image;
function text(txt, x, y) {
    context.fillText(txt, x, y);
}
exports.text = text;
