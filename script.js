Game().start()
Game().pixelate(0.33)

let pix = 0.2
let scl = 1 / pix

// for(let i = 0; i < 100; i++){
//     let e = new Entity()
//     e.setPos(getRes().mul(Math.random(), 0))
//     e.setScale(scl+Math.random()*scl)
//     e.setAng(deg(5))
// 
//     e.afterDraw = function(){
//         if(this.r > 0.85){
//               this.drawEye()
//         }
//     }
// }

let l = new Land()
let m = new Menhir()
m.setScale(25)
m.setPos(getRes().mul(0.5, 0.63))
m.setStatic()

// for(let i = 0; i < 255; i++){
//     setTimeout(function () {
//         let e = new Effect()
//         e.setPos(getRes().div(2))
//         e.setVel(randvec(1))
//     }, i*1);
// }

