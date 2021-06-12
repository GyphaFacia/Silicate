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
	constructor(ent, team = 0){
		this.ent = ent
		this.perks = []
		this.team = team
		this.ai = true
	}
	
	addPerk(perk){
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
		// this.addPerk(perkDict('Joker'))
		// this.addPerk(perkDict('Levi'))
		// this.addPerk(perkDict('Spin'))
		// this.addPerk(perkDict('Explode'))
		// this.addPerk(perkDict('Grow'))
		// this.addPerk(perkDict('Jump'))
		// this.addPerk(perkDict('Randomize'))
		// this.addPerk(perkDict('Reproduce'))
		// this.addPerk(perkDict('Split'))
		// this.addPerk(perkDict('Swap'))
		// this.addPerk(perkDict('Union'))
	}
	
	player(){
		for(let perk of this.perks){
			perk.render()
		}
		this.ai = false
		return this
	}
	
	aiStart(uptimeMin = 1000, uptimeMax = 2000){
		this.ai = true
		this.uptimeMin = uptimeMin
		this.uptimeMax = uptimeMax
		this.aiUpdate()
		return this
	}
	
	aiUpdate(){
		let perks = []
		for(let perk of this.perks){
			perks.push(perk)
		}
		for(let i = 0; i < perks.length; i++){
			let perk = randelt(perks)
			if(perk.oncooldown){ 
				continue 
			}
			perk.optimalCast()
			break
		}
		
		setTimeout(()=>{
			this.aiUpdate()
		}, randint(this.uptimeMin, this.uptimeMax))
	}
}












