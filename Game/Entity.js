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
function strokeOrFill(e){
	if(e.isHollow()){
		e.ctx.lineWidth = e.getWidth()
		e.ctx.strokeStyle = e.getOColor().val()
		e.ctx.stroke()
	}
	else{
		e.ctx.fillStyle = e.getColor().val()
		e.ctx.lineWidth = e.getWidth()
		e.ctx.fill()
		e.ctx.strokeStyle = e.getOColor().val()
		e.ctx.stroke()
	}
}

class Entity {
	constructor() {
		this.parent = document.querySelector('.canvas-game').parent
		this.ctx = this.parent.ctx
		
		this.id = this.parent.entsInc
		this.parent.entsInc += 1
		this.r = random()
		this.name = this.constructor.name
		
		this.addThisToCanvas()
		
		this.setDefaults()
		this.first(...arguments)
		// this.addBody()
		this.second()
	}
	
	addThisToCanvas(){
		this.parent.addEnt(this)
		this.ctx = this.parent.ctx
	}
	
	first(){}
	second(){}
	last(){}
	update(){}
	onclick(){}
	draw(){
		let w = this.getScale().x - this.getWidth()
		let h = this.getScale().y - this.getWidth()
		let x = this.getPos().x
		let y = this.getPos().y
		
		this.drawStart()
		this.ctx.rect(-w/2, -h/2, w, h)
		this.drawEnd()
	}
	
	drawStart(){
		this.ctx.save()
		this.ctx.beginPath()
		this.ctx.translate(this.getPos().x, this.getPos().y)
		this.ctx.rotate((this.getAng())/180*Math.PI)
		this.ctx.filter = this.getFilter()
	}
	
	drawEnd(){
		strokeOrFill(this)
		this.ctx.restore()
	}
	
	showBounds(){
		this.ctx.save()
		this.ctx.beginPath()
		this.ctx.moveTo(this.body.bounds.min.x, this.body.bounds.min.y)
		this.ctx.lineTo(this.body.bounds.max.x, this.body.bounds.min.y)
		this.ctx.lineTo(this.body.bounds.max.x, this.body.bounds.max.y)
		this.ctx.lineTo(this.body.bounds.min.x, this.body.bounds.max.y)
		this.ctx.closePath()
		this.drawEnd()
	}
	boundsMin(){return vec(this.body.bounds.min.x, this.body.bounds.min.y)}
	boundsMax(){return vec(this.body.bounds.max.x, this.body.bounds.max.y)}
	
	
	cursorOnMe(){
		let c = this.parent.getCursor()
		let s = this.getScale()
		let p = this.getPos()
		if(c.x > p.x + s.x/2){return false}
		if(c.x < p.x - s.x/2){return false}
		if(c.y > p.y + s.y/2){return false}
		if(c.y < p.y - s.y/2){return false}
		return true
	}
	
	setDefaults(){
		this.setPos()
		this.setScale(vec(80))
		this.setColor(Clr(255, 255, 255, 0.9))
		this.setOColor(Clr(255, 255, 255, 0.9))
		this.setAng(0)
		this.setTooltip('')
		this.setFilter('')
		this.setHollow(0)
		this.setWidth(1)
	}
	
	remove(wlast = false){
		if(wlast){
			this.last()
		}
		this.removeBody()
		this.parent.removeEnt(this.id)
	}
	
