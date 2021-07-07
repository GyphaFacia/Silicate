class Crisp extends Ngon {
    assignHost(){this.host = CRISPS}
    
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
        // this.color = Hsl(-15, 100, 15)
        this.color = Clr(0)
        
        if(random()>0.8){
            this.afterDraw = this.drawEye
        }
    }
    
    last(){
        playSound('click', random(0.1, 0.25), random(0.25, 0.75), random(255))
        let area = this.getScale().x
        area = area*area*pi()
        let n = area / 100
        n = n > __MAXCRISPS ? __MAXCRISPS : n
        for(let i = 0; i < n; i++){
            setTimeout(()=>{
                if(CRISPS.length > __MAXCRISPS){return null}
                let c = new Crisp(this)
                let v = vec(sin(360*10/n*i), cos(720/n*i))
                v = v.mul((1 - i/n)*this.getScale().x)
                v = v.add(this.getPos())
                v = v.add(random(-5, 5), random(-5, 5))
                c.setPos(v)
            }, i*2)
        }
    }
}




























