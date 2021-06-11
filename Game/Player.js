// 8888888b.  888                                    
// 888   Y88b 888                                    
// 888    888 888                                    
// 888   d88P 888  8888b.  888  888  .d88b.  888d888 
// 8888888P"  888     "88b 888  888 d8P  Y8b 888P"   
// 888        888 .d888888 888  888 88888888 888     
// 888        888 888  888 Y88b 888 Y8b.     888     
// 888        888 "Y888888  "Y88888  "Y8888  888     
//                              888                  
//                         Y8b d88P                  
//                          "Y88P"           
class Player {
	constructor(ent, team = 0, ai = false){
		this.ent = ent
		this.perks = []
		this.team = team
		this.ai = ai
	}
	
	addPerk(perk){
		console.log(perk);
		perk.team = this.team
		perk.ent = this.ent
		this.perks.push(perk)
		if(!this.ai){
			perk.render()
		}
		return perk
	}
	
	perk(name){
		if(typeof(name) == 'string'){
			for(let perk of this.perks){
				if(perk.name == name){
					return perk
				}
			}
		}
		else{
			return this.perks[name - 1]
		}
	}
	
	allPerksTest(){
		this.addPerk(perkDict('SpawnSome'))
		this.addPerk(perkDict('SpawnBig'))
		// this.addPerk(getPerk('Levi'))
		// this.addPerk(getPerk('Spin'))
		// this.addPerk(getPerk('Explode'))
		// this.addPerk(getPerk('Grow'))
		// this.addPerk(getPerk('Jump'))
		// this.addPerk(getPerk('Randomize'))
		// this.addPerk(getPerk('Reproduce'))
		// this.addPerk(getPerk('Split'))
		// this.addPerk(getPerk('Swap'))
		// this.addPerk(getPerk('Union'))
	}
}