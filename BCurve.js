class BCurve {
    static randomY = () => (height/2 + ((random()-0.5)*200));

    constructor(pointArr) {
        this.points = pointArr;
    }

    draw() {
        const bezArgs = [];
        const segment = this.points;
        for (const point of segment ) {
            point.x -= min(ball.velocity.x,5);
            bezArgs.push(point.x,point.y);
        }
        bezier(...bezArgs);
    }

    static makeBezier(i) {
        const cur = [start.copy()];
        for(let j=1; j<4; j++) {
            cur.push(createVector((i+j/3)*interval,BCurve.randomY()));
        }
        road.push(new BCurve(cur));
        start = cur[3];
    }

    static getBezierCurve(x){
        for(const bCurve of road){
            const curve = bCurve.points;
            if(curve[0].x < x && curve[3].x > x){
                return curve;
            }
        }
    }

    getTForX(targetX, maxIterations = 100, epsilon = 0.1) {
        const curve = this.points;
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