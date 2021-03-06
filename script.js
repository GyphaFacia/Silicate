//  .d8888b.                                               
// d88P  Y88b                                              
// 888    888                                              
// 888         8888b.  88888b.  888  888  8888b.  .d8888b  
// 888            "88b 888 "88b 888  888     "88b 88K      
// 888    888 .d888888 888  888 Y88  88P .d888888 "Y8888b. 
// Y88b  d88P 888  888 888  888  Y8bd8P  888  888      X88 
//  "Y8888P"  "Y888888 888  888   Y88P   "Y888888  88888P' 
function getCanvas(){
	if(!window.canvas){
		window.canvas = document.querySelector('.canvasJent').parent
	}
	return window.canvas
}

function getRes(){
	return getCanvas().getRes()
}

function getCenter(){
	return getRes().div(2)
}

function cursor(relative2camera = true){
	return getCanvas().getCursor()
}

function mousedown(){
	return getCanvas().mousedown
}

function wheel(){
	return getCanvas().wheel
}

class Canvas {
	constructor(){
		this.canvas = this.createCanvas()
		this.canvas.parent = this
		this.ctx = this.canvas.getContext('2d')
		this.setRes()
		
		this.ents = []
		this.entsInc = 0
		
		this.canvasBindings()
		this.first()
	}
	
	first(){
		this.startEngine()
		this.startCanvas()
	}
	update(){}
	
	canvasBindings(){
		this.canvas.onmousemove = (e)=>{
			this.setCursor(e)
		}
		this.canvas.onmousedown = (e)=>{
			this.mousedown = true
		}
		this.canvas.onmouseup = (e)=>{
			this.mousedown = false
		}
		let rect = this.canvas.getBoundingClientRect()
		this.cursor = vec(-rect.left, -rect.top)
		
		this.canvas.onclick = (e)=>{
			for(let elt of this.ents){
				if(!elt.onclick){
					continue
				}
				if(elt.cursorOnMe()){
					elt.onclick()
				}
			}
		}
		
		this.canvas.onwheel = (e)=>{
			this.wheel = e.deltaY
		}
	}

	addEnt(ent, index = null){
		if(index == null){
			index = parseInt(this.ents.length/2)
		}
		else if (index < 0) {
			index = this.ents.length - index - 1
		}
		this.ents.splice(index, 0, ent)
	}
	removeEnt(id){
		for(let i = 0; i < this.ents.length; i++){
			if(this.ents[i].id == id){
				this.ents.splice(i, 1)
				break
			}
		}
	}
	
	createCanvas(){
		let c = addElement('canvasJent', 'body', 'canvas')
		c.applyCss(`
			position: absolute
			top: 50%
			left: 50%
			transform: translate(-50%, -50%)
			box-shadow: 0 0 0 3px #aaa
		`)
		
		return c
	}
	
	setCursor(e){
		let rect = this.canvas.getBoundingClientRect()
		this.cursor = vec(e.clientX - rect.left, e.clientY - rect.top)
	}
	getCursor(){
		return vec(this.cursor.x, this.cursor.y)
	}
	
	setRes(){
		let res = vec(...arguments)
		res = res.x + res.y ? res : vec(parseInt(window.innerHeight-50))
		this.canvas.width = res.x
		this.canvas.height = res.y
		this.canvas.applyCss(`
			width: ${res.x}px
			height: ${res.y}px
		`)
	}
	setFullscreen(){
		this.setRes(vec(parseInt(window.innerWidth-50), parseInt(window.innerHeight-50)))
	}
	getRes(){return vec(this.canvas.width, this.canvas.height)}
	
	startCanvas(fps = 60){
		fps = parseInt(1000 / fps)
		this.loop = setInterval(()=>{
			this.draw()
		}, fps)
	}
	stopCanvas(){
		clearInterval(this.loop)
	}
	
	draw(){
		this.clearCanvas()
		this.update()
		for(let ent of this.ents){
			ent.draw()
			ent.updateBody()
			ent.update()
		}
		if(this.perks){
			for(let p of this.perks){
				p.draw()
			}
		}
	}
	clearCanvas(){
		this.ctx.fillStyle = 'rgba(0,0,0,0.1)'
		this.ctx.filter = 'none'
		if(this.clearAll){
			this.ctx.clearRect(0, 0, this.getRes().x, this.getRes().y)
		}
		else{
			this.ctx.fillRect(0, 0, this.getRes().x, this.getRes().y)
		}
	}
	
