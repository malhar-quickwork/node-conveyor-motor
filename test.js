var Gpio = require('pigpio').Gpio;
const led = new Gpio(25, {mode: Gpio.OUTPUT});
let dutyCycle = 50;

setInterval(() => {
  led.pwmWrite(dutyCycle);

  dutyCycle += 50;
  if (dutyCycle > 255) {
    dutyCycle = 50;
  }
}, 500);

process.on('SIGINT', function() {
	led.digitalWrite(0);
	Gpio.terminate();
	console.log('Closing');
});