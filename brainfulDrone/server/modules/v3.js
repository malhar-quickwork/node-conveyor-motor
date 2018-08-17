let motor = null;
let ir = require('./../../proximity_sensor/ir-prox2')
let i=0;
let maxThrottleAllowed = 580; 
let config = require('./config');
let io = null ;

let speeds = {max : 120 , off : 30 , min : 50};

let auto_stability_times = { delay : 250 , out : 300 };
let auto_stability_speeds = { off : 30 , min : 40 , mid : 60 , max :90 , minIncr : 18 , midIncr: 30 , maxIncr : 50 };
let auto_stability_controller = { on :false , intervalObject: null};

var throttleDelays = 500 ;

const mission = require('./mission');
let ir_dummy = {
    interval : null,
    open :(onReadings)=>{
        ir.interval = setInterval(()=>{
            require('child_process').exec('sudo ./modules/pulse', function(error, stdout, stderr) {
                console.log(error,stdout,stderr);
                //onReadings(stdout);
            });
        },500);
    },
    close :()=>{clearInterval(ir.interval);}
}

module.exports =  {
    
    setReferences: (socketIo,m)=>{
        io = socketIo;
        motor = m ;
        ir.open((value)=>{
            //console.log('ir value ',value);
            io.sockets.emit('ir-status',value);
        });
    },
    socketHandle : function(client) {
        client.hasThermoStream = false ;  
        client.hasGyroStream = false ;  
        i++;
        console.log('Clients connected '+i);
        let statusUpdate = (status)=>{
            client.emit('motor-status', status);
        }
        let tellClient = (msg)=>{
            client.emit('msg-client', msg);
        }
    
        client.on('msg', function(data) {
            console.log(data);
        });


        /****
         *  SENSORS CONTROLS
         * ***/

        client.on('shutdown-67rq3d2bo1iwcefl', function(){
            motor.haltAll(()=>{
                console.log('Shutting down')
                require('child_process').exec('sudo shutdown',function(e,so,se){

                });
            });
        });

        
        /****
         *  MOTORS CONTROLS
         * ***/

        client.on('stop-motor', function(data) {
            console.log('stop-motor');
            motor.haltAll();
            statusUpdate('Stopped');          
        });
        
        client.on('speed-motor', function(data) {
        console.log(client);
        console.log(io.sockets.client);
            console.log("speed-motor ",data)
            if(data.payload && data.payload.motorNumber && data.payload.value  && !isNaN(data.payload.value)){
                if(data.payload.value<0){
                    data.payload.value = 0 ;
                }else if(data.payload.value > maxThrottleAllowed){
                    data.payload.value = maxThrottleAllowed ;
                }
                motor.throttle(Number(data.payload.motorNumber),Number(data.payload.value),()=>{
                    console.log("Single Throttle : ",data.payload.value)
                });
            }else{
               console.log("Error in receiving data");
            }
        });
        
        client.on('speed-all-motor', function(data) {
            console.log("speed-all-motor ",data)
            if(data.payload && data.payload.value && !isNaN(data.payload.value)){
                if(data.payload.value<0){
                    data.payload.value = 0;
                }else if(data.payload.value > maxThrottleAllowed){
                    data.payload.value = maxThrottleAllowed ;
                }
                motor.allThrottle(Number(data.payload.value), ()=>{
                    console.log('AllThrottle :',data.payload.value);
                });
            }else{
               console.log("Error in receiving data");
            }
        });

        client.on('speed-dual-motor', function(data) {
            console.log("speed-dual-motor ",data)
            if(data.payload && data.payload.value && data.payload.m1 && data.payload.m2  && !isNaN(data.payload.value)){
                
                let motors = [Number(data.payload.m1),Number (data.payload.m2)] ;
                let speeds = [Number(data.payload.value), Number(data.payload.value)] ;

                if(data.payload.value<0){
                    data.payload.value = 0 ;
                }else if(data.payload.value > maxThrottleAllowed){
                    data.payload.value = maxThrottleAllowed ;
                }
                motor.multiThrottle(motors,speeds, ()=>{
                    console.log('MultiThrottle :',motors," -> ",speeds[0])
                });
                
            }else{
               console.log("Error in receiving data");
            }
        });


        client.on('disconnect', function() { i--; }); 

    }

};
