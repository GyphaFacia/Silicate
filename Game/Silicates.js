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
}