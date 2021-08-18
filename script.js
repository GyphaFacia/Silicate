Game().start()
Game().pixelate(0.2)

for(let i = 0; i < 100; i++){
    let e = new Entity()
    e.setPos(getRes().mul(Math.random(), 0))
    e.setScale(5+Math.random()*3)
    e.setAng(deg(5))

    e.afterDraw = function(){
        if(this.r > 0.85){
              this.drawEye()
        }
    }
}

let l = new Land()










