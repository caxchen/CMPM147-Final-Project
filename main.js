let ship;


function setup() {
    frameRate(1);
    createCanvas(800, 800);
    ship = new Blueprint();
    ship.generate();
    //ship.testGenerate();
}



function shipGenerate() { ship.generate(); }

let test = 0;
let testrate = 0.01;
function draw() {
    background(0);
    //ship.generate();
    stroke(255);
    line(width/4, 0, width/4, 1.5*height/3);
    ship.render();
}