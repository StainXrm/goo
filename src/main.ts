import './style.css'
import Coord from './Coordinate.js'

const GOORANGE = 400
const MAINCIRCLERADIUS = 80
const SUBCIRCLES = 10
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
  gooconnect: boolean
  constructor(x: number, y: number, r: number) {
    this.x = x
    this.y = y
    this.r = r
    this.vx = Math.random() - 0.5
    this.vy = Math.random() - 0.5
    this.gooconnect = false;
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

class Mouse {
  x: number
  y: number
  numCons: number
  r: number
  oldcon: number | undefined
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.r = 5 //min MouseSize
    this.numCons = 0
  }
  draw = () => {
    this.should_r = remap(this.numCons, 1, SUBCIRCLES, 5, 50)
    //console.log(this.numCons, this.should_r)

    //this code still sucks! we need to remove "mass from the Subcircles as we are close and put it on mouse, and vice versa!
    if (this.should_r > this.r) this.r = this.should_r
    if (this.should_r < this.r) this.r = this.r - .5
    if (this.numCons === 0) this.r = this.r - 1;
    this.r = clamp(this.r, 5, 50)




    ctx.beginPath()
    ctx.fillStyle = "white"
    ctx.strokeStyle = "none"
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
  let patchangle = 45
  let patchanglesmall = clamp((GOORANGE / distance) * 40, 20, 180)

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

var mouseCircle = new Mouse()
let mainCircle: SimpleCircle
let subCircles: any = []
const canvas = document.querySelector("canvas")
let mouseTarget = { "x": 0, "y": 0 };


let init = () => {
  console.log("init...")
  if (canvas) {
    canvas.addEventListener("mousemove", (e) => {
      mouseTarget.x = e.offsetX
      mouseTarget.y = e.offsetY
    })
  }
  if (canvas) ctx = <CanvasRenderingContext2D>canvas.getContext("2d")
  if (!ctx || !canvas) return;
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  for (let index = 0; index < SUBCIRCLES; index++) {
    let x = canvas.width / 2 + (Math.random() * 50 - 50)
    let y = canvas.height / 2 + (Math.random() * 50 - 50)
    let r = Math.random() * (MAINCIRCLERADIUS / 3) + (MAINCIRCLERADIUS / 2)
    subCircles[index] = new Circle(x, y, r)
  }
}
init()

window.addEventListener("resize", init)

//Main Draw Function here:
function drawIt() {
  ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight) //Clear first!

  mainCircle = drawCircle(canvas.width / 2, canvas.height / 2, 0) //Main Circle

  //Subcircles:
  for (let index = 0; index < subCircles.length; index++) {
    subCircles[index].draw()
    connectCircles(subCircles[index], mainCircle)
  }

  for (let index = 0; index < subCircles.length; index++) {
    let dist = Coord.getDistance({ "x": mouseTarget.x, "y": mouseTarget.y }, { "x": subCircles[index].x, "y": subCircles[index].y })
    subCircles[index].mousedist = dist;
    if (dist <= subCircles[index].r) {
      if (!subCircles[index].gooconnect) mouseCircle.numCons++;
      subCircles[index].gooconnect = true;

    }
    if (dist > GOORANGE) {
      if (subCircles[index].gooconnect) mouseCircle.numCons--;
      subCircles[index].gooconnect = false;
    }
  }

  Object.assign(mouseCircle, { x: mouseTarget.x, y: mouseTarget.y })
  mouseCircle.draw()


  for (let index = 0; index < subCircles.length; index++) {
    if (subCircles[index].mousedist <= GOORANGE && subCircles[index].gooconnect) connectCircles(mouseCircle, subCircles[index]) // this is for the actual goo like strings!
  }
  requestAnimationFrame(drawIt)
}

requestAnimationFrame(drawIt)