	startEngine(){
		this.Engine = Matter.Engine
		this.Runner = Matter.Runner
		this.Bodies = Matter.Bodies
		this.Composite = Matter.Composite
		
		this.engine = this.Engine.create()
		this.runner = this.Runner.create()
		this.Runner.run(this.runner, this.engine)
		
		let res = this.getRes()
		let ground = this.Bodies.rectangle(res.x/2, res.y, res.x, res.y/100, { isStatic: true })
		this.Composite.add(this.engine.world, ground)
	}
	stopEngine(){
		this.Engine = null
		this.Runner = null
		this.Bodies = null
		this.Composite = null
		this.engine = null
		this.runner = null
	}
}





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
		this.parent = document.querySelector('.canvasJent').parent
		this.ctx = this.parent.ctx
		
		this.id = this.parent.entsInc
		this.parent.entsInc += 1
		this.r = random()
		this.name = this.constructor.name
		
		this.addThisToCanvas()
		
		this.setDefaults()
		this.first(...arguments)
		this.addBody()
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
	
	remove(){
		this.last()
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
	}
	
	draw(){
		this.drawStart()
		this.ctx.arc(0, 0, this.getScale().x - this.getWidth()/2, 0, 2 * Math.PI)
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
		let rad = this.getScale().x - this.getWidth()/2
		this.body = this.parent.Bodies.polygon(pos.x, pos.y, this.getSides(), rad)
		this.parent.Composite.add(this.parent.engine.world, this.body)
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
	}
	
	drawStart(){
		this.ctx.save()
		this.ctx.beginPath()
		let b1 = this.boundsMin()
		let b2 = this.boundsMax()

		let v = b1
		let offset = b2.sub(b1).mul(0, 1).sub(0, this.getInset()*2)
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


// 888888b.                                   888          
// 888  "88b                                  888          
// 888  .88P                                  888          
// 8888888K.   .d88b.  888  888 88888b.   .d88888 .d8888b  
// 888  "Y88b d88""88b 888  888 888 "88b d88" 888 88K      
// 888    888 888  888 888  888 888  888 888  888 "Y8888b. 
// 888   d88P Y88..88P Y88b 888 888  888 Y88b 888      X88 
// 8888888P"   "Y88P"   "Y88888 888  888  "Y88888  88888P' 
function setBounds(width = 500, outline = 0){
	let e
	e = new Entity()
	e.setStatic()
	e.setPos(getRes().mul(0.5, 1).add(0, width/2 - outline))
	e.setScale(getRes().mul(2, 0).add(0, width))
	
	e = new Entity()
	e.setStatic()
	e.setPos(getRes().mul(0.5, 0).add(0, -width/2 + outline))
	e.setScale(getRes().mul(2, 0).add(0, width))
	
	e = new Entity()
	e.setStatic()
	e.setPos(getRes().mul(0, 0.5).add(-width/2 + outline, 0))
	e.setScale(getRes().mul(0, 2).add(width, 0))
	
	e = new Entity()
	e.setStatic()
	e.setPos(getRes().mul(1, 0.5).add(width/2 - outline, 0))
	e.setScale(getRes().mul(0, 2).add(width, 0))
}

// 888                             888          
// 888                             888          
// 888                             888          
// 888       8888b.  88888b.   .d88888 .d8888b  
// 888          "88b 888 "88b d88" 888 88K      
// 888      .d888888 888  888 888  888 "Y8888b. 
// 888      888  888 888  888 Y88b 888      X88 
// 88888888 "Y888888 888  888  "Y88888  88888P' 
class Landscape extends Poly {
	addThisToCanvas(){
		this.parent.addEnt(this, -1)
	}
	
	first(n = 200, wave = 255, ...args){
		function harmony(){
			let pairs = []
			let shift = arguments[0]
			let sum = 0
			let div = 0
			for(let i = 1; i < arguments.length; i+=2){
				let fase = arguments[i]
				let amplitude = arguments[i+1]
				sum += sin(360*fase*shift)*amplitude
				div += amplitude
			}
			sum /= div
			return sum
		}
		
		this.points = []
		
		let res = getRes().mul(1.25)
		
		this.points.push(vec(0, res.y))
		this.points.push(vec(0, res.y/2))
		for(let i = 0; i < n; i++){
			let offy = harmony(i/n, ...args)*wave
			let v = vec(res.x*i/n, res.y/2 - offy)
			this.points.push(v)
		}
		this.points.push(vec(res.x, res.y/2))
		this.points.push(vec(res.x, res.y))
		
		this.setInset(wave)
	}		
	second(){
		this.setStatic()
		// this.setColor(HslClr(75, 20, 70))
		// this.setOColor(HslClr(75, 75, 50))
		this.setColor(HslClr(45, 40, 80))
		this.setOColor(HslClr(45, 40, 60))
		this.setWidth(10)
	}
}

// 888       888          888                    
// 888   o   888          888                    
// 888  d8b  888          888                    
// 888 d888b 888  8888b.  888888 .d88b.  888d888 
// 888d88888b888     "88b 888   d8P  Y8b 888P"   
// 88888P Y88888 .d888888 888   88888888 888     
// 8888P   Y8888 888  888 Y88b. Y8b.     888     
// 888P     Y888 "Y888888  "Y888 "Y8888  888     
class Water extends Entity {
	first(){
		this.bubbles = []
		// this.setColor(HslClr(0, 100, 20, 0.95))
		// this.setOColor(HslClr(0, 100, 40, 0.95))
		this.setColor(HslClr(170, 70, 80, 0.9))
		this.setOColor(HslClr(170, 35, 90, 0.9))
		this.setWidth(1)
		this.setFilter('blur(5px)')
	}
	
	spawnBubble(pos = null, speed = null, size = null){
		if(pos == null){
			pos = this.getScale().mul(random())
		}
		speed = speed ? speed : random(5, 10)
		size = size ? size : random(5, 10)
		this.bubbles.push([pos.x, pos.y, speed, size])
	}
	
	handleBubbles(){
		if(random() > 0.9){
			this.spawnBubble()
		}
		for(let i = 0; i < this.bubbles.length; i++){
			let e = this.bubbles[i]
			e[1] -= e[2]
			if(e[1] < -e[2]*10){
				this.bubbles.splice(i, 1)
			}
		}
	}
	
	drawBubbles(){
		for(let e of this.bubbles){
			this.ctx.save()
			this.ctx.beginPath()
			this.ctx.translate(this.getPos().x, this.getPos().y)
			let x = e[0] - 0.5*this.getScale().x
			let y = e[1] - this.getScale().y/2
			this.ctx.arc(x, y, e[3], 0, 2 * Math.PI)
			this.drawEnd()
		}
	}
	
	addBody(){}
	
	addThisToCanvas(){
		this.parent.addEnt(this, -2)
	}
	
	killInBounds(){
		let s = this.getScale().div(2)
		let v = this.getPos()
		for(let ent of this.parent.ents){
			if(!ent.body){
				continue
			}
			if(ent.getScale().len() > 100){
				continue
			}
			if(ent.getPos().x > v.add(s).x || ent.getPos().x < v.sub(s).x){
				continue
			}
			if(ent.getPos().y > v.sub(s).y){
				let v = ent.getPos()
				v = v.sub(this.getPos().sub(this.getScale().div(2)))
				v = v.add(angvec(random(360)).mul(random(50)))
				this.spawnBubble(
					v,
					random(3, 6),
					random(3, 5)
				)
				setTimeout(()=>{
					ent.remove()
				}, random(255, 500))
			}
		}
	}
	
	update(){
		this.handleBubbles()
		// this.setColor(HslClr(160+sin(time(10))*10, 50, 75, 0.5))
		this.killInBounds()
	}
	
	draw(){
		let n = 50
		let p = this.getPos()
		let s = this.getScale()
		let v
	
		this.drawStart()
	
		v = s.div(2).mul(-1, 1)
		this.ctx.moveTo(v.x, v.y)
		for(let i = 0; i < n; i++){
			v = s.div(2).mul(-1 + 2/n*i, -1)
			v = v.add(0, sin(s.x/n*i + time(500))*5)
			this.ctx.lineTo(v.x, v.y)
		}
		v = s.div(2).mul(1, 1)
		this.ctx.lineTo(v.x, v.y)
		this.ctx.closePath()
		this.drawEnd()
	
		this.drawBubbles()
	}
}



//  .d8888b.  d8b 888 d8b                   888            
// d88P  Y88b Y8P 888 Y8P                   888            
// Y88b.          888                       888            
// "Y888b.   888 888 888  .d8888b  8888b.  888888 .d88b.  
//    "Y88b. 888 888 888 d88P"        "88b 888   d8P  Y8b 
// 	    "888 888 888 888 888      .d888888 888   88888888 
// Y88b  d88P 888 888 888 Y88b.    888  888 Y88b. Y8b.     
//  "Y8888P"  888 888 888  "Y8888P "Y888888  "Y888 "Y8888  
class Silicate extends Ngon{
	first(){
		this.setSides(6)
		this.setColor(HslClr(...randelt(
			[
				[330, 100, 90],
				[40, 65, 80],
				[268, 17, 57],
			]
		)))
		this.setOColor(Clr(0))
		this.setWidth(1)
		this.setScale(vec(15))
	}
}

// 8888888b.                  888               
// 888   Y88b                 888               
// 888    888                 888               
// 888   d88P .d88b.  888d888 888  888 .d8888b  
// 8888888P" d8P  Y8b 888P"   888 .88P 88K      
// 888       88888888 888     888888K  "Y8888b. 
// 888       Y8b.     888     888 "88b      X88 
// 888        "Y8888  888     888  888  88888P' 
class Perk {
	constructor(name, rad, cooldown, callback, renderasap = true){
		this.parent = getCanvas()
		this.ctx = this.parent.ctx
		if(!this.parent.perks){
			this.parent.perks = []
		}
		this.parent.perks.push(this)
		this.name = name
		this.rad = rad ? rad : 150
		this.cooldown = cooldown ? cooldown : 500
		this.oncooldown = 0
		this.setEntity(Silicate)
		this.render()
		this.setCallback(callback)
		this.active = false
		
		this.setCooldown()
	}
	// ?????????? ???????????? ?? ???????????????? ???????????????? ???????? ????????
	setEntity(ent){this.ent = ent}
	
	pick(){
		if(this.oncooldown){
			return false
		}
		
		for(let perk of getCanvas().perks){
			perk.cancel()
		}
		this.active = true
		this.btn.classList.add('perk--active')
		this.btn.classList.remove('perk-frame__perkimg')
	}
	
	cancel(){
		this.active = false
		this.btn.classList.remove('perk--active')
		this.btn.classList.add('perk-frame__perkimg')
	}
	
	setCooldown(cd = null){
		cd = cd ? cd : this.cooldown
		this.oncooldown = time() + this.cooldown/1000
		this.btn.classList.add('unclickable')
		setTimeout(()=>{
			this.btn.classList.remove('unclickable')
			this.oncooldown = 0
		}, this.cooldown)
	}
	
	apply(){
		if(this.active){
			this.cancel()
			this.callback(this)
			this.setCooldown()
		}
	}
	
	// ?????? ?????????????????????? ????????????. ?????????????????? ?????????? ?? ??????????
	applyAt(pos = null){
		pos = pos == null ? getRes().mul(0.5, 0.1) : pos
		let bup = cursor()
		getCanvas().cursor = pos
		this.callback(this)
		getCanvas().cursor = bup
	}
	
	bind(){
		this.btn.ondragstart = (e)=>{
			e.dataTransfer.setDragImage(e.target, window.outerWidth*2, window.outerHeight*2)
			this.pick()
		}
		this.btn.ondragend = (e)=>{
			getCanvas().setCursor(e)
			this.apply()
		}
		getCanvas().canvas.ondragover = (e)=>{
			getCanvas().setCursor(e)
		}
		
		document.onkeyup = (e)=>{
			for(let i = 0; i < getCanvas().perks.length; i++){
				let perk = getCanvas().perks[i]
				if(parseInt(e.key)-1 == i){
					perk.pick()
					getCanvas().canvas.onclick = (e)=>{
						perk.apply()
					}
				}
			}
		}
		
		document.oncontextmenu = (e)=>{
			e.preventDefault()
			for(let perk of getCanvas().perks){
				perk.cancel()
			}
		}
	}
	
	setCallback(callback){
		this.callback = callback
		this.bind()
	}
	
	render(){
		let section = document.querySelector('.perk-section')
		let frame = section.addElement('.perk-frame')
		this.btn = frame.addElement('.perk-frame__perkimg', 'img')
		this.cdoverlay = frame.addElement('.perk-frame__overlay')
		this.btn.src = `./src/Ico/Perks/${this.name}.svg`
	}
	
	draw(){
		let clipY = this.oncooldown ? (this.oncooldown - time())*1000/this.cooldown*10 : 10
		if(this.oncooldown){
			console.log(this.oncooldown, time());
		}
		this.cdoverlay.style.clip = `rect(${clipY}vh, auto, 10vh, auto)`
		
		if(this.active){
			this.ctx.strokeStyle = 'white'
			this.ctx.lineWidth = 5
			let ang = time(1)%(2*Math.PI)
			let n = 7
			for(let i = 0; i < n; i++){
				this.ctx.beginPath()
				this.ctx.arc(cursor().x, cursor().y, this.rad, ang, ang+Math.PI/n)
				this.ctx.stroke()
				ang += 2*Math.PI/n
			}
		}
	}
	
}

let c = new Canvas()
c.clearAll = 1
c.setFullscreen()
setBounds()
let w = new Water()
w.setPos(getRes().mul(0.5, 1.5))
w.setScale(getRes().mul(1.35))
// let l = new Landscape(200, 255, -1.5, 1, 9, 0.1)
let l = new Landscape(500, 255, 2.5, 1, 11, 0.35)
l.setPos(getRes().mul(0.5, 1))

new Perk('SpawnSome', 0, 0, (perk)=>{
	for(let i = 0; i < 5; i++){
		let e = new perk.ent()
		e.setPos(cursor().add(randvecX(random(perk.rad))))
	}
})

new Perk('SpawnBig', 0, 0, (perk)=>{
	let e = new perk.ent()
	e.setPos(cursor())
	e.setScale(vec(50))
})

new Perk('Reproduce', 0, 0, (perk)=>{
	let i = 0
	for(let ent of getCanvas().ents.slice()){
		if(ent.getPos().dist(cursor()) < perk.rad){
			let e = new perk.ent()
			e.setScale(ent.getScale())
			e.setPos(ent.getPos())
			e.setColor(ent.getColor())
			e.setOColor(ent.getOColor())
			i++
			if(i > 10){
				break
			}
		}
	}
})

new Perk('Split', 0, 0, (perk)=>{
	let areaChild = 15*15*Math.PI
	for(let ent of getCanvas().ents.slice()){
		if(ent.getPos().dist(cursor()) < perk.rad){
			let rad = ent.getScale().x
			let areaCur = rad*rad*Math.PI
			let n = parseInt(areaCur/areaChild)
			n = n > 300 ? 300 : n
			for(let i = 0; i < n; i++){
				let e = new perk.ent()
				e.setScale(vec(15))
				e.setPos(ent.getPos().add(angvecX(360*3/n*i, rad/n*i)))
				e.setColor(ent.getColor())
				e.setOColor(ent.getOColor())
			}
			
			ent.remove()
		}
	}
})

new Perk('Grow', 0, 0, (perk)=>{
	for(let ent of getCanvas().ents.slice()){
		if(ent.getPos().dist(cursor()) < perk.rad){
			ent.setScale(ent.getScale().mul(1.25))
		}
	}
})

new Perk('Explode', 0, 0, (perk)=>{
	for(let ent of getCanvas().ents.slice()){
		if(ent.getPos().dist(cursor()) < perk.rad){
			ent.setVel(ent.getPos().sub(cursor()).ort().mul(30))
		}
	}
})

for(let i = 0; i < 2; i++){
	setTimeout(()=>{
		for(let j = 0; j < i*5+2; j++){
			getCanvas().perks[0].applyAt()
		}
	},100*i)
}

let n = 5
for(let i = 0; i < n; i++){
	setTimeout(()=>{
		let cnt = 0
		let avg = vec(0)
		for(let ent of getCanvas().ents){
			if(ent.name == 'Silicate'){
				avg = avg.add(ent.getPos())
				cnt += 1
			}
		}
		avg = avg.div(cnt)
		getCanvas().perks[i+1 == n ? 5 : 4].applyAt(avg)
	}, 0)
}












