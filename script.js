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

let n = 125
for(let i = 0; i < n; i++){
    let e = new Ngon(6)
    e.setScale(random(25, 50))
    e.setPos(getRes().mul(i/n, 0))
    e.color = Hsl(-45, 50, 15)
    e.ocolor = Clr(0)
    e.width = 1
    if(random()>0.8){
        e.afterDraw = e.drawEye
    }
    // if(random()>0.8){
    //     e.afterDraw = e.drawImage
    // }
}























