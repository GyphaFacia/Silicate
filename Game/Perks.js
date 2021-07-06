class Perk {
    constructor(lvl = 1){
        PERKS.push(this)
        this.active = false
        
        this.team = 0
        this.cooldown = 500
        this.rad = 100
        
        this.level = lvl
        
        this.first()
        this.second()
    }
    
    get level(){return this._level}
    set level(lvl){this._level = lvl}
    
    first(){}
    second(){}
    
    disperce(min = 5, max = 10){
        return parseInt(min + (max - min)/4*(this.level - 1))
    }
    
    get name(){return this.constructor.name}
    set active(act){
        if(this.ico){
            if(act){
                this.btn.classList.add('perk--active')
            }
            else{
                this.btn.classList.remove('perk--active')
            }
        }
        this._active = act
    }
    
    get active(){return this._active}
    
    callback(){}
    
    pick(){
        for(let perk of PERKS){perk.cancel()}
        this.active = true
        console.log('picked');
    }
    cancel(){
        this.active = false
        console.log('canceled');
    }
    apply(){
        if(this.active){
            this.active = false
            this.callback()
            console.log('applied');
            
            this.cd = time()
        }
    }
    
    applyAt(){
        let cursorBackup = cursor()
        
        window.mousePos = vec(e.targetY, e.clientY)
        this.apply()
        
        setTimeout(()=>{
            window.mousePos = cursorBackup
        }, 0)
    }
    
    render(){
        let sect = document.querySelector('.perks')

        this.btn = sect.addElement('perk', 'div')
        
        this.ico = this.btn.addElement('perk-img', 'img')
        this.ico.src = `./src/Perks/${this.name}.svg` 
        
        this.clip = this.btn.addElement('perk-clip', 'div')
        
        this.bind()
    }
    
    bind(){
        this.ico.ondragstart = (e)=>{
			e.dataTransfer.setDragImage(e.target, window.outerWidth*2, window.outerHeight*2)
			this.pick()
        }
        
        this.ico.ondragend = (e)=>{
            this.apply()
		}
        
        document.ondragover = (e)=>{
            window.mousePos = vec(e.clientX, e.clientY)
        }
        
        document.oncontextmenu = (e)=>{
			e.preventDefault()
			for(let perk of PERKS){perk.cancel()}
		}
        
        document.onkeyup = (e)=>{
            // let perks = PERKS.filter(perk => perk.team == this.team)
            let perks = PERKS
			for(let i = 0; i < perks.length; i++){
				let perk = perks[i]
				if(parseInt(e.key)-1 == i){
					perk.pick()
					cnv.onclick = (e)=>{
						perk.apply()
					}
				}
			}
		}
    }
    
    handleClip(){
        if(!this.btn){return null}
        if(this.cd){
            let perc = (time() - this.cd)/this.cooldown*1000
            if(perc > 1){this.cd = 0}
            
            let clipY = perc
            clipY *= 100
            this.clip.style.clip = `rect(${clipY}px, auto, 100px, auto)`
        }
        else{
            this.clip.style.clip = `rect(${100}px, auto, 100px, auto)`
        }
    }
    
    draw(){
        this.handleClip()
        
        if(!this.active){ return null }
        
        let n = 3
        for(let i = 0; i < n; i++){
            ctx.strokeStyle = '#aaaa'
            ctx.lineWidth = 3
            
            for(let j = 0; j < 2; j++){
                ctx.beginPath()
                let ang1 = 2*pi()/n*i + time(2)%(2*pi())*(j ? 1 : -1)
                let ang2 = ang1 + 2*pi()/n*0.75
                ctx.arc(...cursor().$, this.rad - (j ? 0 : 10), ang1, ang2)
                ctx.stroke()
            }
        }
    }
    
    alliesInRad(){
        let arr = ENTITIES.filter(ent => ent.team == this.team)
        arr = arr.filter(
            ent => ent.getPos().sub(cursor()).len < this.rad + ent.getScale().x
        )
        return arr
    }
    
    enemiesInRad(){
        let arr = ENTITIES.filter(ent => ent.team != this.team)
        arr = arr.filter(
            ent => ent.getPos().sub(cursor()).len < this.rad + ent.getScale().x
        )
        return arr
    }
    
    allInRad(){
        let arr = ENTITIES.filter(
            ent => ent.getPos().sub(cursor()).len < this.rad + ent.getScale().x
        )
        return arr
    }
}

class SpawnSome extends Perk {
    callback(){
        let n = this.disperce(3, 6)
        let rad = n * 5
        for(let i = 0; i < n; i++){
            let pos = cursor().add(sin(360/n*i)*rad, cos(360/n*i)*rad)
            let e = this.ply.spawnSilicate(pos)
        }
    }
    
    get level(){return this._level}
    set level(lvl){
        this._level = lvl
        this.rad = 100
        this.cooldown = 500
    }
}

class SpawnBig extends Perk {
    callback(){
        let e = this.ply.spawnSilicate(cursor())
        e.setScale(e.getScale().mul(this.disperce(2, 4)))
    }
    
    get level(){return this._level}
    set level(lvl){
        this._level = lvl
        this.rad = 100
        this.cooldown = 500
    }
}

class Explode extends Perk{
    callback(){
        for(let ent of this.alliesInRad()){
            ent.setVel(ent.getPos().sub(cursor()).ort.mul(this.disperce(10, 20)))
        }
    }
    
