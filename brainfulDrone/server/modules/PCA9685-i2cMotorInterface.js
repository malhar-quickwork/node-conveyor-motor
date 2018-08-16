const config = require('./config.js');
let self ={
    auto : false,
    address : config.motorAddress ,
    motors : [6,7,9,10],
    settings :{ kickUpTick : 0 , kickDownTickMin : 40 , kickDownTickMax : 600 },
    wire : null,
    init : (next)=>{ 
        self.haltAll();
        next();
    },
    testInit:(allOne,next)=>{
    },
    haltAll:(next)=>{

    },
    throttle:(selected,speed,next)=>{
    },
    multiThrottle:(selected,speeds,next)=>{

    },    
    allThrottle:(speed,next)=>{
    },    
}

module.exports = self ;
