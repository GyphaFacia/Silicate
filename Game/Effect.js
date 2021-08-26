// 8888888888  .d888  .d888                  888    
// 888        d88P"  d88P"                   888    
// 888        888    888                     888    
// 8888888    888888 888888 .d88b.   .d8888b 888888 
// 888        888    888   d8P  Y8b d88P"    888    
// 888        888    888   88888888 888      888    
// 888        888    888   Y8b.     Y88b.    Y88b.  
// 8888888888 888    888    "Y8888   "Y8888P  "Y888 
class Effect{
    constructor(){
        this.r = Math.random()
        this.team = 0
        this.color = '#000'
        this.width = 2
        this.ocolor = '#222'
        this.setVertices()

        this.layer = this.getDefaultLayer()
        this.cnv = this.layer.cnv
        this.ctx = this.layer.ctx

        this.first(...arguments)
        this.second(...arguments)
        
        this.pos = vec()
        this.scale = vec(10)
    }

    get type(){return this.constructor.name}

    getDefaultLayer(){
        return GAME.layers.effects
    }
    
    update(){}
    beforeDraw(){}
    afterDraw(){}
    first(){}
    second(){}
    last(){}

    setVertices(sides = 5){
        this.verts = []
        for(let i = 0; i < sides; i++){
            this.verts.push(angvec(360/sides*i))
        }
    }

    update(){
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
        if(this.width){
            this.ctx.stroke()
        }
        this.ctx.fill()
    }

    draw(){
        this.drawStart()
        this.drawByVertices()
        this.drawEnd()
    }
    
    drawByVertices(){
        this.ctx.moveTo(...this.verts[0].arr)
        for (let i = 1; i < this.verts.length; i++) {
            this.ctx.lineTo(...this.verts[i].arr)
        }
    }
    
    drawImg(src, offset = vec(), sclmul = vec()){
        if(!this.img || this.img.src != src){
            this.img = new Image(100, 100)
            this.img.src = src
        }
        let {x, y} = this.getScale().mul(sclmul)
        let [ox, oy] = offset.arr
        
        this.drawStart()    
        this.ctx.drawImage(this.img, -x/2 + ox, -y/2 + oy, x, y)
        this.drawEnd()
    }

    // // // // // // // // // // // // // // // // // // // // // // // // // 
    // transform
    // // // // // // // // // // // // // // // // // // // // // // // // // 
    setPos(){
        this.pos = vec(...arguments)
    }
    
    setAng(){
        this.ang = arguments[0]
    }
    setScale(){
        let scl = vec(...arguments)
        this.scale = scl
        
        let cm = this.verts.reduce((sum, cur)=>sum.add(cur), vec())
        cm = cm.div(this.verts.length)
        this.verts = this.verts.map(v => cm.sub(v).ort.mul(scl))
    }

    getPos(){return this.pos}
    getScale(){return this.scale}
    getAng(){return this.ang}

    // // // // // // // // // // // // // // // // // // // // // // // // // 
    // remove
    // // // // // // // // // // // // // // // // // // // // // // // // // 
    remove(wlast = false){
        if(wlast){
            this.last()
        }
        
        for(let i = 0; i < this.collection.length; i++){
            if(this.collection[i].r == this.r){
                this.collection.splice(i, 1)
                break
            }
        }
    }
    
    killOOB(){
        let {x, y} = this.getPos()
        if(x < 0 || y < 0){
            this.remove()
            return true
        }
        if(x > getRes().x || y > getRes().y){
            this.remove()
            return true
        }
        return false
    }
}