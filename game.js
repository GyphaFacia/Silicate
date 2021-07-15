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


function gameStart(){
    canvasInit()
    engineInit()
    collisionsInit()
    
    gameLoop()
    setBounds()
    hills()
}

const __MINSCALE = 10
const __MAXSCALE = 175
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

let bot = new Bot(2)
bot.spawnSilicate(getRes().mul(0.85, 0.5))

// handlePause()

setInterval(()=>{
    let score = document.querySelector('.score')
    for(let i = 0; i < score.children.length; i++){
        let ply = PLAYERS[i]
        if(ply){
            let name = ply.name ? ply.name : ply.constructor.name
            let cnt = ENTITIES.filter(ent=> ent.team == ply.team).length
            score.children[i].children[0].innerText = name
            score.children[i].children[1].innerText = cnt
        }
        else{
            score.children[i].style.display = 'none'
        }
    }
}, 255)














