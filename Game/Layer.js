class Layer{
    constructor(name, pos = null){
        if(!pos){
            pos = document.body
        }
        this.name = name
        
        this.cnv = document.createElement('canvas')
        this.cnv.classList.add('layer')
        this.cnv.classList.add(name)
        pos.append(this.cnv)
        
        this.ctx = this.cnv.getContext('2d')
    }
    
    update(){this.clear()}
    
    clear(){
        this.ctx.clearRect(0, 0, ...this.res.arr)
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
        let {x, y} = v
        this.cnv.width = x
        this.cnv.height = y
    }
}

























