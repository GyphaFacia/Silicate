function gameTick(){
    for(let host of [MAP, ENTITIES]){
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
    
    gameLoop()
    setBounds()
    hills()
}

var ENTITIES = []
var MAP = []
var PERKS = []
gameStart()

let ply = new Ply()
ply.spawnSilicate(getRes().mul(0.15, 0.5))
ENTITIES[0].setScale(200)

let bot = new Bot()
bot.spawnSilicate(getRes().mul(0.85, 0.5))





















