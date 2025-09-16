class Ball{
    constructor(pos,velocity) {
        this.pos = pos;
        this.velocity = velocity;
    }

    draw() {
        this.pos.y = this.pos.y+this.velocity.y;

        let curve = getBezierCurve(this.pos.x);

        if(curve != undefined){
            let t = getTForX(curve,this.pos.x)
            circle(this.pos.x,evaluateBezier(curve.p0.y,curve.p1.y,curve.p2.y,curve.p3.y,t,20))
            let y = evaluateBezier(curve.p0.y,curve.p1.y,curve.p2.y,curve.p3.y,t);
            //3{(1−t)2(P1−P0)+2t(1−t)(P2−P1)+t2(P3−P2)}
            let slope = -1*3*((1-t)**2*(curve.p1.y-curve.p0.y)+2*t*(1-t)*(curve.p2.y-curve.p1.y)+t**2*(curve.p3.y-curve.p2.y)); 
            if (this.pos.y-15 > y ) {
                this.pos.y = y-15;
                if(slope > 0){
                }
            }
            if(Math.sign(slope) != Math.sign(previousSlope) && Math.abs(slope-previousSlope) > 100 && Math.abs(this.pos.y - y) < 50){
                this.velocity.y = -10;
            }
            previousSlope = slope;

        }

        circle(this.pos.x,this.pos.y,25);
    }
}