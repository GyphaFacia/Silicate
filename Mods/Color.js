// .d8888b.           888                  
// d88P  Y88b          888                  
// 888    888          888                  
// 888         .d88b.  888  .d88b.  888d888 
// 888        d88""88b 888 d88""88b 888P"   
// 888    888 888  888 888 888  888 888     
// Y88b  d88P Y88..88P 888 Y88..88P 888     
// "Y8888P"   "Y88P"  888  "Y88P"  888     
function rgbToHex(arr){
	let r = arr[0]
	let g = arr[1]
	let b = arr[2]
	let a = 255
	if (arr.length > 3){
		a = arr[3]
	}

	function componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}
	a *= 255
	a = parseInt(a)
	return '#'+componentToHex(r)+componentToHex(g)+componentToHex(b)+componentToHex(a)
}

function rgbToHsl(arr){
	let r = arr[0]
	let g = arr[1]
	let b = arr[2]
	let a = 1
	if (arr.length > 3){
		a = arr[3]
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

	return [h,s,l,a]
}

function hslToRgb(arr){
	let h = arr[0]
	let s = arr[1]
	let l = arr[2]
	let a = 1
	if (arr.length > 3){
		a = arr[3]
	}

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

function getColorType(s){
	function contains(str, substr){
		return str.split(substr).length - 1 ? true : false
	}
	if (contains(s, '#')){
		s = s.slice(1, s.length)
		return s.length == 4 || s.length == 8? 'hexa' : 'hex'
	}
	if(contains(s, 'rgb')){
		return contains(s, 'rgba') ? 'rgba' : 'rgb'
	}
	if (contains(s, 'hsl')){
		return contains(s, 'hsla') ? 'hsla' : 'hsl'
	}
	return 'unknown'
}

class Color{
	constructor(val){
		function bracketsContent(str){
			let s = str
			s = s.split(')')[0]
			s = s.split('(')[1]
			try{
				s = s.split(' ').join('')
			}
			catch(err){}
			s = s.split(',')
			return s
		}
		let clrtype = getColorType(val)
		if(clrtype == 'hexa' || clrtype == 'hex'){
			val = hexToRgb(val)
			this.r = val[0]
			this.g = val[1]
			this.b = val[2]
			this.a = val[3]
			this.recalcHsl()
		}
		if(clrtype == 'rgba' || clrtype == 'rgb'){
			val = bracketsContent(val)
			this.r = parseInt(val[0])
			this.g = parseInt(val[1])
			this.b = parseInt(val[2])
			this.a = val.length < 4 ? 1 : parseFloat(val[3])
			this.recalcHsl()
		}
		if(clrtype == 'hsla' || clrtype == 'hsl'){
			val = bracketsContent(val)
			this.h = parseInt(val[0])
			this.s = parseInt(val[1])
			this.l = parseInt(val[2])
			this.a = val.length < 4 ? 1 : parseFloat(val[3])
			this.recalcRgb()
		}
	}

	recalcRgb(){
		var arr = hslToRgb([this.h, this.s, this.l])
		this.r = arr[0]
		this.g = arr[1]
		this.b = arr[2]
	}

	recalcHsl(){
		var arr = rgbToHsl([this.r, this.g, this.b])
		this.h = arr[0]
		this.s = arr[1]
		this.l = arr[2]
	}

	val(){
		return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
	}

	/*Set*/
	setR(n){this.r = n;this.recalcHsl();return this;}
	setG(n){this.g = n;this.recalcHsl();return this;}
	setB(n){this.b = n;this.recalcHsl();return this;}

	setH(n){this.h = n;this.recalcRgb();return this;}
	setS(n){this.s = n;this.recalcRgb();return this;}
	setL(n){this.l = n;this.recalcRgb();return this;}

	setA(n){this.a = n;return this}

	/*Mod*/
	modR(n){this.r += n;this.recalcHsl();return this;}
	modG(n){this.g += n;this.recalcHsl();return this;}
	modB(n){this.b += n;this.recalcHsl();return this;}

	modH(n){this.h += n;this.recalcRgb();return this;}
	modS(n){this.s += n;this.recalcRgb();return this;}
	modL(n){this.l += n;this.recalcRgb();return this;}

	modA(n){this.a += n;return this}

	/*Get*/
	getR(n){return this.r}
	getG(n){return this.g}
	getB(n){return this.b}

	getH(n){return this.h}
	getS(n){return this.s}
	getL(n){return this.l}

	getA(n){return this.a}

	/*Arithmetic*/
	add(other){
		let r = this.r + other.r
		let g = this.g + other.g
		let b = this.b + other.b
		return Clr(r, g, b)
	}

	sub(other){
		let r = this.r - other.r
		let g = this.g - other.g
		let b = this.b - other.b
		return Clr(r, g, b)
	}

	mul(other){
		let r = this.r * other.r
		let g = this.g * other.g
		let b = this.b * other.b
		return Clr(r, g, b)
	}

	div(other){
		let r = this.r / other.r
		let g = this.g / other.g
		let b = this.b / other.b
		return Clr(r, g, b)
	}
	
	mix(other, prop = 1){
		let r = (this.r*prop + other.r)/(1+prop)
		let g = (this.g*prop + other.g)/(1+prop)
		let b = (this.b*prop + other.b)/(1+prop)
		return Clr(r, g, b)
	}
	
	dist(other){
		let r = this.r - other.r
		let g = this.g - other.g
		let b = this.b - other.b
		return Math.sqrt(r*r + g*g + b*b)
	}
}

function HslClr(h, s=100, l=50, a = 1){
	return new Color(`hsl(${h}deg, ${s}%, ${l}%, ${a})`)
}

function Clr(r, g=-1, b=-1, a=-1){
	if (typeof r == 'number'){
		if (g < 0){
			g = r
		}
		if (b < 0){
			b = g
		}
		if (a < 0){
			a = 1
		}
		return new Color(`rgb(${r}, ${g}, ${b}, ${a})`)
	}

	if (typeof r == 'string'){
		return new Color(r)
	}

	if (typeof r == "object"){
		r = window.getComputedStyle(r).getPropertyValue("background-color")
		return new Color(r)
	}
}