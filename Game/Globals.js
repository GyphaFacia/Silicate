function createGlobal(name, defaultValue){
    window[name] = defaultValue
    return window[name]
}

function ensureGlobal(name, defaultValue){
    if(window[name] == undefined){
        createGlobal(name, defaultValue)
    }
    return window[name]
}