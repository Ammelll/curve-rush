//https://gamedev.stackexchange.com/questions/37802/collision-detection-with-curves
let gravityVector = [0,0]
class Ball{
    constructor(pos,velocity) {
        this.pos = pos;
        this.velocity = velocity;
        this.slope = 0;
    }

    
    draw() {
        this.pos.y = this.pos.y+this.velocity.y;

        let curve = Ball.getBezierCurve(this.pos.x);

        if(curve == undefined){
            return circle(this.pos.x,this.pos.y,25);
f
        }
        const t = Ball.getTForX(curve,this.pos.x)
        const y = bezierPoint(curve[0].y,curve[1].y,curve[2].y,curve[3].y,t);
        //3{(1−t)2(P1−P0)+2t(1−t)(P2−P1)+t2(P3−P2)}
        const slope = -1*3*((1-t)**2*(curve[1].y-curve[0].y)+2*t*(1-t)*(curve[2].y-curve[1].y)+t**2*(curve[3].y-curve[2].y)); 
        this.slope = slope;
        
        if(this.pos.y+12.5 > y){
            this.pos.y = y-12.5;
            this.velocity.x-=0.02;
            console.log("gravitized")
            this.gravitize()
        } else{
            gravityVector = [0,0.2];
        }
        this.velocity.x+= gravityVector[0];
        this.velocity.y += gravityVector[1];
        this.velocity.x = Ball.boundVelocity(this.velocity.x);
        //B″(t) = 6(1-t)(P₂ - 2P₁ + P₀) + 6t(P₃ - 2P₂ + P₁) = 6[ (1-t)(P₂ - 2P₁ + P₀) + t(P₃ - 2P₂ + P₁) ]
        const slopePrime = 6*(1-t)*(curve[2].y-2*curve[1].y+curve[0].y) + 6*t*(curve[3].y-2*curve[2].y + curve[1].y);
        if(abs(slope-previousSlope) > 200 && abs(this.pos.y - y) <= 12.5){
            this.velocity.y = -2*this.velocity.x;
        }
        previousSlope = slope;


        circle(this.pos.x,this.pos.y,25);
    }
    gravitize(){
        gravityVector = [-0.05*sin(atan(this.slope)),-0.2*cos(atan(this.slope))];
    }

    static getBezierCurve(x){
    for(let curve of road){
        if(curve[0].x < x && curve[3].x > x){
            return curve;
        }
    }
}
    static boundVelocity(velocity){
        return max(-2,min(velocity,5))
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
