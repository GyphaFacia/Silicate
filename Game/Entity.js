class Entity{
     constructor(){
          this.r = Math.random()
          this.team = 0
          this.color = '#111'
          this.width = 0.1
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
     
     setSides(sides = 5){
          this.verts = []
          for(let i = 0; i < sides; i++){
                let t = 2*Math.PI/sides*i
                this.verts.push(vec(Math.sin(t), Math.cos(t)))
          }
     }
     
     update(){
          this.updateBody()
          if(this.r > 0.85){
                this.drawEye()
          }
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

        this.ctx.moveTo(...this.verts[0].arr)
        for (let i = 1; i < this.verts.length; i++) {
            this.ctx.lineTo(...this.verts[i].arr)
        }

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
     getVel(){return this.body.velocity}
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
                    this.host.splice(i, 1)
                    break
              }
         }
     }

     // // // // // // // // // // // // // // // // // // // // // // // // // 
     // eye
     // // // // // // // // // // // // // // // // // // // // // // // // // 
     drawEye(sclMul = null, posOffset = null){
         let pos = this.getPos()
         let scl = this.getScale()
         
         if(this.sides < 4){
              scl = scl.mul(0.66)
         }
         if(this.sides > 7){
              scl = scl.mul(1.25)
         }
         
         if(sclMul){
              scl = scl.mul(sclMul)
         }
         if(posOffset){
              pos = pos.add(posOffset)
         }
         
         this.ctx.beginPath()
         this.ctx.fillStyle = `Hsl(15, 100%, 95%)`
         this.ctx.arc(...pos.arr, scl.x/1.75, 0, 2*pi)
         this.ctx.fill()
         
         function cursor() {
              return getRes().div(2)
         }
         
         pos = pos.add(cursor().sub(pos).ort.mul(scl.x/15))
         
         this.ctx.beginPath()
         this.ctx.fillStyle = '#333'
         this.ctx.arc(...pos.arr, scl.x/2.25, 0, 2*pi)
         this.ctx.fill()
         
         this.ctx.beginPath()
         this.ctx.fillStyle = '#af0'
         this.ctx.arc(...pos.arr, scl.x/2.5, 0, 2*pi)
         this.ctx.fill()
         
         pos = pos.add(cursor().sub(pos).ort.mul(scl.x/20))
         
         this.ctx.beginPath()
         this.ctx.fillStyle = '#000'
         this.ctx.arc(...pos.arr, scl.x/3, 0, 2*pi)
         this.ctx.fill()
         
         this.ctx.beginPath()
         this.ctx.fillStyle = '#fffe'
         this.ctx.arc(...pos.sub(scl.x*0.1).arr, scl.x/7, 0, 2*pi)
         this.ctx.fill()
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
























