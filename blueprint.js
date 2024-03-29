let stop = false;
let measureLine = false;

class Blueprint {
    constructor() {
        this.squares = [];
        this.circles = [];
        this.ellipses = [];
        this.colors = [];
        this.xVertices = [];
        this.yVertices = [];
        this.bodyPattern;
        this.shieldsFlag = false;
        this.shieldsColor = [0, 0, 0];
        this.hullColor;
        this.cockpitPattern;
        this.cockpit;
        this.cockpitColor;
        this.bridgeX;
        this.bridgeY;
        this.thrusterX;
        this.thrusterWidth;
        this.thrusterLength;
        this.thrusterSpritesheet = loadImage("thrusters.png");
        this.thrusterAnimation = [this.thrusterSpritesheet.get(0, 0, 567, 1134), this.thrusterSpritesheet.get(567, 0, 567, 1134),
        this.thrusterSpritesheet.get(1134, 0, 567, 1134), this.thrusterSpritesheet.get(1701, 0, 567, 1134)];  //this array doesn't work for some reason.
        this.thrusterFrame = 0;
        this.name = "SV-1 Ares"; //a default name
        this.typeName = "Private Vessel";
        this.font = loadFont("ERASMD.TTF");
        this.type = 1;  //1 is cruisers
        this.upperBound = height/8;
        this.lowerBound = height-height/4;
        this.lightsX = [];
        this.lightsY = [];
        this.lightsFrame = 0;
        this.lightsMode;
        this.hasLights = false;
    }

    generate() {
        this.xVertices = [];
        this.yVertices = [];
        if (this.type == -1) {
            console.log("generating fighter");
            this.generateBody(3, 6, 2); //fighter pattern
            this.bodyPattern = "fighter";
        }
        else if (this.type == 1) {
            console.log("generating cruiser");
            this.generateBody(5, 8, 1);  //cruiser pattern
            this.bodyPattern = "cruiser";
        }
        if (this.bodyPattern == "fighter") this.normalizeEnds();
        this.normalizeWaists();
        if (this.bodyPattern == "cruiser") this.elongateCruiser();
        //this.generateShields();
        if (this.yVertices[0] < this.upperBound) this.lower();
        if (this.yVertices[this.yVertices.length-1] > height-height/4) this.shrink();
        this.hullColor = (Math.random()*180) + 20
        if (this.bodyPattern == "fighter") this.generateCockpit();
        else if (this.bodyPattern == "cruiser") this.generateBridge();
        this.generateThrusters();
        this.generateName();
        if (Math.random() < 0.7 && this.hullColor < 120) this.generateLights();
        else this.hasLights = false;
        //console.log(this.xVertices[0]);
    }
    

