class Player {
    constructor(team = 0){
        this.team = team
        this.perks = []
        
        this.first()
        this.second()
    }
    
    first(){}
    second(){}
    
    render(){
        for(let perk of this.perks){
            perk.render()
        }
    }
    
    addPerk(name){
        let perk = new name()
        this.perks.push(perk)
        perk.team = this.team
        perk.ply = this
    }
    
    spawnSilicate(){}
    
    getMine(){
        return ENTITIES.slice().filter(e => e.team == this.team)
    }
    
    getOthers(){
        return ENTITIES.slice().filter(e => e.team != this.team)
    }
}


class Ply extends Player{
    first(){
        this.addPerk(SpawnSome)
        this.addPerk(SpawnSome)
        this.addPerk(SpawnSome)
        this.addPerk(SpawnSome)
        this.render()
    }
    
    spawnSilicate(pos = getCenter()){
        let e = new Silly()
        e.setScale(10)
        e.setPos(pos)
        e.team = this.team
        return e
    }
}

class Bot extends Player{
    first(){
        this.addPerk(SpawnSome)
        this.addPerk(SpawnSome)
        this.addPerk(SpawnSome)
        this.addPerk(SpawnSome)
    }
    
    spawnSilicate(pos = getCenter()){
        let e = new Silly()
        e.setScale(10)
        e.setPos(pos)
        e.team = this.team
        e.color = Clr(125, 0, 0)
        return e
    }
}
























