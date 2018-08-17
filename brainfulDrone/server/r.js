var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var ip = require('ip');
const ioClient = require('socket.io-client');
let socketClient;

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
    app.listen(CAM_PORT, () => {
        console.log('Listening on '+CAM_PORT);
        socketClient = ioClient(ip.address+':'+CAM_PORT);

    });
   
    app.route('/api/cats').get((req,res) => {
        console.log('REQUEST');
        socketClient.emit('stop-motor');
        res.send(200,req);
    });
});