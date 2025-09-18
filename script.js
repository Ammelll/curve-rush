let start;
let road = [];
const NUM_ROAD_SEGMENTS = 4;
const height = window.innerHeight*.9, width = height;
const interval = width/NUM_ROAD_SEGMENTS;
let previousSlope = 1;
let gravityVector;

let ball;

function setup(){
    gravityVector = createVector(0,0.2);
    ball = new Ball(createVector(300,300),createVector(0,0));
    createCanvas(width,height);
    background(200);
    start = createVector(0,height/2)
    stroke(0);
    noFill();
    for (let i=0; i<NUM_ROAD_SEGMENTS; i++) {
        BCurve.makeBezier(i);
    }
}


function draw(){
    background(220);
    ball.draw();
    ball.velocity.add(gravityVector)
    if(mouseIsPressed){
        ball.velocity.add(createVector(0.1,1));
    }
    for(const segment of road){
        segment.draw();
    }
    road = road.filter(segment => segment.points[3].x > 0);
    if (road.length <= NUM_ROAD_SEGMENTS) {
        BCurve.makeBezier(NUM_ROAD_SEGMENTS);
    }
}
