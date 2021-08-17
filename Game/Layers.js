class Layer{
    constructor(name, where = null){
        ensureGlobal('LAYERS', {})
        
        where = where == null ? document.body : where
        
        this.cnv = document.createElement('canvas')
        this.cnv.classList.add('layer')
        this.cnv.classList.add(name)
        where.appendChild(this.cnv)
        
        LAYERS[name] = this
        
        this.ctx = this.cnv.getContext('2d')
        this.ents = []
    }
    
    autoSize(mul = 1){
        this.cnv.width = this.rect.width * mul
        this.cnv.height = this.rect.height * mul
    }
    
    get rect(){
        return this.cnv.getBoundingClientRect()
    }
}

function createLayer(name, where = null){
    let newLayer = new Layer(name, where)
    return getLayer(name)
}

function getLayer(name){
    return LAYERS[name]
}

function getEntities(layername){
    layername = layername ? layername : Object.keys(LAYERS)[0]
    return LAYERS[layername].ents
}







