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

    /*
    let array1 = [1, 30, 4, 21, 100000];
    array1.sort((a, b) => { if (a<b) return -1;else return 1; });
    console.log(array1);
    */

    generate() {
        this.xVertices = [];
        this.yVertices = [];
        let randomBody = Math.random();
        if (randomBody < 0.5) {
            console.log("generating fighter");
            this.generateBody(3, 5, 10); //fighter pattern
        }
        else if (randomBody >= 0.5) {
            console.log("generating cruiser");
            this.generateBody(4, 7, 2);  //cruiser pattern
        }
        /*let vertexCount = floor(Math.random()*10);
        while (vertexCount < 2 || vertexCount > 6) vertexCount = floor(Math.random()*10);
        this.generateBody(vertexCount);*/

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
        this.yVertices.push(noise(noiseSeed2)*height);
        for (let i=0; i<vertexCount; i++) {
            this.xVertices.push( noise(noiseSeed1)*(width/2) );
            this.yVertices.push( noise(noiseSeed2)*height );
            noiseSeed1 += noiseRate;
            noiseSeed2 += noiseRate;
        }
        this.yVertices.sort( (a,b)=>a-b );
        this.spaceOutYs();
        //console.log("noiseRate: ", noiseRate);
        //console.log("xVertices: ", this.xVertices);
        //console.log("yVertices: ", this.yVertices);
    }

    spaceOutYs() {

        let constant = height/20;
        let changedSomething = true;
        while (changedSomething) {
            changedSomething = false;
            for (let i=1; i<this.yVertices.length; i++) {
                if ((this.yVertices[i] - this.yVertices[i-1]) < constant) {
                    this.yVertices[i] += constant;
                    changedSomething = true;
                }
            }
            if (this.yVertices[this.yVertices.length-1] > height) {
                this.yVertices.pop();
                this.xVertices.pop();
                changedSomething = true;
            }
        }
    }

}
