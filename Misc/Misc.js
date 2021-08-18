window.pi = Math.PI

function deg(ang){
    return ang/180*pi
}

function sin(t){
    return Math.sin(deg(t))
}

function cos(t){
    return Math.cos(deg(t))
}

function time(){
    return Date.now()
}

function random(...args){
    if(args.length > 1){
        return Math.random()*(args[1] - args[0]) + args[0]
    }
    if(args.length){
        return Math.random()*args[0]
    }
    return Math.random()
}