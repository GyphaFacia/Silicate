var ctx, cnv
var Engine, Runner, Bodies, Composite, engine

function getRes(){return vec(cnv.width, cnv.height)}
function getCenter(){return getRes().div(2)}
function cursor(){return window.mousePos}

function collisionsInit(){
    Matter.Events.on(engine, 'collisionStart', function(event) {
        for(let i = 0; i < event.pairs.length; i++){
            let a = event.pairs[i].bodyA.renderelt
            let b = event.pairs[i].bodyB.renderelt
            
            setTimeout(()=>{
                if(!a || !b){
                    return null
                }
                if(a.team && b.team && a.team != b.team){
                    let scla = a.getScale().x*a.getScale().x - b.getScale().x*b.getScale().x
                    let sclb = b.getScale().x*b.getScale().x - a.getScale().x*a.getScale().x
                    if(scla <= __MINSCALE*__MINSCALE){
                        a.remove(1)
                    }
                    else{
                        a.setScale(Math.sqrt(scla))
                    }
                    if(sclb <= __MINSCALE*__MINSCALE){
                        b.remove(1)
                    }
                    else{
                        b.setScale(Math.sqrt(sclb))
                    }
                }
            }, 25)
        }
    })
}

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

function playSound(src, volume = 0.1, pitch = 1, delay = 0){
    setTimeout(()=>{
        let sound = document.createElement('audio')
        sound.src = `./src/Sounds/${src}.mp3`
        sound.removeAttribute('controls')
        
        sound.volume = volume
        sound.mozPreservesPitch = false;
        sound.playbackRate  = pitch
        
        sound.play()
        sound.remove()
    }, delay)
}


























