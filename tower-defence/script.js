const canvas = document.getElementById('tower-defence')
canvas.setAttribute('width', window.innerWidth)

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')
const particles = []
const enemy = []
const tower = []
const enemyPositionY = []
const score = document.getElementById('score')
const coins = document.getElementById('coins')
const wave = document.getElementById('wave')

let towerLevel = 1

let mouse = {
    x: 0,
    y: 0,
    spotX: 0,
    spotY: 0,
}

document.addEventListener('mousemove', (evt) => {
    mouse.x = evt.clientX
    mouse.y = evt.clientY
})

document.addEventListener('keyup', (evt) => {
    towerLevel = evt.key
    console.log(towerLevel)
})

canvas.addEventListener('click', () => {
    if (towerLevel == 1 && Tower.cost() <= coins.innerText) {
        tower.push(new Tower(mouse.spotX, mouse.spotY))
        coins.innerText = parseInt(coins.innerText) - Tower.cost()
    }

    if (towerLevel == 2 && TowerLevel2.cost() <= coins.innerText) {
        tower.push(new TowerLevel2(mouse.spotX, mouse.spotY, 'green'))
        coins.innerText = parseInt(coins.innerText) - TowerLevel2.cost()
    }

    if (towerLevel == 3 && TowerLevel3.cost() <= coins.innerText) {
        tower.push(new TowerLevel3(mouse.spotX, mouse.spotY, 'green'))
        coins.innerText = parseInt(coins.innerText) - TowerLevel3.cost()
    }

    if (towerLevel == 4 && TowerLevel4.cost() <= coins.innerText) {
        tower.push(new TowerLevel4(mouse.spotX, mouse.spotY, 'green'))
        coins.innerText = parseInt(coins.innerText) - TowerLevel4.cost()
    }
})

function resetGame() {
    enemy.splice(0, enemy.length)
    tower.splice(0, tower.length)
    coins.innerText = 500

    startWave(3)
}

function rotateAndPaintImage(context, image, angleInRad, positionX, positionY, axisX, axisY, width, height) {
    context.translate(positionX, positionY);
    context.rotate(angleInRad * Math.PI / 108);
    context.drawImage(image, 0, 0, 40, 43, 0, 0, -axisX, -axisY);
    context.rotate(-angleInRad * Math.PI / 108);
    context.translate(-positionX, -positionY);
}

class Tower {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.size = 50
        this.shootBall = []
        this.ballSpeed = 3
        this.shootSpeed = 2000
        this.lastShoot = new Date()
        this.damage = 5

        this.towerSprite = new Image
        this.towerSprite.src = './sprite/tower-level-1.png'
    }

    static cost() {
        return 100
    }

    draw() {
        ctx.save()
        ctx.beginPath()
        // ctx.fillStyle = 'rgba(255, 255, 255, 0)'
        // ctx.fillStyle = 'black'
        // ctx.fillRect(this.x * this.size - 2, this.y * this.size - 2, this.size, this.size)

        // rotateAndPaintImage(
        //     ctx, 
        //     this.towerSprite, 
        //     0, 
        //     this.x * this.size + (this.size / 4), 
        //     this.y * this.size,
        //     this.towerSprite.naturalWidth / 2.6,
        //     this.towerSprite.naturalHeight / 2.6
        // )        
        ctx.translate(this.x * this.size + this.size, this.y * this.size + ((this.size - 5) / 4))
        ctx.rotate(Math.PI / 2)
        // ctx.drawImage(this.towerSprite, this.x * this.size, this.y * this.size, this.towerSprite.naturalWidth / 2.6, this.towerSprite.naturalHeight / 2.6)
        ctx.drawImage(this.towerSprite, 0, 0, this.towerSprite.naturalWidth / 2.6, this.towerSprite.naturalHeight / 2.6)
        ctx.restore()
    }

    createShoot() {
        if (new Date().getTime() > this.lastShoot) {
            this.lastShoot.setMilliseconds(this.lastShoot.getMilliseconds() + this.shootSpeed)
            const y = (this.y * this.size) + (this.size / 2)

            const hasEnemyOnTrail = enemyPositionY.findIndex((positionY) => positionY == Math.floor(y / 50))

            if (hasEnemyOnTrail > -1) {
                this.shootBall.push({ x: this.x * this.size, y, damage: this.damage })
            }
        }
    }

    drawShoot() {
        for (let i = 0; i < this.shootBall.length; i++) {
            if (!this.shootBall[i]) continue

            ctx.beginPath()
            for (let e = 0; e < enemy.length; e++) {
                if (!this.shootBall[i]) continue

                if (this.shootBall[i].x - enemy[e].x >= -10 && enemy[e].y + 25 == this.shootBall[i].y) {
                    enemy[e].setHurt(this.shootBall[i].damage, e)
                    this.shootBall.splice(i, 1)
                    continue
                }

                if (this.shootBall[i].x > canvas.clientWidth) {
                    this.shootBall.splice(i, 1)
                }
            }

            if (!this.shootBall[i]) continue

            this.shootBall[i].x += this.ballSpeed
            ctx.arc(this.shootBall[i].x + this.size, this.shootBall[i].y, 10, 0, 2 * Math.PI)
            ctx.stroke()


        }
    }
}

