const config = require('./config.js');
Gpio = require('pigpio').Gpio;
motor13 = new Gpio(13, {mode: Gpio.OUTPUT});
let self ={
    auto : false,
    address : config.motorAddress ,
    motors : [6,7,9,10],
    settings :{ kickUpTick : 0 , kickDownTickMin : 40 , kickDownTickMax : 600 },
    wire : null,
    init : (next)=>{ 
        self.haltAll();
        next();
    },
    testInit:(allOne,next)=>{
    },
    haltAll:(next)=>{

    },
    throttle:(selected,speed,next)=>{
        motor13.pwmWrite(245);
    },
    multiThrottle:(selected,speeds,next)=>{

    },    
    allThrottle:(speed,next)=>{
    },    
}

module.exports = self ;