    get level(){return this._level}
    set level(lvl){
        this._level = lvl
        this.rad = 100
        this.cooldown = 500
    }
}

class Grow extends Perk {
    callback(){
        for(let ent of this.alliesInRad()){
            ent.scaleTo(ent.getScale().add(this.disperce(5, 10)))
        }
    }
    
    get level(){return this._level}
    set level(lvl){
        this._level = lvl
        this.rad = 100
        this.cooldown = 500
    }
}

class Joker extends Perk{
    callback(){
        for(let ent of this.enemiesInRad()){
            let e = this.ply.spawnSilicate(cursor())
            e.setPos(ent.getPos())
            e.setScale(ent.getScale())
            e.setAng(ent.getAng())
            e.setVel(ent.getVel())
            ent.remove()
        }
    }
    
    get level(){return this._level}
    set level(lvl){
        this._level = lvl
        this.rad = 100
        this.cooldown = 500
    }
}

class Jump extends Perk{
    callback(){
        let i = 0
        for(let ent of this.alliesInRad()){
            i++
            setTimeout(()=>{
                ent.setVel(random(-1, 1)*2, -random(this.disperce(15, 25)))
            }, i*50)
        }
    }
    
    get level(){return this._level}
    set level(lvl){
        this._level = lvl
        this.rad = 100
        this.cooldown = 500
    }
}

class Kill extends Perk{
    callback(){
        for(let ent of this.enemiesInRad()){
            setTimeout(()=>{
                if(random() > this.disperce(0.9, 0.5)){
                    ent.remove()
                }
            }, random(1000))
        }
    }
    
    get level(){return this._level}
    set level(lvl){
        this._level = lvl
        this.rad = 100
        this.cooldown = 500
    }
}

class Levi extends Perk{
    callback(){
        for(let ent of this.alliesInRad()){
            let mass = ent.getMass()
            ent.setMass(0.123456789)
            setTimeout(()=>{
                ent.setVel(random(-1, 1), -random(5))
            }, random(1000))
            
            setTimeout(()=>{
                ent.setMass(mass)
            }, this.disperce(3000, 5000))
        }
        engine.gravity.scale = 0
        setTimeout(()=>{
            engine.gravity.scale = 0.001
        }, this.disperce(3000, 5000))
    }
    
    get level(){return this._level}
    set level(lvl){
        this._level = lvl
        this.rad = 100
        this.cooldown = 500
    }
}

class Randomize extends Perk {
    callback(){
        let arr = this.alliesInRad()
        let min = arr[0].getScale().x
        let max = arr[0].getScale().x
        for(let ent of arr){
            if(ent.getScale().x > max){max = ent.getScale().x}
            if(ent.getScale().x < min){min = ent.getScale().x}
        }
        
        for(let ent of arr){
            ent.scaleTo(vec(random(min, max)))
        }
    }
    
    get level(){return this._level}
    set level(lvl){
        this._level = lvl
        this.rad = 100
        this.cooldown = 500
    }
}

class Reproduce extends Perk {
    callback(){
        for(let ent of this.alliesInRad()){
            let sclTo = ent.getScale()
            let child = this.ply.spawnSilicate()
            child.setScale(1)
            child.setPos(ent.getPos())
            
            child.scaleTo(ent.getScale())
        }
    }
    
    get level(){return this._level}
    set level(lvl){
        this._level = lvl
        this.rad = 100
        this.cooldown = 500
    }
}

class Spin extends Perk {
    callback(){
        for(let ent of this.alliesInRad()){
            setTimeout(()=>{
                ent.setAngVel(this.disperce(3, 5) * randelt([1, -1]))
            }, random(100))
        }
    }
    
    get level(){return this._level}
    set level(lvl){
        this._level = lvl
        this.rad = 100
        this.cooldown = 500
    }
}

class Split extends Perk {
    callback(){
        let areaSmall = __MINSCALE*__MINSCALE*pi()
        for(let ent of this.alliesInRad()){
            let area = ent.getScale().x
            area = area*area*pi()/2
            let n = area / areaSmall
            for(let i = 0; i < n; i++){
                let child = this.ply.spawnSilicate()
                let v = vec(sin(360*3/n*i), cos(360*3/n*i))
                v = v.mul(ent.getScale().x/n*i)
                v = v.add(ent.getPos())
                child.setPos(v)
                child.setScale(__MINSCALE)
            }
            ent.remove()
        }
    }
    
    get level(){return this._level}
    set level(lvl){
        this._level = lvl
        this.rad = 100
        this.cooldown = 500
    }
}

class Swap extends Perk {
    callback(){
        for(let ent of this.alliesInRad()){
            let v = cursor().sub(ent.getPos()).mul(2, 0)
            v = ent.getPos().add(v)
            // ent.setPos(v)
            ent.moveTo(v)
        }
    }
    
    get level(){return this._level}
    set level(lvl){
        this._level = lvl
        this.rad = 100
        this.cooldown = 500
    }
}

class Union extends Perk {
    callback(){
        let area = 0
        let pos = vec()
        let cnt = this.alliesInRad().length
        for(let ent of this.alliesInRad()){
            area += ent.getScale().x * ent.getScale().x
            pos = pos.add(ent.getPos())
            ent.remove()
        }
        pos = pos.div(cnt)        
        let union = this.ply.spawnSilicate(pos)
        union.setScale(Math.sqrt(area))
    }
    
    get level(){return this._level}
    set level(lvl){
        this._level = lvl
        this.rad = 100
        this.cooldown = 500
    }
} 
























