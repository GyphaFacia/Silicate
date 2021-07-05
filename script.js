function setBounds(width = 500){
    let t = new Entity()
    t.setPos(getRes().mul(0.5, 0).sub(0, width/2))
    t.setScale(getRes().mul(1, 0).add(0, width))
    t.setStatic()
    
    let b = new Entity()
    b.setPos(getRes().mul(0.5, 1).add(0, width/2))
    b.setScale(getRes().mul(1, 0).add(0, width))
    b.setStatic()
    
    let r = new Entity()
    r.setPos(getRes().mul(1, 0.5).add(width/2, 0))
    r.setScale(getRes().mul(0, 1).add(width, 0))
    r.setStatic()
    
    let l = new Entity()
    l.setPos(getRes().mul(0, 0.5).sub(width/2, 0))
    l.setScale(getRes().mul(0, 1).sub(width, 0))
    l.setStatic()
}

function gameTick(){
    for(let ent of ENTITIES){
        ent.updateBody()
        ent.beforeDraw()
        ent.draw()
        ent.afterDraw()
    }
}

function gameStart(){
    canvasInit()
    engineInit()
    
    gameLoop()
    setBounds()
}

var ENTITIES = []
gameStart()

let e
for(let i = 0; i < 25; i++) {
    e = new Ngon()
}

















