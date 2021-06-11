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
		this.cooldown = cooldown == null ? 100 : rad
		
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
		cd = cd ? cd : this.cooldown
		this.oncooldown = time() + this.cooldown/1000
		
		if(!this.rendered){return null}
		
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
	
	// Для интерфейсов врагов. Применить скилл в точке
	applyAt(pos = null){
		if(this.oncooldown){ return null }
		pos = pos == null ? getRes().mul(0.5, 0.1) : pos
		let bup = cursor()
		getCanvas().cursor = pos
		this.callback(this)
		getCanvas().cursor = bup
		this.setCooldown()
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
}

class Levi extends Perk{
	first(){
		this.rad = __MINSCALE*5
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

class SpawnSome extends Perk{
	first(){
		this.rad = __MINSCALE*2.5
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

class SpawnBig extends Perk{
	first(){
		this.rad = __MINSCALE*3
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

class Split extends Perk{
	first(){
		this.rad = __MINSCALE*4.5
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

class Grow extends Perk{
	first(){
		this.rad = __MINSCALE*4
	}
	callback(){
		for(let ent of getCanvas().ents.slice()){
			if(!ent.isSilicate){continue}
			if(this.team && ent.team && ent.team != this.team){ continue }
			let dist = ent.getPos().dist(cursor()) - ent.getScale().x
			if(dist < this.rad){
				ent.setScale(ent.getScale().add(this.disperce(__MINSCALE/4, __MINSCALE/2)))
			}
		}
	}
}

class Explode extends Perk {
	first(){
		this.rad = __MINSCALE*3.3
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

class Randomize extends Perk {
	first(){
		this.rad = __MINSCALE*4
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

class Jump extends Perk {
	first(){
		this.rad = __MINSCALE*5
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

class Swap extends Perk {
	first(){
		this.rad = __MINSCALE*10
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

class Union extends Perk {
	first(){
		this.rad = __MINSCALE*4
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
			e.setScale(vec(scl))
		}
	}
}

class Spin extends Perk {
	first(){
		this.rad = __MINSCALE*3
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

class Joker extends Perk{
	first(){
		this.rad = __MINSCALE*2.5
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
	}
	return new dict[name]()
}












