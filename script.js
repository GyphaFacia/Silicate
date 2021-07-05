function setBounds(width = 500){
    class Bounds extends Entity{
        assignHost(){this.host = MAP}
    }
    
    let t = new Bounds()
    t.setPos(getRes().mul(0.5, 0).sub(0, width/2))
    t.setScale(getRes().mul(1, 0).add(0, width))
    t.setStatic()
    
    let b = new Bounds()
    b.setPos(getRes().mul(0.5, 1).add(0, width/2))
    b.setScale(getRes().mul(1, 0).add(0, width))
    b.setStatic()
    
    let r = new Bounds()
    r.setPos(getRes().mul(1, 0.5).add(width/2, 0))
    r.setScale(getRes().mul(0, 1).add(width, 0))
    r.setStatic()
    
    let l = new Bounds()
    l.setPos(getRes().mul(0, 0.5).sub(width/2, 0))
    l.setScale(getRes().mul(0, 1).sub(width, 0))
    l.setStatic()
}

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
    e.color = Hsl(69, 35, 66)
    e.ocolor = Hsl(69, 35, 25)
    e.width = 10
    e.setPos(getRes().mul(0.5, 1))
    e.setScale(1.1)
    e.setStatic()
    
    document.body.applyCss(`
        background: linear-gradient(to top, #350 25%, hsl(45, 100%, 90%))
    `)
    
    e.pushUp = setInterval(()=>{
        let verts = e.verts.slice()
        verts = verts.map((v)=>v.add(e.body.position))
        for(let ent of ENTITIES){
            let v = verts[0]
            let x = ent.getPos().x
            for (let i = 1; i < verts.length; i++) {
                if(Math.abs(x - verts[i].x) < Math.abs(x - v.x)){
                    v = verts[i]
                }
            }
            if(v.y < ent.getPos().y){
                ent.setPos(v.sub(0, 5))
            }
        }
    }, 255)
    
    return e
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
    
    if(window.mouseClick){
        for(let i = 0; i < 1; i++){
            let e = new Rect()
            e.setPos(cursor())
            e.setScale(random(15, 25))
            e.color = Hsl(random(360), 100, 50)
        }
        console.log(ENTITIES.length);
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














