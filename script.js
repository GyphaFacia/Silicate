function gameTick(){
    for(let host of [MAP, ENTITIES, CRISPS]){
        for(let ent of host){
            ent.updateBody()
            ent.beforeDraw()
            ent.draw()
            ent.afterDraw()
        }
    }
    
    for(let perk of PERKS){
        perk.draw()
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

var ENTITIES = []
var MAP = []
var PERKS = []
var CRISPS = []

gameStart()

let ply = new Ply(1)
ply.spawnSilicate(getRes().mul(0.15, 0.5))

let bot = new Bot(2)
bot.spawnSilicate(getRes().mul(0.85, 0.5))



