	setColor(){this.clr = arguments.length ? arguments[0] : Clr(255)}
	setOColor(){this.oclr = arguments.length ? arguments[0] : Clr(255)}
	setTooltip(){this.tooltip = arguments[0]}
	setFilter(){this.filter = arguments[0]}
	setHollow(hollow = 1){this.hollow = hollow ? true : false}
	setWidth(){this.width = arguments[0]}
	
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
		}
	}
	
	addBody(){
		if(!this.parent.Engine){
			return null
			this.updatebody = ()=>{}
		}
		this.body = this.parent.Bodies.rectangle(
			this.getPos().x, this.getPos().y, this.getScale().x, this.getScale().y)
		this.parent.Composite.add(this.parent.engine.world, this.body)
		return this
	}
	removeBody(){
		if(!this.body){
			return null
		}
		Matter.World.remove(this.parent.engine.world, this.body)
		this.parent.Composite.remove(this.parent.engine.world, this.body)
	}
	
	updateBody(){
		if(!this.body){
			return null
		}
		let pos = this.body.position
		pos = vec(pos.x, pos.y)
		this.pos = pos
		this.ang = this.body.angle / Math.PI * 180
		if(this.getMass() != 0.123456789 && !this.parent.engine.gravity.scale){
			this.applyForce(__GRAVITY.mul(this.getMass()))
		}
	}
	
	setStatic(isStatic = true){
		Matter.Body.setStatic(this.body, isStatic)
	}
	setAngVel(angvel){
		Matter.Body.setAngularVelocity(this.body, angvel)
	}
	setVel(){
		let vel = vec(...arguments)
		Matter.Body.setVelocity(this.body, vel)
	}
	setMass(mass){
		Matter.Body.setMass(this.body, mass)
	}
	applyForce(){
		Matter.Body.applyForce(this.body, this.pos, vec(...arguments))
	}
	
	getPos(){return this.pos}
	getScale(){return this.scale}
	getColor(){return this.clr}
	getOColor(){return this.oclr}
	getAng(){return this.ang}
	getTooltip(){return this.tooltip}
	getFilter(){return this.filter}
	isHollow(){return this.hollow}
	getWidth(){return this.width}
	
	isStatic(){return this.body.isStatic}
	getAngVel(){return this.body.angularVelocity}
	getVel(){return this.body.velocity}
	getMass(){return this.body.mass}
}





//  .d8888b.  d8b                 888          
// d88P  Y88b Y8P                 888          
// 888    888                     888          
// 888        888 888d888 .d8888b 888  .d88b.  
// 888        888 888P"  d88P"    888 d8P  Y8b 
// 888    888 888 888    888      888 88888888 
// Y88b  d88P 888 888    Y88b.    888 Y8b.     
//  "Y8888P"  888 888     "Y8888P 888  "Y8888  
class Circle extends Entity {
	addBody(){
		if(!this.parent.Engine){
			return null
			this.updatebody = ()=>{}
		}
		this.body = this.parent.Bodies.circle(
			this.getPos().x, this.getPos().y, this.getScale().x)
		this.parent.Composite.add(this.parent.engine.world, this.body)
		this.body.renderelt = this
		return this
	}
	
	draw(){
		this.drawStart()
		this.ctx.arc(0, 0, this.getScale().x - this.getWidth()/2, 0, 2 * Math.PI)
		this.drawEnd()
	}
}





// 8888888b.                    888                    888 
// 888  "Y88b                   888                    888 
// 888    888                   888                    888 
// 888    888  8888b.  .d8888b  88888b.   .d88b.   .d88888 
// 888    888     "88b 88K      888 "88b d8P  Y8b d88" 888 
// 888    888 .d888888 "Y8888b. 888  888 88888888 888  888 
// 888  .d88P 888  888      X88 888  888 Y8b.     Y88b 888 
// 8888888P"  "Y888888  88888P' 888  888  "Y8888   "Y88888 
class DashedCircle extends Circle {
	first(){
		this.dashes = 7
		this.setWidth(3)
	}
	draw(){
		this.ctx.strokeStyle = 'white'
		this.ctx.lineWidth = 5
		let ang = 0
		let n = this.dashes
		for(let i = 0; i < n; i++){
			this.drawStart()
			this.ctx.arc(0, 0, this.getScale().x, ang, ang+Math.PI/n)
			this.drawEnd()
			ang += 2*Math.PI/n
		}
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
		this.setSides(arguments.length ? arguments[0] : 5)
	}
	
	setSides(sides){this.sides = sides > 2 ? sides : 3}
	getSides(){return this.sides}
	
