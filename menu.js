let cnv = document.querySelector('canvas')
ctx = cnv.getContext('2d')

let scl = cnv.parentNode.getBoundingClientRect()

cnv.width = scl.width
cnv.height = scl.width

var SIDES = 6
var EYECLR = Clr(255, 200, 0)
var COLOR = Clr(25)
var RAD = cnv.width/2.5

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


const colors = '000 '.repeat(25)
const eyecolors = '000 '.repeat(25)
const shapes = '3 4 5 6 r'

let sect = document.querySelector('.options-color')
for(let option of colors.split(' ')){
    let itm = sect.addElement('options-item', 'div')
    let cont = itm.addElement('options-item__content', 'span')
    let btn = itm.addElement('options-item__button', 'button')
    btn.innerText = random()>0.5 ? 'Buy' : 'Pick'
    cont.style.backgroundColor = `#${option}`
}

sect = document.querySelector('.options-eyecolor')
for(let option of eyecolors.split(' ')){
    let itm = sect.addElement('options-item', 'div')
    let cont = itm.addElement('options-item__content', 'span')
    let btn = itm.addElement('options-item__button', 'button')
    btn.innerText = random()>0.5 ? 'Buy' : 'Pick'
    cont.style.backgroundColor = `#${option}`
}

sect = document.querySelector('.options-shape')
for(let option of shapes.split(' ')){
    let itm = sect.addElement('options-item', 'div')
    let cont = itm.addElement('options-item__content', 'span')
    let btn = itm.addElement('options-item__button', 'button')
    btn.innerText = random()>0.5 ? 'Buy' : 'Pick'
    cont.style.backgroundImage = `url(./src/Shapes/${option}.svg)`
}


// <div class="options-item">
//     <span class="options-item__content" style="background-color: #501"></span>
//     <button class="options-item__button">Buy</button>
// </div>























