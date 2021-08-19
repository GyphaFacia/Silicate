class Effect{
    constructor(){
        this.pos = vec()
        this.scale = vec(random(1, 2))
        this.ang = 0

        this.color = '#000'
        this.ocolor = '#f05'
        this.width = 0.5
        this.friction = 0.01
        
        this.r = Math.random()
        
        this.layer = this.getDefaultLayer()
        this.cnv = this.layer.cnv
        this.ctx = this.layer.ctx
        this.getDefaultLayer().ents.push(this)
    }
    
    getDefaultLayer(){return LAYERS.effects}
    
    beforeDraw(){}
    afterDraw(){}
    first(){}
    second(){}
    last(){}
    
    // // // // // // // // // // // // // // // // // // // // // // // // // 
    // transform
    // // // // // // // // // // // // // // // // // // // // // // // // // 
    setPos(){this.pos = vec(...arguments)}
    setScale(){this.scale = vec(...arguments)}
    setAng(ang){this.ang = ang!=undefined ? ang : 0}
    
    getPos(){return this.pos}
    getScale(){return this.scale}
    getAng(){return this.ang}
        
    update(){
        this.gasMotion()
        this.deleteOOB()
    }
    
    remove(wlast = false){
        if(wlast){
            this.last()
        }

        for(let i = 0; i < this.layer.ents.length; i++){
            if(this.layer.ents[i].r == this.r){
                this.layer.ents.splice(i, 1)
                break
            }
        }
    }
    
    // // // // // // // // // // // // // // // // // // // // // // // // // 
    // draw
    // // // // // // // // // // // // // // // // // // // // // // // // // 
    drawStart(){
        this.ctx.save()
        this.ctx.beginPath()
        this.ctx.translate(...this.getPos().arr)
        this.ctx.rotate((this.getAng())/180*Math.PI)
        this.ctx.filter = this.filter ? this.filter : 'none'
    }

    drawEnd(){
        this.ctx.closePath()
        this.fill()
        this.ctx.restore()
    }

    fill(){
        this.ctx.fillStyle = this.color ? this.color : 'transparent'
        this.ctx.lineWidth = this.width ? this.width : 0
        this.ctx.strokeStyle = this.ocolor ? this.ocolor : 'transparent'
        this.ctx.stroke()
        this.ctx.fill()
    }

    draw(){
        this.drawStart()

        this.ctx.arc(0, 0, this.getScale().x, 0, 2*pi)

        this.drawEnd()
    }
    
    // // // // // // // // // // // // // // // // // // // // // // // // // 
    // misc
    // // // // // // // // // // // // // // // // // // // // // // // // // 
    deleteOOB(){
        let {x, y} = this.getPos()
        if(x < 0){this.remove()}
        if(y < 0){this.remove()}
        if(x > getRes().x){this.remove()}
        if(y > getRes().y){this.remove()}
    }
    
    gasMotion(){
        let r = this.r
        let ra = Math.sqrt(r)
        let hor = sin(time()/(1+r*5))
        let vert = (ra*5 + 2)/7
        
        let v = vec(hor/2, vert)
        this.pos = this.pos.sub(v)
    }
    
}

function gas(pos, cnt){
    for(let i = 0; i < cnt; i++){
        let e = new Effect()
        e.setPos(pos)
        e.update = function(){
            this.gasMotion()
            this.deleteOOB()
        }
    }
}















