let ship;

function setup() {
    frameRate(2);
    createCanvas(800, 800);
    ship = new Blueprint();
    ship.generate();
}

let test = 0;
let testrate = 0.01;
function draw() {
    background(0);
    ship.render();
}