    render() {
        
        translate(width/2, 0);
        //render thrusters first so it's below the main body
        this.thrusterFrame += 1;
        if (this.thrusterFrame >= this.thrusterAnimation.length) this.thrusterFrame = 0;
        fill(this.hullColor*0.7);
        noStroke();
        let snapshot;
        for (let i=0; i<this.thrusterX.length; i++) {
            snapshot = this.thrusterSpritesheet.get(this.thrusterFrame*567, 0, 567, 1134);
            snapshot.resize(this.thrusterWidth*1.7, this.thrusterWidth*2);
            image(snapshot, this.thrusterX[i]-this.thrusterWidth*0.7/2, this.yVertices[this.yVertices.length-1]+this.thrusterLength-20);
            rect(this.thrusterX[i], this.yVertices[this.yVertices.length-1]-10, this.thrusterWidth, this.thrusterLength);
        }
        //set up shields
        if (this.shieldsFlag) {
            stroke(this.shieldsColor[0], this.shieldsColor[1], this.shieldsColor[2]);
            strokeWeight(5);
        } else noStroke()
        //render body
        this.renderSymmetrical(this.xVertices, this.yVertices, this.hullColor);
        this.renderInner();
        fill(50, 30, 120);
        noStroke();
        //render cockpit
        if (this.bodyPattern == "fighter") { 
            fill(this.cockpitColor);
            if (this.cockpitPattern == "ellipse") {
                ellipse(this.cockpit[0], this.cockpit[1], this.cockpit[2], this.cockpit[3]);
            } else if (this.cockpitPattern = "polygon" || this.cockpitPattern == "strip") {
                beginShape();
                for (let i=0; i<this.cockpit.length; i++) {
                    vertex(this.cockpit[i], this.cockpit[i+1]);
                    i++;
                }
                endShape(CLOSE);
            }
        //render command bridge
        } else if (this.bodyPattern == "cruiser") {
            this.renderSymmetrical(this.bridgeX, this.bridgeY, this.hullColor - 40);
        }
        textSize(40);
        fill(255);
        textFont(this.font);
        text(this.name, width/30-width/2, height/20);  //name text
        textSize(25);
        text(this.typeName, -width/2 + width/30, height/12); //ship type
        stroke(252, 186, 3);
        strokeWeight(5);

        //rendering lights
        if (this.hasLights) {
            this.lightsFrame++;
            if (this.lightsFrame > 70) this.lightsFrame = 0;
            if (this.lightsFrame == 45) fill(this.lightsColor[0], this.lightsColor[1], this.lightsColor[2]);
            else if (this.lightsFrame == 53) fill(this.lightsColor[0], this.lightsColor[1], this.lightsColor[2]);
            else fill(this.hullColor);
            noStroke();
            let lightsSize = 4;
            if (this.bodyPattern == "cruiser") {
                for (let i=1; i<this.lightsCount; i++) {
                circle(this.lightsSeparationX, this.yVertices[0] + i*this.lightsSeparationY, 4);
                circle(-this.lightsSeparationX, this.yVertices[0] + i*this.lightsSeparationY, 4);
                }
            } else if (this.bodyPattern == "fighter") {
                circle(this.fighterLightsX[0], this.fighterLightsY[0], lightsSize);
                circle(-this.fighterLightsX[0], this.fighterLightsY[0], lightsSize);
                circle(this.fighterLightsX[1], this.fighterLightsY[1], lightsSize);
                circle(-this.fighterLightsX[1], this.fighterLightsY[1], lightsSize);

            }
        }
    }

    renderSymmetrical(xArray, yArray, color) {
        fill(color);
        beginShape();
        for (let i=0; i<xArray.length; i++) {
            vertex(xArray[i], yArray[i]);
        }
        for (let i=xArray.length-1; i>=0; i--) {
            vertex(-xArray[i], yArray[i]);
        }
        endShape(CLOSE);
    }

    renderInner() { //render() was getting a bit crowded
        fill(this.hullColor-10);
        let multiplier = 0.8;
        let offset = this.yVertices[this.yVertices.length-1] - this.yVertices[this.yVertices.length-1]*multiplier;
        beginShape(); 
        for (let i=0; i<this.xVertices.length; i++) {
            vertex(this.xVertices[i] * multiplier, this.yVertices[i]);
        }
        for (let j=this.xVertices.length-1; j>=0; j--) {
            vertex(-this.xVertices[j] * multiplier, this.yVertices[j]);
        }
        endShape(CLOSE);
    }


    generateBody(minVertices, maxVertices, noiseRate) {
        let vertexCount = floor(Math.random()*10);
        while (vertexCount < minVertices || vertexCount > maxVertices) vertexCount = floor(Math.random()*10);

        let noiseSeed1 = Math.random()*100;
        let noiseSeed2 = Math.random()*100;
        this.xVertices.push(noise(noiseSeed1)*width/5);
        this.yVertices.push(noise(noiseSeed2)*height/3);
        for (let i=0; i<vertexCount; i++) {
            noiseSeed1 += noiseRate;
            noiseSeed2 += noiseRate;
            this.xVertices.push( noise(noiseSeed1)*(width/2) );
            this.yVertices.push( noise(noiseSeed2)*height );
        }
        this.yVertices.sort( (a,b)=>a-b );
        this.smoothOut();
    }

