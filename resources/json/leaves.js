const LEAF_IMAGE = "/resources/images/leaf.png";

const FALLING_LEAVES = 30;
const LEAF_SPEED = 0.2;

const canvas = document.getElementById("leaves");
const ctx = canvas.getContext("2d");

const image = new Image();
image.src = LEAF_IMAGE;

let width = 0;
let height = 0;
let dpr = 1;

const fallingLeaves = [];

function random(min, max) {
return Math.random() * (max - min) + min;
}

function resize() {
dpr = Math.min(window.devicePixelRatio || 1, 2);

width = window.innerWidth;
height = window.innerHeight;

canvas.width = width * dpr;
canvas.height = height * dpr;

canvas.style.width = width + "px";
canvas.style.height = height + "px";

ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

}

function createFallingLeaf(startAnywhere = false) {
return {
x: random(-50, width + 50),
y: startAnywhere ? random(-100, height) : random(-150, -20),
size: random(18, 45),
speed: random(0.7, 2.2) * LEAF_SPEED,
drift: random(-0.5, 0.5),
rotation: random(0, Math.PI * 2),
rotationSpeed: random(-0.025, 0.025),
sway: random(0, Math.PI * 2),
swaySpeed: random(0.01, 0.035),
swayAmount: random(0.3, 1),
opacity: random(0.65, 1)
};
}

function initialize() {
fallingLeaves.length = 0;

for (let i = 0; i < FALLING_LEAVES; i++) {
    fallingLeaves.push(createFallingLeaf(true));
}

}

function drawLeaf(leaf) {
ctx.save();

ctx.globalAlpha = leaf.opacity;
ctx.translate(leaf.x, leaf.y);
ctx.rotate(leaf.rotation);

ctx.drawImage(
    image,
    -leaf.size / 2,
    -leaf.size / 2,
    leaf.size,
    leaf.size
);

ctx.restore();

}

function updateFallingLeaf(leaf) {
leaf.y += leaf.speed;
leaf.sway += leaf.swaySpeed;

leaf.x +=
    leaf.drift +
    Math.sin(leaf.sway) * leaf.swayAmount;

leaf.rotation += leaf.rotationSpeed;

if (
    leaf.y > height + 100 ||
    leaf.x < -150 ||
    leaf.x > width + 150
) {
    Object.assign(leaf, createFallingLeaf(false));
}

}

function animate() {
ctx.clearRect(0, 0, width, height);

for (const leaf of fallingLeaves) {
    updateFallingLeaf(leaf);
    drawLeaf(leaf);
}

requestAnimationFrame(animate);

}

function start() {
resize();
initialize();
animate();
}

image.onload = start;

image.onerror = () => {
console.error("Could not load leaf image:", LEAF_IMAGE);
};

window.addEventListener("resize", resize);
