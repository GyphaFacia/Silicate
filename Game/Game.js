class GameClass{
    constructor() {
    }
    
    startEngine(){
        let engine = ensureGlobal('ENGINE', Matter.Engine.create())        
        Matter.Runner.run(Matter.Runner.create(), engine)
    }
    
    setupLayers(){
        createLayer('background').update = function(){
            let w = this.cnv.width
            let h = this.cnv.height
            
            let skyGrad = this.ctx.createLinearGradient(0, 0, 0, h)
            skyGrad.addColorStop(0, '#eee')
            skyGrad.addColorStop(1, '#000')
            this.ctx.fillStyle = skyGrad
            this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height)
        }
        getLayer('background').update()

        createLayer('entities').update = function(){this.clear()}
        createLayer('effects').update = function(){this.clear()}
        createLayer('map').update = function(){this.clear()}
    }
    
    start(){
        this.startEngine()
        this.setupLayers()
        setInterval(()=>{
            this.gameloop()
        }, 10)
        setTimeout(()=>{
            this.makeBorders()
        }, 10)
    }
    
    gameloop(){
        if(this.paused){return null}
        
        for(let layer in LAYERS){
            LAYERS[layer].update()
            for(let ent of LAYERS[layer].ents){
                ent.update()
                ent.beforeDraw()
                ent.draw()
                ent.afterDraw()
            }
        }
    }
    
    pixelate(mul = 1){
        for(let layername in LAYERS){
            let layer = LAYERS[layername]
            layer.autoSize(mul)
            layer.clear()
            layer.update()
        }
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
        
    save(){}
    load(){}
    pause(){}
    resume(){}
}

function Game(){
    return ensureGlobal('GameGlobal', new GameClass())
}

















