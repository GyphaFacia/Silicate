class Entity {
    constructor() {
        ENTITIES.push(this)
        this.r = Math.random()
        
        this.addBody()
    }
    
    get name(){return this.constructor.name}
    
    addBody(){
        this.body = Matter.Bodies.rectangle(0, 0, 1, 1)
        this.scale = 1
		Composite.add(engine.world, this.body)
        this.updateVerts()
		return this
    }
    
    updateVerts(){
        this.verts = []
        for(let vert of this.body.vertices){
            this.verts.push(vec(vert).sub(this.body.position))
        }
        
        console.log(this.verts);
    }
    
    updateBody(){
		if(!this.body){
			return null
		}
		this.pos = vec(this.body.position)
		this.ang = this.body.angle / Math.PI * 180
		// if(this.getMass() != 0.123456789 && !this.parent.engine.gravity.scale){
		// 	this.applyForce(__GRAVITY.mul(this.getMass()))
		// }
	}
    
    drawStart(){
		ctx.save()
		ctx.beginPath()
		ctx.translate(...this.getPos().$)
		ctx.rotate((this.getAng())/180*Math.PI)
		ctx.filter = this.filter ? this.filter : 'none'
	}
	
	drawEnd(){
        ctx.closePath()
        this.fill()
		ctx.restore()
	}
    
    draw(){
        this.drawStart()
        
        ctx.moveTo(...this.verts[0].$)
        for (var i = 1; i < this.verts.length; i++) {
            ctx.lineTo(...this.verts[i].$)
        }
        
        this.drawEnd()
    }
    
    fill(){
        ctx.fillStyle = this.color ? this.color.hex : 'transparent'
        ctx.lineWidth = this.lwidth ? this.lwidth : 0
        ctx.strokeStyle = this.ocolor ? this.ocolor.hex : 'transparent'
        ctx.stroke()
        ctx.fill()
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
		let scale = vec(...arguments).div(this.getScale())
		this.scale = vec(...arguments)
		if(this.body){
			Matter.Body.scale(this.body, scale.x, scale.y)
            this.updateVerts()
		}
	}
    
    getPos(){return this.pos}
	getScale(){return this.scale}
    getAng(){return this.ang}
}




