    smoothOut() {
        let xcopies = this.xVertices;
        let ycopies = this.yVertices;
        let changedSomething = true;
        let xdif, ydif;
        let maxdif = 1.7
        let timeOut = 0;
        try {
        while (changedSomething) {
            changedSomething = false;
            for (let i=1; i<this.yVertices.length; i++) {
                xdif = this.xVertices[i] - this.xVertices[i-1];
                ydif = this.yVertices[i] - this.yVertices[i-1];
                if (xdif > maxdif*ydif) { //xi is bigger than x(i-1)
                    this.xVertices[i] /= 2;
                    changedSomething = true;
                } else if (xdif < -maxdif*ydif) { //x(i-1) is bigger than xi  so xdif is negative
                    this.xVertices[i-1] /= 2;
                    changedSomething = true;
                }
            }
            timeOut++;
            if (timeOut > 200) throw "timeout";
        }
        if (xdif > maxdif*ydif || xdif < -maxdif*ydif) {
            console.log("spike detected");
            console.log("x vertices");
            console.log(xcopies);
            console.log("y vertices");
            console.log(ycopies);
            console.log("xdif: ", xdif, "  ydif: ", ydif);
        }
        }
        catch (a) {
            console.log(a);
            console.log("x vertices");
            console.log(xcopies);
            console.log("y vertices");
            console.log(ycopies);
            console.log("xdif: ", xdif, "  ydif: ", ydif);
        };
    }


    normalizeEnds() {
        if (this.xVertices[0] > this.xVertices[2] || this.xVertices[0] > width/10) {
            this.xVertices[0] = Math.random()*width/14;
        }
        if (this.xVertices[this.xVertices.length-2] < this.xVertices[0]) this.xVertices[this.xVertices.length-2] = this.xVertices[0]*2;
    }

    normalizeWaists() {
        for (let i=1; i<this.xVertices.length; i++) {
            if (this.xVertices[i] < width/12) this.xVertices[i] = width/12;
        }
    }

    elongateCruiser() {
        let minLength = 1.5*height/3;
        let totalLength = this.yVertices[this.yVertices.length-1] - this.yVertices[0];
        if (totalLength < minLength) {
            let multiplier = minLength / totalLength;
            for (let i=0; i<this.yVertices.length; i++) this.yVertices[i] *= multiplier;
        }
    }

    shrink() {
        let constant = this.lowerBound/this.yVertices[this.yVertices.length-1];
        for (let i=0; i<this.yVertices.length; i++) {
            this.xVertices[i] *= constant;
            this.yVertices[i] *= constant;
        }
    }

    lower() {
        let constant = this.upperBound - this.yVertices[0];
        for (let i=0; i<this.yVertices.length; i++) {
            this.yVertices[i] += constant;
        }
    }

    generateShields() {
        let gotRand1 = Math.random();
        if (gotRand1 < 0.6) {
            this.shieldsFlag = false;
            return;
        }
        this.shieldsFlag = true;
        if (gotRand1 < 0.8) {  //blue shields
            this.shieldsColor = [0, 140, 255];
        } else if (gotRand1 < 0.9) {  //orange shields
            this.shieldsColor = [255, 166, 0];
        } else if (gotRand1 < 0.93) { //yellow shields
            this.shieldsColor = [237, 222, 14];
        } else if (gotRand1 < 0.98) { //green shields
            this.shieldsColor = [0, 237, 95];
        } else {  //rare pink shields
            this.shieldsColor = [237, 0, 182];
        }
    }

