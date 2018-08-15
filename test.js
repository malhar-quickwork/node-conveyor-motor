var Gpio = require('pigpio').Gpio;
const led = new Gpio(25, {mode: Gpio.OUTPUT});
let dutyCycle = 50;

var intervalSetting = setInterval(() => {
  led.pwmWrite(dutyCycle);

  dutyCycle += 100;
  if (dutyCycle > 255) {
    intervalSetting.clearInterval();
  }
}, 500);

process.on('SIGINT', function() {
	led.digitalWrite(0);
	Gpio.terminate();
	console.log('Closing');
});