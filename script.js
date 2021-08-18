Game().start()
Game().pixelate(0.5)

for(let i = 0; i < 33; i++){
    let e = new Entity()
    e.setPos(getRes().mul(Math.random(), 0))
    e.setScale(10)
    e.setAng(deg(5))
}











