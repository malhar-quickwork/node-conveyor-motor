var express = require('express');
var router = express.Router();
var Book = require('../models/Book.js');
var http = require('http');
var Gpio = require('pigpio').Gpio,
motorOut = new Gpio(13, {mode: Gpio.OUTPUT});
console.log(motorOut.getPwmRealRange());
console.log(motorOut.getPwmRange());

/* GET ALL BOOKS */
router.get('/', function(req, res, next) {
    runMotor();
    function runMotor() {
        motorOut.digitalWrite(1);
    }
    function stopMotor() {
        motorOut.digitalWrite(0);
    }
    var controlSignal = 0;
    function slower() {
      stopMotor();
      console.log('Sloweeer');
      motorOut.pwmWrite(controlSignal);
      controlSignal = controlSignal + 50;
      if(controlSignal >= 255){
        controlSignal = 0;
      }
      setTimeout(slower,5000);
    }
    setTimeout(slower,5000);
    process.on('SIGINT', function() {
      motorOut.digitalWrite(0);
      console.log('Closing');
    });
});

module.exports = router;

