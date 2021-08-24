class Game{
    constructor(){
        this.layers = {}
        this.pixelate = 0.2
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
    }
    
    start(){
        this.initLayers()
        
        this.gameloop_interval = setInterval(()=>{
            this.gameloop()
        }, 10)
    }
    
    gameloop(){
        for(let layer in this.layers){
            layer = this.layers[layer]
            if(layer.update && !layer.passive){
                layer.update()
            }
        }
    }
    
    // layers
    addLayer(name){
        let layer = this.layers[name] = new Layer(name)
        layer.res = layer.size.mul(this.pixelate)
        return layer
    }
    
    getLayer(name){
        return this.layers[name]
    }
}

ensureGlobe('GAME', new Game())






