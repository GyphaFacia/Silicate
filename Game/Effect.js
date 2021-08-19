class Effect{
    constructor(){
        this.pos = vec()
        this.scale = vec(2)
        this.ang = 0
        this.vel = vec()
        this.friction = 0.01
        this.mass = -1

        this.color = '#000'
        // this.ocolor = '#f05'
        // this.width = 0.5
        
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
    setVel(){this.vel = vec(...arguments)}
    
    getPos(){return this.pos}
    getScale(){return this.scale}
    getAng(){return this.ang}
    getVel(){return this.vel}
        
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
        this.setPos(this.getPos().add(this.vel))
        this.setVel(this.getVel().mul(1 - this.friction))
        this.setVel(this.getVel().add(0, this.mass * 0.02))
    }
    
}
















