var http = require('http');
var Gpio = require('pigpio').Gpio,
motorOut = new Gpio(22, {mode: Gpio.OUTPUT});
runMotor();
function runMotor() {
    motorOut.digitalWrite(1);
}
function stopMotor() {
    motorOut.digitalWrite(0);
}
setTimeout(stopMotor,10000);