// 8888888888          888    
// 888                 888    
// 888                 888    
// 8888888    88888b.  888888 
// 888        888 "88b 888    
// 888        888  888 888    
// 888        888  888 Y88b.  
// 8888888888 888  888  "Y888 
class Entity{
    constructor(){
        this.r = Math.random()
        this.team = 0
        this.color = '#000'
        this.width = 2
        this.ocolor = '#222'
        this.setSides()

        this.layer = this.getDefaultLayer()
        this.cnv = this.layer.cnv
        this.ctx = this.layer.ctx
        this.getDefaultLayer().ents.push(this)

        this.first(...arguments)
        this.addBody()
        this.second(...arguments)
    }

    getDefaultLayer(){
        return LAYERS.entities
    }

    beforeDraw(){}
    afterDraw(){}
    first(){}
    second(){}
    last(){}

    setSides(sides = 5){
        this.verts = []
        for(let i = 0; i < sides; i++){
            let t = 2*Math.PI/sides*i
            this.verts.push(vec(Math.sin(t), Math.cos(t)))
        }
    }

    update(){
        this.updateBody()
    }

    // // // // // // // // // // // // // // // // // // // // // // // // // 
    // draw
    // // // // // // // // // // // // // // // // // // // // // // // // // 
    drawStart(){
        this.ctx.save()
        this.ctx.beginPath()
        this.ctx.translate(...this.getPos().arr)
        this.ctx.rotate((this.getAng())/180*Math.PI)
        this.ctx.filter = this.filter ? this.filter : 'none'
    }

    drawEnd(){
        this.ctx.closePath()
        this.fill()
        this.ctx.restore()
    }

    fill(){
        this.ctx.fillStyle = this.color ? this.color : 'transparent'
        this.ctx.lineWidth = this.width ? this.width : 0
        this.ctx.strokeStyle = this.ocolor ? this.ocolor : 'transparent'
        this.ctx.stroke()
        this.ctx.fill()
    }

    draw(){
        this.drawStart()
        this.drawByVertices()
        this.drawEnd()
    }
    
    drawByVertices(){
        this.ctx.moveTo(...this.verts[0].arr)
        for (let i = 1; i < this.verts.length; i++) {
            this.ctx.lineTo(...this.verts[i].arr)
        }
    }
    
    drawImg(offset, sclmul, src){
        if(!this.img || this.img.src != src){
            this.img = new Image(100, 100)
            this.img.src = src
        }
        let {x, y} = this.getScale().mul(sclmul)
        let [ox, oy] = offset.arr
        this.ctx.drawImage(this.img, -x/2 + ox, -y/2 + oy, x, y)
    }

    // // // // // // // // // // // // // // // // // // // // // // // // // 
    // transform
    // // // // // // // // // // // // // // // // // // // // // // // // // 
    setPos(){
        this.pos = vec(...arguments)
        if(this.body){
            Matter.Body.setPosition(this.body, this.getPos())
        }
    }
    
    setAng(){
        this.ang = arguments[0]
        if(this.body){
            Matter.Body.setAngle(this.body, this.getAng())
        }
    }
    setScale(){
        // let scale = vec(...arguments).div(this.getScale())
        let scl = vec(...arguments)
        // scl = scl.x > __MAXSCALE ? vec(__MAXSCALE) : scl
        let scale = scl.div(this.getScale())
        this.scale = scl
        if(this.body){
            Matter.Body.scale(this.body, scale.x, scale.y)
            this.updateVerts()
            this.setMass(1)
        }
    }

    getPos(){return this.pos}
    getScale(){return this.scale}
    getAng(){return this.ang}

    // // // // // // // // // // // // // // // // // // // // // // // // // 
    // phys body
    // // // // // // // // // // // // // // // // // // // // // // // // // 
    addBody(){
        this.body = Matter.Bodies.fromVertices(0, 0, this.verts)
        Matter.World.add(ENGINE.world, this.body)
        this.scale = vec(1)
        this.updateVerts()
    }

    removeBody(){
        if(!this.body){
            return null
        }
        Matter.World.remove(engine.world, this.body)
        Composite.remove(engine.world, this.body)
    }

    updateVerts(){
        this.verts = []
        let cx = this.body.position.x
        let cy = this.body.position.y
        for(let vert of this.body.vertices){
            let {x, y} = vert
            this.verts.push(vec(x, y).sub(cx, cy))
        }
    }

    updateBody(){
        if(!this.body){
            return null
        }
        let {x, y} = this.body.position
        this.pos = vec(x, y)
        this.ang = this.body.angle / Math.PI * 180
        if(this.getMass() != 0.123456789 && !ENGINE.gravity.scale){
            this.applyForce(vec(0, 0.001).mul(this.getMass()))
        }
    }

