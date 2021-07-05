var cnv, eng, ctx

function getRes(){return vec(cnv.width, cnv.height)}
function getCenter(){return getRes().div(2)}

function canvasInit(){
    cnv = document.body.addElement('game_canvas', 'canvas')
    cnv.width = window.innerWidth
    cnv.height = window.innerHeight
    ctx = cnv.getContext('2d')
    window.requestAnimationFrame(gameTick)
}

function gameTick(){
    ctx.clearRect(0, 0, ...getRes().$);
    window.requestAnimationFrame(gameTick)
}

function gameStart(){
    console.clear()
    canvasInit()
    console.log(getRes().str);
    console.log(getCenter().str);
}
setTimeout(()=>{gameStart()}, 100)































