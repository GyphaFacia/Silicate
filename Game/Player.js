class Player {
    constructor(team = 0){
        this.team = team
        this.first()
        this.second()
    }
    
    first(){}
    second(){}
    
    spawnSilicate(pos = getCenter()){
        let e = new Silly()
        e.setScale(10)
        e.setPos(pos)
        e.team = this.team
        return e
    }
    
    getMine(){
        return ENTITIES.slice().filter(e => e.team == this.team)
    }
    
    getOthers(){
        return ENTITIES.slice().filter(e => e.team != this.team)
    }
}




























