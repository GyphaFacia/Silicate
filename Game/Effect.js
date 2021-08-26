// 8888888888  .d888  .d888                  888    
// 888        d88P"  d88P"                   888    
// 888        888    888                     888    
// 8888888    888888 888888 .d88b.   .d8888b 888888 
// 888        888    888   d8P  Y8b d88P"    888    
// 888        888    888   88888888 888      888    
// 888        888    888   Y8b.     Y88b.    Y88b.  
// 8888888888 888    888    "Y8888   "Y8888P  "Y888 
class Effect{
    constructor(){
        this.r = Math.random()
        this.team = 0
        this.color = '#000'
        this.width = 2
        this.ocolor = '#222'
        this.setVertices()

        this.layer = this.getDefaultLayer()
        this.cnv = this.layer.cnv
        this.ctx = this.layer.ctx

        this.first(...arguments)
        this.addBody()
        this.second(...arguments)
    }

    get type(){return this.constructor.name}

    getDefaultLayer(){
        return GAME.layers.entities
    }

    beforeDraw(){}
    afterDraw(){}
    first(){}
    second(){}
    last(){}

    setVertices(sides = 5){
        this.verts = []
        for(let i = 0; i < sides; i++){
            this.verts.push(angvec(360/sides*i))
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
        
        this.drawStart()    
        this.ctx.drawImage(this.img, -x/2 + ox, -y/2 + oy, x, y)
        this.drawEnd()
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
        Matter.World.remove(ENGINE.world, this.body)
        Matter.Composite.remove(ENGINE.world, this.body)
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

        for(let i = 0; i < this.collection.length; i++){
            if(this.collection[i].r == this.r){
                this.collection.splice(i, 1)
                break
            }
        }
    }

    // // // // // // // // // // // // // // // // // // // // // // // // // 
    // eye
    // // // // // // // // // // // // // // // // // // // // // // // // // 
    drawEye(pos = vec(), aim = CURSOR, scaleMul = 0.66){
        let circle = (pos, rad, clr, oclr = '#000', width = 0)=>{
            this.ctx.beginPath()
            this.ctx.fillStyle = clr
            if(width){
                this.ctx.strokeStyle = oclr
                this.ctx.lineWidth = width
            }
            this.ctx.arc(...pos.arr, rad, 0, 2*pi())
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

        // whites
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