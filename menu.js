let cnv = document.querySelector('canvas')
ctx = cnv.getContext('2d')

let scl = cnv.parentNode.getBoundingClientRect()

cnv.width = scl.width
cnv.height = scl.width

var SIDES = 6
var EYECLR = Clr(255, 200, 0)
var COLOR = Clr(25)
var RAD = cnv.width/2.5
var PERKS = 'SpawnSome Grow Reproduce Union'.split(' ')
drawPerks()

document.onmousemove = (e)=>{window.mousePos = vec(e.clientX, e.clientY)}
function cursor(){return window.mousePos}
window.mousePos = vec()

setInterval(()=>{
    ctx.beginPath()
    ctx.clearRect(0, 0, cnv.width, cnv.height)
    
    ctx.fillStyle = COLOR.hex
    ctx.filter = `drop-shadow(0 0 1px #fff) drop-shadow(0 0 25px #000)`
    
    ctx.save()
    ctx.translate(cnv.width/2, cnv.height/2)
        
    let ang = time(5)
    ctx.moveTo(...vec(sin(ang), cos(ang)).mul(RAD).$)
    for(let i = 1; i < SIDES; i++){
        let ang = 360/SIDES*i + time(5)
        ctx.lineTo(...vec(sin(ang), cos(ang)).mul(RAD).$)
    }
    
    ctx.closePath()
    ctx.fill()
    ctx.restore()
    
    ctx.filter = 'none'
    let pos = vec(cnv.width/2)
    let scl = vec(RAD)
    switch (SIDES) {
        case 3:
            scl = scl.div(1.5)
            break;
        case 50:
            scl = scl.mul(1.25)
            break;
    }
    
    let eyeclr = EYECLR
    
    ctx.beginPath()
    ctx.fillStyle = Hsl(15, 100, 95).hex
    ctx.arc(...pos.$, scl.x/1.75, 0, 2*pi())
    ctx.fill()
    
    pos = pos.add(cursor().sub(pos).ort.mul(scl.x/15))
    
    ctx.beginPath()
    let eyeclr2 = Hsl(eyeclr.h, eyeclr.s, eyeclr.l-15)
    ctx.fillStyle = eyeclr2.hex
    ctx.arc(...pos.$, scl.x/2.25, 0, 2*pi())
    ctx.fill()
    
    ctx.beginPath()
    ctx.fillStyle = eyeclr.hex
    ctx.arc(...pos.$, scl.x/2.5, 0, 2*pi())
    ctx.fill()
    
    pos = pos.add(cursor().sub(pos).ort.mul(scl.x/20))
    
    ctx.beginPath()
    ctx.fillStyle = '#000'
    ctx.arc(...pos.$, scl.x/3, 0, 2*pi())
    ctx.fill()
    
    ctx.beginPath()
    ctx.fillStyle = '#fffe'
    ctx.arc(...pos.sub(scl.x*0.1).$, scl.x/7, 0, 2*pi())
    ctx.fill()
}, 16)


// const colors = '000 500 050 005 502 450 305 aaa'
// const eyecolors = 'd9ff00 0af fa0 f05 502 111 305 aaa 0ff'
const colors = '000 111 502 305 030 aaa fab fa5 fff 003'
const eyecolors = 'df0 0ff 09f fa0 f05 fab fa5 bbb 000'
const shapes = '3 4 5 6 r'
const perks = 'SpawnSome SpawnBig Explode Grow Joker Jump Kill Levi Randomize Reproduce Spin Split Swap Union'

let sect = document.querySelector('.options-color')
for(let option of colors.split(' ')){
    let itm = sect.addElement('options-item', 'div')
    let cont = itm.addElement('options-item__content', 'span')
    let btn = itm.addElement('options-item__button', 'button')
    btn.innerText = 'Pick'
    cont.style.backgroundColor = `#${option}`
    
    itm.onclick = (e)=>{
        COLOR = Hex(option)
        saveOptions()
    }
}
COLOR = Hex(colors.split(' ')[0])


