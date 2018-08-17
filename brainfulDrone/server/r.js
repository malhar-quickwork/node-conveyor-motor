var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var ip = require('ip');


let PORT = 9000 ,CAM_PORT = 9001;

const config = require('./modules/config.js');
const mocks = require('./modules/mocks.nonPi.js');

let motor = config.isPi? require('./modules/PCA9685-i2cMotorInterface.js'):mocks.motor;
let socketHandleV3 =  require('./modules/v3.js') ;

let currentHandler = socketHandleV3 ;
currentHandler.setReferences(io,motor);

motor.init(()=>{
    config.camStreamSrc = 'http://'+ip.address()+':'+CAM_PORT+'/?action=stream';
        console.log('Belt at : '+config.camStreamSrc);
    
    app.use(express.static(__dirname + '/public'));  
    server.listen(PORT,()=>{
        console.log('Belt Server: http://'+ip.address()+':'+PORT);    
        io.on('connection', currentHandler.socketHandle);
    });
    app.use('/api',require('./routes/routes.js'))
    app.listen(CAM_PORT, () => {
        console.log('Listening on '+CAM_PORT);

    });
});
module.exports = app,express;