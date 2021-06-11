// 888     888                   888                    
// 888     888                   888                    
// 888     888                   888                    
// Y88b   d88P  .d88b.   .d8888b 888888 .d88b.  888d888 
//  Y88b d88P  d8P  Y8b d88P"    888   d88""88b 888P"   
//   Y88o88P   88888888 888      888   888  888 888     
//    Y888P    Y8b.     Y88b.    Y88b. Y88..88P 888     
//     Y8P      "Y8888   "Y8888P  "Y888 "Y88P"  888  

class Vector {
    constructor(x, y){
        this.x = x
        this.y = y
    }
    
    toString(){
        return `vec(${parseInt(this.x*100)/100}, ${parseInt(this.y*100)/100})`
    }
    
    add(){
        let v = vec(...arguments)
        v.x += this.x
        v.y += this.y
        return v
    }
    
    sub(){
        let v = vec(...arguments)
        v.x = this.x - v.x
        v.y = this.y - v.y
        return v
    }
    
    mul(){
        let v = vec(...arguments)
        v.x *= this.x
        v.y *= this.y
        return v
    }
    
    mult(){
        let v = vec(...arguments)
        v.x *= this.x
        v.y *= this.y
        return v
    }
    
    div(){
        let v = vec(...arguments)
        v.x = this.x / v.x
        v.y = this.y / v.y
        return v
    }
    
    len(){return Math.sqrt(this.x*this.x + this.y*this.y)}
    length(){return Math.sqrt(this.x*this.x + this.y*this.y)}
    
    dist(){
        let v = vec(...arguments)
        return v.sub(this).len()
    }
    distance(){
        let v = vec(...arguments)
        return v.sub(this).len()
    }
    
    ort(){
        return this.div(this.len())
    }
    
    int(){
        return vec(parseInt(this.x), parseInt(this.y)) 
    }
    round(){
        return vec(Math.round(this.x), Math.round(this.y)) 
    }
}

function vec(){
    let args = arguments
    let arlen = args.length
    
    if(!arlen){
        return new Vector(0, 0)
    }
    
    if(args[0] == undefined){
        return new Vector(0, 0)
    }
    
    if(typeof(args[0]) == 'number'){
        let x = args[0]
        let y = args[1] == undefined ? x : args[1]
        return new Vector(x, y)
    }
    
    if(args[0].constructor.name == 'Vector'){
        return new Vector(args[0].x, args[0].y)
    }
    
    if(Array.isArray(args[0])){
        let x = args[0][0] == undefined ? 0 : args[0][0]
        let y = args[0][1] == undefined ? x : args[0][1]
        return new Vector(x, y)
    }
}

function vec2ang(dir){
	return Math.atan2(dir.x, dir.y)/2/Math.PI*360
}

function angvec(ang = 0, degrees = true){
	if(degrees){
		ang = ang/360*2*Math.PI
	}
	return vec(Math.cos(ang), Math.sin(ang))
}
function angvecX(ang, len){
    return angvec(ang).mul(len)
}

function randvec(){
	return vec(Math.random()-0.5, Math.random()-0.5).ort()
}
function randvecX(len){
    return randvec().mul(len)
}










