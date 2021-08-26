GAME.start()

let root = GAME.addEntity()
root.afterDraw = function(){
    let eff = GAME.addEffect()
    eff.color = '#fff'
    eff.width = 0
    eff.ocolor = '#f00'
    eff.setPos(CURSOR)
    eff.setScale(relvec(0.1))
    eff.update = function(){
        let x = (this.r-0.5)/5
        this.setPos(this.getPos().sub(x, this.r/2+1))
        
        if(this.killOOB()){
            console.log(this.collection.length);
        }
    }
}