    setStatic(isStatic = true){
        Matter.Body.setStatic(this.body, isStatic)
    }
    setAngVel(angvel = 0){
        Matter.Body.setAngularVelocity(this.body, angvel)
    }
    setVel(){
        let vel = vec(...arguments)
        Matter.Body.setVelocity(this.body, vel)
    }
    setMass(mass = 0.5){
        Matter.Body.setMass(this.body, mass)
    }
    applyForce(){
        Matter.Body.applyForce(this.body, this.pos, vec(...arguments))
    }

    isStatic(){return this.body.isStatic}
    getAngVel(){return this.body.angularVelocity}
    getVel(){
        let {x, y} = this.body.velocity
        return vec(x, y)
    }
    getMass(){return this.body.mass}

    // // // // // // // // // // // // // // // // // // // // // // // // // 
    // remove
    // // // // // // // // // // // // // // // // // // // // // // // // // 
    remove(wlast = false){
        if(wlast){
            this.last()
        }
        this.removeBody()

        for(let i = 0; i < this.layer.ents.length; i++){
            if(this.layer.ents[i].r == this.r){
                this.layer.ents.splice(i, 1)
                break
            }
        }
    }

    // // // // // // // // // // // // // // // // // // // // // // // // // 
    // eye
    // // // // // // // // // // // // // // // // // // // // // // // // // 
    drawEye(pos = vec(), aim = vec(), scaleMul = 0.66){
        let circle = (pos, rad, clr, oclr = '#000', width = 0)=>{
            this.ctx.beginPath()
            this.ctx.fillStyle = clr
            if(width){
                this.ctx.strokeStyle = oclr
                this.ctx.lineWidth = width
            }
            this.ctx.arc(...pos.arr, rad, 0, 2*pi)
            this.ctx.fill()
            if(width){
                this.ctx.stroke()
            }
        }

        pos = this.getPos().add(pos)
        let scl = this.getScale().mul(scaleMul)
        let rad = Math.min(...scl.arr)
        let irisClr = '#af5'
        aim = aim.sub(pos).ort

        // white
        circle(pos, rad, '#fff')

        // iris
        pos = pos.add(aim.mul(rad/7))
        circle(pos, rad * 0.75, '#af5', '#582', 1)

        // pupil
        pos = pos.add(aim.mul(rad/9))
        circle(pos, rad * 0.5, '#000')
        // flare
        pos = pos.add(vec(0, -rad/10))
        circle(pos, rad * 0.15, '#fff')
    }
}





// 8888888b.                   888    
// 888   Y88b                  888    
// 888    888                  888    
// 888   d88P .d88b.   .d8888b 888888 
// 8888888P" d8P  Y8b d88P"    888    
// 888 T88b  88888888 888      888    
// 888  T88b Y8b.     Y88b.    Y88b.  
// 888   T88b "Y8888   "Y8888P  "Y888 
class Rect extends Entity{
    setRect(){
        let scale = vec(...arguments)
        let lt = scale.mul(-1, -1).div(2)
        let rt = scale.mul(1, -1).div(2)
        let rb = scale.mul(1, 1).div(2)
        let lb = scale.mul(-1, 1).div(2)
        this.verts = [lt, rt, rb, lb]
    }

    first(){
        this.setRect(...arguments)
    }

    getDefaultLayer(){
        return LAYERS.map
    }
}





// 888                             888 
// 888                             888 
// 888                             888 
// 888       8888b.  88888b.   .d88888 
// 888          "88b 888 "88b d88" 888 
// 888      .d888888 888  888 888  888 
// 888      888  888 888  888 Y88b 888 
// 88888888 "Y888888 888  888  "Y88888 
class Land extends Entity{
    setSides(){
        let res = getRes().mul(1.15)

        let bl = res.mul(0, 1)
        let br = res.mul(1, 1)

        let n = 100
        let wave = []
        for(let i = 1; i < n; i++){
            let t = 0*i/n + 0
            let h = (sin(t) + 1)/2
            h = 0.5 + h * 0.25
            let v = res.mul(i/n, h)
            wave.push(v)
        }

        this.verts = [bl, ...wave, br]
    }

    getDefaultLayer(){
        return LAYERS.map
    }

    second(){
        this.setStatic()
        this.color = '#000'
        this.ocolor = 'transparent'
        this.width = 0
        this.setPos(getRes().mul(0.55, 1))
    }

    updateVerts(){
        this.verts = []
        let cx = this.body.position.x
        let cy = this.body.position.y
        for(let body of this.body.parts){
            for(let vert of body.vertices){
                let {x, y} = vert
                this.verts.push(vec(x, y).sub(cx, cy))
            }
        }

        this.verts.sort((v1, v2)=>{
            return v1.x > v2.x ? 1 : -1
        })
    }
    
