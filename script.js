function gameTick(){
    for(let host of [MAP, ENTITIES]){
        for(let ent of host){
            ent.updateBody()
            ent.beforeDraw()
            ent.draw()
            ent.afterDraw()
        }
    }
    
    let zoom = 2
    let canv = getRes()
    let cur = cursor()
    let frame = getRes().div(zoom)
    let perc = canv.div(cur)
    perc = vec(0.15, 0.5) 
    
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    
    let fin = vec()
    fin = fin.sub(canv.mul(perc))
    // fin = fin.add(frame.mul(vec(1).sub(perc)).div(2))

    ctx.translate(...fin.$)
    ctx.scale(zoom, zoom)
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

let red = new Circle()
red.setStatic()
red.setPos(getRes().mul(0.15, 0.5))
red.color = Clr(255,0,0)
red.setScale(25)

let blu = new Circle()
blu.setStatic()
blu.setPos(getRes().mul(0.85, 0.5))
blu.color = Clr(0,0,255)
blu.setScale(25)

let whi = new Circle()
whi.setStatic()
whi.setPos(getRes().mul(0.5, 0.5))
whi.color = Clr(255)
whi.setScale(25)














