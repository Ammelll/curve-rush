let start;
let road = [];
const NUM_ROAD_SEGMENTS = 4;
let interval;
const height = window.innerHeight*.9, width=height ;
let p3x;
let previousSlope = 1;
const randomY = ()=> (height/2 + ((random()-0.5)*200));

class BezierCurve {
    constructor(p0,p1,p2,p3){
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }
}



function getBezierCurve(x){
    for(let curve of road){
        if(curve.p0.x < x && curve.p3.x > x){
            return curve;
        }
    }
}

let ball;

function setup(){
    ball = new Ball(createVector(300,300),createVector(0,0))
    createCanvas(width,height);
    interval = width/NUM_ROAD_SEGMENTS;
    background(200);
    start = createVector(0,height/2)
    stroke(0);
    noFill();
    initiateRoad();
}


function initiateRoad(){
    for (let i=0; i<NUM_ROAD_SEGMENTS; i++) {
        let p0 = start.copy();
        let p1 = createVector((i+1/3)*interval,randomY());
        let p2 = createVector((i+2/3)*interval,randomY());
        let p3 = createVector((i+1)*interval,randomY());
        road.push(new BezierCurve(p0,p1,p2,p3));
        start = p3;
    }
}

function draw(){
    background(220);
    ball.draw();
    ball.velocity.add(createVector(0,0.5))
    if(mouseIsPressed){
        ball.velocity.add(createVector(0.1,1));
    }
    for(let segment of road){
        segment.p0.x -=Math.min(ball.velocity.x,5);
        segment.p1.x -=Math.min(ball.velocity.x,5);
        segment.p2.x -=Math.min(ball.velocity.x,5);
        segment.p3.x -=Math.min(ball.velocity.x,5);
        if(segment == getBezierCurve(ball.pos.x)){
            p3x = segment.p3.x;
        }
        bezier(segment.p0.x, segment.p0.y, segment.p1.x, segment.p1.y, segment.p2.x, segment.p2.y, segment.p3.x,segment.p3.y);

        road = road.filter(segment => segment.p3.x > 0);
        if(road.length <= width/interval){
            let p0 = start.copy();
            let i = width-interval
            let p1 = createVector(i+interval/3,randomY());
            let p2 = createVector(i+2*interval/3,randomY());
            let p3 = createVector(i+interval,randomY());
            road.push(new BezierCurve(p0,p1,p2,p3));
            start = p3;
        }
    }
}

function evaluateBezier(p0,p1,p2,p3,t){
    let u = 1-t;
    return u**3*p0+3*u**2*t*p1+3*u*t**2*p2+t**3*p3;
}

//what does this do?
function getTForX(curve, targetX, maxIterations = 100, epsilon = 0.1) {
    let t0 = 0;
    let t1 = 1;
    let tMid;

    for (let i = 0; i < maxIterations; i++) {
        tMid = (t0 + t1) / 2;
        let x = bezierPoint(curve.p0.x, curve.p1.x, curve.p2.x, curve.p3.x, tMid);

        if (abs(x - targetX) < epsilon) {
            return tMid;
        }

        if (x < targetX) {
            t0 = tMid;
        } else {
            t1 = tMid;
        }
    }

    return tMid;
}