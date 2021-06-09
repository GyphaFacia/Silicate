// 888b     d888          888    888      
// 8888b   d8888          888    888      
// 88888b.d88888          888    888      
// 888Y88888P888  8888b.  888888 88888b.  
// 888 Y888P 888     "88b 888    888 "88b 
// 888  Y8P  888 .d888888 888    888  888 
// 888   "   888 888  888 Y88b.  888  888 
// 888       888 "Y888888  "Y888 888  888 
function random(){
	if(arguments.length == 1){
		return Math.random()*arguments[0]
	}
	if(arguments.length == 2){
		let a = arguments[0]
		let b = arguments[1]
		return Math.random()*(b-a)+a
	}
	return Math.random()
}

function randint(){
	if(arguments.length == 1){
		return parseInt(Math.random()*arguments[0])
	}
	if(arguments.length == 2){
		let a = arguments[0]
		let b = arguments[1]
		return parseInt(Math.random()*(b-a)+a)
	}
	return Math.round(Math.random())
}

function randelt(arr){
	return arr[parseInt(Math.random()*arr.length)]
}

function time(speed = 1){
	return Date.now()/1000*speed
}

function sin(ang = 0){
	return Math.sin(ang/180*Math.PI)
}
function cos(ang = 0){
	return Math.cos(ang/180*Math.PI)
}





// 888b     d888 8888888 .d8888b.   .d8888b.
// 8888b   d8888   888  d88P  Y88b d88P  Y88b
// 88888b.d88888   888  Y88b.      888    888
// 888Y88888P888   888   "Y888b.   888
// 888 Y888P 888   888      "Y88b. 888
// 888  Y8P  888   888        "888 888    888
// 888   "   888   888  Y88b  d88P Y88b  d88P
// 888       888 8888888 "Y8888P"   "Y8888P"
function addElement(name, parent, tag = 'div'){
	if(typeof(parent) == typeof(' ')){
		parent = document.querySelector(parent)
	}
	let elt = document.createElement(tag)
	if(name[0]=='.'){
		elt.addClass(name.slice(1))
	}
	else if(name[0]=='#'){
		elt.setId(name.slice(1))
	}
	else{
		elt.addClass(name)
	}

	parent.appendChild(elt)
	return elt
}

Element.prototype.addElement = function(name, tag = 'div'){
	return addElement(name, this, tag)
}

Element.prototype.addClass = function(classname){
	this.classList.add(classname)
	return this
}

Element.prototype.setId = function(idname = null){

	function genUniqueId(){
		return '_' + Math.random().toString(36).substr(2, 9);
	}

	if(idname == null){
		idname = genUniqueId()
	}
	this.id = idname
	return '#'+idname
}

Element.prototype.getId = function(){
	let s = this.id
	if(!s){
		return this.setId()
	}
	return '#'+s
}

Element.prototype.dissolve = function(time = 500){
	$(this).fadeOut(time, function(){$(this).remove()})
}


function addTestElement(){
	let elt = addElement('test', 'body')
	elt.applyCss(`
		width: 30vh
		height: 30vh
		position: absolute
		left: 20vh
		top: 20vh
		background-color: #aaa
	`)
	return elt
}




// 8888888b.                                          .d8888b.   .d8888b.   .d8888b.
// 888   Y88b                                        d88P  Y88b d88P  Y88b d88P  Y88b
// 888    888                                        888    888 Y88b.      Y88b.
// 888   d88P 8888b.  888d888 .d8888b   .d88b.       888         "Y888b.    "Y888b.
// 8888888P"     "88b 888P"   88K      d8P  Y8b      888            "Y88b.     "Y88b.
// 888       .d888888 888     "Y8888b. 88888888      888    888       "888       "888
// 888       888  888 888          X88 Y8b.          Y88b  d88P Y88b  d88P Y88b  d88P
// 888       "Y888888 888      88888P'  "Y8888        "Y8888P"   "Y8888P"   "Y8888P"

