function gameTick(){
    for(let ent of ENTITIES){
        ent.draw()
    }
}

function gameStart(){
    // console.clear()
    
    canvasInit()
    engineInit()
    
    gameLoop()
}

var ENTITIES = []
gameStart()


























