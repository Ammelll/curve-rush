let start;
let road = [];
const NUM_ROAD_SEGMENTS = 4;
const height = window.innerHeight*.9, width = height;
const interval = width/NUM_ROAD_SEGMENTS;
const randomY = () => (height-200 + ((random()-0.5)*200));
let ball;

function setup(){
    ball = new Ball(createVector(300,height),createVector(0,0));
    createCanvas(width,height);
    background(200);
    start = createVector(0,height/2)
    stroke(0);
    noFill();
    for (let i=0; i<NUM_ROAD_SEGMENTS; i++) {
        makeBezier(i);
    }
}

function makeBezier(i) {
    let p0 = start.copy();
    let p1 = createVector((i+1/3)*interval,randomY());
    let p2 = createVector((i+2/3)*interval,randomY());
    let p3 = createVector((i+1)*interval,randomY());
    road.push([p0,p1,p2,p3]);
    start = p3;
}

function draw(){
    background(220);
    ball.draw();
    text(ball.getScore(), width/2, 100);
    line(0, ball.goal_height, width, ball.goal_height);
    if(mouseIsPressed){
        ball.velocity.add(createVector(0.3,0.5));
    }
    drawRoad();
    road = road.filter(segment => segment[3].x > 0);
    if (road.length <= NUM_ROAD_SEGMENTS) {
        makeBezier(NUM_ROAD_SEGMENTS);
    }
}

function drawRoad() {
    for(const segment of road){
        const bezArgs = [];
        for (const point of segment ) {
            point.x -= ball.velocity.x;
            bezArgs.push(point.x,point.y);
        }
        bezier(...bezArgs);
    }
}