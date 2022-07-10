let ship;

function setup() {
    frameRate(1);
    createCanvas(800, 800);
    ship = new Blueprint();
    ship.generate();
    //ship.testGenerate();
}

let test = 0;
let testrate = 0.01;
function draw() {
    background(0);
    //ship.generate();
    stroke(255);
    let x1 = 5;
    let y1 = 5;
    line(x1, y1, x1*17, y1*10);
    circle(40, 6*height/7, 40);
    line(0, height/2, width/12, height/2);
    ship.render();
}