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
        socketClient = ioClient('http://'+ip.address()+':'+PORT);

    });
   
    app.route('/api/motor/:motor/stop').get((req,res) => {
        let motorName = req.params['motor'];
        console.log('REQUEST '+motorName);
        switch (motorName) {
            case 'motor1':    
            socketClient.emit('speed-motor', {payload:{motorNumber : 1, value : 32},message:'speed change'});
                break;
            case 'motor2':
            socketClient.emit('speed-motor', {payload:{motorNumber : 2, value : 32},message:'speed change'});
                break;
            case 'motor3':
            socketClient.emit('speed-motor', {payload:{motorNumber : 3, value :32},message:'speed change'});
                break;
            case 'conveyor1':
            socketClient.emit('speed-dual-motor', {payload:{m1 : 2, m2 : 3, value : 32},message:'speed change'});
                break;
            case 'conveyor2':
            socketClient.emit('speed-motor', {payload:{motorNumber : 1, value : 32},message:'speed change'});
                break;
            case 'all':
                socketClient.emit('stop-motor', {message:'stop motor'});
                break;
            default:
                break;
        }
        res.send(200,{'motor':motorName,'speed':0});
    });
    app.route('/api/motor/:motor/speed/:speed').get((req,res) => {
        let motorName = req.params['motor'];
        let speed = req.params['speed'];
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
    app.route('/api/motor/:motor/start').get((req,res) => {
        let motorName = req.params['motor'];
        let speed = 36;
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