const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7 //get rid of gap on bottom of player
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './img/shop.png',
    scale: 2.75, 
    framesMax: 6 //how many frames total
})



const player = new Fighter({
   position: {
    x: 0, 
    y: 0
},
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 0,
        y: 0,
    }, 
    imageSrc: './samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157

    },
    sprites: {
        idle: {
            imageSrc: './samuraiMack/Idle.png',
            framesMax: 8 //how many frames/poses
        },
        run: {
            imageSrc: './samuraiMack/Run.png',
            framesMax: 8,
            image: new Image()
        }, 
        jump: {
            imageSrc: './samuraiMack/Jump.png',
            framesMax: 2,
            image: new Image()
        },
        fall: {
            imageSrc: './samuraiMack/Fall.png',
            framesMax: 2,
            image: new Image()

        },
        attack1: {
            imageSrc: './samuraiMack/Attack1.png',
            framesMax: 6,
            image: new Image()

        }, 
        takeHit: {
            imageSrc: './samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4,
            image: new Image()
    },
    death: {
        imageSrc: './samuraiMack/Death.png',
        framesMax: 6,
    }
},
    attackbox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
   
})


const enemy = new Fighter({
    position: { 
    x: 400, 
     y: 100
 },
     velocity: {
         x: 0,
         y: 0,
     },
     color: 'blue',
     offset: {
        x: -50,
        y: 0,
    },
    imageSrc: './kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167

    },
    sprites: {
        idle: {
            imageSrc: './kenji/Idle.png',
            framesMax: 4 //how many frames/poses
        },
        run: {
            imageSrc: './kenji/Run.png',
            framesMax: 8,
            image: new Image()
        }, 
        jump: {
            imageSrc: './kenji/Jump.png',
            framesMax: 2,
            image: new Image()
        },
        fall: {
            imageSrc: './kenji/Fall.png',
            framesMax: 2,
            image: new Image()

        },
        attack1: {
            imageSrc: './kenji/Attack1.png',
            framesMax: 4,
            image: new Image()

        }, 
        takeHit: {
            imageSrc: './kenji/Take hit.png',
            framesMax: 3,
            image: new Image()

        },
        death: {
            imageSrc: './kenji/Death.png',
            framesMax: 7,
        }
    },
    attackbox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 175,
        height: 50
    }
 })


console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },

    ArrowRight: {
        pressed: false
    },

    ArrowLeft: {
        pressed: false
    },

    ArrowUp: {
        pressed: false
    }

}

function rectangularCollision({
    rectangle1,
    rectanlge2
}){
    return(
        player.attackbox.position.x + rectangle1.attackbox.width >= rectanlge2.position.x
            && rectangle1.attackbox.position.x <= rectanlge2.position.x + rectanlge2.width 
            && rectangle1.attackbox.position.y + rectangle1.attackbox.height >= rectanlge2.position.y
            && rectangle1.attackbox.position.y <= rectanlge2.position.y + rectanlge2.height
    )
}

function determineWinner({player, enemy, timerId}){
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if(player.health === enemy.health){
        document.querySelector('#displayText').innerHTML = 'Tie'
    } else if(player.health > enemy.health){
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
    }else if(enemy.health > player.health){
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
    }
}

let timer = 60
let timerId
function decreaseTimer(){
        if(timer > 0 ){
           timerId = setTimeout(decreaseTimer, 1000)
            timer--
            document.querySelector('#timer').innerHTML = timer
            }
        if(timer === 0 ){
            document.querySelector('#displayText').style.display = 'flex'
            determineWinner({player, enemy, timerId})
          
        }
   
}
  
decreaseTimer()

function animate(){
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle= 'rgba(255,255,255, 0.15)'
    c.fillRect(0,0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0 //stop player velocity when keyup
    enemy.velocity.x = 0 //stop player velocity when keyup


    //player movement
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5
        player.switchSprite('run')
        player.image = player.sprites.run.image
    } else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }
    //jumping
    if (player.velocity.y < 0){
        player.switchSprite('jump')
    } else if(player.velocity.y > 0 ){
        player.switchSprite('fall')
    }

        //enemy movement
        if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
            enemy.velocity.x = -5
        enemy.switchSprite('run')
        } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
            enemy.velocity.x = 5
        enemy.switchSprite('run')
        } else{ 
        enemy.switchSprite('idle')
        }

    //jumping
        if (enemy.velocity.y < 0){
            enemy.switchSprite('jump')
        } else if(enemy.velocity.y > 0 ){
            enemy.switchSprite('fall')
        }
  
        //detect collision & enemy gets hit
        if(rectangularCollision({
            rectangle1: player,
            rectanlge2: enemy
        }) && player.isAttacking && player.framesCurrent === 4) {
            enemy.takeHit()
            player.isAttacking = false
            // document.querySelector('#enemyHealth').style.width = enemy.health + '%'
            gsap.to('#enemyHealth', {
                width: enemy.health + '%'
            })
            

        }

        //if player missed
        if (player.isAttacking && player.framesCurrent === 4){
            player.isAttacking = false
        }

        if(rectangularCollision({
            rectangle1: enemy,
            rectanlge2: player
        }) && enemy.isAttacking && enemy.framesCurrent === 2){
            player.takeHit()
            enemy.isAttacking = false
            // player.health -= 20
            // document.querySelector('#playerHealth').style.width = player.health + '%'
            gsap.to('#playerHealth', {
                width: player.health + '%'
            })
        }

            //if player missed
            if (enemy.isAttacking && enemy.framesCurrent === 2){
                enemy.isAttacking = false
                }

        //end game based on health
        if(enemy.health <= 0 || player.health <= 0){
            determineWinner({player, enemy, timerId})
        }
}

animate()

addEventListener('keydown', (event) => {
    if(!player.dead){
        
    

    console.log(event.key)
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
        break

        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
        break

        case 'w':
            player.velocity.y = -20
            player.lastKey = 'w'
        break
        
        case ' ':
            player.attack()
            break


     }  
    }

    if(!enemy.dead){
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
        break

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
        break

        case 'ArrowUp':
            keys.ArrowUp.pressed = true
            enemy.velocity.y = -20
        break

        case 'ArrowDown':
            enemy.attack()
        break
    }
}
})

addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
        break

        case 'a':
            keys.a.pressed = false
        break

        case 'w':
            keys.w.pressed = false
            lastKey = 'w'
        break

        case 'ArrowRight':
            keys.ArrowRight.pressed = false
        break

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
        break

        case 'ArrowUp':
            keys.ArrowUp.pressed = false
        break
       
        
    }

 console.log(event)
})

