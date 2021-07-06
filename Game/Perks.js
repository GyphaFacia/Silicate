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
                this.ico.classList.add('perk--active')
            }
            else{
                this.ico.classList.remove('perk--active')
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
        this.active = false
        this.callback()
        console.log('applied');
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
        this.ico = document.querySelector('.perks').addElement('perk', 'img')
        this.ico.src = `./src/Perks/${this.name}.svg` 
        
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
            let perks = PERKS.slice().filter(perk => perk.team == this.team)
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
    
    draw(){
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
        this.rad = 40
        this.cooldown = 50
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
        this.rad = 40
        this.cooldown = 50
    }
}































