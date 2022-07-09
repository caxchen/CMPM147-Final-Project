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
    background(0);
    ship.generate();
    stroke(255);
    //line(5, 10, 5, 10+height/20);
    circle(40, 6*height/7, 40);
    ship.render();
}