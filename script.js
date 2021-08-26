GAME.start()

let root = GAME.addEntity()
root.afterDraw = function(){
    // GAME.addEffect('Fire', getRes().div(2))
    GAME.addEffect('Fire', CURSOR)
}

