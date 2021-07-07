function gameTick(){
    for(let host of [MAP, ENTITIES, CRISPS]){
        for(let ent of host){
            ent.updateBody()
            if(!PAUSED){ent.beforeDraw()}
            ent.draw()
            if(!PAUSED){ent.afterDraw()}
        }
    }
    
    for(let perk of PERKS){
        if(!PAUSED){perk.draw()}
    }
}

function handlePause(){
    PAUSED = !PAUSED
    if(PAUSED){
        pausebutton.classList.add('pause-button--paused')
    }
    else{
        pausebutton.classList.remove('pause-button--paused')
    }
    for(let perk of PERKS){
        perk.cancel()
    }
    for(let host of [MAP, ENTITIES, CRISPS]){
        for(let ent of host){
            let static = PAUSED ? true : ent.stat
            ent.stat = ent.isStatic()
            Matter.Body.setStatic(ent.body, static)
        }
    }
}

let pausebutton = document.querySelector('.pause-button')
pausebutton.onclick = ()=>{
    handlePause()
}

function gameStart(){
    canvasInit()
    engineInit()
    collisionsInit()
    
    gameLoop()
    setBounds()
    hills()
}

const __MINSCALE = 10
const __MAXSCALE = 255
const __MAXCRISPS = 300

let PAUSED = false

var ENTITIES = []
var MAP = []
var PERKS = []
var CRISPS = []

gameStart()

let ply = new Ply(1)
ply.spawnSilicate(getRes().mul(0.15, 0.5))

let bot = new Bot(2)
bot.spawnSilicate(getRes().mul(0.85, 0.5))



















