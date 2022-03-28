// 888888b.                                   888 
// 888  "88b                                  888 
// 888  .88P                                  888 
// 8888888K.   .d88b.  888  888 88888b.   .d88888 
// 888  "Y88b d88""88b 888  888 888 "88b d88" 888 
// 888    888 888  888 888  888 888  888 888  888 
// 888   d88P Y88..88P Y88b 888 888  888 Y88b 888 
// 8888888P"   "Y88P"   "Y88888 888  888  "Y88888 
function setBounds(width = 500){
    class Bounds extends Entity{
        assignHost(){this.host = MAP}
        
        second(){
            this.color = Clr(255)
            this.width = 3
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
    r.setScale(getRes().mul(0, 1).sub(width, 0))
    r.setStatic()
    
    
    let l = new Bounds()
    l.setPos(getRes().mul(0, 0.5).sub(width/2, 0))
    l.setScale(getRes().mul(0, 1).sub(width, 0))
    l.setStatic()
}





// 888                             888 
// 888                             888 
// 888                             888 
// 888       8888b.  88888b.   .d88888 
// 888          "88b 888 "88b d88" 888 
// 888      .d888888 888  888 888  888 
// 888      888  888 888  888 Y88b 888 
// 88888888 "Y888888 888  888  "Y88888 
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
    
    e.color = Clr(0)
    e.ocolor = Clr(0)
    
    e.width = 10
    e.setPos(getRes().mul(0.5, 1))
    e.setScale(1.1)
    e.setStatic()
    
    // document.body.applyCss(`
    //     // background: radial-gradient(circle at 50% 200%, hsl(15, 100%, 75%), hsl(280, 50%, 20%))
    //     // background: linear-gradient(to top, hsl(334, 65%, 80%) 25%, hsl(212, 66%, 90%));
    // `)
    
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
            if(v.y + 10 < ent.getPos().y){
                ent.setPos(ent.getPos().x, v.y - ent.getScale().y*2)
            }
        }
    }, 255)
    
    let smallmushes = [
        './src/Foliage/FourMushes.svg',
        './src/Foliage/FourMushesM.svg',
    ]
    
    let midmushes = [
        './src/Foliage/ThreeMushes.svg',
        './src/Foliage/ThreeMushesM.svg',
    ]
    
    let bigmushes = [
        './src/Foliage/BigMush.svg',
        './src/Foliage/BigMushM.svg',
        
    ]
    
    for(let i = 0; i < 33; i++){
        e.addImage(randelt(smallmushes), randelt(e.verts), vec(random(25, 33)))
    }
    for(let i = 0; i < 15; i++){
        e.addImage(randelt(midmushes), randelt(e.verts).add(0, 5), vec(random(50, 66)))
    }
    for(let i = 0; i < 3; i++){
        e.addImage(randelt(bigmushes), randelt(e.verts).add(0, 25), vec(random(150, 200)))
    }
    
    for(let i = 0; i < 5; i++){
        // e.addImage('./src/Foliage/ThreeMushes.svg', vec(0, -500), vec(100))
    }
    
    e.afterDraw = e.drawImages
    
    return e
}


























