let stop = false;

class Blueprint {
    constructor() {
        this.squares = [];
        this.circles = [];
        this.ellipses = [];
        this.colors = [];
        this.xVertices = [];
        this.yVertices = [];
        this.bodyPattern;
    }

    generate() {
        this.xVertices = [];
        this.yVertices = [];
        let randomBody = Math.random();
        if (randomBody < 0.5) {
            console.log("generating fighter");
            this.generateBody(3, 5, 10); //fighter pattern
            this.bodyPattern = "fighter";
        }
        else if (randomBody >= 0.5) {
            console.log("generating cruiser");
            this.generateBody(5, 8, 1);  //cruiser pattern
            this.bodyPattern = "cruiser";
        }
        if (this.bodyPattern == "fighter") this.normalizeEnds();
        this.normalizeWaists();
        if (this.bodyPattern == "cruiser") this.elongateCruiser();

    }

    testGenerate() {
        this.testGenerateBody();
    }
    testGenerateBody() {
        this.yVertices.push(183);
        this.yVertices.push(200);
        this.yVertices.push(230);
        this.yVertices.push(250);
        this.yVertices.push(260);

        this.xVertices.push(40);
        this.xVertices.push(50);
        this.xVertices.push(20);
        this.xVertices.push(100);
        this.xVertices.push(30);

        this.yVertices.sort( (a,b)=>a-b );
        this.spaceOutYs();
    }

    render() {
        translate(width/2, 0);
        beginShape();
        for (let i=0; i<this.xVertices.length; i++) {
            vertex(this.xVertices[i], this.yVertices[i]);
        }
        for (let j=this.xVertices.length-1; j>=0; j--) {
            vertex(-this.xVertices[j], this.yVertices[j]);
        }
        endShape(CLOSE);
    }


    generateBody(minVertices, maxVertices, noiseRate) {
        let vertexCount = floor(Math.random()*10);
        while (vertexCount < minVertices || vertexCount > maxVertices) vertexCount = floor(Math.random()*10);


        let noiseSeed1 = Math.random();
        let noiseSeed2 = Math.random();
        this.xVertices.push(noise(noiseSeed1)*width/5);
        this.yVertices.push(noise(noiseSeed2)*height/3);
        for (let i=0; i<vertexCount; i++) {
            noiseSeed1 += noiseRate;
            noiseSeed2 += noiseRate;
            this.xVertices.push( noise(noiseSeed1)*(width/2) );
            this.yVertices.push( noise(noiseSeed2)*height );
        }
        this.yVertices.sort( (a,b)=>a-b );
        //console.log("xVertice after generateBody: ", this.xVertices);
        //console.log("yVertices after generateBody: ", this.yVertices);
        this.smoothOut();
        //console.log("noiseRate: ", noiseRate);
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
            //console.log("in for loop iteration ", timeOut, ":  ", this.xVertices);
            timeOut++;
            if (timeOut > 200) throw "timeout";
        }
        }
        catch (a) {
            console.log(a);
            console.log("x vertices");
            console.log(xcopies);
            console.log("y vertices");
            console.log(ycopies);
        };
        try {if (stop) throw "stopp";}
        catch(a) {console.log(a)};
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
            console.log("elongate trigger");
            let multiplier = minLength / totalLength;
            for (let i=0; i<this.yVertices.length; i++) this.yVertices[i] *= multiplier;
        }
    }

}
