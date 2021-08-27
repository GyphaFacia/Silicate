ensureGlobe('PLAYERS', [])
class Player {
    constructor(team = 0){
        this.team = team
        this.perks = []
        
        this.first(...arguments)
        this.second()
        
        PLAYERS.push(this)
    }
    
    get perks(){return PERKS.filter(perk => perk.team == this.team)}
    set perks(n){}
    
    first(){}
    second(){}
    
    render(){
        for(let perk of this.perks){
            perk.render()
        }
    }
    
    addPerk(name, cd = true){
        let perk = new name()
        this.perks.push(perk)
        perk.team = this.team
        perk.ply = this
        perk.cd = cd ? time() : 0
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

function allPerks(){
    return `SpawnSome
    SpawnBig
    Explode
    Grow
    Joker
    Jump
    Kill
    Levi
    Randomize
    Reproduce
    Spin
    Split
    Swap
    Union`.split('\n')
}

function perkname2perk(){
    let arr = {
        'SpawnSome': SpawnSome,
        'SpawnBig': SpawnBig,
        'Explode': Explode,
        'Grow': Grow,
        'Joker': Joker,
        'Jump': Jump,
        'Kill': Kill,
        'Levi': Levi,
        'Randomize': Randomize,
        'Reproduce': Reproduce,
        'Spin': Spin,
        'Split': Split,
        'Swap': Swap,
        'Union': Union,
    }
    return arr[arguments[0]]
}

function loadOptions(){
    let obj = localStorage.getItem('player')
    obj = JSON.parse(obj)
    return obj
}

class Ply extends Player{
    first(){
        this.color = Clr(0)
        this.eyeclr = Clr(255)
        this.name = 'Tester'
        
        this.team = arguments[0]
        for(let perk of loadOptions().perks){
            this.addPerk(perkname2perk(perk))
        }
        
        this.render()
        for(let perk of this.perks){
            perk.level = 5
        }
    }
    
    spawnSilicate(pos = getCenter()){
        playSound('pop', random(0.1, 0.25), random(0.5, 2), random(255))
        let e = new Silly(this.sides)
        e.color = this.color
        e.eyeclr = this.eyeclr
        e.setScale(__MINSCALE)
        e.setPos(pos)
        e.team = this.team
        return e
    }
}

class Bot extends Player{
    first(){
        this.team = arguments[0]
        
        this.color = Clr(0)
        this.eyeclr = Clr(255,0,0)
        this.sides = randelt([3, 4, 5, 6, 33])
        
        for(let i = 0; i < 4; i++){
            let perk = randelt(allPerks())
            perk = perk.trim()
            console.log(`Bot got ${perk} perk`);
            perk = perkname2perk(perk)
            this.addPerk(perk)
        }
        
        
        this.think()
    }
    
    think(){
        if(this.dead){return null}
        
        if(!PAUSED){
            let perks = this.perks
            for(let i = 0; i < perks.length; i++){
                let perk = randelt(perks)
                if(perk.cd){
                    continue
                }
                perk.optimalCast()
                break
            }
        }
        
        setTimeout(()=>{
            this.think()
        }, random(1000, 2000))
    }
    
    spawnSilicate(pos = getCenter()){
        let e = new Silly(this.sides)
        
        e.color = this.color
        e.eyeclr = this.eyeclr
        
        e.setScale(__MINSCALE)
        e.setPos(pos)
        e.team = this.team
        return e
    }
}
























