function setBounds(width = 500){
    class Bounds extends Entity{
        assignHost(){this.host = MAP}
        
        second(){
            this.color = Clr(255)
            this.width = 10
            this.ocolor = Clr(0)
        }
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
    points.push(getRes().mul(0, 1).sub(5))
    
    let n = 255
    
    for(let i = 0; i < n; i++){
        let v = vec(i/n * getRes().x, getRes().y*0.5 + sin(-90*6/n*i)*100)
        v = v.add(0, sin(90*15/n*i)*75)
        points.push(v)
    }
    
    points.push(getRes().mul(1, 1).add(5))
    
    let e = new Poly(points)
    e.color = Hsl(45, 15, 25)
    e.ocolor = Hsl(69, 35, 33)
    e.width = 15
    e.setPos(getRes().mul(0.5, 1))
    e.setScale(1.1)
    e.setStatic()
    
    document.body.applyCss(`
        // background: radial-gradient(circle at 50% 200%, hsl(15, 100%, 75%), hsl(280, 50%, 20%))
        background: linear-gradient(to top, hsl(334, 65%, 80%) 25%, hsl(212, 66%, 90%));
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
            if(v.y + ent.getScale().y*2 < ent.getPos().y){
                ent.setPos(ent.getPos().x, v.y - ent.getScale().y*2)
            }
        }
    }, 255)
    
    return e
}