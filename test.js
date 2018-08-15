var Gpio = require('pigpio').Gpio;
const led = new Gpio(13, {mode: Gpio.OUTPUT});
var dutyCycle = process.argv.splice(2);
console.log("Speed Passed:" + dutyCycle);
if(dutyCycle < 255){
    led.pwmWrite(dutyCycle);
}
dutyCycle = 0;
var i = 0;
while(true){
	dutyCycle = dutyCycle + i;
	console.log("DUTY CYCLE" + dutyCycle);
    led.pwmWrite(dutyCycle);
    i++;

    if(i >= 100){
    	dutyCycle = 0;
    	i = 0;
    }
    setTimeout(function() {
    	console.log('Blah blah blah blah extra-blah');
	}, 3000);
}