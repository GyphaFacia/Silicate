Element.prototype.addHtml = function(code, pos = 'beforeend'){
    this.insertAdjacentHTML(pos, code)
}

Element.prototype.applyCss = function(css){
    css = css.replaceAll(';', '')
    css = css.split('\n')
    
    css = css.map((item) => {
        item = item.split(':')
        item = [item[0], item.slice(1).join(':')]
        item = item.map(e => e.trim())
        return item
    })
    
    css = css.filter((pair) => {
        return pair[0] ? 1 : 0
    })
    
    css.forEach((kv, i) => {
        let [k, v] = kv
        this.style[k] = v
    })
}

function parseCss(css){
    css = css.split('{')
    
    let pairs = []
    css.forEach((item, i) => {
        item.split('}').forEach((item, i) => {
            pairs.push(item)
        })
    })
    
    css = pairs.map(e => e.trim())
    css = css.filter(e => e)
    
    for(let i = 0; i < css.length; i+= 2){
        let selector = css[i]
        let style = css[i + 1]
        for(let elt of document.querySelectorAll(selector)){
            elt.applyCss(style)
        }
    }
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












