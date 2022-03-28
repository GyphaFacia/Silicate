// trig
function pi(){
    return Math.PI
}

function deg(ang){
    return ang/180*pi()
}

function sin(ang){
    return Math.sin(deg(ang))
}

function cos(ang){
    return Math.cos(deg(ang))
}

// rand
function random(){
	if(arguments.length == 1){
		return Math.random()*arguments[0]
	}
	if(arguments.length == 2){
		let [a, b] = arguments
		return Math.random()*(b-a)+a
	}
	return Math.random()
}

function randint(){
	if(arguments.length == 1){
		return parseInt(Math.random()*arguments[0])
	}
	if(arguments.length == 2){
		let [a, b] = arguments
		return parseInt(Math.random()*(b-a)+a)
	}
	return Math.round(Math.random())
}

function randelt(arr){
	return arr[parseInt(Math.random()*arr.length)]
}

// time
function time(speed = 1){
	return Date.now()/1000*speed
}

// clipboard
function toClipboard(){
    let s = ''
    Array.from(arguments).forEach((item, i) => {
        s += item + ' '
    })
    s = s.trim()
    
    window.clipboardInterval = setInterval(()=>{
        navigator.clipboard.writeText(s)
        .then(()=>{
            clearInterval(window.clipboardInterval)
        })
        .catch(e=>{})
    }, 10)
}

function copyAllLocalScripts(f){
    let srcs = []
    let scripts = document.querySelectorAll('script')
    for(script of scripts){
        if(!script.src.includes(window.location.href)){ continue }
        srcs.push(script.src)
    }
    let s = ''
    srcs.forEach((src, i) => {
        fetch(src)
        .then(resp => resp.text())
        .then(data => {
            s += data
            if(i == srcs.length - 1){
                s = s.replaceAll('copyAllLocalScripts()', '')
                toClipboard(s)
            }
        })
    })
}