class TowerLevel2 extends Tower {
    constructor(x, y) {
        super(x, y)
        this.damage = 10
        this.shootSpeed = 1000
        this.towerSprite = new Image
        this.towerSprite.src = './sprite/tower-level-2.png'
    }

    static cost() {
        return 200
    }
}

class TowerLevel3 extends Tower {
    constructor(x, y) {
        super(x, y)
        this.damage = 10
        this.shootSpeed = 1000
        this.towerSprite = new Image
        this.towerSprite.src = './sprite/tower-level-3.png'
    }

    static cost() {
        return 400
    }
}

class TowerLevel4 extends Tower {
    constructor(x, y) {
        super(x, y)
        this.damage = 10
        this.shootSpeed = 1000
        this.towerSprite = new Image
        this.towerSprite.src = './sprite/tower-level-4.png'
    }

    static cost() {
        return 600
    }
}

class Enemy {
    constructor(y) {
        this.x = canvas.clientWidth - 50
        this.y = y
        this.size = 50
        this.speed = .3
        this.hp = 50
        this.hurt = new Date().getTime()
        this.enemyOrk = new Image
        this.enemyOrk.src = './sprite/enemy-ork.png'

        this.enemyOrkHurt = new Image
        this.enemyOrkHurt.src = './sprite/enemy-ork-hurt.png'
    }

    static killReward() {
        return 25
    }

    update() {
        if (this.x <= 0) {
            this.x = canvas.clientWidth - 50
        }

        this.x -= this.speed
    }

    draw() {
        ctx.beginPath()
        ctx.fillStyle = 'black'
        ctx.fillText(this.hp, this.x + this.size / 2, this.y + this.size / 2)
        if (new Date().getTime() > this.hurt) {
            ctx.drawImage(this.enemyOrk, this.x, this.y, this.enemyOrk.naturalWidth / 23, this.enemyOrk.naturalHeight / 23)
        } else {
            ctx.drawImage(this.enemyOrkHurt, this.x, this.y, this.enemyOrk.naturalWidth / 23, this.enemyOrk.naturalHeight / 23)
        }
    }

    setHurt(damage, enemyIndex) {
        const time = new Date
        time.setMilliseconds(time.getMilliseconds() + 150)
        this.hurt = time.getTime()

        this.hp -= damage

        if (this.hp <= 0) {
            coins.innerText = parseInt(coins.innerText) + Enemy.killReward()
            enemy.splice(enemyIndex, 1)
            enemyPositionY.splice(enemyIndex, 1)
        }
    }
}

function startWave(totalEnemy) {
    enemyPositionY.splice(0, enemyPositionY.length)

    for (let i = 0; i < totalEnemy; i++) {
        const enemyY = Math.floor(Math.random() * canvas.clientHeight / 50)
        const sameSpot = enemyPositionY.findIndex((item) => item == enemyY)

        if (sameSpot == -1) {
            enemyPositionY.push(enemyY)
            enemy.push(new Enemy(enemyY * 50))
        } else {
            i--
        }
    }

    wave.innerText = parseInt(wave.innerText) + 1
}

function animate() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

    if (!enemy.length) startWave(3)

    for (let i = 0; i < tower.length; i++) {
        tower[i].draw()
        tower[i].createShoot()
        tower[i].drawShoot()
    }

    for (let i = 0; i < enemy.length; i++) {
        enemy[i].update()
        enemy[i].draw()
    }

    let closestX = -1
    let closestY = -1

    for (let i = 0; i < canvas.clientWidth / 50; i++) {
        const dx = i - ((mouse.x / 50))

        if (dx < 0) {
            closestX = i
        }
    }

    for (let i = 0; i < canvas.clientHeight / 50; i++) {
        const dy = i - ((mouse.y / 50))

        if (dy < 0) {
            closestY = i
        }
    }

    if (closestX > -1) {
        ctx.beginPath()
        ctx.rect(closestX * 50, closestY * 50, 50, 50)
        ctx.stroke()
        mouse.spotX = closestX
        mouse.spotY = closestY
    }

    requestAnimationFrame(animate)
}
animate()