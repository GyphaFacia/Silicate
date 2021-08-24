// 888     888                   
// 888     888                   
// 888     888                   
// Y88b   d88P  .d88b.   .d8888b 
//  Y88b d88P  d8P  Y8b d88P"    
//   Y88o88P   88888888 888      
//    Y888P    Y8b.     Y88b.    
//     Y8P      "Y8888   "Y8888P 
// 2d vector
class Vector {
    constructor(x,  y){
        this.x = x
        this.y = y
    }
    
    // misc getters
    get str(){
        let precision = 2
        let {x, y} = this
        x = parseInt(x * Math.pow(10, precision)) / Math.pow(10, precision)
        y = parseInt(y * Math.pow(10, precision)) / Math.pow(10, precision)
        return `vec(${x}, ${y})`
    }
    
    get arr(){
        return [this.x, this.y]
    }
    
    // binary operators
    oper(other, func){
        return new Vector(func(this.x, other.x), func(this.y, other.y))
    }
    
    add(){ return this.oper(vec(...arguments), (a, b)=>a+b) }
    sub(){ return this.oper(vec(...arguments), (a, b)=>a-b) }
    mul(){ return this.oper(vec(...arguments), (a, b)=>a*b) }
    div(){ return this.oper(vec(...arguments), (a, b)=>a/b) }
    
    // getters
    get len(){ return Math.sqrt(this.x*this.x + this.y*this.y) }
    get ort(){ return this.div(this.len) }    
}

// create new vector
function vec(...args){
    // vec() => vec(0, 0)
    if(!args.length){
        return new Vector(0, 0)
    }
    
    if(args.length == 1){
        // vec(vecB) => vecB
        if(args[0].constructor.name == 'Vector'){
            return args[0]
        }
        // vec(x) => vec(x, x)
        return new Vector(args[0], args[0])
    }
    
    // vec(x, y) => vec(x, y)
    if(args.length == 2){
        return new Vector(args[0], args[1])
    }
}

// ort vec by angle
function angvec(t){
    return new Vector(sin(t), cos(t))
}

// random vector
function randvec(){
    return angvec(random(360)).mul(random(...arguments))
}

// function pos




// 888b     d888          888    888      
// 8888b   d8888          888    888      
// 88888b.d88888          888    888      
// 888Y88888P888  8888b.  888888 88888b.  
// 888 Y888P 888     "88b 888    888 "88b 
// 888  Y8P  888 .d888888 888    888  888 
// 888   "   888 888  888 Y88b.  888  888 
// 888       888 "Y888888  "Y888 888  888 
// 3.14...
function pi(){
    return Math.PI
}

// deg to radians
function deg(t){
    return t/180*pi()
}

// sin in degrees
function sin(t){
    return Math.sin(deg(t))
}

// cos in degrees
function cos(t){
    return Math.cos(deg(t))
}

// current time in ms
function time(){
    return Date.now()
}

function random(...args){
    let r = Math.random()
    if(!args.length){ return r }
    
    if(args.length == 1){ return r*args[0] }
    
    let min = args[0]
    let max = args[1]
    return r*(max - min) + min
}





//  .d8888b.  888          888               
// d88P  Y88b 888          888               
// 888    888 888          888               
// 888        888  .d88b.  88888b.   .d88b.  
// 888  88888 888 d88""88b 888 "88b d8P  Y8b 
// 888    888 888 888  888 888  888 88888888 
// Y88b  d88P 888 Y88..88P 888 d88P Y8b.     
//  "Y8888P88 888  "Y88P"  88888P"   "Y8888  
function createGlobe(name, defaultValue){
    window[name] = defaultValue
    return window[name]
}

function ensureGlobe(name, defaultValue){
    if(window[name] == undefined){
        createGlobe(name, defaultValue)
    }
    return window[name]
}








