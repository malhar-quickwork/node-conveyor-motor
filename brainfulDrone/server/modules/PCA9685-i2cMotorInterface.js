const config = require('./config.js');
const raspi = require('raspi');
const PWM = require('raspi-pwm').PWM;
let pwm12,pwm13,pwm17;

let self ={
    auto : false,
    address : config.motorAddress ,
    motors : [13,12,18],
    settings :{ kickUpTick : 0 , kickDownTickMin : 40 , kickDownTickMax : 600 },
    wire : null,
    init : (next)=>{ 
        raspi.init(() => {
            pwm12 = new PWM('GPIO12');
            pwm13 = new PWM('GPIO13');
            pwm17 = new PWM('GPIO17');
        });
        next();
    },
    motorsArr : [pwm13,pwm12,pwm17],
    testInit:(allOne,next)=>{
    },
    haltAll:(next)=>{

        for(let i = 0 ; i < self.motors.length; i++){
            self.motorsArr[i].write(30);
        }

    },
    throttle:(selected,speed,next)=>{
		if(speed < 130){
            console.log('Speed On GPIO' + self.motors[selected-1] + ' : ',speed);
            console.log(self.motorsArr);
            for (let i = 0; i < self.motorsArr.length; i++){
                console.log(i);
                console.log(self.motorsArr[i]);
            }
		    //self.motorsArr[selected-1].write(speed);
		    console.log('Speed On GPIO' + self.motors[selected-1] + ' : ',speed);
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
