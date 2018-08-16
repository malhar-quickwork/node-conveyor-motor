const config = require('./config.js');
const raspi = require('raspi');
const PWM = require('raspi-pwm').PWM;
let pwm12,pwm13,pwm17;
raspi.init(() => {
	pwm12 = new PWM('GPIO12');
	pwm13 = new PWM('GPIO13');
	pwm17 = new PWM('GPIO17');
});
let self ={
    auto : false,
    address : config.motorAddress ,
    motors : [13,12,18],
    motorsArr : [pwm13,pwm12,pwm17],
    settings :{ kickUpTick : 0 , kickDownTickMin : 40 , kickDownTickMax : 600 },
    wire : null,
    init : (next)=>{ 
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
		if(speed < 130){
		self.motorsArr[selected].write(speed);
		console.log('Speed On GPIO' + self.motors[selected] + ' : ',speed);
	}
    },
    multiThrottle:(selected,speeds,next)=>{

    },    
    allThrottle:(speed,next)=>{
        for(let i = 0 ; i < self.motors.length; i++){
            self.motorsArr[i].write(speed);
        }
    },    
}

module.exports = self ;
