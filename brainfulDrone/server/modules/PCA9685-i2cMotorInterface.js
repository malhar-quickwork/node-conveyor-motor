const config = require('./config.js');
/* const raspi = require('raspi');
const pwm = require('raspi-pwm'); */
//const pwm = require('raspi-soft-pwm');
const pigpio = require('pigpio');
const Gpio = pigpio.Gpio;
process.on('SIGINT', function() {
	for(let i = 0 ; i < self.motorsArr.length; i++){
        self.motorsArr[i].pwmWrite(0);
    }
    pigpio.terminate();
	console.log('Closing');
});
process.on('SIGTERM', function() {
	for(let i = 0 ; i < self.motorsArr.length; i++){
        self.motorsArr[i].pwmWrite(0);
    }
    pigpio.terminate();
	console.log('Closing');
});
let pwm12,pwm13,pwm18;
let self ={
    auto : false,
    address : config.motorAddress ,
    motors : [13,12,18],
    motorsArr : [],
    settings :{ kickUpTick : 0 , kickDownTickMin : 40 , kickDownTickMax : 600 },
    wire : null,
    init : (next)=>{ 
        pigpio.configureClock(2, pigpio.CLOCK_PWM);
        pigpio.initialize();
       /*  raspi.init(() => { */
            pwm12 = new Gpio(12, {mode: Gpio.OUTPUT}); // new pwm.PWM('GPIO12');
            pwm13 = new Gpio(13, {mode: Gpio.OUTPUT}); // new pwm.PWM('GPIO13');
            pwm18 = new Gpio(18, {mode: Gpio.OUTPUT}); //new pwm.PWM('GPIO18');        
            self.motorsArr.push(pwm13);            
            self.motorsArr.push(pwm12);
            self.motorsArr.push(pwm18);
            for(let i = 0 ; i < self.motorsArr.length; i++){
            self.motorsArr[i].pwmFrequency(100);
            self.motorsArr[i].pwmWrite(9);
            }
            console.log(self.motorsArr[1]);
       /*  }); */
        next();
    },
    testInit:(allOne,next)=>{
    },
    haltAll:(next)=>{

        for(let i = 0 ; i < self.motorsArr.length; i++){
            self.motorsArr[i].pwmWrite(30);
        }

    },
    throttle:(selected,speed,next)=>{
		if(speed < 255){
            console.log('Speed On GPIO' + self.motors[selected-1] + ' : ',speed);
            console.log(self.motorsArr[selected-1]);
		    self.motorsArr[selected-1].pwmWrite(speed);
	    }
    },
    multiThrottle:(selected,speeds,next)=>{

    },    
    allThrottle:(speed,next)=>{
        for(let i = 0 ; i < self.motorsArr.length; i++){
            self.motorsArr[i].write(speed);
        }
    },    
}

module.exports = self ;
