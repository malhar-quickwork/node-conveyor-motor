var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var ip = require('ip');
var ds18b20 = require('ds18b20');
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
    function myFunc(arg) {
        // POLLING FOR TEMPERATURE HERE PANKAJ
        ds18b20.temperature('28-0117c2b9e7ff', function(err, value) {
            console.log('Current temperature is', value);
            var data = {payload:{motorNumber : 'temp', value : value, event:'temp_change'}};
            data.payload.timestamp = Date.now();
            socketHandleV3.triggerAutomation(data);
            // SENDING TO CLIENT SIDE IN CODE.JS
            io.emit('temp-update',value);
          });
        setTimeout(myFunc, 10000);
      };
    myFunc();
    config.camStreamSrc = 'http://'+ip.address()+':'+CAM_PORT+'/?action=stream';
        console.log('Belt at : '+config.camStreamSrc);
    
    app.use(express.static(__dirname + '/public'));  
    server.listen(PORT,()=>{
        console.log('Belt Server: http://'+ip.address()+':'+PORT);   
        console.err('OPEN PORT 9001 on ngrok in downloads folder,change endpoint in 3 automations, start,stop and increase speed');
        io.on('connection', currentHandler.socketHandle);
    });
    app.listen(CAM_PORT, () => {
        console.log('Listening on '+CAM_PORT);
        socketClient = ioClient('http://'+ip.address()+':'+PORT);

    });
   
    app.route('/api/motor/:motor/stop').get((req,res) => {
        let motorName = req.params['motor'];
        console.log('REQUEST '+motorName);
        let speed = 32;
        let status = {payload:{motorNumber : 0, value : 32},message:'speed change'};
        switch (motorName) {
            case 'motor1':    
            status.payload.motorNumber = 1;
            socketClient.emit('speed-motor', status);
            break;
            case 'motor2':
            status.payload.motorNumber = 2;
            socketClient.emit('speed-motor', status);
                break;
            case 'motor3':
            status.payload.motorNumber = 3;
            socketClient.emit('speed-motor', status);
                break;
            case 'conveyor1':
            socketClient.emit('speed-dual-motor', {payload:{m1 : 2, m2 : 3, value : speed},message:'speed change'});
                break;
            case 'conveyor2':
            socketClient.emit('speed-motor', {payload:{motorNumber : 1, value : speed},message:'speed change'});
                break;
            case 'all':
                delete status.payload.motorNumber;
                socketClient.emit('stop-motor', {message:'stop motor'});
                break;
            default:
                break;
        }
        // UPDATE CLIENT SPEED
        io.emit('update-scope',status);
        res.send(200,{'motor':motorName,'speed':0});
    });
    app.route('/api/motor/:motor/speed/:speed').get((req,res) => {
        let motorName = req.params['motor'];
        let speed = req.params['speed'];
        console.log('REQUEST '+motorName+' speed '+speed);
        let status = {payload:{motorNumber : 0, value : speed},message:'speed change'};
        switch (motorName) {
            case 'motor1':    
            status.payload.motorNumber = 1;
            socketClient.emit('speed-motor', status);
            break;
            case 'motor2':
            status.payload.motorNumber = 2;
            socketClient.emit('speed-motor', status);
                break;
            case 'motor3':
            status.payload.motorNumber = 3;
            socketClient.emit('speed-motor', status);
                break;
            case 'conveyor1':
            socketClient.emit('speed-dual-motor', {payload:{m1 : 2, m2 : 3, value : speed},message:'speed change'});
                break;
            case 'conveyor2':
            socketClient.emit('speed-motor', {payload:{motorNumber : 1, value : speed},message:'speed change'});
                break;
            case 'all':
                delete status.payload.motorNumber;
                socketClient.emit('speed-all-motor',  status);
                break;
            default:
                break;
        }
        // UPDATE CLIENT SPEED
        io.emit('update-scope',status);
        res.send(200,{'motor':motorName,'speed':speed});
    });
    app.route('/api/motor/:motor/start').get((req,res) => {
        let motorName = req.params['motor'];
        let speed = 36;
        console.log('REQUEST '+motorName+' speed '+speed);
        let status = {payload:{motorNumber : 0, value : speed},message:'speed change'};
        switch (motorName) {
            case 'motor1':    
            status.payload.motorNumber = 1;
            socketClient.emit('speed-motor', status);
            break;
            case 'motor2':
            status.payload.motorNumber = 2;
            socketClient.emit('speed-motor', status);
                break;
            case 'motor3':
            status.payload.motorNumber = 3;
            socketClient.emit('speed-motor', status);
                break;
            case 'conveyor1':
            socketClient.emit('speed-dual-motor', {payload:{m1 : 2, m2 : 3, value : speed},message:'speed change'});
                break;
            case 'conveyor2':
            socketClient.emit('speed-motor', {payload:{motorNumber : 1, value : speed},message:'speed change'});
                break;
            case 'all':
                delete status.payload.motorNumber;
                socketClient.emit('speed-all-motor',  {payload:{ value : speed},message:'speed change all'});
                break;
            default:
                break;
        }
        // UPDATE CLIENT SPEED
        io.emit('update-scope',status);
        res.send(200,{'motor':motorName,'speed':speed});
    });
    app.route('/api/motor/:motor/getspeed').get((req,res) => {
        let motorName = req.params['motor'];
        let responsePayload = [];
        console.log('REQUEST '+motorName+' speed '+speed);
        switch (motorName) {
            case 'motor1':    
            socketClient.emit('speed-motor', {payload:{motorNumber : 1, value : speed},message:'speed change'});
                break;
            case 'motor2':
            socketClient.emit('speed-motor', {payload:{motorNumber : 2, value : speed},message:'speed change'});
                break;
            case 'motor3':
            socketClient.emit('speed-motor', {payload:{motorNumber : 3, value :speed},message:'speed change'});
                break;
            case 'conveyor1':
            socketClient.emit('speed-dual-motor', {payload:{m1 : 2, m2 : 3, value : speed},message:'speed change'});
                break;
            case 'conveyor2':
            socketClient.emit('speed-motor', {payload:{motorNumber : 1, value : speed},message:'speed change'});
                break;
            case 'all':
                socketClient.emit('speed-all-motor',  {payload:{ value : speed},message:'speed change all'});
                break;
            default:
                break;
        }
        res.send(200,{'motor':motorName,'speed':speed});
    });
});