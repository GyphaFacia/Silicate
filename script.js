function createBackgroundLayer(){
    let bg = createLayer('background')

    bg.autoSize(0.1)
    
    let cnv = bg.cnv
    let ctx = bg.ctx
    
    let w = cnv.width
    let h = cnv.height
    
    let skyGrad = ctx.createLinearGradient(0, 0, 0, h)
    skyGrad.addColorStop(0, '#555')
    skyGrad.addColorStop(1, '#000')
    ctx.fillStyle = skyGrad
    ctx.fillRect(0, 0, cnv.width, cnv.height)
}

function createMapLayer(){
    let bg = createLayer('map')
    bg.autoSize(0.1)
}

function createEntitiesLayer(){
    let bg = createLayer('entities')
    bg.autoSize(0.1)
}

function createEffectsLayer(){
    let bg = createLayer('effects')
    bg.autoSize(0.1)
}

createBackgroundLayer()
createMapLayer()
createEntitiesLayer()
createEffectsLayer()









