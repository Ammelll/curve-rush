class Ball{
    constructor(pos,velocity) {
        this.pos = pos;
        this.velocity = velocity;
    }

    draw() {
        this.pos.y = this.pos.y+this.velocity.y;

        let curve = getBezierCurve(this.pos.x);

        if(curve != undefined){
            let t = Ball.getTForX(curve,this.pos.x)
            let y = bezierPoint(curve.p0.y,curve.p1.y,curve.p2.y,curve.p3.y,t);
            //3{(1−t)2(P1−P0)+2t(1−t)(P2−P1)+t2(P3−P2)}
            let slope = -1*3*((1-t)**2*(curve.p1.y-curve.p0.y)+2*t*(1-t)*(curve.p2.y-curve.p1.y)+t**2*(curve.p3.y-curve.p2.y)); 
            if (this.pos.y-12.5 > y) {
                this.pos.y = y-12.5;
            }
            //B″(t) = 6(1-t)(P₂ - 2P₁ + P₀) + 6t(P₃ - 2P₂ + P₁) = 6[ (1-t)(P₂ - 2P₁ + P₀) + t(P₃ - 2P₂ + P₁) ]
            let slopePrime = 6*(1-t)*(curve.p2.y-2*curve.p1.y+curve.p0.y) + 6*t*(curve.p3.y-2*curve.p2.y + curve.p1.y);
            if(slopePrime !=0 && Math.abs(slope-previousSlope) > 100 && Math.abs(this.pos.y - y) <= 25){
                this.velocity.y = -10;
            }
            previousSlope = slope;

        }

        circle(this.pos.x,this.pos.y,25);
    }
    static getTForX(curve, targetX, maxIterations = 100, epsilon = 0.1) {
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
}
