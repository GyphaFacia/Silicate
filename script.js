function gameTick(){
    for(let host of [MAP, ENTITIES, CRISPS]){
        for(let ent of host){
            ent.updateBody()
            if(!PAUSED){ent.beforeDraw()}
            ent.draw()
            ent.afterDraw()
        }
    }
    
    for(let perk of PERKS){
        if(!PAUSED){perk.draw()}
    }
}

function handlePause(){
    PAUSED = !PAUSED
    
    if(PAUSED){
        document.querySelector('.pause-menu').classList.remove('hide')
        document.querySelector('.pause-button').classList.add('pause-button--paused')
    }
    else{
        document.querySelector('.pause-menu').classList.add('hide')
        document.querySelector('.pause-button').classList.remove('pause-button--paused')
    }
    
    for(let perk of PERKS){
        perk.cancel()
    }
    
    // for(let host of [ENTITIES, CRISPS]){
    //     for(let ent of host){
    //         let static = PAUSED ? true : ent.stat
    //         ent.stat = ent.isStatic()
    //         Matter.Body.setStatic(ent.body, static)
    //     }
    // }
    
    for(let perk of document.querySelectorAll('.perk')){
        if(PAUSED){
            perk.classList.add('hide')
        }
        else{
            perk.classList.remove('hide')
        }
    }
}

function initPause(){
    document.querySelector('.pause-button').onclick = ()=>{
        handlePause()
    }
    
    document.onkeyup = (e)=>{
        if(e.key === "Escape") {
            handlePause()
        }
    }
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
var PLAYERS = []

initPause()
gameStart()

let ply = new Ply(1)
ply.spawnSilicate(getRes().mul(0.15, 0.5))

// let bot = new Bot(2)
// bot.spawnSilicate(getRes().mul(0.85, 0.5))

let m = new Mush()

// handlePause()

















