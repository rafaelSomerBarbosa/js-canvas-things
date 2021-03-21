const canvas = document.getElementById('canvas')

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')

const score = document.querySelector('#score');
canvas.width = 800
canvas.height = 800

class Snake {
    constructor() {
        this.x = 10;
        this.y = 10;
        this.size = 50;
    }
    // update(){
    //     this.x += 1
    //     this.y += 1
    // }

    draw() {
        ctx.beginPath()
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x*this.size, this.y*this.size, this.size-1, this.size-1)
        ctx.closePath()
    }

    /**
     * 
     * @param {KeyboardEvent} evt 
     */
    commands(evt) {        
        const event = {
            'ArrowUp': () => {
                console.log('qweqwe')
                this.y -= 1
            },
            'ArrowDown': () => {
                this.y += 1
            },
            'ArrowLeft': () => {
                this.x -= 1
            },
            'ArrowRight': () => {
                this.x += 1
            },
        }

        if(event[evt.key]) event[evt.key]()
    }
}

const snake = new Snake()
document.addEventListener('keyup', (evt) => snake.commands(evt))

function animate() {    
    ctx.clearRect(0,0, canvas.clientWidth, canvas.clientHeight)

    for(let a=0; a<canvas.clientWidth/snake.size;a++){
        for(let h=0; h<canvas.clientWidth/snake.size;h++){
            ctx.fillStyle = '#000';
            ctx.fillRect(h*snake.size - (1), a*snake.size - (1), snake.size + (1*2), snake.size + (1*2))

            ctx.fillStyle = '#FFF';
            ctx.fillRect(h*snake.size, a*snake.size, snake.size, snake.size)

        }
    }    
    // snake.update()
    snake.draw()

    requestAnimationFrame(animate);    
}
animate()