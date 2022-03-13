//SOH CAH TOA
// sin = opp/hyp
// cos = adj/hyp
// tan = opp/adj

interface Circle {
    x: number;
    y: number;
    r: number;
    cr: number;
}

interface CartesianObject {
    x: number;
    y: number;
}

interface PolarObject {
    r: number;
    deg: number;
}

export class Coords {

    polarToCartesian(pCO: PolarObject): object {
        let x = pCO.r * Math.cos(pCO.deg * (Math.PI / 180))
        let y = pCO.r * Math.sin(pCO.deg * (Math.PI / 180))
        return { "x": x, "y": y }
    }

    polarRelToCartesian(pCO: PolarObject, relO: CartesianObject): CartesianObject {
        let x = pCO.r * Math.cos(pCO.deg * (Math.PI / 180))
        let y = pCO.r * Math.sin(pCO.deg * (Math.PI / 180))
        return { "x": relO.x + x, "y": relO.y + y }
    }

    cartesianToPolar(o: CartesianObject): PolarObject {
        let radius = Math.sqrt(o.x * o.x + o.y * o.y)
        let deg = this.radsToDeg(Math.atan2(o.y, o.x))
        return { "r": radius, "deg": deg }
    }

    cartesianRelToPolar(o1: CartesianObject, o2: CartesianObject): PolarObject {
        let x = o1.x - o2.x;
        let y = o1.y - o2.y;
        let radius = Math.sqrt(x * x + y * y)
        let deg = this.radsToDeg(Math.atan2(y, x))
        return { "r": radius, "deg": deg }
    }

    // getTangentPoints(radiusTarget: number, deg: number, centerX: number, centerY: number): object {
    //     let p1 = this.polarRel(radiusTarget, deg + 90, centerX, centerY)
    //     let p2 = this.polarRel(radiusTarget, deg - 90, centerX, centerY)
    //     return { "p1": p1, "p2": p2 }
    // }

    getDistance = (c0: CartesianObject, c1: CartesianObject): number => {
        let x = c0.x - c1.x
        let y = c0.y - c1.y
        return Math.sqrt(x * x + y * y)
    }

    degToRads(deg: number): number {
        return deg * (Math.PI / 180)
    }

    radsToDeg(rad: number): number {
        return (rad * 180) / Math.PI
    }

}
export default new Coords()