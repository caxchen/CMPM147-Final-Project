let ship;

function setup() {
    frameRate(1);
    createCanvas(800, 800);
    ship = new Blueprint();
    ship.generate();
}

let test = 0;
let testrate = 0.01;
function draw() {
    ship.generate();
    background(0);
    ship.render();
}