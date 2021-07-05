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
}

var ENTITIES = []
var MAP = []
gameStart()

function hills(){
    let points = []
    points.push(getRes().mul(0, 1))
    
    let n = 255
    
    for(let i = 0; i < n; i++){
        let v = vec(i/n * getRes().x, getRes().y*0.5 + sin(-90*6/n*i)*100)
        v = v.add(random(3), sin(90*15/n*i)*75)
        points.push(v)
    }
    
    points.push(getRes().mul(1, 1))
    
    let e = new Poly(points)
    e.color = Hsl(35, 35, 66)
    e.ocolor = Hsl(35, 35, 25)
    e.width = 15
    e.setPos(getRes().mul(0.5, 1))
    e.setScale(1.1)
    e.setStatic()
    
    document.body.applyCss(`
        background: linear-gradient(to top, #503 25%, hsl(45, 100%, 90%))
    `)
    
    e.afterDraw = function(){
        for(let ent of ENTITIES){
            
        }
    }
    
    return e
}

hills()

for(let i = 0; i < 125; i++){
    let e = new Circle()
    e.setScale(10)
    e.setPos(getRes().mul(i/125, 0.1))
    e.color = Clr(255)
}













