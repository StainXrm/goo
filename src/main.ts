import './style.css'
import Coord from './Coordinate.js'

const GOORANGE = 300
const MAINCIRCLERADIUS = 80
const SUBCIRCLES = 8
const DEBUG = !true

let ctx: CanvasRenderingContext2D

interface Coordinates {
  x: number,
  y: number
}

interface SimpleCircle {
  x: number,
  y: number,
  r: number //radius
}

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
    this.vx = Math.random() - 0.5
    this.vy = Math.random() - 0.5
  }
  calcGravity = () => {
    // let dist = Coord.getDistance({ "x": this.x, "y": this.y }, mainCircle)

    this.vx -= (this.x - mainCircle.x) * 0.0001;
    this.vy -= (this.y - mainCircle.y) * 0.0001;
    this.vx += Math.random() * 0.0001
    this.vy += Math.random() * 0.0001
  }

  draw = () => {
    this.calcGravity()
    this.x += this.vx
    this.y += this.vy
    ctx.beginPath()
    ctx.fillStyle = "white"
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
    ctx.fill()
  }
}


const clamp = (num: number, min = 0, max = 1) => Math.min(Math.max(num, min), max);
const remap = (num: number, min1 = 0, max1 = 1, min2 = 0, max2 = 1) => min2 + (num - min1) * (max2 - min2) / (max1 / min1)


function drawCircle(x: number, y: number, radius: number, fill = "white", stroke = "none"): SimpleCircle {
  if (!ctx) return { "x": -1, "y": -1, "r": -1 }
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

//Goo like stringing effect!
function connectCircles(MouseCircle: SimpleCircle, MainCircle: SimpleCircle) {
  let distance = Coord.getDistance(MouseCircle, MainCircle)
  // if (distance > GOORANGE) return;
  // if (target.r - source.r > distance) return;
  if (Math.abs(MouseCircle.r - MainCircle.r) > distance) return
  const tsd = Coord.cartesianRelToPolar(MouseCircle, MainCircle)
  const std = Coord.cartesianRelToPolar(MainCircle, MouseCircle)
  let angledist = remap(distance, 1, GOORANGE, -15, 60)
  let angledistsmall = clamp(distance, 10, 15) //this still needs tweaking!
  let patchangle = 40
  let patchanglesmall = clamp((GOORANGE / distance) * 30, 33, 160)

  let cs1 = Coord.polarRelToCartesian({ "r": MainCircle.r, "deg": tsd.deg + patchangle }, MainCircle)
  let cs2 = Coord.polarRelToCartesian({ "r": MainCircle.r, "deg": tsd.deg - patchangle }, MainCircle)
  let ct1 = Coord.polarRelToCartesian({ "r": MouseCircle.r, "deg": std.deg + patchanglesmall }, MouseCircle)
  let ct2 = Coord.polarRelToCartesian({ "r": MouseCircle.r, "deg": std.deg - patchanglesmall }, MouseCircle)

  let cs1a = Coord.polarRelToCartesian({ "r": angledist, "deg": tsd.deg - patchangle }, cs1)
  let cs2a = Coord.polarRelToCartesian({ "r": angledist, "deg": tsd.deg + patchangle }, cs2)
  let ct1a = Coord.polarRelToCartesian({ "r": angledistsmall, "deg": std.deg - patchangle }, ct1)
  let ct2a = Coord.polarRelToCartesian({ "r": angledistsmall, "deg": std.deg + patchangle }, ct2)

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

let mouseCircle
let mainCircle: SimpleCircle
let subCircles: any = []
let canvas;
let mouseTarget = { "x": 0, "y": 0 };


let init = () => {
  console.log("init...")
  canvas = document.querySelector("canvas")
  canvas.addEventListener("mousemove", (e) => {
    mouseTarget.x = e.offsetX
    mouseTarget.y = e.offsetY
    console.log(e)
  })
  if (canvas) ctx = <CanvasRenderingContext2D>canvas.getContext("2d")
  if (!ctx || !canvas) return;
  canvas.width = 800
  canvas.height = 800
  for (let index = 0; index < SUBCIRCLES; index++) {
    let x = canvas.width / 2 + (Math.random() * 50 - 50)
    let y = canvas.height / 2 + (Math.random() * 50 - 50)
    let r = Math.random() * (MAINCIRCLERADIUS / 3) + (MAINCIRCLERADIUS / 2)
    subCircles[index] = new Circle(x, y, r)
  }
}
init()

window.addEventListener("resize", init())

//Main Draw Function here:
function drawIt() {
  ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight) //Clear first!

  mainCircle = drawCircle(canvas.width / 2, canvas.height / 2, MAINCIRCLERADIUS) //Main Circle

  //Subcircles:
  for (let index = 0; index < subCircles.length; index++) {
    subCircles[index].draw()
    connectCircles(subCircles[index], mainCircle)
  }

  //MouseDot
  //IMPROVE: We should make the mouse charge up on goo and then release it on distance to each subcircle // Remove MainCircle... no need if there are enough subcis
  let mouseCircleDist = Coord.getDistance({ "x": mouseTarget.x, "y": mouseTarget.y }, { "x": mainCircle.x, "y": mainCircle.y })
  const mouseMinSize = 10;
  if (mouseCircleDist < GOORANGE) {
    let mouseCircleSize = (GOORANGE / mouseCircleDist) * 10
    mouseCircleSize = clamp(mouseCircleSize, mouseMinSize, MAINCIRCLERADIUS / 2)
    mouseCircle = drawCircle(mouseTarget.x, mouseTarget.y, mouseCircleSize)
    connectCircles(mouseCircle, mainCircle)
    for (let index = 0; index < subCircles.length; index++) {
      connectCircles(mouseCircle, subCircles[index]) // this is for the actual goo like strings!
    }
  }
  if (mouseCircleDist >= GOORANGE) {
    drawCircle(mouseTarget.x, mouseTarget.y, mouseMinSize)
  }

  requestAnimationFrame(drawIt)
}

requestAnimationFrame(drawIt)
