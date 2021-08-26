class Game{
    constructor(){
        this.layers = {}
        this.ents = []
        this.effs = []
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
        this.addLayer('effects')
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
        
        // for(let i = 0; i < 50; i++){
        //     this.addEntity().setPos(getRes().mul(random(), 0.1))
        // }
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
        
        for(let eff of this.effs){
            eff.update()
            eff.beforeDraw()
            eff.draw()
            eff.afterDraw()
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
    // entity&effects factory
    // // // // // // // // // // // // // // // // // // // // // // // // //     
    spawn(){ this.addEntity(...arguments) }
    
    addEntity(type = null, pos = null, scale = null){
        pos = pos ? pos : getRes().div(2)
        scale = scale ? scale : relvec(10)
        
        if(type == 'Silicate' || type == null){
            let ent = new Entity()
            ent.setPos(pos)
            ent.setScale(scale)
            ent.setAng(deg(random(360)))
            
            if(ent.r > 0.85){
                ent.afterDraw = function (){
                    this.drawEye()
                }
            }
            
            ent.collection = this.ents
            ent.collection.push(ent)
            return ent
        }
        
        if(type == 'Land'){
            let ent = new Land()
            ent.collection = this.ents
            ent.collection.push(ent)
            return ent
        }
        
        return null
    }
    
    addEffect(type = null, pos = null, scale = null){
        pos = pos ? pos : getRes().div(2)
        scale = scale ? scale : relvec(10)
        
        if(type == null){
            let eff = new Effect()
            eff.setPos(pos)
            eff.setScale(scale)
            eff.collection = this.effs
            eff.collection.push(eff)
            return eff
        }
        
        if(type == 'Gas'){
            let eff = new Effect()
            eff.setPos(pos)
            eff.setScale(relvec(random(0.1, 0.5)))
            eff.lifetime = eff.life = random(1, 2)
            eff.vel = randvec(1)
            eff.mass = random(0.025, 0.075)
            
            eff.collection = this.effs
            eff.collection.push(eff)
            return eff
        }
        
        if(type == 'Fire'){
            let eff = new Effect()
            
            eff.setScale(relvec(random(1, 2)))
            eff.setPos(pos)
            eff.lifetime = eff.life = random(0.5, 1)
            eff.startcolor = Clr(255, 255, 200)
            eff.endcolor = Clr(255, 0, 50, 0.5)
            eff.vel = randvec(0.2)
            eff.mass = random(0.01, 0.02)
            
            eff.last = function () {
                let eff = GAME.addEffect()
                eff.setScale(relvec(random(0.5, 1)))
                eff.setPos(this.getPos())
                eff.lifetime = eff.life = random(0.5, 1)
                eff.startcolor = Clr(125, 125, 125, 0.5)
                eff.endcolor = Clr(0,0,0,0)
                eff.vel = randvec(0.2)
                eff.mass = random(0.02, 0.04)
            }

            eff.collection = this.effs
            eff.collection.push(eff)
            return eff
        }
        
        return null
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





