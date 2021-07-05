function gameTick(){
    for(let ent of ENTITIES){
        ent.updateBody()
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

let e = new Entity()
e.setPos(getCenter())
e.setScale(100)




















