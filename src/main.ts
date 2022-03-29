import './style.css'
import Coord, { Coords } from './Coordinate.js'

const GOORANGE = 300;
const DEBUG = !true;

let ctx: CanvasRenderingContext2D

interface Coordinates {
  x: number,
  y: number
}

interface Circle {
  x: number,
  y: number,
  r: number //radius
}

let init = () => {
  const canvas = document.querySelector("canvas")
  ctx = canvas?.getContext("2d")
  if (!canvas) return;
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

init()



const clamp = (num: number, min = 0, max = 1) => Math.min(Math.max(num, min), max);
const remap = (num: number, min1 = 0, max1 = 1, min2 = 0, max2 = 1) => min2 + (num - min1) * (max2 - min2) / (max1 / min1)


function drawCircle(x: number, y: number, radius: number, fill = "white", stroke = "none") {
  if (!ctx) return
  ctx.beginPath()
  ctx.fillStyle = fill
  ctx.strokeStyle = stroke
  ctx.arc(x, y, radius, 0, 2 * Math.PI)
  ctx.fill()
  return { "x": x, "y": y, "r": radius }
}

function drawDebugDot(coord: Coordinates) {
  if (!DEBUG) return
  ctx.beginPath()
  ctx.fillStyle = "red"
  ctx.strokeStyle = "none"
  ctx.arc(coord.x, coord.y, 3, 0, 2 * Math.PI)
  ctx.fill()
}

function connectCircles(target, source) {
  let distance = Coord.getDistance(sourceCircle, targetCircle)
  if (distance > GOORANGE) return;
  // if (target.r - source.r > distance) return;
  if (Math.abs(target.r - source.r) > distance) return
  const tsd = Coord.cartesianRelToPolar(target, source)
  const std = Coord.cartesianRelToPolar(source, target)
  let angledist = remap(distance, 1, GOORANGE, -15, 70)
  let patchangle = 45
  let patchanglesmall = clamp((GOORANGE / distance) * 30, 45, 160)
  // if (target.r + source.r > distance) patchanglesmall = (90 / distance) * 75;
  // if ((target.r + source.r) / 2 > distance) angledist = 1



  let cs1 = Coord.polarRelToCartesian({ "r": source.r, "deg": tsd.deg + patchangle }, source)
  let cs2 = Coord.polarRelToCartesian({ "r": source.r, "deg": tsd.deg - patchangle }, source)
  let ct1 = Coord.polarRelToCartesian({ "r": target.r, "deg": std.deg + patchanglesmall }, target)
  let ct2 = Coord.polarRelToCartesian({ "r": target.r, "deg": std.deg - patchanglesmall }, target)

  let cs1a = Coord.polarRelToCartesian({ "r": angledist, "deg": tsd.deg - patchangle }, cs1)
  let cs2a = Coord.polarRelToCartesian({ "r": angledist, "deg": tsd.deg + patchangle }, cs2)
  let ct1a = Coord.polarRelToCartesian({ "r": angledist, "deg": std.deg - patchangle }, ct1)
  let ct2a = Coord.polarRelToCartesian({ "r": angledist, "deg": std.deg + patchangle }, ct2)

  ctx.beginPath()
  ctx.moveTo(cs1.x, cs1.y)
  ctx.bezierCurveTo(cs1a.x, cs1a.y, ct2a.x, ct2a.y, ct2.x, ct2.y)
  ctx.lineTo(ct1.x, ct1.y)
  ctx.bezierCurveTo(ct1a.x, ct1a.y, cs2a.x, cs2a.y, cs2.x, cs2.y)
  ctx.closePath()
  ctx.fillStyle = "white"
  ctx.fill()

  if (DEBUG) {
    ctx.strokeStyle = "blue"
    ctx.stroke()
    drawDebugDot(cs1a)
    drawDebugDot(cs2a)
    drawDebugDot(ct1a)
    drawDebugDot(ct2a)
    drawDebugDot(ct1)
    drawDebugDot(ct2)
    drawDebugDot(cs1)
    drawDebugDot(cs2)

  }
}

let targetCircle
let sourceCircle
let mouseTarget = { "x": 0, "y": 0 };

window.addEventListener("mousemove", (e) => {
  mouseTarget.x = e.clientX
  mouseTarget.y = e.clientY
})

function drawIt() {
  ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight)
  targetCircle = drawCircle(mouseTarget.x, mouseTarget.y, 50)
  sourceCircle = drawCircle(window.innerWidth / 2, window.innerHeight / 2, 80)
  connectCircles(targetCircle, sourceCircle)
  requestAnimationFrame(drawIt)
}
requestAnimationFrame(drawIt)

class Circle {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  constructor(x: number, y: number, r: number) {
    this.x = x
    this.y = y
    this.r = r
    this.vx = Math.random() * 2
    this.vy = Math.random() * 2
    this.id = null;
    this.connections = [];
  }
  draw() {
    if (!ctx) return
    ctx.beginPath()
    ctx.fillStyle = "white"
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
    ctx.fill()
  }
}

