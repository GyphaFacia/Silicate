class Game{
    constructor(){
        this.layers = {}
        this.ents = []
        this.pixelate = 0.35
    }
    
    pause(){}
    resume(){}
    save(){}
    load(){}
    
    initLayers(){
        let bg = this.addLayer('background')
        let [w, h] = bg.res.arr
        let skyGrad = bg.ctx.createLinearGradient(0, 0, 0, h)
        skyGrad.addColorStop(0, '#999')
        skyGrad.addColorStop(1, '#000')
        bg.ctx.fillStyle = skyGrad
        bg.ctx.fillRect(0, 0, ...bg.res.arr)
        bg.passive = true
        
        this.addLayer('entities')
        this.addLayer('map')
    }
    
    initEngine(){
        let engine = ensureGlobe('ENGINE', Matter.Engine.create())        
        Matter.Runner.run(Matter.Runner.create(), engine)
    }
    
    initGameloop(){
        this.gameloop_interval = setInterval(()=>{
            this.gameloop()
        }, 10)
    }
    
    start(){
        this.initLayers()
        this.initEngine()
        this.initGameloop()
        this.makeBorders()
        
        this.addEntity('Land')
        
        for(let i = 0; i < 50; i++){
            this.addEntity().setPos(getRes().mul(random(), 0.1))
        }
    }
    
    gameloop(){
        for(let layer in this.layers){
            layer = this.layers[layer]
            if(layer.update && !layer.passive){
                layer.update()
            }
        }
        
        for(let ent of this.ents){
            ent.update()
            ent.beforeDraw()
            ent.draw()
            ent.afterDraw()
        }
    }
    
    // // // // // // // // // // // // // // // // // // // // // // // // // 
    // layers
    // // // // // // // // // // // // // // // // // // // // // // // // // 
    addLayer(name){
        let layer = this.layers[name] = new Layer(name)
        layer.res = layer.size.mul(this.pixelate)
        return layer
    }
    
    getLayer(name){
        return this.layers[name]
    }
    
    // // // // // // // // // // // // // // // // // // // // // // // // // 
    // entity factory
    // // // // // // // // // // // // // // // // // // // // // // // // //     
    spawn(){ this.addEntity(...arguments) }
    
    addEntity(type = null, pos = null, scale = null){
        let ent
        
        if(type == 'Silicate' || type == null){
            pos = pos ? pos : getRes().div(2)
            scale = scale ? scale : relvec(10)
            ent = new Entity()
            ent.collection = this.ents
            
            ent.setPos(pos)
            ent.setScale(scale)
            ent.setAng(deg(random(360)))
            if(ent.r > 0.85){
                ent.afterDraw = function (){
                    this.drawEye()
                }
            }
        }
        
        if(type == 'Land'){
            ent = new Land()
            ent.collection = this.ents
        }
        
        ent.collection.push(ent)
        return ent
    }
    
    makeBorders(){
        let w = getRes().x
        let h = getRes().y
        let o = Math.min(w, h)/10
        
        let t = new Rect(w*5, o)
        let b = new Rect(w*5, o)
        let r = new Rect(o, h*5)
        let l = new Rect(o, h*5)
        
        t.setPos(getRes().mul(0.5, 0).sub(o/2))
        b.setPos(getRes().mul(0.5, 1).add(o/2))
        l.setPos(getRes().mul(0, 0.5).sub(o/2))
        r.setPos(getRes().mul(1, 0.5).add(o/2))
        
        for(let e of [t, b, r, l]){
            e.setStatic()
            e.color = 'transparent'
            e.ocolor = 'transparent'
        }
    }
}

// vector relative to screen width
function relvec(){
    let mult = ensureGlobe('VECTOR_MULT', getRes().x/500)
    return vec(...arguments).mul(mult)
}

function getRes(){
    return GAME.layers.background.res
}

ensureGlobe('GAME', new Game())
ensureGlobe('CURSOR', vec())

document.body.onmousemove = (e)=>{
    console.log('here');
    let v = vec(e.clientX, e.clientY)
    v = v.div(GAME.layers.background.size)
    v = v.mul(GAME.layers.background.res)
    CURSOR = v
}





