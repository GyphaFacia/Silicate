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
		
		Matter.Events.on(getCanvas().engine, 'collisionStart', function(event) {
			for(let i = 0; i < event.pairs.length; i++){
				let a = event.pairs[i].bodyA.renderelt
				let b = event.pairs[i].bodyB.renderelt
				
				setTimeout(()=>{
					if(!a || !b){
						return null
					}
					if(a.isSilicate && b.isSilicate){
						if(a.team && b.team && a.team != b.team){
							let scla = a.getScale().x*a.getScale().x - b.getScale().x*b.getScale().x
							let sclb = b.getScale().x*b.getScale().x - a.getScale().x*a.getScale().x
							if(scla <= __MINSCALE){
								a.remove(1)
							}
							else{
								a.setScale(Math.sqrt(scla))
							}
							if(sclb <= __MINSCALE){
								b.remove(1)
							}
							else{
								a.setScale(Math.sqrt(scla))
							}
						}
					}
				}, 25)
			}
		})
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