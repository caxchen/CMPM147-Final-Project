let ship;
let stars;

function setup() {
    frameRate(30);
    createCanvas(800, 800);
    ship = new Blueprint();
    ship.generate();
    stars = new Starfield();
    //ship.testGenerate();
}


function shipGenerate() { ship.generate(); }

let test = 0;
let testrate = 0.01;
function draw() {
    background(0);
    stars.render();
    //ship.generate();
    stroke(0, 140, 255);
    //line(0, height-height/8, width, height-height/8);
    line(0, height-height/4, width, height-height/4);
    noStroke();
    fill(255);
    ship.render();

}


class Starfield {
    constructor() {
        this.xVertices = [];
        this.yVertices = [];
        this.diameters = [];
        this.count = 500;
        this.generate();
        this.scrollFlag = false;
    }

    generate() {
        for (let i=0; i<this.count; i++) {
            this.xVertices.push(Math.random()*width);
            this.yVertices.push(Math.random()*(height+100)-100);
            this.diameters.push(width/(200 + Math.random()*300));
        }
    }

    render() {
        fill(255);
        noStroke();
        for (let i=0; i<this.xVertices.length; i++) {
            circle(this.xVertices[i], this.yVertices[i], this.diameters[i]);
        }
        if (this.scrollFlag) this.parallaxScroll();
    }

    parallaxScroll() {
        for (let i=0; i<this.yVertices.length; i++) {
            this.yVertices[i] += this.diameters[i];
            if (this.yVertices[i] > height+100) this.yVertices[i] = -100;
        }
    }
}