var Gpio = require('pigpio').Gpio,
const led = new Gpio(25, {mode: Gpio.OUTPUT});
let dutyCycle = 0;

setInterval(() => {
  led.pwmWrite(dutyCycle);

  dutyCycle += 25;
  if (dutyCycle > 255) {
    dutyCycle = 0;
  }
}, 900);

process.on('SIGINT', function() {
	led.digitalWrite(0);
	Gpio.terminate();
	console.log('Closing');
});