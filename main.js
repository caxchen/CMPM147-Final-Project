let ship;
let stars;
let showcaseSwitch = false;
let showcaseCounter = 100;
let typeChosen = 1;


function setup() {
    frameRate(30);
    createCanvas(800, 800);
    ship = new Blueprint();
    ship.generate();
    stars = new Starfield();
    //ship.testGenerate();

    //set up html selector "typeChooser"
    let cruiserOption = document.createElement("option");
    cruiserOption.value = 1;
    cruiserOption.innerHTML = "cruiser";
    typeChooser.appendChild(cruiserOption);
    let fighterOption = document.createElement("option");
    fighterOption.value = -1;
    fighterOption.innerHTML = "fighter";
    typeChooser.appendChild(fighterOption);
    typeChooser.onchange = e => {
        ship.type = typeChooser.value;
        typeChosen = typeChooser.value;
        ship.generate();
    }

    //set up html selector "showcaseChooser"
    let offOption = document.createElement("option");
    offOption.value = 0;  //true and false was causing the value to be the string "true" and "false" instead of booleans
    offOption.innerHTML = "off";
    showcaseChooser.appendChild(offOption);
    let onOption = document.createElement("option");
    onOption.value = 1; 
    onOption.innerHTML = "on";
    showcaseChooser.appendChild(onOption);
    showcaseChooser.onchange = e => {
        showcaseSwitch = showcaseChooser.value;
        if (showcaseSwitch == false) ship.type = typeChosen;
    }

}


function shipGenerate() { 
    ship.generate(); 
    console.log(typeChosen, " vs ", ship.type);
}


let test = 0;
let testrate = 0.01;
function draw() {
    background(0);
    stars.render();
    showcaseUpdate();


    //stroke(0, 140, 255);
    //line(0, height-height/8, width, height-height/8);
    //line(0, height-height/4, width, height-height/4);
    noStroke();
    fill(255);
    ship.render();

}


function showcaseUpdate() {
    if (showcaseSwitch ==  1) {

        showcaseCounter++;
        if (showcaseCounter >= 150) {
            showcaseCounter = 0;
            if (Math.random() < 0.5) ship.type = -1;
            else ship.type = 1;
            ship.generate();
        }

    }
}


class Starfield {
    constructor() {
        this.xVertices = [];
        this.yVertices = [];
        this.diameters = [];
        this.count = 500;
        this.generate();
        this.scrollFlag = true;
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
            this.yVertices[i] += this.diameters[i]/20;
            if (this.yVertices[i] > height+100) this.yVertices[i] = -100;
        }
    }
}