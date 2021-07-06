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
    
    testAllPerks(){
        this.addPerk(SpawnSome)
        this.addPerk(SpawnBig)
        this.addPerk(Explode)
        this.addPerk(Grow)
        this.addPerk(Joker)
        this.addPerk(Jump)
        this.addPerk(Kill)
        this.addPerk(Levi)
        this.addPerk(Randomize)
        this.addPerk(Reproduce)
        this.addPerk(Spin)
        this.addPerk(Split)
        this.addPerk(Swap)
        this.addPerk(Union)
    }
}


class Ply extends Player{
    first(){
        this.team = 1
        
        this.addPerk(SpawnSome)
        this.addPerk(Grow)
        this.addPerk(Reproduce)
        this.addPerk(Union)
        
        
        this.render()
        for(let perk of this.perks){
            perk.level = 5
        }
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
        this.team = 2
    }
    
    spawnSilicate(pos = getCenter()){
        let e = new Silly()
        e.setScale(10)
        e.setPos(pos)
        e.team = this.team
        e.color = Hsl(69, 100, 40)
        return e
    }
}
























