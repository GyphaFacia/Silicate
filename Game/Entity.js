// 8888888888          888    d8b 888             
// 888                 888    Y8P 888             
// 888                 888        888             
// 8888888    88888b.  888888 888 888888 888  888 
// 888        888 "88b 888    888 888    888  888 
// 888        888  888 888    888 888    888  888 
// 888        888  888 Y88b.  888 Y88b.  Y88b 888 
// 8888888888 888  888  "Y888 888  "Y888  "Y88888 
//                                            888 
//                                       Y8b d88P 
//                                        "Y88P"  
class Entity {
    constructor(){
        this.host = ENTITIES
        this.host.push(this)
        this.r = Math.random()
        
        this.first()
        this.addBody()
        this.second()
    }
    
    get name(){return this.constructor.name}
    
    beforeDraw(){}
    afterDraw(){}
    first(){}
    second(){}
    last(){}
    
    // Draw
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
        for (let i = 1; i < this.verts.length; i++) {
            ctx.lineTo(...this.verts[i].$)
        }
        
        this.drawEnd()
    }
    
    fill(){
        ctx.fillStyle = this.color ? this.color.hex : 'transparent'
        ctx.lineWidth = this.width ? this.width : 0
        ctx.strokeStyle = this.ocolor ? this.ocolor.hex : 'transparent'
        ctx.stroke()
        ctx.fill()
    }
    
    // Pos Ang Scale
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
    
    // Body
    addBody(){
        this.body = Matter.Bodies.rectangle(0, 0, 1, 1)
        this.scale = 1
		Composite.add(engine.world, this.body)
        this.updateVerts()
		return this
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
        for(let vert of this.body.vertices){
            this.verts.push(vec(vert).sub(this.body.position))
        }
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
        
        for(let i = 0; i < this.host.length; i++){
            if(this.host[i].r == this.r){
                this.host.splice(i, 1)
                break
            }
        }
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
class Rect extends Entity {
    second(){
        this.setPos(getCenter())
        this.setScale(random(75, 125))
        this.setAng(random(360))
        this.color = Hsl(random(360), 100, 95)
        this.width = 0
    }
}





//  .d8888b.  d8b                 888          
// d88P  Y88b Y8P                 888          
// 888    888                     888          
// 888        888 888d888 .d8888b 888  .d88b.  
// 888        888 888P"  d88P"    888 d8P  Y8b 
// 888    888 888 888    888      888 88888888 
// Y88b  d88P 888 888    Y88b.    888 Y8b.     
//  "Y8888P"  888 888     "Y8888P 888  "Y8888  
class Circle extends Entity{
    second(){
        this.setPos(getCenter())
        this.setScale(random(75, 125))
        this.setAng(random(360))
        this.color = Hsl(random(360), 100, 95, 0.5)
        this.width = 0
    }
    
    addBody(){
		this.body = Bodies.circle(0, 0, 1)
        this.scale = 1
		Composite.add(engine.world, this.body)
        this.updateVerts()
		return this
	}
    
    draw(){
        this.drawStart()
        ctx.arc(0, 0, this.getScale().x*0.965, 0, 2*pi())
        this.drawEnd()
    }
}





// 888b    888                            
// 8888b   888                            
// 88888b  888                            
// 888Y88b 888  .d88b.   .d88b.  88888b.  
// 888 Y88b888 d88P"88b d88""88b 888 "88b 
// 888  Y88888 888  888 888  888 888  888 
// 888   Y8888 Y88b 888 Y88..88P 888  888 
// 888    Y888  "Y88888  "Y88P"  888  888 
//                  888                   
//             Y8b d88P                   
//              "Y88P"                    
class Ngon extends Entity {
	first(){
		this.sides = arguments.length ? arguments[0] : 5
	}
    
    second(){
        this.setPos(getCenter())
        this.setScale(random(75, 125))
        this.setAng(random(360))
        this.color = Hsl(random(360), 100, 95, 0.5)
        this.width = 0
    }
	
	addBody(){
        this.body = Matter.Bodies.polygon(0, 0, this.sides, 1)
        this.scale = 1
		Composite.add(engine.world, this.body)
        this.updateVerts()
		return this
	}
}


















