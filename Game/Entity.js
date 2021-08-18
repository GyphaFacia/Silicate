class Entity{
    constructor(){
        this.r = Math.random()
        this.team = 0
        this.color = '#111'
        this.width = 0.25
        this.ocolor = '#fff'
        this.setSides()
        
        this.layer = LAYERS.entities
        this.cnv = this.layer.cnv
        this.ctx = this.layer.ctx
        LAYERS.entities.ents.push(this)
        
        this.first(...arguments)
        this.addBody()
        this.second(...arguments)
    }
    
    beforeDraw(){}
    afterDraw(){}
    first(){}
    second(){}
    last(){}
    
    addBody(){
        this.body = Matter.Bodies.fromVertices(0, 0, this.verts)
        Matter.World.add(ENGINE.world, this.body)
        this.scale = vec(1)
        this.updateVerts()
    }
    
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
        
        this.ctx.moveTo(...this.verts[0].arr)
        for (let i = 1; i < this.verts.length; i++) {
            this.ctx.lineTo(...this.verts[i].arr)
        }
        
        this.drawEnd()
    }
    
    
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
   
   //body
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
       // if(this.getMass() != 0.123456789 && !engine.gravity.scale){
       //     this.applyForce(vec(0, 0.001).mul(this.getMass()))
       // }
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
   getVel(){return this.body.velocity}
   getMass(){return this.body.mass}
   
   // remove
   remove(wlast = false){
       if(wlast){
           this.last()
       }
       this.removeBody()
       
       for(let i = 0; i < this.layer.ents.length; i++){
           if(this.host[i].r == this.r){
               this.host.splice(i, 1)
               break
           }
       }
   }
}

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
}
























