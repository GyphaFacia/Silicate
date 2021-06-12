// 8888888b.                  888               
// 888   Y88b                 888               
// 888    888                 888               
// 888   d88P .d88b.  888d888 888  888 .d8888b  
// 8888888P" d8P  Y8b 888P"   888 .88P 88K      
// 888       88888888 888     888888K  "Y8888b. 
// 888       Y8b.     888     888 "88b      X88 
// 888        "Y8888  888     888  888  88888P' 
class Perk {
	constructor(ent = Silicate, rad = null, cooldown = null, level = null){
		this.parent = getCanvas()
		this.ctx = this.parent.ctx
		if(!this.parent.perks){
			this.parent.perks = []
		}
		this.parent.perks.push(this)
		
		this.name = this.constructor.name
		this.setEntity(ent)
		
		this.rad = rad == null ? 100 : rad
		this.level = level == null ? 5 : level
		this.cooldown = cooldown == null ? 500 : rad
		
		this.rendered = false
		this.active = false
		this.oncooldown = 0
		this.team = 0
		
		this.first()
	}

	first(){}
	callback(){}
	setEntity(ent){this.ent = ent}
	
	disperce(min, max){
		return min + (max - min)/4*(this.level - 1)
	}
	
	pick(){
		if(this.oncooldown){
			return false
		}
		
		for(let perk of getCanvas().perks){
			perk.cancel()
		}
		this.active = true
		if(!this.rendered){return null}
		this.btn.classList.add('perk--active')
		this.btn.classList.remove('perk-frame__perkimg')
	}
	
	cancel(){
		this.active = false
		if(!this.rendered){return null}
		this.btn.classList.remove('perk--active')
		this.btn.classList.add('perk-frame__perkimg')
	}
	
