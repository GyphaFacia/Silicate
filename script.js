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








