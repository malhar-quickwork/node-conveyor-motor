const config = require('./config.js');
/* const raspi = require('raspi');
const pwm = require('raspi-pwm'); */
//const pwm = require('raspi-soft-pwm');
var ds18b20 = require('ds18b20');
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
ds18b20.sensors(function(err, ids) {
  // got sensor IDs ...
  if(err) {
      console.log('Cannot error ',err);
  }
  else {
  console.log('in here');
  console.log(ids);
  }
});
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
            function myFunc(arg) {
                ds18b20.temperature('28-0117c2b9e7ff', function(err, value) {
                    console.log('Current temperature is', value);
                  });
                setTimeout(myFunc, 1500);
              };
            myFunc();
              
              
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
            console.log('Speed On GPIO' + self.motors[selected-1] + ' : ',speed);
            ds18b20.temperature('28-0117c2b9e7ff', function(err, value) {
                console.log('Current temperature is', value);
              });
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