    generateCockpit() {
        let maxWidth = findMax(this.xVertices);
        let length = this.yVertices[this.yVertices.length-1] - this.yVertices[0];
        let gotRand = Math.random();
        if (gotRand < 0.40) { //ellipse pattern
            this.cockpitPattern = "ellipse";
            this.cockpit = [0, this.yVertices[0] + length/2, maxWidth/3, length/3];
        } else if (gotRand < 0.8 && this.xVertices[0] < this.xVertices[1]) { //trapezoid pattern
            this.cockpitPattern = "polygon";
            this.cockpit = [this.xVertices[0]/3, this.yVertices[0]+length/3, this.xVertices[1]/3, this.yVertices[0] + 2*length/3, 
            -this.xVertices[1]/3, this.yVertices[0] + 2*length/3, -this.xVertices[0]/3, this.yVertices[0]+length/3];

        }  else if (this.xVertices[0] > width/16) { //strip pattern
            this.cockpitPattern = "strip";
            this.cockpit = [this.xVertices[1]/2, this.yVertices[0]+length/3, this.xVertices[1]/2, this.yVertices[0]+length/3+length/12,
            this.xVertices[1]/2-this.xVertices[1]/6, this.yVertices[0]+length/3+length/17, 
            -(this.xVertices[1]/2-this.xVertices[1]/6), this.yVertices[0]+length/3+length/17,
            -this.xVertices[1]/2, this.yVertices[0]+length/3+length/12, -this.xVertices[1]/2, this.yVertices[0]+length/3];

        } else {
            this.cockpitPattern = "ellipse";
            this.cockpit = [0, this.yVertices[0] + length/2, maxWidth/3, length/3];
        }
        if (this.shieldsFlag) this.cockpitColor = this.shieldsColor;
        else {
            let gotRand2 = Math.random();
            if (gotRand2 < 0.1) this.cockpitColor = [115, 43, 33]; //dark red
            else if (gotRand2 < 0.2) this.cockpitColor = [209, 143, 63]; //orange
            else if (gotRand2 < 0.3) this.cockpitColor = [219, 206, 107]; //yellow
            else if (gotRand2 < 0.4) this.cockpitColor = [37, 105, 75]; //green
            else if (gotRand2 < 0.5) this.cockpitColor = [74, 148, 145]; //dark cyan
            else if (gotRand2 < 0.6) this.cockpitColor = [78, 84, 135]; //dark blue
            else if (gotRand2 < 0.7) this.cockpitColor = [99, 78, 135]; //purple
            else if (this.cockpitPattern == "strip") this.cockpitColor = [115, 43, 33]; //dark red;
            else this.cockpitColor = [74, 148, 145]; //dark cyan
        }

    }

    generateBridge() {
        //3 patterns
        //1: 4 vertices.  begins and ends on reflectline (chevron pattern)
        //2: 4 vertices.  none on reflectline  (underwear pattern)
        //3: starting vertex, 3 more vertices to form a quadrangle, ends at starting vertex.  makes 2 symmetrical shapes (strip pattern)
        let gotRand = Math.random();
        this.bridgeX = [];
        this.bridgeY = [];
        let maxX = findMinNotFront(this.xVertices);
        let maxLength = height/20;
        let start = this.yVertices[2];
        this.bridgeX.push(0); //0
        this.bridgeY.push(start);
        if (gotRand < 0.33) { //case 1
            this.bridgeX.push(maxX/2 + Math.random()*maxX/2);
            this.bridgeY.push(start + Math.random()*maxLength);
            this.bridgeX.push(this.bridgeX[1]);
            this.bridgeY.push(this.bridgeY[1] + 0.85*maxLength);
            this.bridgeX.push(0);
            this.bridgeY.push(start + this.bridgeY[2] - this.bridgeY[1] + Math.random()*maxLength/8);
        } else if (gotRand < 0.66) { //case 2
            this.bridgeX.push(maxX/5); //1
            this.bridgeY.push(start);
            this.bridgeX.push(this.bridgeX[1] + maxLength/10); //2
            this.bridgeY.push(start + maxLength/2);
            this.bridgeX.push(this.bridgeX[2] + maxX/3); //3
            this.bridgeY.push(this.bridgeY[2]);
            this.bridgeX.push(this.bridgeX[3] + maxX/10); //4
            this.bridgeY.push(this.bridgeY[3] + maxLength/2);
        } else {  // case 3   
            this.bridgeX.push(maxX/5); //1
            this.bridgeY.push(start - maxX/6);
            this.bridgeY[0] = this.bridgeY[1];
            this.bridgeX.push(this.bridgeX[1] + maxX/3); //2
            this.bridgeY.push(this.bridgeY[1] + maxLength/10);
            this.bridgeX.push(this.bridgeX[2]); //3
            this.bridgeY.push(this.bridgeY[2] + 2*maxLength);
            this.bridgeX.push(this.bridgeX[1]); //4
            this.bridgeY.push(this.bridgeY[3]);
            this.bridgeX.push(this.bridgeX[1]); //5
            this.bridgeY.push(this.bridgeY[1]);

        }
    }