	addBody(){
		if(!this.parent.Engine){
			return null
			this.updatebody = ()=>{}
		}
		let pos = this.getPos()
		let rad = this.getScale().x
		this.body = this.parent.Bodies.polygon(pos.x, pos.y, this.getSides(), rad)
		this.parent.Composite.add(this.parent.engine.world, this.body)
		this.body.renderelt = this
		return this
	}

	draw(){
		let w = this.getScale().x - this.getWidth()/2
		let h = this.getScale().y - this.getWidth()/2
		let x = this.getPos().x
		let y = this.getPos().y
		
		let n = this.getSides()
		let pi2 = 2*Math.PI
		let ang = 360/n/2
		ang = ang/360*pi2
		
		this.drawStart()
		this.ctx.moveTo(w*Math.cos(ang), h*Math.sin(ang))
		for (let i = 1; i <= n; i ++) {
			this.ctx.lineTo(w*Math.cos(pi2/n*i+ang), h*Math.sin(pi2/n*i+ang))
		}
		this.ctx.closePath()
		this.drawEnd()
	}
}





//  .d8888b.  d8b                        
// d88P  Y88b Y8P                        
// 888    888                            
// 888        888 88888b.d88b.   .d88b.  
// 888        888 888 "888 "88b d88P"88b 
// 888    888 888 888  888  888 888  888 
// Y88b  d88P 888 888  888  888 Y88b 888 
//  "Y8888P"  888 888  888  888  "Y88888 
// 	     							 888 
// 		    					Y8b d88P 
// 			    				 "Y88P"  
class Cimg extends Entity{
	first(){
		this.setImg(arguments[0])
	}
	setImg(img){
		let image = new Image(800, 800)
		image.src = img
		this.img = image
	}
	getImg(){return this.img}
	
	draw(){
		let w = this.getImg().naturalWidth
		let h = this.getImg().naturalHeight
		let ratio = w>h ? w/h : h/w
		w = this.getScale().x
		h = this.getScale().y
		w /= ratio
		this.drawStart()
		this.ctx.drawImage(this.img, -w/2, -h/2, w, h)
		this.drawEnd()
	}
}



// 8888888b.          888          
// 888   Y88b         888          
// 888    888         888          
// 888   d88P .d88b.  888 888  888 
// 8888888P" d88""88b 888 888  888 
// 888       888  888 888 888  888 
// 888       Y88..88P 888 Y88b 888 
// 888        "Y88P"  888  "Y88888 
//                             888 
//                        Y8b d88P 
//                         "Y88P"  
class Poly extends Entity {
	first(){
		this.points = []
		for(let point of arguments){
			this.points.push(point)
		}
		this.setInset(0)
		this.offy = 0
	}
	
	setInset(inset){this.inset = inset}
	getInset(){return this.inset}
	
	addBody(){
		if(!this.parent.Engine){
			return null
			this.updatebody = ()=>{}
		}
		this.body = this.parent.Bodies.fromVertices(0, 0, this.points, [])
		this.parent.Composite.add(this.parent.engine.world, this.body)
		this.body.renderelt = this
		return this
	}
	
	drawStart(){
		this.ctx.save()
		this.ctx.beginPath()
		let b1 = this.boundsMin()
		let b2 = this.boundsMax()

		let v = b1
		let offset = b2.sub(b1).mul(0, 1).sub(0, this.getInset()*2+this.offy)
		v = v.sub(offset)
		
		this.ctx.translate(v.x, v.y)
		this.ctx.filter = this.getFilter()
	}
	draw(){
		let v = this.points
		this.drawStart()
		this.ctx.moveTo(v[0].x, v[0].y)
		for (let i = 1; i <= v.length - 1; i ++) {
			this.ctx.lineTo(v[i].x, v[i].y)
		}
		this.ctx.closePath()
		this.drawEnd()
		// this.showBounds()
	}
	
	updateBody(){}
}