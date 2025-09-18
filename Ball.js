//https://gamedev.stackexchange.com/questions/37802/collision-detection-with-curves
//B″(t) = 6(1-t)(P₂ - 2P₁ + P₀) + 6t(P₃ - 2P₂ + P₁) = 6[ (1-t)(P₂ - 2P₁ + P₀) + t(P₃ - 2P₂ + P₁) ]
// const slopePrime = 6*(1-t)*(curve[2].y-2*curve[1].y+curve[0].y) + 6*t*(curve[3].y-2*curve[2].y + curve[1].y);
let gravityVector = [0,0]
const getSlope = (curve,t) => (-1*3*((1-t)**2*(curve[1].y-curve[0].y)+2*t*(1-t)*(curve[2].y-curve[1].y)+t**2*(curve[3].y-curve[2].y)));
let previousSlope = 1;
class Ball{
    constructor(pos,velocity) {
        this.pos = pos;
        this.velocity = velocity;
        this.slope = 0;
    }
    
    draw() {
        circle(this.pos.x,this.pos.y,25);
        this.incrementYPosition();
        let curve = Ball.getBezierCurve(this.pos.x);
        if(curve == undefined) return;
        const t = Ball.getTForX(curve,this.pos.x)
        const y = bezierPoint(curve[0].y,curve[1].y,curve[2].y,curve[3].y,t);
        this.slope = getSlope(curve,t);
        this.handleGrounded(y);
        this.applyGravity(gravityVector);
        this.handleJump(y);
        previousSlope = this.slope;
    }
    changingSlope(y){
        return abs(this.slope-previousSlope) > 200 && abs(this.pos.y - y) <= 12.5
    }
    handleJump(y){
        if(this.changingSlope(y)){
            this.velocity.y = -2*this.velocity.x;
        }
    }
    onGround(y){
        return this.pos.y+12.5 > y;
    }
    handleGrounded(y){
        if(this.onGround(y)){
            this.pos.y = y-12.5;
            this.velocity.x = this.velocity.x > 0.02 ? this.velocity.x-0.02 : this.velocity.x;
            gravityVector = [-0.05*sin(atan(this.slope)),-0.05*cos(atan(this.slope))];
            return;
        } 
        gravityVector = [0,0.1];
    }
    incrementYPosition(){
        this.pos.y+=this.velocity.y;
    }
    applyGravity(gravityVector){
        this.velocity.x+= gravityVector[0];
        this.velocity.y += gravityVector[1];
        this.velocity.x = min(this.velocity.x,5)
    }

    static getBezierCurve(x){
        for(let curve of road){
            if(curve[0].x < x && curve[3].x > x){
                return curve;
            }
        }
    }
    static getTForX(curve, targetX, maxIterations = 100, epsilon = 0.1) {
        let t0 = 0;
        let t1 = 1;
        let tMid;

        for (let i = 0; i < maxIterations; i++) {
            tMid = (t0 + t1) / 2;
            let x = bezierPoint(curve[0].x, curve[1].x, curve[2].x, curve[3].x, tMid);

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
}
