class Perk {
    constructor() {
        
    }
    
    get name(){return this.constructor.name}
    
    draw(){
        // document.querySelector('.perks').addHtml(`
        //     <div class="perk">
    	// 		<img src="./src/Perks/${this.name}.svg" alt="" class="perk__img">
    	// 		<div class="perk__cooldown"></div>
    	// 	</div>
        // `)
        
        document.querySelector('.perks').addHtml(`
            <img src="./src/Perks/${this.name}.svg" alt="" class="perk">
        `)
    }
}

class SpawnSome extends Perk {
    
}

let p = new SpawnSome()
p.draw()
p.draw()
p.draw()
p.draw()





























