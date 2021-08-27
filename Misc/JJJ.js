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





//  .d8888b.           888                  
// d88P  Y88b          888                  
// 888    888          888                  
// 888         .d88b.  888  .d88b.  888d888 
// 888        d88""88b 888 d88""88b 888P"   
// 888    888 888  888 888 888  888 888     
// Y88b  d88P Y88..88P 888 Y88..88P 888     
//  "Y8888P"   "Y88P"  888  "Y88P"  888     
function rgbToHex(){
	let [r, g, b] = arguments
	let a = arguments.length > 3 ? arguments[3] : 1

	function componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}
	a *= 255
	a = parseInt(a)
	return '#'+componentToHex(r)+componentToHex(g)+componentToHex(b)+componentToHex(a)
}

function rgbToHsl(){
	let [r,g,b] = arguments
	let a = 1
	if (arguments.length > 3){
		a = arguments[3]
	}

	r /= 255, g /= 255, b /= 255;

	var max = Math.max(r, g, b), min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;

	if (max == min) {
		h = s = 0;
	} else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}

		h /= 6;
	}

	h *= 360
	s *= 100
	l *= 100

	return [h, s, l, a]
}

function hslToRgb(){
	let [h, s, l] = arguments
	let a = arguments.length > 3 ? arguments[3] : 1

	h /= 360, s /= 100, l /= 100;

	var r, g, b;
	if(s == 0){
		r = g = b = l;
	}
	else{
		var hue2rgb = function hue2rgb(p, q, t){
			if(t < 0) t += 1;
			if(t > 1) t -= 1;
			if(t < 1/6) return p + (q - p) * 6 * t;
			if(t < 1/2) return q;
			if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		}
		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb(p, q, h + 1/3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1/3);
	}
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a];
}

function hexToRgb(hex){
	if (hex.length == 5 || hex.length == 9){
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b, a) {
			return r + r + g + g + b + b + a + a;
		});
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? [parseInt(result[1], 16), parseInt(result[2], 16), 
						 parseInt(result[3], 16), parseInt(result[4], 16) / 256] : null;
	}
	else{
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), 1] : null;
	}
}

class Color {
    constructor(r = 255, g, b, a){
        this.$ = new Array(7).fill(0)
        
        this.r = r
        this.g = g == undefined ? this.r : g
        this.b = b == undefined ? this.g : b
        this.a = a == undefined ? 1 : a
        
        this.updateHsl()
    }
    
    get rgb(){
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
    }
    get hsl(){
        return `hsla(${this.h}, ${this.s}%, ${this.l}%, ${this.a})`
    }
    get hex(){
        return rgbToHex(this.r, this.g, this.b, this.a)
    }

    updateHsl(){
        [this.$[4], this.$[5], this.$[6]] = rgbToHsl(this.r, this.g, this.b)
    }
    
    updateRgb(){
        [this.$[0], this.$[1], this.$[2]] = hslToRgb(this.h, this.s, this.l)
    }
    
    set r(n){this.$[0] = n ; this.updateHsl()}
    set g(n){this.$[1] = n ; this.updateHsl()}
    set b(n){this.$[2] = n ; this.updateHsl()}
    set a(n){this.$[3] = n}
    set h(n){this.$[4] = n ; this.updateRgb()}
    set s(n){this.$[5] = n ; this.updateRgb()}
    set l(n){this.$[6] = n ; this.updateRgb()}
    
    get r(){return this.$[0]}
    get g(){return this.$[1]}
    get b(){return this.$[2]}
    get a(){return this.$[3]}
    get h(){return this.$[4]}
    get s(){return this.$[5]}
    get l(){return this.$[6]}
    
    mod(other, func){
        let rgb = this.$.slice(0, 4)
        let rgb2 = other.$.slice(0, 3)
        rgb = rgb.map((e, i) => {
            let e2 = rgb2[i]
            return e2 != undefined ? func(e, e2) : e
        })
        return new Color(...rgb)
    }
    
    add(other){
        return this.mod(other, (a, b)=> a + b)
    }
    
    sub(other){
        return this.mod(other, (a, b)=> a - b)
    }
    
    div(other){
        return this.mod(other, (a, b)=> a / b)
    }
    
    mul(other){
        return this.mod(other, (a, b)=> a * b)
    }
    
    mix(other, ratio = 0.5, withAlpha = false){
        let c1 = this.mul(new Color(ratio))
        let c2 = other.mul(new Color(1 - ratio))
        
        if(withAlpha){
            let c3 = c1.add(c2)
            c3.a = c1.a*ratio + c2.a*(1-ratio)
            return c3
        }
        return c1.add(c2)
    }
}

class ColorHsl extends Color{
    constructor(h = 0, s = 100, l = 50, a = 1){
        super()
        
        this.$ = new Array(7).fill(0)
        
        this.h = h
        this.s = s
        this.l = l
        this.a = a
        
        this.updateRgb()
    }
}

function Clr(){
    return new Color(...arguments)
}

function Hsl(){
    return new ColorHsl(...arguments)
}

function Hex(){
	return new Clr(...hexToRgb(...arguments))
}





// 888b     d888          888    888      
// 8888b   d8888          888    888      
// 88888b.d88888          888    888      
// 888Y88888P888  8888b.  888888 88888b.  
// 888 Y888P 888     "88b 888    888 "88b 
// 888  Y8P  888 .d888888 888    888  888 
// 888   "   888 888  888 Y88b.  888  888 
// 888       888 "Y888888  "Y888 888  888 
// clap number between min and max limits
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max)
}

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


function addElement(name, parent, tag = 'div'){
	if(typeof(parent) == 'string'){
		parent = document.querySelector(parent)
	}
	
	let elt = document.createElement(tag)
	
	if(name[0]=='.'){
		elt.classList.add(name.slice(1))
	}
	else if(name[0]=='#'){
		elt.id = name.slice(1)
	}
	else{
		elt.classList.add(name)
	}

	parent.appendChild(elt)
	return elt
}
Element.prototype.addElement = function(name, tag = 'div'){
	return addElement(name, this, tag)
}





