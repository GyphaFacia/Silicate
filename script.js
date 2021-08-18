Game().start()
Game().pixelate(0.25)

for(let i = 0; i < 100; i++){
    let e = new Entity()
    e.setPos(getRes().mul(Math.random(), 0))
    e.setScale(5+Math.random()*5)
    e.setAng(deg(5))
}











