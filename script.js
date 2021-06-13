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
	e = new Entity().addBody()
	e.setOColor(Clr(0,0,0,0))
	e.setHollow()
	e.setStatic()
	e.setPos(getRes().mul(0.5, 1).add(0, width/2 - outline))
	e.setScale(getRes().mul(2, 0).add(0, width))
	
	e = new Entity().addBody()
	e.setOColor(Clr(0,0,0,0))
	e.setHollow()
	e.setStatic()
	e.setPos(getRes().mul(0.5, 0).add(0, -width/2 + outline))
	e.setScale(getRes().mul(2, 0).add(0, width))
	
	e = new Entity().addBody()
	e.setOColor(Clr(0,0,0,0))
	e.setHollow()
	e.setStatic()
	e.setPos(getRes().mul(0, 0.5).add(-width/2 + outline, 0))
	e.setScale(getRes().mul(0, 2).add(width, 0))
	
	e = new Entity().addBody()
	e.setOColor(Clr(0,0,0,0))
	e.setHollow()
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
		this.addBody()
	}		
	second(){
		this.setStatic()
		// this.setColor(HslClr(75, 20, 70))
		// this.setOColor(HslClr(75, 75, 50))
		this.setColor(HslClr(45, 40, 80))
		this.setOColor(HslClr(45, 40, 60))
		this.setWidth(5)
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
			
			this.ctx.translate(this.getPos().x, this.getPos().y)
			let x = e[0] - 0.5*this.getScale().x
			let y = e[1] - this.getScale().y/2
			
			
			this.ctx.beginPath()
			this.ctx.arc(x, y, e[3], 0, 2 * Math.PI)
			this.ctx.closePath()
			
			this.ctx.beginPath()
			this.ctx.arc(x+25, y-15, e[3], 0, 2 * Math.PI)
			this.ctx.closePath()
			
			
			this.ctx.beginPath()
			this.ctx.arc(x-15, y+25, e[3], 0, 2 * Math.PI)
			this.ctx.closePath()
			
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
			if(!ent.body || !ent.isSilicate){
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
				setTimeout(()=>{
					ent.remove()
				}, random(255, 500))
				if(random() > 0.5){ continue }
				this.spawnBubble(
					v,
					random(3, 6),
					random(3, 5)
				)
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
function shatter(ent, flakescl = __MINSCALE/3, maxcnt = 50, life = 500){
	let rad = ent.getScale().x
	let square = rad*rad
	let n = square / flakescl / flakescl
	n = n > maxcnt ? maxcnt : n
	for(let i = 0; i < n; i++){
		let p = new Ngon(randint(4, 6)).addBody()
		p.setPos(ent.getPos())
		p.setWidth(1)
		p.setOColor(ent.getColor())
		p.setColor(ent.getColor())
		p.setScale(random(0.75, 1.25)*flakescl)
		p.setPos(ent.getPos().add(angvecX(360/n*i, rad/n*i*random(0.5, 1))))
		
		p.setVel(randvecX(random()))
		setTimeout(()=>{
			p.remove()
		}, random(0.75, 1.25)*life)
	}
}

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
		this.setScale(vec(__MINSCALE))
		
		this.isSilicate = true
		this.addBody()
	}
	
	last(){
		shatter(this)
	}
}





//  .d8888b.                             888    
// d88P  Y88b                            888    
// 888    888                            888    
// 888         .d88b.  88888b.  .d8888b  888888 
// 888        d88""88b 888 "88b 88K      888    
// 888    888 888  888 888  888 "Y8888b. 888    
// Y88b  d88P Y88..88P 888  888      X88 Y88b.  
//  "Y8888P"   "Y88P"  888  888  88888P'  "Y888 
const __MINSCALE = 10
const __MAXSCALE = 125
const __SPAWNLIMIT = 20
const __GRAVITY = vec(0, 0.001)
const __COOLDOWN_ELITE = 10*1000 // элитный перк
const __COOLDOWN_HARD = 7*1000 // сильный перк
const __COOLDOWN_MID = 5*1000 // средний перкы
const __COOLDOWN_LIGHT = 3*1000 // слабый перк

// 888b     d888          d8b          
// 8888b   d8888          Y8P          
// 88888b.d88888                       
// 888Y88888P888  8888b.  888 88888b.  
// 888 Y888P 888     "88b 888 888 "88b 
// 888  Y8P  888 .d888888 888 888  888 
// 888   "   888 888  888 888 888  888 
// 888       888 "Y888888 888 888  888 
let c = new Canvas()
c.clearAll = 1
c.setFullscreen()
setBounds()
// let w = new Water()
// w.setPos(getRes().mul(0.5, 1.45))
// w.setScale(getRes().mul(1.35))
// let l = new Landscape(200, 255, -1.5, 1, 9, 0.1)
let l = new Landscape(255, 125, 1.5, 1, 11, 0.1, 7, 0.1)
l.setPos(getRes().mul(0.5, 1))
l.offy = -15

class Ruby extends Silicate{second(){this.setColor(HslClr(-20, 100, 50))}}
let p1 = new Player(Ruby, 1)
p1.allPerksTest()

class Emerald extends Silicate{second(){this.setColor(HslClr(85, 100, 50))}}
let p2 = new Player(Emerald, 2)
p2.allPerksTest()

class Gold extends Silicate{second(){this.setColor(Clr(255, 225, 0))}}
let p3 = new Player(Gold, 3)
p3.allPerksTest()

p1.botHard()
p2.botHard()
p3.player()

let teamsTab = addElement('teams-tab', 'body')

let gameStartTime = time()
let timeTab = addElement('timer-tab', 'body')
setInterval(()=>{
	let sec = time() - gameStartTime
	sec = parseInt(sec)
	min = parseInt(sec/60)
	sec -= min * 60
	sec = sec + ''
	min = min + ''
	sec = sec.length == 1 ? '0' + sec : sec
	min = min.length == 1 ? '0' + min : min
	timeTab.innerText = `${min}:${sec}`
	
	let arr = []
	for(let ply of getCanvas().players){
		arr[ply.team] = []
		arr[ply.team][0] = 0
		arr[ply.team][1] = '#fff'
	}
	for(let ent of getCanvas().ents){
		if(!ent.isSilicate){ continue }
		arr[ent.team][0] += 1
		arr[ent.team][1] = ent.getColor().val()
	}
	let html = ''
	for(let team in arr){
		let cnt = arr[team][0]
		let clr = arr[team][1]
		if(!cnt){ continue }
		html += `<span class = "teams-tab__team" style="color: ${clr}">${cnt}</span>`
	}
	teamsTab.innerHTML = html
	
}, 100)






