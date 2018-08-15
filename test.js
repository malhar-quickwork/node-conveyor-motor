var Gpio = require('pigpio').Gpio;
const led = new Gpio(25, {mode: Gpio.OUTPUT});
var dutyCycle = process.argv.splice(2);
console.log("Speed Passed:" + dutyCycle);
if(dutyCycle < 255){
    led.pwmWrite(dutyCycle);
}
