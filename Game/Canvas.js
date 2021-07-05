var ctx, cnv
var Engine, Runner, Bodies, Composite, engine

function getRes(){return vec(cnv.width, cnv.height)}
function getCenter(){return getRes().div(2)}
function cursor(){return window.mousePos}

function canvasInit(){
    cnv = document.body.addElement('game_canvas', 'canvas')
    cnv.width = window.innerWidth
    cnv.height = window.innerHeight
    ctx = cnv.getContext('2d')
    window.requestAnimationFrame(gameTick)
    
    document.onmousemove = (e)=>{window.mousePos = vec(e.clientX, e.clientY)}
    window.mousePos = getCenter()
}

function engineInit(){
    Engine = Matter.Engine
    Runner = Matter.Runner
    Bodies = Matter.Bodies
    Composite = Matter.Composite
    
    engine = Engine.create()
    
    window.runner = Runner.create()
    Runner.run(runner, engine)
}

function clearCanvas(){
    ctx.clearRect(0, 0, ...getRes().$)
}

function gameLoop(){
    setInterval(()=>{
        clearCanvas()
        gameTick()
    }, 25);
}



























