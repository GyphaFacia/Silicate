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
            skyGrad.addColorStop(0, '#555')
            skyGrad.addColorStop(1, '#000')
            this.ctx.fillStyle = skyGrad
            this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height)
        }
        getLayer('background').update()

        
        createLayer('map')
        createLayer('entities')
        createLayer('effects')
        
        getLayer('entities').update = function(){this.clear()}
    }
    
    start(){
        this.startEngine()
        this.setupLayers()
        setInterval(()=>{
            this.gameloop()
        }, 10)
    }
    
    gameloop(){
        if(this.paused){return null}
        
        for(let layer in LAYERS){
            LAYERS[layer].update()
            for(let ent of LAYERS[layer].ents){
                ent.update()
            }
        }
    }
    
    pixelate(mul = 1){
        for(let layerName in LAYERS){
            let layer = LAYERS[layerName]
            layer.autoSize(mul)
            layer.clear()
            layer.update()
        }
    }
    
    test(){
        let e = new Entity()
    }
    
    save(){}
    load(){}
    pause(){}
    resume(){}
}

function Game(){
    return ensureGlobal('GameGlobal', new GameClass())
}

