function cssToArray(css){
	function uppercaseFirstChar(s){
		return s.charAt(0).toUpperCase() + s.slice(1);
	}

	function kebab2cammel(s){
		s = s.split('-')
		for (let i = 1; i < s.length; i++){
			s[i] = uppercaseFirstChar(s[i])
		}
		return s.join('')
	}

	let arr = []
	let strings = css.split('\n')
	for(string of strings){
		if(!string.replaceAll(' ', '')){
			continue
		}
		string = string.replaceAll(';', '').trim()
		let attribute = kebab2cammel(string.split(':')[0])
		let value = string.split(':')[1]
		arr.push([attribute.trim(), value])
	}
	return arr
}

function applyCss(elt, css){
	for(str of cssToArray(css)){
		elt.style[str[0]] = str[1]
	}
}

Element.prototype.applyCss = function(css){
	applyCss(this, css)
}

function parseCss(css){
	let arr = []
	for(e1 of css.split('{')){
		for (e2 of e1.split('}')){
			arr.push(e2)
		}
	}

	for(let i = 0; i < arr.length; i+=2){
		let selector = arr[i]
		for (sep of ' 	\n'){
			selector = selector.replaceAll(sep, '')
		}
		if(!selector){
			continue
		}
		let style = arr[i+1]
		for(elt of document.querySelectorAll(selector)){
			applyCss(elt, style)
		}
	}
}




//  .d8888b.           888    8888888b.
// d88P  Y88b          888    888   Y88b
// 888    888          888    888    888
// 888         .d88b.  888888 888   d88P .d88b.  .d8888b
// 888  88888 d8P  Y8b 888    8888888P" d88""88b 88K
// 888    888 88888888 888    888       888  888 "Y8888b.
// Y88b  d88P Y8b.     Y88b.  888       Y88..88P      X88
//  "Y8888P88  "Y8888   "Y888 888        "Y88P"   88888P'
function parseXYAlignment(args){
	let x, y
	let alignment = 'c'
	if(typeof(args[0]) == 'number'){
		x = args[0]
		if(typeof(args[1]) == 'number'){
			y = args[1]
		}
		else{
			y = x
		}
	}
	else if(Array.isArray(args[0])){
		x = args[0][0]
		y = args[0][1]
	}
	else if(args[0]){
		x = args[0].x
		y = args[0].y
	}

	for(arg of args){
		if(typeof(arg) == 'string'){
			alignment = arg
		}
	}
	return [x, y, alignment]
}

Element.prototype.getScale = function(){
	let rect = this.getBoundingClientRect();
	return vec(rect.right - rect.left, rect.bottom - rect.top)
}

Element.prototype.getPos = function(){
	let alignment = parseXYAlignment(arguments)[2]
	let rect = this.getBoundingClientRect();
	let pos = vec()
	pos.x = null
	pos.y = null

	if(alignment.includes('l')){
		pos.x = rect.left
	}
	if(alignment.includes('r')){
		pos.x = rect.right
	}
	if(alignment.includes('t')){
		pos.y = rect.top
	}
	if(alignment.includes('b')){
		pos.y = rect.bottom
	}

	if(alignment == 'c'){
		pos.x = (rect.left + rect.right)/2
		pos.y = (rect.top + rect.bottom)/2
	}
	if(alignment[0] == 'c' || pos.x == null){
		pos.x = (rect.left + rect.right)/2
	}
	if(alignment[1] == 'c' || pos.y == null){
		pos.y = (rect.top + rect.bottom)/2
	}

	return pos
}

Element.prototype.setPos = function(){
	let xya = parseXYAlignment(arguments)
	let x = xya[0]
	let y = xya[1]
	let alignment = xya[2]

	let scl = this.getScale()

	if(alignment.includes('l')){
		x += 0
	}
	if(alignment.includes('r')){
		x -= scl.x
	}
	if(alignment.includes('t')){
		y += 0
	}
	if(alignment.includes('b')){
		y -= scl.y
	}

	if(alignment == 'c'){
		y -= scl.y/2
	}
	if(alignment[0] == 'c'){
		x -= scl.x/2
	}
	if(alignment[1] == 'c'){
		y -= scl.y/2
	}

	this.style.left = parseInt(x)+'px'
	this.style.top = parseInt(y)+'px'
}

Element.prototype.dist = function(other){
	let pos1 = this.getPos()
	let pos2 = other.getPos()
	let dist = (pos1.x - pos2.x)*(pos1.x - pos2.x)
	dist += (pos1.y - pos2.y)*(pos1.y - pos2.y)
	dist = Math.sqrt(dist)
	return dist
}


















