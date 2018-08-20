let app = angular.module('rutvik',['ngRoute','ngMaterial']);
var socket = io.connect(window.location.host);
var mc = null ; 

app.config(function($routeProvider) {
    $routeProvider
    .when("/device", {
        templateUrl: 'pages/device.html',
        controller: 'deviceCtrl'
    })
    .when("/", {
        templateUrl: 'pages/main.html',
        controller: 'main'
    })
    .when("/mission", {
        templateUrl: 'pages/mission.html',
        controller: 'MissionCtrl'
    })
    .when("/motors", {
        templateUrl: 'pages/motor_control.html',
        controller: 'MotorControlCtrl'
    })    
    ;
});

app.controller('main',function($scope){
    window.location = "#motors"
})  
app.controller('deviceCtrl',function($scope){
   $scope.shutdown =  function(){
     socket.emit('shutdown-67rq3d2bo1iwcefl');
   };
})  

app.controller('MissionCtrl',function($scope){
    socket.emit('get-video-stream',function(streamSrc){
        let element = '<img id="mainVid" src="'+streamSrc+'" width="640">';
        document.getElementById("missionVideoPanel").innerHTML =  element ;
    });
})  


app.directive("mdNumPicker", function(){
    return {
            restrict: 'EC',
            controller: function($scope){
                console.log('Loaded directive Ctrl')
                $scope.stop = ()=>{
                // $scope.state.started= false;
                    socket.emit('stop-motor', {message:'stop motor'});
                }            
            $scope.incVal = function(){
                // $scope.animateUp = false;
                if(angular.isNumber($scope.val)){
                    if(!angular.isUndefined($scope.maxValue) && $scope.val>=$scope.maxValue){
                    return;
                    };
                    $scope.val = $scope.val + parseInt($scope.$parent.deltaValue);
                    if($scope.name.includes(":")){ 
                        $scope.$parent.sendDualMotorValue($scope.name.split(":")[0],$scope.name.split(":")[1],$scope.val);
                        if($scope.name.split(":")[1] == "3"){
                            $scope.$parent.value3 = $scope.val;
                        }else if($scope.name.split(":")[1] == "4"){
                            $scope.$parent.value4 = $scope.val;
                        }
                    }else{
                        $scope.$parent.sendValue($scope.name,$scope.val);
                    }
                    
                    if(!!$scope.onChange){
                    $scope.onChange({value: $scope.val})
                    }
                };
                };
                $scope.decVal = function(){
                // $scope.animateUp = true;
                if(angular.isNumber($scope.val)){
                    if(!angular.isUndefined($scope.minValue) && $scope.val<=$scope.minValue){
                    return;
                    };
                    $scope.val = $scope.val - parseInt($scope.$parent.deltaValue);
                    /* if($scope.name.includes(":")){ 
                        $scope.$parent.sendDualMotorValue($scope.name.split(":")[0],$scope.name.split(":")[1],$scope.val);
                        if($scope.name.split(":")[1] == "3"){
                            $scope.$parent.value3 = $scope.val;
                        }else if($scope.name.split(":")[1] == "4"){
                            $scope.$parent.value4 = $scope.val;
                        }
                    }else{
                        console.log('macas as');
                        //$scope.$parent.sendValue($scope.name,$scope.val);
                    } */

                    //$scope.$parent.sendValue($scope.name,$scope.val);
                    if(!!$scope.onChange){
                    $scope.onChange({value: $scope.val})
                    }
                }
                }
                
                $scope.isMinValue = function(){
                if(angular.isNumber($scope.val) && !angular.isUndefined($scope.minValue)
                    && $scope.val <= $scope.minValue){
                    return true;
                };
                
                return false;
                };
                
                $scope.isMaxValue = function(){
                if(angular.isNumber($scope.val) && !angular.isUndefined($scope.maxValue)
                    && $scope.val >= $scope.maxValue){
                    return true;
                };
                
                return false;
                }
                
                $scope.$watch('val', function(newVal, oldVal){
                $scope.animateUp = newVal < oldVal ; 
                });

            },
            scope: {
                val: '=ngModel',
                maxValue: '=*?',
                minValue: '=*?',
                onChange: '&',
                name : '@',   
            },
            template: [
                '<div layout="column" layout-align="center stretch">',
                    '<md-button class="md-raised" ng-click="incVal()" ng-disabled="isMaxValue()">+</md-button>',
                    '<div class="md-num-picker__content md-display-1" ng-class="{\'animate-up\': animateUp}">',
                    '<div ng-animate-swap="val" class="md-num-picker__content-view">{{val}}</div>',
                    '</div>',
                    '<md-button class="md-raised" ng-click="decVal()" ng-disabled="isMinValue()">-</md-button>',
                '</div>'].join(' ').replace(/\s+/g, ' ')
            }
})

