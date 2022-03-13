import './style.css'
import Coord, { Coords } from './Coordinate.js'

const GOORANGE = 40;
const DEBUG = true;

const canvas = document.querySelector("canvas")
const ctx = canvas?.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

function drawCircle(x, y, radius, fill = "white", stroke = "none") {
  ctx.beginPath()
  ctx.fillStyle = fill
  ctx.strokeStyle = stroke
  ctx.arc(x, y, radius, 0, 2 * Math.PI)
  ctx.fill()

  if (DEBUG) {
    ctx.beginPath()
    ctx.fillStyle = "rgba(255, 255, 255, .1)"
    ctx.arc(x, y, radius + GOORANGE, 0, 2 * Math.PI)
    ctx.fill()
  }
  return { "x": x, "y": y, "r": radius, "cr": radius + GOORANGE }
}

function detectIntersect(C, C2): boolean {
  let distance: number = this.getDistance(C, C2)
  if (distance > C.r + C2.r) return false //circles don't touch
  if (distance < C.r - C2.r) return false //circle is inside the other..
  if (distance == 0 && C.r == C2.r) return false //cicles are same size and on top of each other = infinite intersects!
  return true;
}

function drawDebugDot(coord: object) {
  if (!DEBUG) return
  ctx.beginPath()
  ctx.fillStyle = "red"
  ctx.strokeStyle = "none"
  ctx.arc(coord.x, coord.y, 3, 0, 2 * Math.PI)
  ctx.fill()
}


const ct = drawCircle(600, 100, 50)
const cs = drawCircle(600, 300, 80)
const ds = Coord.cartesianRelToPolar(ct, cs)
const dt = Coord.cartesianRelToPolar(cs, ct)

let angledist = dt.r * 0.2
let patchangle = 45
let patchanglesmall = 45
if (dt.r < ct.r + cs.r) patchanglesmall = dt.r * 0.45;
if (dt.r < ct.r + cs.r) angledist = dt.r * 0.1

console.log(ct.r, cs.r)

let cs1 = Coord.polarRelToCartesian({ "r": cs.r, "deg": ds.deg + patchangle }, cs)
let cs2 = Coord.polarRelToCartesian({ "r": cs.r, "deg": ds.deg - patchangle }, cs)
let ct1 = Coord.polarRelToCartesian({ "r": ct.r, "deg": dt.deg + patchanglesmall }, ct)
let ct2 = Coord.polarRelToCartesian({ "r": ct.r, "deg": dt.deg - patchanglesmall }, ct)



let cs1a = Coord.polarRelToCartesian({ "r": angledist, "deg": ds.deg - patchangle }, cs1)
let cs2a = Coord.polarRelToCartesian({ "r": angledist, "deg": ds.deg + patchangle }, cs2)
let ct1a = Coord.polarRelToCartesian({ "r": angledist, "deg": dt.deg - patchangle }, ct1)
let ct2a = Coord.polarRelToCartesian({ "r": angledist, "deg": dt.deg + patchangle }, ct2)



ctx.beginPath()
ctx.moveTo(cs1.x, cs1.y)
ctx.bezierCurveTo(cs1a.x, cs1a.y, ct2a.x, ct2a.y, ct2.x, ct2.y)
ctx?.lineTo(ct1.x, ct1.y)
ctx.bezierCurveTo(ct1a.x, ct1a.y, cs2a.x, cs2a.y, cs2.x, cs2.y)
ctx?.closePath()
ctx.fillStyle = "white"
ctx?.fill()
ctx.strokeStyle = "blue"
ctx?.stroke()

// drawDebugDot(cs1a)
// drawDebugDot(cs2a)
// drawDebugDot(ct1a)
// drawDebugDot(ct2a)
// drawDebugDot(ct1)
// drawDebugDot(ct2)
// drawDebugDot(cs1)
// drawDebugDot(cs2)





// const m = Coord.getCrossMiddle(c, ct)


//let ca1 = Coord.distanceAimAt(m.p1, ct.r, ct)
// let cb1 = Coord.distanceAimAt(m.p1, c.r, c)
// let ca2 = Coord.distanceAimAt(m.p2, ct.r, ct)
// let cb2 = Coord.distanceAimAt(m.p2, c.r, c)


// ctx.beginPath()
// ctx.moveTo(ca1.x, ca1.y)
// ctx?.quadraticCurveTo(m.center.x, m.center.y, cb1.x, cb1.y)
// ctx?.lineTo(cb2.x, cb2.y)
// ctx?.quadraticCurveTo(m.center.x, m.center.y, ca2.x, ca2.y)
// ctx?.closePath()
// ctx.fillStyle = "red"
// ctx?.fill()


//ctx.lineTo(m.p1.x, m.p1.y)
// const h2 = Coord.polarRelToCartesian({ "r": 100, "deg", })


// ctx.moveTo(tpC1.p1.x, tpC1.p1.y)
// ctx.lineTo(tpC1.p2.x, tpC1.p2.y)

//ctx.lineTo(tpC2.p1.x, tpC2.p1.y)
//ctx?.quadraticCurveTo(mid.x, mid.y, tpC2.p1.x, tpC2.p1.y)

// ctx.closePath()
// ctx?.fill();
