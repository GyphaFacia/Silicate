function createBackgroundLayer(){
    let bg = createLayer('background')
    
    bg.autoSize(0.1)
    
    let cnv = bg.cnv
    let ctx = bg.ctx
    let rect = bg.rect
    
    let skyGrad = ctx.createLinearGradient(0, 0, 0, cnv.height);
    skyGrad.addColorStop(0, '#555');
    skyGrad.addColorStop(1, '#000');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    
    let sunGrad = ctx.createLinearGradient(0, 0, 0, cnv.height);
    sunGrad.addColorStop(0, '#555');
    sunGrad.addColorStop(1, '#000');
    ctx.fillStyle = sunGrad
    ctx.fillRect(0, 0, cnv.width, cnv.height);
}

createBackgroundLayer()













