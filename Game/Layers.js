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
    
    clear(){
        this.ctx.clearRect(0, 0, ...this.res.arr)
    }
    
    update(){}
    
    autoSize(mul = 1){
        this.res = this.size.mul(mul)
    }
    
    get rect(){
        return this.cnv.getBoundingClientRect()
    }
    
    get size(){
        return vec(this.rect.width, this.rect.height)
    }
    
    get res(){
        return vec(this.cnv.width, this.cnv.height)
    }
    set res(v){
        let {x,y} = v
        this.cnv.width = x
        this.cnv.height = y
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

function getRes(){
    return LAYERS[Object.keys(LAYERS)[0]].res
}





