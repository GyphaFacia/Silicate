class Perk {
    constructor() {
        PERKS.push(this)
        this.team = 0
        this.cooldow = 1000
        this.active = false
        this.rad = 100
        
        this.first()
        this.second()
    }
    
    first(){}
    second(){}
    
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
                ctx.arc(...cursor().$, this.rad * (j ? 1 : 0.9), ang1, ang2)
                ctx.stroke()
            }
        }
    }
}

class SpawnSome extends Perk {
    callback(){
        this.ply.spawnSilicate()
    }
    
    
}































