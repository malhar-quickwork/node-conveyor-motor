var http = require('http');
var Gpio = require('pigpio').Gpio,
motorOut = new Gpio(13, {mode: Gpio.OUTPUT});
console.log(motorOut.getPwmRealRange());
console.log(motorOut.getPwmRange());
runMotor();
function runMotor() {
    motorOut.digitalWrite(1);
}
function stopMotor() {
    motorOut.digitalWrite(0);
}
function slower() {
	stopMotor();
	console.log('Sloweeer');
	motorOut.pwmWrite(30);
}
setTimeout(slower,5000);
process.on('SIGINT', function() {
	motorOut.digitalWrite(0);
	Gpio.terminate();
	console.log('Closing');
});