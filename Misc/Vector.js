class Vector{
    constructor(x, y){
        this.x = x
        this.y = y
    }
    
    pair(other, func){
        let x = func(this.x, other.x)
        let y = func(this.y, other.y)
        return new Vector(x, y)
    }
    
    add(){
        return this.pair(vec(...arguments), (a,b)=>a+b)
    }
    
    sub(){
        return this.pair(vec(...arguments), (a,b)=>a-b)
    }
    
    mul(){
        return this.pair(vec(...arguments), (a,b)=>a*b)
    }
    
    div(){
        return this.pair(vec(...arguments), (a,b)=>a/b)
    }
    
    get len(){
        return Math.sqrt(this.x*this.x + this.y*this.y)
    }
    
    get ort(){
        return this.div(this.len)
    }
    
    get str(){
        return `vec(${this.x}, ${this.y})`
    }
    
    get arr(){
        return [this.x, this.y]
    }
    
    get max(){
        return Math.max(this.x, this.y)
    }
    
    dist(){
        let other = vec(...arguments)
        return other.sub(this).len
    }
}

function vec(...args){
    if(args.length == 0){
        return new Vector(0, 0)
    }
    if(args.length == 2){
        return new Vector(args[0], args[1])
    }
    
    if(args[0].constructor.name == 'Vector'){
        return args[0]
    }
    
    return new Vector(args[0], args[0])
}

function angvec(t){
    return vec(sin(t), cos(t))
}

function randvec(){
    return angvec(random(360)).mul(random(...arguments))
}















