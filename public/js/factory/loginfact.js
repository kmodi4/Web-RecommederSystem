
'use strict';

angular.module('myApp')
       .factory('loginfact', ['$http','$rootScope', function($http,$rootScope){
       	   var loginfact = {};
                loginfact.postlogin = function(user){
                   var parameter = user;
                   console.log(parameter);
          					return  $http({
          					  method  : 'POST',
          					  url     : 'http://'+$rootScope.server+'/api/authenticate',
          					  data    :  parameter,  // pass in data as strings
          					  headers : { 'Content-Type': 'application/json' }  
                      // set the headers so angular passing info as form data (not request payload)
          				 });
                  }
            return loginfact;
                
       }]);
      


