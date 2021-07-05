function getRes(){return vec(cnv.width, cnv.height)}
function getCenter(){return getRes().div(2)}

function canvasInit(){
    window.cnv = document.body.addElement('game_canvas', 'canvas')
    cnv.width = window.innerWidth
    cnv.height = window.innerHeight
    window.ctx = cnv.getContext('2d')
    window.requestAnimationFrame(gameTick)
}

function engineInit(){
    window.Engine = Matter.Engine
    window.Render = Matter.Render
    window.Runner = Matter.Runner
    window.Bodies = Matter.Bodies
    window.Composite = Matter.Composite
    
    window.engine = Engine.create()
    
    window.runner = Runner.create()
    Runner.run(runner, engine)
}

function clearCanvas(){
    ctx.clearRect(0, 0, ...getRes().$)
}

function gameTick(){
    clearCanvas()
    
    
    
    window.requestAnimationFrame(gameTick)
}

function gameStart(){
    console.clear()
    canvasInit()
    engineInit()
}
setTimeout(()=>{gameStart()}, 100)































