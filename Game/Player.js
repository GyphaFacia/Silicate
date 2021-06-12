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
		this.addPerk(perkDict('Jump'))
		this.addPerk(perkDict('Grow'))
		this.addPerk(perkDict('Joker'))
		// this.addPerk(perkDict('Reproduce'))
		// this.addPerk(perkDict('Union'))
		// this.addPerk(perkDict('Levi'))
		// this.addPerk(perkDict('Spin'))
		// this.addPerk(perkDict('Explode'))
		// this.addPerk(perkDict('Randomize'))
		// this.addPerk(perkDict('Split'))
		// this.addPerk(perkDict('Swap'))
		// this.addPerk(perkDict('Chameleon'))
	}
	
	start(){
		this.perks[0].applyAt(getRes().mul(0.1 + 0.8*(this.team-1), 0.1))
		for(let perk of this.perks){
			perk.setCooldown()
		}
	}
	
	playerStart(){
		for(let perk of this.perks){
			perk.render()
		}
		this.ai = false
		this.start()
		return this
	}
	
	botEasy(){
		this.aiStart(3000, 6000)
	}
	
	botHard(){
		this.aiStart(1000, 2000)
	}
	
	botHell(){
		this.aiStart(10, 100)
	}
	
	aiStart(uptimeMin = 1000, uptimeMax = 2000){
		this.ai = true
		this.uptimeMin = uptimeMin
		this.uptimeMax = uptimeMax
		this.start()
		this.aiUpdate()
		this.perks[0].optimalCast()
		return this
	}
	
	aiUpdate(){
		try {
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
		} catch (e) {
			console.error(e)
		} finally {
			setTimeout(()=>{
				this.aiUpdate()
			}, randint(this.uptimeMin, this.uptimeMax))
		}
		
	}
}












