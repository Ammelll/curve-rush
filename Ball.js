//https://gamedev.stackexchange.com/questions/37802/collision-detection-with-curves
class Ball{
    constructor(pos,velocity) {
        this.pos = pos;
        this.velocity = velocity;
    }

    
    draw() {
        this.pos.y = this.pos.y+this.velocity.y;

        const bCurve = BCurve.getBezierCurve(this.pos.x);
        const curve = bCurve.points;

        if(curve == undefined){
            return circle(this.pos.x,this.pos.y,25);
        }
        const t = curve.getTForX(this.pos.x)
        const y = bezierPoint(curve[0].y,curve[1].y,curve[2].y,curve[3].y,t);
        //3{(1−t)2(P1−P0)+2t(1−t)(P2−P1)+t2(P3−P2)}
        const slope = -1*3*((1-t)**2*(curve[1].y-curve[0].y)+2*t*(1-t)*(curve[2].y-curve[1].y)+t**2*(curve[3].y-curve[2].y)); 


        if(this.pos.y+12.5 > y){
            this.pos.y = y-12.5;
            this.velocity.x-=0.02;
        }
        this.velocity.x = this.boundVelocity(this.velocity.x);
        //B″(t) = 6(1-t)(P₂ - 2P₁ + P₀) + 6t(P₃ - 2P₂ + P₁) = 6[ (1-t)(P₂ - 2P₁ + P₀) + t(P₃ - 2P₂ + P₁) ]
        const slopePrime = 6*(1-t)*(curve[2].y-2*curve[1].y+curve[0].y) + 6*t*(curve[3].y-2*curve[2].y + curve[1].y);
        if(abs(slope-previousSlope) > 200 && abs(this.pos.y - y) <= 12.5){
            this.velocity.y = -2*this.velocity.x;
        }
        previousSlope = slope;
        circle(this.pos.x,this.pos.y,25);
    }

    boundVelocity() {
        return max(0,min(this.velocity.x,5))
    }

}