app.controller('MotorControlCtrl',function($scope){

            $scope.deltaValue = 1;
            $scope.globalValueApply = function(){
                $scope.value1 = $scope.value2 = $scope.value3 = $scope.value4 = parseInt($scope.globalValue);
                socket.emit('speed-motor', {payload:{motorNumber : 1, value : $scope.globalValue},message:'speed change'});
                socket.emit('speed-motor', {payload:{motorNumber : 2, value : $scope.globalValue},message:'speed change'});
                socket.emit('speed-motor', {payload:{motorNumber : 3, value : $scope.globalValue},message:'speed change'});
                //socket.emit('speed-motor', {payload:{motorNumber : 4, value : $scope.globalValue},message:'speed change'});
            }
            $scope.globalIncrementer = function(){
                $scope.dummyDeltaValue = parseInt($scope.deltaValue);
                $scope.value1 = $scope.value1 + $scope.dummyDeltaValue;
                $scope.value2 = $scope.value2 + $scope.dummyDeltaValue;
                $scope.value3 = $scope.value3 + $scope.dummyDeltaValue;
                $scope.value4 = $scope.value4 + $scope.dummyDeltaValue;
           
                socket.emit('speed-motor', {payload:{motorNumber : 1, value : $scope.value1},message:'speed change'});
                socket.emit('speed-motor', {payload:{motorNumber : 2, value : $scope.value2},message:'speed change'});
                socket.emit('speed-motor', {payload:{motorNumber : 3, value : $scope.value3},message:'speed change'});
                socket.emit('speed-motor', {payload:{motorNumber : 4, value : $scope.value4},message:'speed change'});
            }
            $scope.globalDecrementer = function(){
                $scope.dummyDeltaValue = parseInt($scope.deltaValue);
                $scope.value1 = $scope.value1 - $scope.dummyDeltaValue;
                $scope.value2 = $scope.value2 - $scope.dummyDeltaValue;
                $scope.value3 = $scope.value3 - $scope.dummyDeltaValue;
                $scope.value4 = $scope.value4 - $scope.dummyDeltaValue;
           
                socket.emit('speed-motor', {payload:{motorNumber : 1, value : $scope.value1},message:'speed change'});
                socket.emit('speed-motor', {payload:{motorNumber : 2, value : $scope.value2},message:'speed change'});
                socket.emit('speed-motor', {payload:{motorNumber : 3, value : $scope.value3},message:'speed change'});
                socket.emit('speed-motor', {payload:{motorNumber : 4, value : $scope.value4},message:'speed change'});
            }            
            $scope.sendValue = (motorNumber,val)=>{
                socket.emit('speed-motor', {payload:{motorNumber : motorNumber, value : val},message:'speed change'});
                if(val <= 34) {
                    socket.emit('trigger-event',{payload:{motorNumber : motorNumber, value : val, event:'speed_fail'}});
                }
                if(val > 45) {
                    socket.emit('trigger-event',{payload:{motorNumber : motorNumber, value : val, event:'speed_overload'}});
                }
            }  
            $scope.sendDualMotorValue = (motorNumber1, motorNumber2,val)=>{
                socket.emit('speed-dual-motor', {payload:{m1 : motorNumber1, m2 : motorNumber2, value : val},message:'speed change'});
            }
            $scope.stop = function(){
                $scope.value1 = $scope.value2 = $scope.value3 = $scope.value4 = 36;
                socket.emit('stop-motor', {message:'stop motor'});
            }

            $scope.curr = {x:0 ,y: 0,z : 0};

            
               
});

//extra 

/* let oldMainCtrl = function($scope){
        $scope.state = {auto:false , init:false , started:false};
    $scope.autoDownMode = ()=>{$scope.state.auto=!$scope.state.auto};
    //var socket = io.connect(window.location.host);
    socket.on('connect', function(data) {
        socket.emit('join', 'Hello World from client');
    });
    socket.on('motor-status',(status)=>{
            console.log('motor status recieved '+status)
            $scope.status = status ;
            $scope.$digest();
    });
    socket.on('msg-client',(msg)=>{
            console.log('Msg from drone : ',msg);
    });
    $scope.init = ()=>{
        $scope.state.init = true;
        socket.emit('init-motor', {message:'start motor'});
    }
    $scope.stop = ()=>{
        $scope.state.started= false;
        socket.emit('stop-motor', {message:'stop motor'});
    }
    $scope.sendValue = (val)=>{
        if(val==9){
            $scope.state.started= true;
        }
        socket.emit('speed-motor', {payload:val,message:'speed change'});
    }

    $scope.sendValueWithMotor = (motorNumber,val)=>{
        if(val==9){
            $scope.state.started= true;
        }
        socket.emit('speed-motor', {payload:{motorNumber : motorNumber, value : val},message:'speed change'});
    }
};
 */

