function gameTick(){
    for(let host of [MAP, ENTITIES]){
        for(let ent of host){
            ent.updateBody()
            ent.beforeDraw()
            ent.draw()
            ent.afterDraw()
        }
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
gameStart()

let ply = new Player()
ply.spawnSilicate(getRes().mul(0.15, 0.5))

let bot = new Player()
ply.spawnSilicate(getRes().mul(0.85, 0.5)).color = Clr(255, 200, 0)





