    generateThrusters() {
        //FIRST generate thruster size within a range
        //THEN figure out how many thrusters you can fit onto the back.  backsize/thrusterwidth.  then put them on
        //THEN see if there are any other places you can fit thrusters
        let backLength = 2 * this.xVertices[this.xVertices.length - 1];
        this.thrusterWidth = width/10; //default width just for acquiring thrusterCount
        let minThrusters = Math.floor(backLength/this.thrusterWidth);
        if (minThrusters == 0) minThrusters = 1;
        let maxThrusters = minThrusters + 1;
        if (minThrusters > 2) minThrusters--;
        let thrusterCount = minThrusters + Math.floor( Math.random() * (maxThrusters+1-minThrusters) ); //thrusterCount done
        this.thrusterWidth = backLength / thrusterCount;
        this.thrusterWidth *= 0.7;
        measureLine = this.thrusterWidth;
        this.thrusterX = [];
        for (let i=1; i<=thrusterCount; i++) {
            this.thrusterX.push(i*backLength/thrusterCount - backLength/2 - this.thrusterWidth - 0.15*backLength/thrusterCount);
        }
        this.thrusterLength = (0.5 + Math.random()) * this.thrusterWidth; //0.5 to 1.5
    }

    generateName() {
        //constructor was getting a bit crowded.
        this.pre = ["Paan-", "Baan-", "Ven", "Ad", "Tain", "Noor", "Skur", "Ti", "Yi", "Fai", "Om", "Can", "Um", "Kor", "Xor", 
        "deez", "Scai", "E", "Zel", "Dir", "Rav", "Ste", "Este", "Ele", "Ala", "Shi", "Deez ", "Hai", "Gai", "Syl", "Ala", "Ix", "Him",
        "Win", "Van", "Tor", "Lon", "San", "Ed", "Goth", "Sto", "Hel", "Vil", "Val", "Am", "Uel", "Mun", "Witt", "Nord", "Ryll", "Skyv", 
        "Niko", "Thys", "Vend", "Brond", "Vell", "Ska", "Fal", "Ron", "Skron", "Hem", "Lin", "Stan", "Tan", "Sod", "Mar", "Up", "Gav", 
        "Mor", "Sal", "Sol", "Kau", "Jak", "In", "Al", "Lak", "Tanna", "Gir", "Mos", "Saf", "Wan", "Oam", "Kai", "Gung"];
        this.post = ["fera", "el", "an", "chak", "urz", "min", "kren", "shi", "delar", "mun", "ana", "venna", "telios", "elia", "a", "nuts",
        "sandor", "krisk", "vos", "karzan", "enia", "ia", "o", "mor", "isk", "Nuts", "cho", "faen", "gadda", "ix", "eiji", "lin", "var", 
        "heim", "helm", "havn", "hafen", "is", "ier", "bur", "ien", "ona", "anca", "aga", "on", "una", "gona", "udia", "sari", "hero",
        "urse", "cchio", "les", "zaro", "sina", "sala", "eb", "je", "ich", "ern", "ioux", "eux", "eans", "hoven", "olle", "burg", "wick",
        "zig", "stadt", "ling", "ingen", "gart", "dorf", "alze", "munde", "foss", "inne", "hamar", "ovka", "uka", "izhka", "more", "orsk",
        "myr", "laiv", "at", "ul", "ton", "anga", "nui", "aka", "koura", "gill"];
        this.adj = ["Vain", "Formless", "Twisted", "Crystal", "Red", "Grey", "White", "Black", "Adamantian", "Obsidian", "Iron", "Steel",
        "Night", "Solar", "Dark", "Burning", "Sex", "Holy", "Fane", "Auroran", "Polar", "Heavenly", "Lonely", "Arctic", "Mystic", "Distant",
        "Far", "Funky Fresh", "Queen's", "Great", "Golden"];
        this.cruiserNoun = ["Pegasus", "Ghost", "Blade", "Sword", "Spear", "Valkyrie", "Void", "Serpent", "Dragon", "Fire", "Flame", "Wind", 
        "Spirit", "Vision", "Star", "Sun", "Aurora", "Vortex", "Pulsar", "Quasar", "Aquila", "Vale", "Veil", "Garden", "Shore", "Hand"]
        this.nounSingle = ["Tyrfing", "Hela", "Hades", "Loki", "Zeus", "Surtr", "York", "Mandalay", "Jakarta", "Bengaluru", "Acapulco", "Colombo", 
        "Kolkata", "Tianjin", "Taipei", "Ulaanbaatar", "Antanarivo", "Cairo", "Pegasus", "Golem", "Jotun", "Ankara", "Dakar", "Valencia",
        "Daegu", "Resolute", "Hera", "Roskilde", "Tallinn", "Helsinki", "Vilnius", "Medina", "Algiers", "Caen", "Montpellier", "Groz", 
        "Malta", "Khartoum", "Nairobi", "Lisbon", "Königsberg", "Atlanta", "Mom's Spaghetti", "Quito", "Raphael", "Abaddon",
        "Ezekiel", "Saint Augustine", "Bonaventure", "Caleston", "Canterbury", "Ravenna", "Mercantilist", "Blackbeard", "Resolute", "Cornucopia"];
        //Note: US Navy Cruisers are named after cities
        this.fighterNoun = ["Basilisk", "Archer", "Antares", "Magi", "Marauder", "Outlander", "Farsight", "Owl", "Eagle", "Salamander",
        "Goblin", "Lamp", "Galliot", "Dragonfly", "Locust", "Mantis", "Cicada", "Castella", "Ghost", "Phantom", "Aurora", "Vortex",
        "Pulsar", "Quasar", "Nomad", "Firehawk", "Spriggan", "Sparrow", "Ringdancer", "Starskipper", "Beltskipper", "Corsair", "Calico",
        "Wyvern", "Contrail", "Comet", "Hadron", "Griffin", "Hammerhead"];
        this.cruiserTypes = ["Yacht", "Cargo Ship", "Battleship", "Frigate", "Destroyer", "Dreadnought", "Transport", "Passenger Ship",
        "Exploration Vessel", "Science Vessel", "Trade Vessel", "Flagship", "Resort Cruiser", "Medical Frigate", "Cathedral Ship"];
        this.fighterTypes = ["Fighter", "Personal Transport", "Shuttle", "Corporate Shuttle", "Civilian Shuttle", "Bomber", "Dropship",
        "Exploration Craft", "Scout Ship"]
        this.name = "";
        // 65 - 90 is capital letters
        // 48 - 57 is numbers
        if (this.bodyPattern == "fighter") {
            let gotRand1 = Math.random();
            if (gotRand1 < 0.5) {  //prepost fighternoun
                this.name += this.pre[Math.floor(Math.random()*this.pre.length)];
                this.name += this.post[Math.floor(Math.random()*this.post.length)];
                this.name += " ";
                this.name += this.fighterNoun[Math.floor(Math.random()*this.fighterNoun.length)];
            } else { // letter-number fighternoun 
                this.name += String.fromCharCode(65+Math.floor(Math.random()*26))
                this.name += "-";
                this.name += Math.floor(Math.random() * 101) + " ";
                this.name += this.fighterNoun[Math.floor(Math.random()*this.fighterNoun.length)];
            }
            this.typeName = this.fighterTypes[Math.floor(Math.random()*this.fighterTypes.length)];
        } else if (this.bodyPattern == "cruiser") {
            let gotRand2 = Math.random();
            this.name += String.fromCharCode(65+Math.floor(Math.random()*26));
            this.name += String.fromCharCode(65+Math.floor(Math.random()*26));
            this.name += String.fromCharCode(65+Math.floor(Math.random()*26)) + " ";
            if (gotRand2 < 0.3) { // cruiserNoun of prepost
                this.name += this.cruiserNoun[Math.floor(Math.random()*this.cruiserNoun.length)] + " of ";
                this.name += this.pre[Math.floor(Math.random()*this.pre.length)];
                this.name += this.post[Math.floor(Math.random()*this.post.length)];
            } else if (gotRand2 < 0.7) { //nounSingle
                this.name += this.nounSingle[Math.floor(Math.random()*this.nounSingle.length)];
            } else { // adj cruiserNoun
                this.name += this.adj[Math.floor(Math.random()*this.adj.length)] + " ";
                this.name += this.cruiserNoun[Math.floor(Math.random()*this.cruiserNoun.length)];
            }
            this.typeName = this.cruiserTypes[Math.floor(Math.random()*this.cruiserTypes.length)];
        }
    }


