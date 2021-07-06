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
    collisionsInit()
    
    gameLoop()
    setBounds()
    hills()
}

const __MINSCALE = 10
const __MAXSCALE = 255

var ENTITIES = []
var MAP = []
var PERKS = []

gameStart()

let ply = new Ply(1)

let bot = new Ply(2)





