	setCooldown(cd = null){
		if(!this.cooldown){return null}
		cd = cd ? cd : this.cooldown
		this.oncooldown = time() + this.cooldown/1000
		
		if(this.rendered){this.btn.classList.add('unclickable')}
		setTimeout(()=>{
			if(this.rendered){this.btn.classList.remove('unclickable')}
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
	
	// Для интерфейсов врагов. Применить скилл в точке
	applyAt(pos = null){
		if(this.oncooldown){ return null }
		pos = pos == null ? getRes().mul(0.5, 0.1) : pos
		let bup = cursor()
		getCanvas().cursor = pos
		this.callback(this)
		getCanvas().cursor = bup
		this.setCooldown()
		testCircle(pos, this.rad)
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
	
	render(){
		this.rendered = true
		let section = document.querySelector('.perk-section')
		let frame = section.addElement('.perk-frame')
		this.btn = frame.addElement('.perk-frame__perkimg', 'img')
		this.cdoverlay = frame.addElement('.perk-frame__overlay')
		this.btn.src = `./src/Ico/Perks/${this.name}.svg`
		this.bind()
	}
	
	draw(){
		if(this.rendered){
			let clipY = this.oncooldown ? (this.oncooldown - time())*1000/this.cooldown*10 : 10
			this.cdoverlay.style.clip = `rect(${clipY}vh, auto, 10vh, auto)`
		}
		
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
	
	// Ai skill position calculations
	getMaxDence(team = 'my', considerScale = 0){
		let rad = this.rad
		let gridres = getRes().div(rad).round()
		
		let mrx = []
		for(let x = 0; x < gridres.x; x++){
			let col = []
			for(let y = 0; y < gridres.y; y++){
				col.push(0)
			}
			mrx.push(col)
		}
		
		for(let ent of getCanvas().ents){
			if(!ent.isSilicate){continue}
			if(ent.team != this.team && team == 'my'){continue}
			if(ent.team == this.team && team != 'my'){continue}
			let v = ent.getPos().div(rad).round()
			try {
				mrx[v.x][v.y] += considerScale ? ent.getScale().x : 1
			} catch (e) {}
		}
		
		let max = vec(0)
		for(let x = 0; x < gridres.x; x++){
			for(let y = 0; y < gridres.y; y++){
				if(mrx[x][y] > mrx[max.x][max.y]){
					max = vec(x, y)
				}
			}
		}
		if(!max.x && !max.y){
			max = getRes().mul(random(), 0.25)
		}
		else{
			max = max.mul(rad)
		}
		// testCircle(max, this.rad)
		// visGrid(mrx)
		return max
	}
	
	optimalCast(){
		this.aiSpawn()
	}
	
	aiSpawn(considerScale = false){
		let pos = this.getMaxDence('my', considerScale)
		pos = pos.sub(0, this.rad*3)
		this.applyAt(pos)
	}
	
	aiAttack(considerScale = false){
		let pos = this.getMaxDence('other', considerScale)
		pos = pos.sub(0, this.rad*5)
		this.applyAt(pos)
	}
	
	aiBuff(considerScale = false){
		let pos = this.getMaxDence('my', considerScale)
		this.applyAt(pos)
	}
	
	aiDeBuff(considerScale = false){
		let pos = this.getMaxDence('other', considerScale)
		this.applyAt(pos)
	}
}

function testCircle(pos, rad = 100, temporary = false){
	if(temporary){
		getCanvas().ctx.beginPath()
		getCanvas().ctx.strokeStyle = '#f00'
		getCanvas().ctx.lineWidth = 5
		getCanvas().ctx.arc(pos.x, pos.y, rad, 0, 2 * Math.PI)
		getCanvas().ctx.stroke()
		getCanvas().ctx.closePath()
	}
	else{
		let c = new DashedCircle()
		c.setPos(pos)
		c.setScale(vec(rad))
		c.setHollow()
		c.setOColor(Clr(255))
		c.setWidth(3)
		c.update = ()=>{
			c.setOColor(c.getOColor().modA(-0.025))
		}
		setTimeout(()=>{
			c.remove()
		}, 1000)
	}
}

function visGrid(mrx, fill = 0.1){
	getCanvas().ctx.lineWidth = 5
	getCanvas().ctx.strokeStyle = '#fff0'
	let cell = getRes().div(vec(mrx.length, mrx[0].length))
	let max = vec(0)
	for(let x = 0; x < mrx.length; x++){
		for(let y = 0; y < mrx[0].length; y++){
			getCanvas().ctx.fillStyle = Clr(255).setA(mrx[x][y]*fill).val()
			getCanvas().ctx.beginPath()
			let p = cell.mul(x, y)
			getCanvas().ctx.rect(p.x, p.y, cell.x, cell.y)
			getCanvas().ctx.fill()
			getCanvas().ctx.stroke()
			getCanvas().ctx.closePath()
		}
	}
}


//  .d8888b.                                  
// d88P  Y88b                                 
// Y88b.                                      
//  "Y888b.    .d88b.  88888b.d88b.   .d88b.  
//     "Y88b. d88""88b 888 "888 "88b d8P  Y8b 
// 	     "888 888  888 888  888  888 88888888 
// Y88b  d88P Y88..88P 888  888  888 Y8b.     
//  "Y8888P"   "Y88P"  888  888  888  "Y8888  
class SpawnSome extends Perk{
	first(){
		this.rad = __MINSCALE*2.5
		this.cooldown = __COOLDOWN_HARD
	}
	optimalCast(){
		this.aiSpawn()
	}
	callback(){
		let cnt = this.disperce(1, 7)
		for(let i = 0; i < cnt; i++){
			let e = new this.ent()
			e.team = this.team
			e.setPos(cursor().add(angvecX(360/cnt*i+time(100), this.rad*(cnt > 1))))
		}
	}
}

// 888888b.   d8b          
// 888  "88b  Y8P          
// 888  .88P               
// 8888888K.  888  .d88b.  
// 888  "Y88b 888 d88P"88b 
// 888    888 888 888  888 
// 888   d88P 888 Y88b 888 
// 8888888P"  888  "Y88888 
//                     888 
//                Y8b d88P 
//                 "Y88P"  
class SpawnBig extends Perk{
	first(){
		this.rad = __MINSCALE*3
		this.cooldown = __COOLDOWN_ELITE
	}
	optimalCast(){
		this.aiAttack()
	}
	callback(){
		let e = new this.ent()
		e.team = this.team
		e.setPos(cursor())
		e.setScale(vec(this.disperce(__MINSCALE*2, __MINSCALE*4)))
	}
}

class Reproduce extends Perk{
	first(){
		this.rad = __MINSCALE*4
		this.cooldown = __COOLDOWN_HARD
	}
	optimalCast(){
		this.aiBuff()
	}
	callback(){
		let i = 0
		for(let ent of getCanvas().ents.slice()){
			if(!ent.isSilicate){continue}
			if(this.team && ent.team && ent.team != this.team){ continue }
			let dist = ent.getPos().dist(cursor()) - ent.getScale().x
			if(dist < this.rad){
				let e = new this.ent()
				e.team = this.team
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
	}
}

//  .d8888b.           888 d8b 888    
// d88P  Y88b          888 Y8P 888    
// Y88b.               888     888    
//  "Y888b.   88888b.  888 888 888888 
// 	   "Y88b. 888 "88b 888 888 888    
//       "888 888  888 888 888 888    
// Y88b  d88P 888 d88P 888 888 Y88b.  
//  "Y8888P"  88888P"  888 888  "Y888 
//            888                     
//			  888                     
// 			  888                     
class Split extends Perk{
	first(){
		this.rad = __MINSCALE*4.5
		this.cooldown = __COOLDOWN_LIGHT
	}
	optimalCast(){
		this.aiBuff(true)
	}
	callback(){
		let areaChild = __MINSCALE*__MINSCALE*Math.PI
		for(let ent of getCanvas().ents.slice()){
			if(!ent.isSilicate){continue}
			if(this.team && ent.team && ent.team != this.team){ continue }
			let dist = ent.getPos().dist(cursor()) - ent.getScale().x
			if(dist < this.rad){
				let rad = ent.getScale().x
				let areaCur = rad*rad*Math.PI
				let n = parseInt(areaCur/areaChild)
				n = n > __SPAWNLIMIT*15 ? __SPAWNLIMIT*15 : n
				for(let i = 0; i < n; i++){
					let e = new this.ent()
					e.team = this.team
					e.setScale(vec(__MINSCALE))
					e.setPos(ent.getPos().add(angvecX(360*3/n*i, rad/n*i)))
					e.setColor(ent.getColor())
					e.setOColor(ent.getOColor())
				}
				
				ent.remove()
			}
		}
	}
}

//  .d8888b.                                
// d88P  Y88b                               
// 888    888                               
// 888        888d888 .d88b.  888  888  888 
// 888  88888 888P"  d88""88b 888  888  888 
// 888    888 888    888  888 888  888  888 
// Y88b  d88P 888    Y88..88P Y88b 888 d88P 
//  "Y8888P88 888     "Y88P"   "Y8888888P"  
class Grow extends Perk{
	first(){
		this.rad = __MINSCALE*4
		this.cooldown = __COOLDOWN_HARD
	}
	optimalCast(){
		this.aiBuff(true)
	}
	callback(){
		for(let ent of getCanvas().ents.slice()){
			if(!ent.isSilicate){continue}
			if(this.team && ent.team && ent.team != this.team){ continue }
			let dist = ent.getPos().dist(cursor()) - ent.getScale().x
			if(dist < this.rad){
				let scl = ent.getScale().add(this.disperce(__MINSCALE/4, __MINSCALE/2)).x
				scl = scl > __MAXSCALE ? __MAXSCALE : scl
				ent.setScale(vec(scl))
			}
		}
	}
}

// 8888888888                   888               888          
// 888                          888               888          
// 888                          888               888          
// 8888888    888  888 88888b.  888  .d88b.   .d88888  .d88b.  
// 888        `Y8bd8P' 888 "88b 888 d88""88b d88" 888 d8P  Y8b 
// 888          X88K   888  888 888 888  888 888  888 88888888 
// 888        .d8""8b. 888 d88P 888 Y88..88P Y88b 888 Y8b.     
// 8888888888 888  888 88888P"  888  "Y88P"   "Y88888  "Y8888  
//                     888                                     
//                     888                                     
//                     888                                     
class Explode extends Perk {
	first(){
		this.rad = __MINSCALE*3.3
		this.cooldown = __COOLDOWN_LIGHT
	}
	optimalCast(){
		this.aiBuff()
	}
	callback() {
		for(let ent of getCanvas().ents.slice()){
			if(!ent.isSilicate){continue}
			if(this.team && ent.team && ent.team != this.team){ continue }
			let dist = ent.getPos().dist(cursor()) - ent.getScale().x
			if(dist < this.rad){
				ent.setVel(ent.getPos().sub(cursor()).ort().mul(this.disperce(10, 20)))
			}
		}
	}
}

// 8888888b.                         888 
// 888   Y88b                        888 
// 888    888                        888 
// 888   d88P  8888b.  88888b.   .d88888 
// 8888888P"      "88b 888 "88b d88" 888 
// 888 T88b   .d888888 888  888 888  888 
// 888  T88b  888  888 888  888 Y88b 888 
// 888   T88b "Y888888 888  888  "Y88888 
class Randomize extends Perk {
	first(){
		this.rad = __MINSCALE*4
		this.cooldown = __COOLDOWN_HARD
	}
	optimalCast(){
		this.aiBuff()
	}
	callback() {
		let min = getRes().x
		let max = 0
		for(let ent of getCanvas().ents.slice()){
			if(!ent.isSilicate){continue}
			if(this.team && ent.team && ent.team != this.team){ continue }
			let dist = ent.getPos().dist(cursor()) - ent.getScale().x
			if(dist < this.rad){
				if(ent.getScale().x > max){max = ent.getScale().x}
				if(ent.getScale().x < min){min = ent.getScale().x}
			}
		}
		for(let ent of getCanvas().ents.slice()){
			if(!ent.isSilicate){continue}
			if(this.team && ent.team && ent.team != this.team){ continue }
			let dist = ent.getPos().dist(cursor()) - ent.getScale().x
			if(dist < this.rad){
				ent.setScale(vec(random(min, max)))
			}
		}
	}
}

// 888888                                 
//   "88b                                 
//    888                                 
//    888 888  888 88888b.d88b.  88888b.  
//    888 888  888 888 "888 "88b 888 "88b 
//    888 888  888 888  888  888 888  888 
//    88P Y88b 888 888  888  888 888 d88P 
//    888  "Y88888 888  888  888 88888P"  
//  .d88P                        888      
//.d88P"                         888      
//88P"                           888      
class Jump extends Perk {
	first(){
		this.rad = __MINSCALE*5
		this.cooldown = __COOLDOWN_LIGHT
	}
	optimalCast(){
		this.aiBuff()
	}
	callback() {
		let i = 0
		for(let ent of getCanvas().ents.slice()){
			if(!ent.isSilicate){continue}
			if(this.team && ent.team && ent.team != this.team){ continue }
			let dist = ent.getPos().dist(cursor()) - ent.getScale().x
			if(dist < this.rad){
				i += 1
				setTimeout(()=>{
					ent.setVel(vec(0, -20).add(randvecX(random(5))))
				}, i * 50)
			}
		}
	}
}

// .d8888b.                                  
// d88P  Y88b                                 
// Y88b.                                      
// "Y888b.   888  888  888  8888b.  88888b.  
//    "Y88b. 888  888  888     "88b 888 "88b 
// 	 	"888 888  888  888 .d888888 888  888 
// Y88b  d88P Y88b 888 d88P 888  888 888 d88P 
// "Y8888P"   "Y8888888P"  "Y888888 88888P"  
// 	  								888      
//  								888      
//  								888      
class Swap extends Perk {
	first(){
		this.rad = __MINSCALE*10
		this.cooldown = __COOLDOWN_MID
	}
	optimalCast(){
		this.aiBuff()
	}
	callback() {
		let arr = []
		for(let ent of getCanvas().ents.slice()){
			if(!ent.isSilicate){continue}
			if(this.team && ent.team && ent.team != this.team){ continue }
			let dist = ent.getPos().dist(cursor()) - ent.getScale().x
			if(dist < this.rad){
				arr.push(ent)
			}
		}
		
		for (var i = 0; i < arr.length/2; i++){
			let j = arr.length-i-1
			let temp = arr[i].getPos()
			arr[i].setPos(arr[j].getPos())
			arr[j].setPos(temp)
		}
	}
}

// 888     888          d8b                   
// 888     888          Y8P                   
// 888     888                                
// 888     888 88888b.  888  .d88b.  88888b.  
// 888     888 888 "88b 888 d88""88b 888 "88b 
// 888     888 888  888 888 888  888 888  888 
// Y88b. .d88P 888  888 888 Y88..88P 888  888 
//  "Y88888P"  888  888 888  "Y88P"  888  888 
class Union extends Perk {
	first(){
		this.rad = __MINSCALE*4
		this.cooldown = __COOLDOWN_HARD
	}
	optimalCast(){
		this.aiBuff()
	}
	callback() {
		let scl = 0
		let pos = vec(0)
		let cnt = 0
		for(let ent of getCanvas().ents.slice()){
			if(!ent.isSilicate){continue}
			if(this.team && ent.team && ent.team != this.team){ continue }
			let dist = ent.getPos().dist(cursor()) - ent.getScale().x
			if(dist < this.rad){
				pos = pos.add(ent.getPos())
				scl += ent.getScale().x*ent.getScale().x
				cnt += 1
				ent.remove()
			}
		}
		if(cnt){
			let e = new this.ent()
			e.team = this.team
			e.setPos(pos.div(cnt))
			scl = Math.sqrt(scl)
			scl = scl > __MAXSCALE ? __MAXSCALE : scl
			e.setScale(vec(scl))
		}
	}
}

// .d8888b.           d8b          
// d88P  Y88b          Y8P          
// Y88b.                            
// "Y888b.   88888b.  888 88888b.  
//    "Y88b. 888 "88b 888 888 "88b 
// 	    "888 888  888 888 888  888 
//Y88b  d88P 888 d88P 888 888  888 
// "Y8888P"  88888P"  888 888  888 
//  		 888                   
// 		     888                   
// 		     888                   
class Spin extends Perk {
	first(){
		this.rad = __MINSCALE*3
		this.cooldown = __COOLDOWN_LIGHT
	}
	optimalCast(){
		this.aiBuff(true)
	}
	callback() {
		let avel = this.disperce(0.5, 2)
		for(let ent of getCanvas().ents.slice()){
			if(!ent.isSilicate){continue}
			if(this.team && ent.team && ent.team != this.team){ continue }
			let dist = ent.getPos().dist(cursor()) - ent.getScale().x
			if(dist < this.rad){
				ent.setAngVel(randelt([-avel, avel]))
			}
		}
	}
}

// 888                       d8b 
// 888                       Y8P 
// 888                           
// 888      .d88b.  888  888 888 
// 888     d8P  Y8b 888  888 888 
// 888     88888888 Y88  88P 888 
// 888     Y8b.      Y8bd8P  888 
// 88888888 "Y8888    Y88P   888 
class Levi extends Perk{
	first(){
		this.rad = __MINSCALE*5
		this.cooldown = __COOLDOWN_LIGHT
	}
	optimalCast(){
		this.aiBuff()
	}
	callback(){
		for(let ent of getCanvas().ents.slice()){
			if(!ent.isSilicate){continue}
			if(this.team && ent.team && ent.team != this.team){ continue }
			let dist = ent.getPos().dist(cursor()) - ent.getScale().x
			if(dist < this.rad){
				getCanvas().engine.gravity.scale = 0
				let mass = ent.getMass()
				ent.setMass(0.123456789)
				ent.setVel(ent.getPos().sub(cursor()).ort().mul(3))
				setTimeout(()=>{
					getCanvas().engine.gravity.scale = 0.001
					ent.setMass(mass)
				}, this.disperce(2000, 5000))
			}
		}
	}
}

// 888888          888                       
//   "88b          888                       
//    888          888                       
//    888  .d88b.  888  888  .d88b.  888d888 
//    888 d88""88b 888 .88P d8P  Y8b 888P"   
//    888 888  888 888888K  88888888 888     
//    88P Y88..88P 888 "88b Y8b.     888     
//    888  "Y88P"  888  888  "Y8888  888     
//  .d88P                                    
// .d88P"                                     
// 888P"                                       
class Joker extends Perk{
	first(){
		this.rad = __MINSCALE*2.5
		this.cooldown = __COOLDOWN_ELITE
	}
	optimalCast(){
		this.aiDeBuff(true)
	}
	callback() {
		let aClass = null
		let bClass = null
		let aTeam = null
		let bTeam = null
		
		for(let perk of getCanvas().perks){
			if(!aClass){
				aClass = perk.ent
				aTeam = perk.team
			}
			else if(!bClass && perk.ent != aClass){
				bClass = perk.ent
				bTeam = perk.team
			}
		}
		
		for(let ent of getCanvas().ents.slice()){
			if(!ent.isSilicate){continue}
			let dist = ent.getPos().dist(cursor()) - ent.getScale().x
			if(dist < this.rad){
				let toggle = ent.team == aTeam
				let e = toggle ? new bClass() : new aClass()
				e.team = toggle ? bTeam : aTeam
				e.setPos(ent.getPos())
				e.setScale(ent.getScale())
				e.setAng(ent.getAng())
				ent.remove()
			}
		}
	}
}

//  .d8888b.  888                                      888 
// d88P  Y88b 888                                      888 
// 888    888 888                                      888 
// 888        88888b.   8888b.  88888b.d88b.   .d88b.  888 
// 888        888 "88b     "88b 888 "888 "88b d8P  Y8b 888 
// 888    888 888  888 .d888888 888  888  888 88888888 888 
// Y88b  d88P 888  888 888  888 888  888  888 Y8b.     888 
//  "Y8888P"  888  888 "Y888888 888  888  888  "Y8888  888 
class Chameleon extends Perk {
	first(){
		this.rad = __MINSCALE*5
		this.cooldown = __COOLDOWN_LIGHT
	}
	optimalCast(){
		this.aiBuff()
	}
	callback() {
		let i = 0
		for(let ent of getCanvas().ents.slice()){
			if(!ent.isSilicate){continue}
			if(this.team && ent.team && ent.team != this.team){ continue }
			let dist = ent.getPos().dist(cursor()) - ent.getScale().x
			if(dist < this.rad){
				let e = ent
				e.setColor(ent.getColor().setA(0.25))
				e.setOColor(ent.getOColor().setA(0.25))
				setTimeout(()=>{
					console.log(e.getColor());
					e.setColor(ent.getColor().setA(1))
					e.setOColor(ent.getOColor().setA(1))
				}, this.disperce(1000, 5000));
			}
		}
	}
}


// 8888888b.  d8b          888    
// 888  "Y88b Y8P          888    
// 888    888              888    
// 888    888 888  .d8888b 888888 
// 888    888 888 d88P"    888    
// 888    888 888 888      888    
// 888  .d88P 888 Y88b.    Y88b.  
// 8888888P"  888  "Y8888P  "Y888 
function perkDict(name){
	let dict = {		
		'Explode': Explode,
		'Grow': Grow,
		'Jump': Jump,
		'Levi': Levi,
		'Randomize': Randomize,
		'Reproduce': Reproduce,
		'SpawnBig': SpawnBig,
		'SpawnSome': SpawnSome,
		'Spin': Spin,
		'Split': Split,
		'Swap': Swap,
		'Union': Union,
		'Joker': Joker,
		'Chameleon': Chameleon,
	}
	return new dict[name]()
}












