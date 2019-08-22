const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

let interval
let frames = 0
const myObstacles = []

class Component {
  constructor(width, height, color, x, y) {
    this.width = width
    this.height = height
    this.color = color
    this.x = x
    this.y = y
    this.speedX = 0
    this.speedY = 0
  }
  draw() {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
  newPos() {
    this.x += this.speedX
    this.y += this.speedY
  }
  top() {
    return this.y
  }
  bottom() {
    return this.y + this.height
  }
  left() {
    return this.x
  }
  right() {
    return this.x + this.width
  }
  crashWith(obstacle) {
    return !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.right() < obstacle.left() ||
      this.left() > obstacle.right()
    )
  }
}

let player = new Component(30, 30, 'red', 0, 110)

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function updateCanvas() {
  frames += 1
  clearCanvas()
  player.newPos()
  player.draw()
  drawObstacles()
  updateObstacles()
  checkGameOver()
}

function start() {
  interval = setInterval(updateCanvas, 20)
}

function stop() {
  clearInterval(interval)
  interval = null
}

function checkGameOver() {
  let crashed = myObstacles.some(obstacle => player.crashWith(obstacle))

  if (crashed) {
    stop()
  }
}

function updateObstacles() {
  if (frames % 120 === 0) {
    let x = canvas.width
    let minHeight = canvas.height * 0.075
    let maxHeight = canvas.height * 0.75
    let height = Math.floor(
      Math.random() * (maxHeight - minHeight + 1) + minHeight
    )
    let minGap = canvas.height * 0.18
    let maxGap = maxHeight
    let gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap)

    myObstacles.push(new Component(10, height, 'green', x, 0))
    myObstacles.push(
      new Component(10, x - height - gap, 'green', x, height + gap)
    )
  }
}

function drawObstacles() {
  myObstacles.forEach(obstacles => {
    obstacles.x -= 1
    obstacles.draw()
  })
}

document.onkeydown = e => {
  switch (e.keyCode) {
    case 38:
      player.speedY -= 1
      break
    case 40:
      player.speedY += 1
      break
    case 37:
      player.speedX -= 1
      break
    case 39:
      player.speedX += 1
      break
    case 32:
      if (interval) break
      start()
      break
    case 81:
      stop()
      break
    default:
      break
  }
}

document.onkeyup = e => {
  player.speedX = 0
  player.speedY = 0
}
