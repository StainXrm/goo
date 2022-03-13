import './style.css'
import Coord, { Coords } from './Coordinate.js'

const GOORANGE = 40;
const DEBUG = !true;

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

function drawDebugDot(coord: object) {
  if (!DEBUG) return
  ctx.beginPath()
  ctx.fillStyle = "red"
  ctx.strokeStyle = "none"
  ctx.arc(coord.x, coord.y, 3, 0, 2 * Math.PI)
  ctx.fill()
}

function connectCircles(target, source) {
  let distance = Coord.getDistance(sourceCircle, targetCircle)
  if (distance > 300) return;
  // if (target.r - source.r > distance) return;
  if (Math.abs(target.r - source.r) > distance) return
  const tsd = Coord.cartesianRelToPolar(target, source)
  const std = Coord.cartesianRelToPolar(source, target)
  let angledist = (distance / 300) * 80
  let patchangle = 45
  let patchanglesmall = 45
  if (target.r + source.r > distance) patchanglesmall = (90 / distance) * 70;
  if ((target.r + source.r) / 2 > distance) angledist = (distance / 300) * 1

  console.log(distance / 50)


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

let targetCircle;
let sourceCircle;
let mouseTarget = { "x": 0, "y": 0 };

window.addEventListener("mousemove", (e) => {
  mouseTarget.x = e.clientX
  mouseTarget.y = e.clientY
})

function drawIt() {
  ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight)
  targetCircle = drawCircle(mouseTarget.x, mouseTarget.y, 50)
  sourceCircle = drawCircle(600, 300, 80)
  connectCircles(targetCircle, sourceCircle)
  requestAnimationFrame(drawIt)
}
requestAnimationFrame(drawIt)



