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
    stroke(0, 140, 255);
    line(0, height/6, width/8, height/6);
    ship.render();
}