sect = document.querySelector('.options-eyecolor')
for(let option of eyecolors.split(' ')){
    let itm = sect.addElement('options-item', 'div')
    let cont = itm.addElement('options-item__content', 'span')
    let btn = itm.addElement('options-item__button', 'button')
    btn.innerText = 'Pick'
    cont.style.backgroundColor = `#${option}`
    
    itm.onclick = (e)=>{
        EYECLR = Hex(option)
        saveOptions()
    }
}
EYECLR = Hex(eyecolors.split(' ')[0])

sect = document.querySelector('.options-shape')
for(let option of shapes.split(' ')){
    let itm = sect.addElement('options-item', 'div')
    let cont = itm.addElement('options-item__content', 'span')
    let btn = itm.addElement('options-item__button', 'button')
    btn.innerText = 'Pick'
    cont.style.backgroundImage = `url(./src/Shapes/${option}.svg)`
    
    itm.onclick = (e)=>{
        SIDES = parseInt(option == 'r' ? 50 : option)
        saveOptions()
    }
}

sect = document.querySelector('.options-perks')
for(let option of perks.split(' ')){
    let itm = sect.addElement('options-item', 'div')
    let title = itm.addElement('options-item__title', 'p')
    let cont = itm.addElement('options-item__content', 'span')
    let btn = itm.addElement('options-item__button', 'button')
    btn.innerText = 'Pick'
    title.style.margin = '50px 0 0 0'
    title.innerText = option
    cont.style.backgroundImage = `url(./src/Perks/${option}.svg)`
    cont.style.filter = 'invert(1)'
    cont.style.border = 'none'
    
    itm.onclick = (e)=>{
        addPerk(option)
        drawPerks()
    }
}

function drawPerks(){
    let perksSect = document.querySelector('.preview-perks-wrapper')
    perksSect.innerHTML = ``
    
    for(let perk of PERKS){
        let perkElt = perksSect.addElement('perk', 'dev')
        perkElt.applyCss(`
            background-image: url(./src/Perks/${perk}.svg);
        `)
        
        perkElt.onclick = (e)=>{
            perkElt.fade = setInterval(()=>{
                let alpha = window.getComputedStyle(perkElt)['opacity']
                alpha = parseFloat(alpha) - 0.05
                console.log(alpha);
                perkElt.style.opacity = alpha
                if(alpha < 0){
                    clearInterval(perkElt.fade)
                    removePerk(perk)
                    drawPerks()
                }
            }, 10)
        }
    }
}

function addPerk(perk){
    if(PERKS.length + 1 > 9){
        PERKS.shift()
    }
    PERKS.push(perk)
    saveOptions()
}

function removePerk(perk){
    for(let i = 0; i < PERKS.length; i++){
        if(PERKS[i] == perk){
            PERKS.splice(i, 1)
            break
        }
    }
    saveOptions()
}

function saveOptions(){
    let obj = {}
    obj.color = COLOR
    obj.eyeclr = EYECLR
    obj.perks = PERKS
    obj.sides = SIDES > 25 ? 25 : SIDES
    obj.plyname = document.querySelector('input').value
    
    obj = JSON.stringify(obj)
    
    console.log(obj);
    localStorage.setItem('player', obj)
}

function loadOptions(){
    let obj = localStorage.getItem('player')
    obj = JSON.parse(obj)

    COLOR = Clr(...obj.color.$)
    EYECLR = Clr(...obj.eyeclr.$)
    PERKS = obj.perks
    SIDES = obj.sides
    document.querySelector('input').value = obj.plyname
    drawPerks()
    
    console.log(obj);
    return obj
}

document.querySelector('.preview__playbutton').onclick = (e)=>{
    saveOptions()
    window.location.href = 'game.html'
}

console.log(loadOptions())























