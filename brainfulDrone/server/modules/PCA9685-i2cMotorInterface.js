const config = require('./config.js');
Gpio = require('pigpio').Gpio;
motor13 = new Gpio(13, {mode: Gpio.OUTPUT});
motor12 = new Gpio(12, {mode: Gpio.OUTPUT});
motor18 = new Gpio(18, {mode: Gpio.OUTPUT});
let self ={
    auto : false,
    address : config.motorAddress ,
    motors : [13,12,17],
    motorsArr : [motor13,motor12,motor17,motor18],
    settings :{ kickUpTick : 0 , kickDownTickMin : 40 , kickDownTickMax : 600 },
    wire : null,
    init : (next)=>{ 
        self.haltAll();
        next();
    },
    testInit:(allOne,next)=>{
    },
    haltAll:(next)=>{

        for(let i = 0 ; i < self.motors.length; i++){
            self.motorsArr[i].pwmWrite(30);
        }

    },
    throttle:(selected,speed,next)=>{
        self.motorsArr[selected].pwmWrite(speed);
    },
    multiThrottle:(selected,speeds,next)=>{

    },    
    allThrottle:(speed,next)=>{
        for(let i = 0 ; i < self.motors.length; i++){
            self.motorsArr[i].pwmWrite(speed);
        }
    },    
}

module.exports = self ;