    generateLights() {
        this.hasLights = true;
        this.lightsSeparationX = width/60;
        this.lightsSeparationY = height/35;
        if (this.bodyPattern == "cruiser") this.lightsCount = Math.floor((this.bridgeY[0] - this.yVertices[0])/this.lightsSeparationY);
        else {
            let edge;
            if (this.yVertices[1]-this.yVertices[0] > this.yVertices[2]-this.yVertices[1]) edge = 0;
            else edge = 1;
            let yAdd = (this.yVertices[this.yVertices.length-1] - this.yVertices[0]) / 25;
            this.fighterLightsX = [];
            this.fighterLightsX.push(this.xVertices[edge + 0] * 0.7);
            this.fighterLightsY = [];
            this.fighterLightsY.push(this.yVertices[edge + 0] + yAdd);
            this.fighterLightsX.push(this.xVertices[edge + 1] * 0.7);
            this.fighterLightsY.push(this.yVertices[edge + 1] + yAdd);
        };
        
        let gotRand = Math.random();
        if (gotRand < 0.25) this.lightsColor = [255,255,255]; //white
        else if (gotRand < 0.5) this.lightsColor = [255, 174, 0]; //orange
        else if (gotRand < 0.75) this.lightsColor = [255, 98, 66];  //red
        else if (gotRand < 1) this.lightsColor = [61, 255, 13]; //green
        //else this.lightsColor = [51, 99, 255]; //blue
        this.lightsFrame = 0;
    }

}



function findMax(searchArray) {
    let max = 0;
    for (let i=0; i<searchArray.length; i++) {
        if (searchArray[i] > max) max = searchArray[i];
    }
    return max;
}

function findMinNotFront(searchArray) {
    let min = searchArray[1];
    for (let i=2; i<searchArray.length; i++) {
        if (searchArray[i] < min) min = searchArray[i];
    }
    return min;

}
