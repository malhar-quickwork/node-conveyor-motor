var Gpio = require('pigpio').Gpio;
const led = new Gpio(25, {mode: Gpio.OUTPUT});
let dutyCycle = 50;
var args = process.argv.splice(2);
console.log("Arguments:" + args);
led.pwmWrite(args[0]);
process.on('SIGINT', function() {
	led.digitalWrite(0);
	Gpio.terminate();
	console.log('Closing');
});