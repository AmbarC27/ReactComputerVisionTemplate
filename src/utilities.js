const labelMap = {
    0: { name: '0', color: 'red' },
    1: { name: '1', color: 'red' },
    2: { name: '2', color: 'red' },
    3: { name: '3', color: 'red' },
    4: { name: '4', color: 'red' },
    5: { name: '5', color: 'red' },
    6: { name: '6', color: 'red' },
    7: { name: '7', color: 'red' },
    8: { name: '8', color: 'red' },
    9: { name: '9', color: 'red' },
    10: { name: 'a', color: 'red' },
    11: { name: 'b', color: 'red' },
    12: { name: 'c', color: 'red' },
    13: { name: 'd', color: 'red' },
    14: { name: 'e', color: 'red' },
    15: { name: 'f', color: 'red' },
    16: { name: 'g', color: 'red' },
    17: { name: 'h', color: 'red' },
    18: { name: 'i', color: 'red' },
    19: { name: 'j', color: 'red' },
    20: { name: 'k', color: 'red' },
    21: { name: 'l', color: 'red' },
    22: { name: 'm', color: 'red' },
    23: { name: 'n', color: 'red' },
    24: { name: 'o', color: 'red' },
    25: { name: 'p', color: 'red' },
    26: { name: 'q', color: 'red' },
    27: { name: 'r', color: 'red' },
    28: { name: 's', color: 'red' },
    29: { name: 't', color: 'red' },
    30: { name: 'u', color: 'red' },
    31: { name: 'v', color: 'red' },
    32: { name: 'w', color: 'red' },
    33: { name: 'x', color: 'red' },
    34: { name: 'y', color: 'red' },
    35: { name: 'z', color: 'red' }
}

// Define a drawing function
export const drawRect = (boxes, classes, scores, threshold, imgWidth, imgHeight, ctx)=>{
    for(let i=0; i<=boxes.length; i++){
        if(boxes[i] && classes[i] && scores[i]>threshold){
            // Extract variables
            const [y,x,height,width] = boxes[i]
            const text = classes[i]
            
            // Set styling
            ctx.strokeStyle = labelMap[text]['color']
            ctx.lineWidth = 10
            ctx.fillStyle = 'white'
            ctx.font = '30px Arial'         
            
            // DRAW!!
            ctx.beginPath()
            ctx.fillText(labelMap[text]['name'] + ' - ' + Math.round(scores[i]*100)/100, x*imgWidth, y*imgHeight-10)
            ctx.rect(x*imgWidth, y*imgHeight, width*imgWidth/2, height*imgHeight/1.5);
            ctx.stroke()
        }
    }
}