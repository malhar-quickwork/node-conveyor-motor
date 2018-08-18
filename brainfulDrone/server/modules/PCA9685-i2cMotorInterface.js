const config = require('./config.js');
/* const raspi = require('raspi');
const pwm = require('raspi-pwm'); */
//const pwm = require('raspi-soft-pwm');
const Gpio = require('pigpio').Gpio;
const led = new Gpio(17, {mode: Gpio.OUTPUT});
let pwm12,pwm13,pwm18;
let self ={
    auto : false,
    address : config.motorAddress ,
    motors : [13,12,18],
    motorsArr : [],
    settings :{ kickUpTick : 0 , kickDownTickMin : 40 , kickDownTickMax : 600 },
    wire : null,
    init : (next)=>{ 
        raspi.init(() => {
            pwm12 = new Gpio(12, {mode: Gpio.OUTPUT}); // new pwm.PWM('GPIO12');
            pwm13 = new Gpio(13, {mode: Gpio.OUTPUT}); // new pwm.PWM('GPIO13');
            pwm18 = new Gpio(18, {mode: Gpio.OUTPUT}); //new pwm.PWM('GPIO18');
            self.motorsArr.push(pwm13);            
            self.motorsArr.push(pwm12);
            self.motorsArr.push(pwm18);
            console.log(self.motorsArr[1]);
        });
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
		//if(speed < 130){
            console.log('Speed On GPIO' + self.motors[selected-1] + ' : ',speed);
            console.log(self.motorsArr[selected-1]);
		    self.motorsArr[selected-1].pwmWrite(speed);
		    console.log('Speed On GPIO' + self.motors[selected-1] + ' : ',speed);
	    //}
    },
    multiThrottle:(selected,speeds,next)=>{

    },    
    allThrottle:(speed,next)=>{
        for(let i = 0 ; i < self.motorsArr.length; i++){
            self.motorsArr[i].write(speed);
        }
    },    
}
process.on('SIGINT', function() {
	for(let i = 0 ; i < self.motorsArr.length; i++){
        self.motorsArr[i].digitalWrite(0);
    }
Gpio.terminate();
	console.log('Closing');
});
module.exports = self ;
