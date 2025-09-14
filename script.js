var offset = 0;
var strum = 1;
var multiplier = 1;
var start;
let road = [];
let NUM_ROAD_SEGMENTS = 4;
let interval;
let width = 800;
let height = 800;
let p3x;
class BezierCurve{
    constructor(p0,p1,p2,p3){
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }
}
class Ball{
    constructor(pos,velocity){
        this.pos = pos;
        this.velocity = velocity;
    }
    draw(){
        this.pos.y = this.pos.y+this.velocity.y;

        let curve = getBezierCurve(this.pos.x);
        if(curve != undefined){
            let t = getTForX(curve,this.pos.x)
            let tPrev = getTForX(curve,this.pos.x-10)
            circle(this.pos.x,evaluateBezier(curve.p0.y,curve.p1.y,curve.p2.y,curve.p3.y,t,20))
            let y = evaluateBezier(curve.p0.y,curve.p1.y,curve.p2.y,curve.p3.y,t);
            let yPrev = evaluateBezier(curve.p0.y,curve.p1.y,curve.p2.y,curve.p3.y,tPrev);       
            if(y > yPrev+5){
                this.velocity.y = -5;
            }
            if (this.pos.y-15 > y ) {
                this.pos.y = y-15;
                // this.velocity
            }
        }

        circle(this.pos.x,this.pos.y,25);
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
    interval = width/NUM_ROAD_SEGMENTS;
    createCanvas(800, 800);
    background(200);
    start = createVector(0,height/2)
    stroke(0);
    noFill();
    initiateRoad();
}
function randomY(){
    return height/2 + ((random()-0.5)*100)
}
function initiateRoad(){
    for(let i = 0; i < width+interval; i+=interval){
        let p0 = start.copy();
        let p1 = createVector(i+interval/3,randomY());
        let p2 = createVector(i+2*interval/3,randomY());
        let p3 = createVector(i+interval,randomY());
        road.push(new BezierCurve(p0,p1,p2,p3));
        start = p3;
    }
}
function draw(){
    background(220);
    ball.draw();
    ball.velocity.add(createVector(0,0.5))
    if(mouseIsPressed){
        ball.velocity.add(createVector(0.1,0));
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