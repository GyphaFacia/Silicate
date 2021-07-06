class Crisp extends Ngon {
    first(ent){
        this.sides = randint(3, 6)
        this.color = ent.color
        
        this.team = 0
        setTimeout(()=>{
            this.remove()
        }, random(500, 1000))
    }
    
    second(){
        this.setPos(getCenter())
        this.setScale(random(4, 5))
        this.setMass(0.001)
        this.setVel(random(-2, 2), -random(5))
    }
}

class Silly extends Ngon {
    first(){
        this.sides = 6
    }
    
    second(){
        this.color = Hsl(-45, 50, 15)
        this.ocolor = Clr(0)
        this.width = 1
        if(random()>0.8){
            this.afterDraw = this.drawEye
        }
    }
    
    last(){
        let area = this.getScale().x
        area = area*area*pi()
        let n = area / 100
        for(let i = 0; i < n; i++){
            let c = new Crisp(this)
            let v = vec(sin(720/n*i), cos(720/n*i))
            v = v.mul(i/n*this.getScale().x)
            v = v.add(this.getPos())
            c.setPos(v)
        }
    }
}




























