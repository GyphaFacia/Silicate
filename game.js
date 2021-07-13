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

function loadOptions(){
    let obj = localStorage.getItem('player')
    obj = JSON.parse(obj)

    // obj.color = COLOR
    // obj.eyecolor = EYECLR
    // obj.perks = PERKS
    // obj.sides = SIDES
    // obj.playername = document.querySelector('input').value
    
    console.log(obj);
    return obj
}

let ply = new Ply(1)
ply.spawnSilicate(getRes().mul(0.15, 0.5))

// let bot = new Bot(2)
// bot.spawnSilicate(getRes().mul(0.85, 0.5))

// handlePause()

















