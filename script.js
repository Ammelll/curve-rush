var offset = 0;
var strum = 1;
var multiplier = 1;
var start;
let road = [];
let NUM_ROAD_SEGMENTS = 4;
let interval;
let width = 800;
let height = 800;
class BezierCurve{
    constructor(p0,p1,p2,p3){
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }
}
function setup(){
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
    for(let i = 0; i < width; i+=interval){
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
    console.log(interval)
    for(let segment of road){
        segment.p0.x -=1;
        segment.p1.x -=1;
        segment.p2.x -=1;
        segment.p3.x -=1;
        bezier(segment.p0.x, segment.p0.y, segment.p1.x, segment.p1.y, segment.p2.x, segment.p2.y, segment.p3.x,segment.p3.y);

        if(segment.p3.x < 0){
            road.shift()
        }
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