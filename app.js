var http = require('http');
var Gpio = require('pigpio').Gpio,
motorOut = new Gpio(22, {mode: Gpio.OUTPUT});
