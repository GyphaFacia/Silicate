// 888     888                   888                    
// 888     888                   888                    
// 888     888                   888                    
// Y88b   d88P  .d88b.   .d8888b 888888 .d88b.  888d888 
//  Y88b d88P  d8P  Y8b d88P"    888   d88""88b 888P"   
//   Y88o88P   88888888 888      888   888  888 888     
//    Y888P    Y8b.     Y88b.    Y88b. Y88..88P 888     
//     Y8P      "Y8888   "Y8888P  "Y888 "Y88P"  888  
function data2coords(){
    let args = arguments
    if(args.length == 2){
        return [args[0], args[1]]
    }
    if(args.length){
        let arg = args[0]
        if(typeof(arg) == 'number'){
            return [arg, arg]
        }
        if(arg.constructor.name == 'Vector'){
            return [arg.x, arg.y]
        }
        if(Array.isArray(arg)){
            return [arg[0], arg[1]]
        }
        if(typeof(arg) == 'object'){
            return [arg.x, arg.y]
        }
    }
    return [0, 0]
}


class Vector {
    constructor(){
        [this.x, this.y] = data2coords(...arguments)
    }
    
    get str(){return `vec(${this.x}, ${this.y})`}
    
    get $(){return [this.x, this.y]}
    
    mod(other, func){
        let v1 = this.$
        let v2 = data2coords(...other)
        return new Vector(func(v1[0], v2[0]), func(v1[1], v2[1]))
    }
    
    add(){return this.mod([...arguments], (a, b)=>a+b)}
    sub(){return this.mod([...arguments], (a, b)=>a-b)}
    mul(){return this.mod([...arguments], (a, b)=>a*b)}
    div(){return this.mod([...arguments], (a, b)=>a/b)}
    
    mix(other, ratio = 0.25){
        let v1 = this.mul(ratio)
        let v2 = other.mul(1 - ratio)
        return v1.add(v2)
    }
    
    get len(){return Math.sqrt(this.x*this.x + this.y*this.y)}
    get ort(){return this.div(this.len)}
}

function vec(){
    return new Vector(...arguments)
}




























