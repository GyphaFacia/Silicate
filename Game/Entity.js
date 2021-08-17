class Entity{
    constructor() {
        let v = getRes().mul(0.5, 0)
        this.body = Matter.Bodies.circle(...v.arr, 1) 
        this.layer = LAYERS.entities
        this.cnv = this.layer.cnv
        this.ctx = this.layer.ctx
        Matter.World.add(ENGINE.world, this.body)
        LAYERS.entities.ents.push(this)
    }
    
    update(){
        let {x, y} = this.body.position
        this.ctx.beginPath()
        this.ctx.fillStyle = '#777'
        this.ctx.arc(x, y, 1.5, 0, Math.PI*2)
        this.ctx.fill()
    }
    
}