// 8888888b.                  888               
// 888   Y88b                 888               
// 888    888                 888               
// 888   d88P .d88b.  888d888 888  888 .d8888b  
// 8888888P" d8P  Y8b 888P"   888 .88P 88K      
// 888       88888888 888     888888K  "Y8888b. 
// 888       Y8b.     888     888 "88b      X88 
// 888        "Y8888  888     888  888  88888P' 
class Perk {
	constructor(name, callback, ent = Silicate, rad = 100, cooldown = 1, level = 1, render = 0){
		this.parent = getCanvas()
		this.ctx = this.parent.ctx
		if(!this.parent.perks){
			this.parent.perks = []
		}
		this.parent.perks.push(this)
		
		this.name = name
		this.setEntity(ent)
		this.setCallback(callback)
		
		this.rad = rad
		this.level = level
		this.cooldown = cooldown
		
		this.rendered = false
		this.active = false
		this.oncooldown = 0
		this.team = 0
		
		if(render){	this.render() }
	}
	// Класс энтити с которыми работает этот перк
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
	
	setCallback(callback){
		this.callback = callback
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





// 8888888888                888                             
// 888                       888                             
// 888                       888                             
// 8888888  8888b.   .d8888b 888888 .d88b.  888d888 888  888 
// 888         "88b d88P"    888   d88""88b 888P"   888  888 
// 888     .d888888 888      888   888  888 888     888  888 
// 888     888  888 Y88b.    Y88b. Y88..88P 888     Y88b 888 
// 888     "Y888888  "Y8888P  "Y888 "Y88P"  888      "Y88888 
//                                                       888 
//                                                  Y8b d88P 
//                                                   "Y88P"  
function getPerk(name){
	if(name=='Levi'){
		return new Perk('Levi', (perk)=>{
			for(let ent of getCanvas().ents.slice()){
				if(!ent.isSilicate){continue}
				if(perk.team && ent.team && ent.team != perk.team){ continue }
				let dist = ent.getPos().dist(cursor()) - ent.getScale().x
				if(dist < perk.rad){
					getCanvas().engine.gravity.scale = 0
					let mass = ent.getMass()
					ent.setMass(0.123456789)
					ent.setVel(ent.getPos().sub(cursor()).ort().mul(3))
					setTimeout(()=>{
						getCanvas().engine.gravity.scale = 0.001
						ent.setMass(mass)
					}, perk.disperce(2000, 5000))
				}
			}
		}, Silicate, __MINSCALE*5, 1, 5)
	}
	
	if(name=='SpawnSome'){
		return new Perk('SpawnSome', (perk)=>{
			let cnt = perk.disperce(1, 7)
			for(let i = 0; i < cnt; i++){
				let e = new perk.ent()
				e.team = perk.team
				e.setPos(cursor().add(angvecX(360/cnt*i+time(100), perk.rad*(cnt > 1))))
			}
		}, Silicate, __MINSCALE*2.5, 1, 5)
	}
	
	if(name=='SpawnBig'){
		return	new Perk('SpawnBig', (perk)=>{
			let e = new perk.ent()
			e.team = perk.team
			e.setPos(cursor())
			e.setScale(vec(perk.disperce(__MINSCALE*2, __MINSCALE*5)))
		}, Silicate, __MINSCALE*3, 1, 5)
	}
	
	if(name=='Reproduce'){
		return new Perk('Reproduce', (perk)=>{
			let i = 0
			for(let ent of getCanvas().ents.slice()){
				if(!ent.isSilicate){continue}
				if(perk.team && ent.team && ent.team != perk.team){ continue }
				let dist = ent.getPos().dist(cursor()) - ent.getScale().x
				if(dist < perk.rad){
					let e = new perk.ent()
					e.team = perk.team
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
		}, Silicate, __MINSCALE*4.5, 1, 5)
	}
	
	if(name=='Split'){
		return new Perk('Split', (perk)=>{
			let areaChild = __MINSCALE*__MINSCALE*Math.PI
			for(let ent of getCanvas().ents.slice()){
				if(!ent.isSilicate){continue}
				if(perk.team && ent.team && ent.team != perk.team){ continue }
				let dist = ent.getPos().dist(cursor()) - ent.getScale().x
				if(dist < perk.rad){
					let rad = ent.getScale().x
					let areaCur = rad*rad*Math.PI
					let n = parseInt(areaCur/areaChild)
					n = n > __SPAWNLIMIT*15 ? __SPAWNLIMIT*15 : n
					for(let i = 0; i < n; i++){
						let e = new perk.ent()
						e.team = perk.team
						e.setScale(vec(__MINSCALE))
						e.setPos(ent.getPos().add(angvecX(360*3/n*i, rad/n*i)))
						e.setColor(ent.getColor())
						e.setOColor(ent.getOColor())
					}
					
					ent.remove()
				}
			}
		}, Silicate, __MINSCALE*4.5, 1, 5)
	}
	
	if(name=='Grow'){
		return new Perk('Grow', (perk)=>{
			for(let ent of getCanvas().ents.slice()){
				if(!ent.isSilicate){continue}
				if(perk.team && ent.team && ent.team != perk.team){ continue }
				let dist = ent.getPos().dist(cursor()) - ent.getScale().x
				if(dist < perk.rad){
					ent.setScale(ent.getScale().add(perk.disperce(__MINSCALE/4, __MINSCALE/2)))
				}
			}
		}, Silicate, __MINSCALE*4, 1, 5)
	}
	
	if(name=='Explode'){
		return new Perk('Explode', (perk)=>{
			for(let ent of getCanvas().ents.slice()){
				if(!ent.isSilicate){continue}
				if(perk.team && ent.team && ent.team != perk.team){ continue }
				let dist = ent.getPos().dist(cursor()) - ent.getScale().x
				if(dist < perk.rad){
					ent.setVel(ent.getPos().sub(cursor()).ort().mul(perk.disperce(10, 20)))
				}
			}
		}, Silicate, __MINSCALE*3.3, 1, 5)
	}
	
	if(name=='Randomize'){
		return new Perk('Randomize', (perk)=>{
			let min = getRes().x
			let max = 0
			for(let ent of getCanvas().ents.slice()){
				if(!ent.isSilicate){continue}
				if(perk.team && ent.team && ent.team != perk.team){ continue }
				let dist = ent.getPos().dist(cursor()) - ent.getScale().x
				if(dist < perk.rad){
					if(ent.getScale().x > max){max = ent.getScale().x}
					if(ent.getScale().x < min){min = ent.getScale().x}
				}
			}
			for(let ent of getCanvas().ents.slice()){
				if(!ent.isSilicate){continue}
				if(perk.team && ent.team && ent.team != perk.team){ continue }
				let dist = ent.getPos().dist(cursor()) - ent.getScale().x
				if(dist < perk.rad){
					ent.setScale(vec(random(min, max)))
				}
			}
			
		}, Silicate, __MINSCALE*4, 1, 5)
	}
	
	if(name=='Jump'){
		return new Perk('Jump', (perk)=>{
			let i = 0
			for(let ent of getCanvas().ents.slice()){
				if(!ent.isSilicate){continue}
				if(perk.team && ent.team && ent.team != perk.team){ continue }
				let dist = ent.getPos().dist(cursor()) - ent.getScale().x
				if(dist < perk.rad){
					i += 1
					setTimeout(()=>{
						ent.setVel(vec(0, -20).add(randvecX(random(5))))
					}, i * 50)
				}
			}
		}, Silicate, __MINSCALE*5, 1, 5)
	}
	
	if(name=='Swap'){
		return new Perk('Swap', (perk)=>{
			let arr = []
			for(let ent of getCanvas().ents.slice()){
				if(!ent.isSilicate){continue}
				if(perk.team && ent.team && ent.team != perk.team){ continue }
				let dist = ent.getPos().dist(cursor()) - ent.getScale().x
				if(dist < perk.rad){
					arr.push(ent)
				}
			}
			
			for (var i = 0; i < arr.length/2; i++){
				let j = arr.length-i-1
				let temp = arr[i].getPos()
				arr[i].setPos(arr[j].getPos())
				arr[j].setPos(temp)
			}
			
		}, Silicate, __MINSCALE*10, 1, 5)
	}
	
	if(name=='Union'){
		return new Perk('Union', (perk)=>{
			let scl = 0
			let pos = vec(0)
			let cnt = 0
			for(let ent of getCanvas().ents.slice()){
				if(!ent.isSilicate){continue}
				if(perk.team && ent.team && ent.team != perk.team){ continue }
				let dist = ent.getPos().dist(cursor()) - ent.getScale().x
				if(dist < perk.rad){
					pos = pos.add(ent.getPos())
					scl += ent.getScale().x*ent.getScale().x
					cnt += 1
					ent.remove()
				}
			}
			if(cnt){
				let e = new perk.ent()
				e.team = perk.team
				e.setPos(pos.div(cnt))
				scl = Math.sqrt(scl)
				e.setScale(vec(scl))
			}
		}, Silicate, __MINSCALE*4, 1, 5)
	}
	
	if(name=='Spin'){
		return new Perk('Spin', (perk)=>{
			let avel = perk.disperce(0.5, 2)
			for(let ent of getCanvas().ents.slice()){
				if(!ent.isSilicate){continue}
				if(perk.team && ent.team && ent.team != perk.team){ continue }
				let dist = ent.getPos().dist(cursor()) - ent.getScale().x
				if(dist < perk.rad){
					ent.setAngVel(randelt([-avel, avel]))
				}
			}
		}, Silicate, __MINSCALE*3, 1, 5)
	}
	
	return new Perk('SpawnSome', (perk)=>{
		let cnt = perk.disperce(1, 7)
		for(let i = 0; i < cnt; i++){
			let e = new perk.ent()
			e.team = perk.team
			e.setPos(cursor().add(angvecX(360/cnt*i+time(100), perk.rad*(cnt > 1))))
		}
	}, Silicate, __MINSCALE*2.5, 1, 5)
}