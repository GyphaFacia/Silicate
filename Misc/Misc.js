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