    pushOut(){
        this.inc = this.inc == undefined ? 0 : this.inc
        this.inc += 1
        this.inc = this.inc % LAYERS.entities.ents.length
        let ent = LAYERS.entities.ents[this.inc]

        let verts = this.verts.slice()
        let {x, y} = this.body.position
        verts = verts.map((v)=>v.add(x, y))

        let v = verts[0]
        x = ent.getPos().x
        for (let i = 1; i < verts.length; i++) {
            if(Math.abs(x - verts[i].x) < Math.abs(x - v.x)){
                v = verts[i]
            }
        }

        if(v.y < ent.getPos().y){
            ent.setPos(ent.getPos().x, v.y - ent.getScale().y*2)
            ent.setVel(0, -5)
            console.log('pop');
        }
    }

    update(){
        this.pushOut()
    }
}





//  .d8888b.           888                               
// d88P  Y88b          888                               
// Y88b.               888                               
//  "Y888b.   88888b.  88888b.   .d88b.  888d888 .d88b.  
//     "Y88b. 888 "88b 888 "88b d8P  Y8b 888P"  d8P  Y8b 
//       "888 888  888 888  888 88888888 888    88888888 
// Y88b  d88P 888 d88P 888  888 Y8b.     888    Y8b.     
//  "Y8888P"  88888P"  888  888  "Y8888  888     "Y8888  
//            888                                        
//            888                                        
//            888                                        
class Sphere extends Entity{
    setSides(){}
    
    getDefaultLayer(){
        return LAYERS.map
    }
    
    first(){
        this.width = 0
        this.ocolor = 'transparent'
    }
    
    addBody(){
        this.body = Matter.Bodies.circle(0, 0, 1)
        Matter.World.add(ENGINE.world, this.body)
        this.scale = vec(1)
        this.updateVerts()
    }
}





// 888b     d888                   888      d8b         
// 8888b   d8888                   888      Y8P         
// 88888b.d88888                   888                  
// 888Y88888P888  .d88b.  88888b.  88888b.  888 888d888 
// 888 Y888P 888 d8P  Y8b 888 "88b 888 "88b 888 888P"   
// 888  Y8P  888 88888888 888  888 888  888 888 888     
// 888   "   888 Y8b.     888  888 888  888 888 888     
// 888       888  "Y8888  888  888 888  888 888 888     
class Menhir extends Entity{    
    setSides(){
        this.verts = []
        let w = 1
        let h = 2.1
        this.verts.push(vec(-w*0.4, -h*0.66))
        this.verts.push(vec(w*0.4, -h*1))
        this.verts.push(vec(w, h))
        this.verts.push(vec(-w, h))
    }
    
    draw(){
        // this.drawStart()
        // this.color = '#fff1'
        // this.drawByVertices()
        // this.drawEnd()
        
        this.drawStart()
        this.drawImg(vec(0, -1), vec(6.5), '../src/Menhir/Buff.svg')
        this.drawEnd()
        
        this.drawStart()
        let b = (sin(time()/10) + 1)/2
        b = b*0.5 + 0.5
        this.ctx.filter = `drop-shadow(0 0 5px #f05) drop-shadow(0 0 5px #f05) brightness(${b})`
        this.drawImg(vec(0, -1), vec(6.5), '../src/Menhir/BuffRunes.svg')
        this.drawEnd()
    }
}





//  .d8888b.  888                        888    
// d88P  Y88b 888                        888    
// 888    888 888                        888    
// 888        88888b.   .d88b.  .d8888b  888888 
// 888  88888 888 "88b d88""88b 88K      888    
// 888    888 888  888 888  888 "Y8888b. 888    
// Y88b  d88P 888  888 Y88..88P      X88 Y88b.  
//  "Y8888P88 888  888  "Y88P"   88888P'  "Y888 
class GhostEntity extends Entity{
    addBody(){this.scale = vec(1)}
    setScale(){
        let oldscale = this.getScale()
        let newscale = vec(...arguments)
        let scalePower = newscale.div(oldscale)
        
        let center = vec()
        for(let v of this.verts){
            center = center.add(v)
        }
        center = center.div(this.verts.length)
        
        for (let i = 0; i < this.verts.length; i++) {
            let oldvert = this.verts[i].sub(center)
            this.verts[i] = center.add(oldvert.mul(scalePower))
        }
    }
}


// 888b     d888 d8b                   
// 8888b   d8888 Y8P                   
// 88888b.d88888                       
// 888Y88888P888 888 .d8888b   .d8888b 
// 888 Y888P 888 888 88K      d88P"    
// 888  Y8P  888 888 "Y8888b. 888      
// 888   "   888 888      X88 Y88b.    
// 888       888 888  88888P'  "Y8888P 
function getEntities(layername){
    return LAYERS[layername].ents
}




















