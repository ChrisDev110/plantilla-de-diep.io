const canvas = document.getElementsByTagName('canvas')[0],
    ctx = canvas.getContext('2d')

const keys = []
let mouseDown = false
window.onkeydown = (e) => {
    keys[e.key] = true
}; window.onkeyup = (e) => {
    keys[e.key] = false
}; window.onmousedown = () => {
    mouseDown = true
}; window.onmouseup = () => {
    mouseDown = false
}; window.onmousemove = (e) => {
    player.angle = Math.atan2(e.clientY-canvas.height/2, e.clientX-canvas.width/2)
}; window.onresize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

// #282828 Stroke
// #00BEFF Player
// #FFE800 Square

let COLORS = {
    STROKE: '#282828',
    PLAYER: '#00BEFF',
    SQUARE: '#FFE800'
}

let player = {
    x: 0,
    y: 0,
    angle: 0,
    speed: 4,
    basereload: 0,
    reload: 1
}
let bullets = []
let shapes = []

function init() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    for (let i = 0; i < 30; i++) {
        shapes.push({
            x: Math.random()*canvas.width-canvas.width/2,
            y: Math.random()*canvas.height-canvas.height/2,
            angle: Math.random()*2*Math.PI
        })
    }
}
function loop() {
    render()
    movePlayer()
}
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.save()

    ctx.translate(canvas.width/2-player.x, canvas.height/2-player.y)

    backGround()

    ctx.save()
    ctx.translate(player.x, player.y)
    ctx.rotate(player.angle-Math.PI/2)

    ctx.fillStyle = 'gray'
    ctx.strokeStyle = COLORS.STROKE
    ctx.lineWidth = 3
    ctx.strokeRect(-16, 0, 32, 64)
    ctx.fillRect(-16, 0, 32, 64)

    ctx.beginPath()
    ctx.arc(0, 0, 32, 0, 2*Math.PI)
    ctx.closePath()
    ctx.fillStyle = COLORS.PLAYER
    ctx.strokeStyle = COLORS.STROKE
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.fill()

    ctx.restore()

    shapes.forEach((shape, i) => {
        shape.angle += 0.02

        bullets.forEach((bullet, o) => {
            if (bullet.x+32 > shape.x &&
                bullet.x-32 < shape.x &&
                bullet.y+32 > shape.y &&
                bullet.y-32 < shape.y) {
                bullets.splice(o, 1)
                shapes.splice(i, 1)
                shapes.push({
                    x: Math.random()*canvas.width-canvas.width/2,
                    y: Math.random()*canvas.height-canvas.height/2,
                    angle: Math.random()*2*Math.PI
                })
            }
        })

        ctx.save()
        ctx.translate(shape.x, shape.y)
        ctx.rotate(shape.angle)

        ctx.fillStyle = COLORS.SQUARE
        ctx.strokeStyle = COLORS.STROKE
        ctx.lineWidth = 3
        ctx.strokeRect(-15, -15, 30, 30)
        ctx.fillRect(-15, -15, 30, 30)

        ctx.restore()
    })

    bullets.forEach(bullet => {
        bullet.x += Math.cos(bullet.angle)*5
        bullet.y += Math.sin(bullet.angle)*5

        ctx.save()
        ctx.translate(bullet.x, bullet.y)
        ctx.rotate(bullet.angle)

        ctx.beginPath()
        ctx.arc(0, 0, 16, 0, 2*Math.PI)
        ctx.closePath()
        ctx.fillStyle = COLORS.PLAYER
        ctx.strokeStyle = COLORS.STROKE
        ctx.lineWidth = 3
        ctx.stroke()
        ctx.fill()

        ctx.restore()
    })

    ctx.restore()
}
function movePlayer() {
    player.basereload += 0.05
    if (player.basereload > player.reload+0.1) {
        player.basereload = player.reload+0.1
    }

    if ((keys['a'] || keys['ArrowLeft']) == true) {
        player.x -= player.speed
    }
    if ((keys['d'] || keys['ArrowRight']) == true) {
        player.x += player.speed
    }
    if ((keys['w'] || keys['ArrowUp']) == true) {
        player.y -= player.speed
    }
    if ((keys['s'] || keys['ArrowDown']) == true) {
        player.y += player.speed
    }
    if (mouseDown == true && player.basereload > player.reload) {
        player.basereload = 0
        bullets.push({
            x: player.x + Math.cos(player.angle)*64, 
            y: player.y + Math.sin(player.angle)*64, 
            angle: player.angle
        })
    }
}
function backGround() {
    ctx.save()

    ctx.translate(0, 0)

    ctx.globalAlpha = 0.1
    ctx.lineWidth = 2
    for (let i = 0; i < canvas.width; i += 32+2) {
        for (let o = 0; o < canvas.height; o += 32+2) {
            ctx.strokeRect(i-canvas.width/2, o-canvas.height/2, 32, 32)
        }
    }

    ctx.restore()
}
init()
window.setInterval(loop, 16)