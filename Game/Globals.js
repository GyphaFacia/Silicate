function createGlobal(name, defaultValue){
    window[name] = defaultValue
}

function ensureGlobal(name, defaultValue){
    if(window[name] == undefined){
        createGlobal(name, defaultValue)
    }
}