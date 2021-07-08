function handlePause(){
    PAUSED = !PAUSED
    
    if(PAUSED){
        document.querySelector('.pause-menu').classList.remove('hide')
        document.querySelector('.pause-button').classList.add('pause-button--paused')
        cnv.style.filter = 'drop-shadow(0 0 10px white) blur(10px)'
    }
    else{
        document.querySelector('.pause-menu').classList.add('hide')
        document.querySelector('.pause-button').classList.remove('pause-button--paused')
        cnv.style.filter = 'drop-shadow(0 0 1px white)'
    }
    
    for(let perk of PERKS){
        perk.cancel()
    }
    
    if(ENTITIES.length < 100){
        for(let host of [ENTITIES, CRISPS]){
            for(let ent of host){
                let static = PAUSED ? true : ent.stat
                ent.stat = ent.isStatic()
                Matter.Body.setStatic(ent.body, static)
            }
        }
    }
    
    for(let perk of document.querySelectorAll('.perk')){
        if(PAUSED){
            perk.classList.add('hide')
        }
        else{
            perk.classList.remove('hide')
        }
    }
}

function initPause(){
    let pb = document.body.addElement('pause-button', 'Button')
    let ico = pb.addElement('pause-button__ico')
    ico.classList.add('far')
    ico.classList.add('fa-pause-circle')
    
    document.querySelector('.pause-button').onclick = ()=>{
        handlePause()
    }
    
    document.onkeyup = (e)=>{
        if(e.key === "Escape") {
            handlePause()
        }
    }
}