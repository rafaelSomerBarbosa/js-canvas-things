const canvas = document.getElementById('particles')
canvas.setAttribute('width', window.innerWidth)
canvas.setAttribute('height', window.innerHeight)

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')
const particles = []

let mouse = {
    x: 0,
    y: 0,
}

document.addEventListener('mousemove', (evt) => {
    mouse.x = evt.clientX
    mouse.y = evt.clientY
})

document.addEventListener('click', () => {
    const newParticle = new Particle(true, true)

    particles.push(newParticle)
    // if (!newParticle.isCollidingOnFirstRender()) {
    // }
})

class Particle {
    constructor(createOnMousePosition, ignoreConflit) {
        this.id = Math.round(Math.random() * 50000)
        this.radius = 20
        // this.isCollidingOnFirstRender()
        
        if(ignoreConflit) {
            this.x = mouse.x
            this.y = mouse.y
        }

        this.moveStyleY = Math.random() * 2 > 1 ? 'down' : 'up'
        this.moveStyleX = Math.random() * 2 > 1 ? 'right' : 'left'
        this.moveSpeed = .3
        this.lastCollision = -1
        this.move = true
        this.createOnMousePosition = createOnMousePosition ?? false
        this.totalCrash = 0
    }

    update() {
        this.checkPosition()

        for (let i = 0; i < particles.length; i++) {
            if (particles[i].id == this.id) continue

            if (this.isColliding(particles[i].x, particles[i].y)) {
                if (this.lastCollision != particles[i].id) {
                    this.lastCollision = particles[i].id

                    console.log('crash +50')
                    if(this.totalCrash > 50) {
                        particles[i].moveStyleX = 'right'
                        particles[i].moveStyleY = 'up'

                        this.moveStyleX = 'left'
                        this.moveStyleX = 'down'
                    } else {
                        const oldMoveStyleX = this.moveStyleX == 'left' ? 'right' : 'left'
                        const oldMoveStyleY = this.moveStyleY == 'up' ? 'down' : 'up'
                        this.moveStyleX = particles[i].moveStyleX
                        particles[i].moveStyleX = oldMoveStyleX

                        this.moveStyleY = particles[i].moveStyleY
                        particles[i].moveStyleY = oldMoveStyleY
                    }
                }
            } else {
                this.lastCollision = -1
            }
        }

        if (this.move) {
            if (this.moveStyleY == 'down') {
                this.y += this.moveSpeed
            }

            if (this.moveStyleY == 'up') {
                this.y -= this.moveSpeed
            }

            if (this.moveStyleX == 'right') {
                this.x += this.moveSpeed
            }

            if (this.moveStyleX == 'left') {
                this.x -= this.moveSpeed
            }
        }

        // this.drawInMousePosition()
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        ctx.stroke()
    }

    checkPosition() {
        if (this.y >= (canvas.clientHeight - this.radius)) {
            this.moveStyleY = 'up'
        }

        if (this.y <= (0 + this.radius)) {
            this.moveStyleY = 'down'
        }

        if (this.x >= (canvas.clientWidth - this.radius)) {
            this.moveStyleX = 'left'
        }

        if (this.x <= (0 + this.radius)) {
            this.moveStyleX = 'right'
        }
    }

    drawInMousePosition() {
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(mouse.x, mouse.y)
        ctx.stroke()
    }

    isColliding(x, y) {
        const dx = x - this.x
        const dy = y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < this.radius + this.radius) {
            this.totalCrash += 1

            return true
        } else {
            this.totalCrash = 0
        }

        return false
    }

    isCollidingOnFirstRender() {
        if (!this.createOnMousePosition) {
            this.x = Math.random() * (canvas.clientWidth - this.radius)
            this.y = Math.random() * (canvas.clientHeight - this.radius)
        } else {
            this.x = mouse.x
            this.y = mouse.y
        }

        for (let i = 0; i < particles.length; i++) {
            if (particles[i].id == this.id) continue

            if (this.isColliding(particles[i].x, particles[i].y)) {
                return true
            }
        }

        return false
    }
}



// for (let i = 0; i < 50; i++) {
//     const newParticle = new Particle

//     if (!newParticle.isCollidingOnFirstRender()) {
//         particles.push(newParticle)
//     }
// }

function animate() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

    for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        if (particles[i]) particles[i].draw()
    }

    ctx.beginPath()
    ctx.arc(mouse.x, mouse.y, 20, 0, 2 * Math.PI)
    ctx.stroke()

    // particle.update()
    // particle.draw()

    requestAnimationFrame(animate)
}
animate()