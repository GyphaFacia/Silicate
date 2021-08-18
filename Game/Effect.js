class Effect{
    constructor(){
        this.pos = vec()
        this.scale = vec(1)
        this.ang = 0
        this.vel = randvec(0.25)
        this.mass = 1
        this.color = '#000'
        // this.ocolor = '#fff'
        // this.width = 1
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
        this.motionUpdate()
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
    // motion
    // // // // // // // // // // // // // // // // // // // // // // // // // 
    motionUpdate(){
        this.setPos(this.getPos().add(this.vel))
        this.vel = this.vel.mul(1 - this.friction)
        
        let ep = vec(0.5, -1).mul(getRes())
        let dir = ep.sub(this.getPos())
        let dist = ep.dist(this.getPos())/2
        let av = dir.div(dist*dist)
        this.vel = this.vel.add(av)
    }
}

















