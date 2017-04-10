
'use strict';

angular.module('myApp')
       .factory('addEng', ['$http','$rootScope', function($http,$rootScope){
       	   var addEng = {};
                addEng.postdetail = function(user){
                   var parameter = user;
                   console.log(parameter);
					return  $http({
					  method  : 'POST',
					  url     : 'http://'+$rootScope.server+'/php/addEngineer.php',
					  data    :  parameter,  // pass in data as strings
					  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
				 });
                  }
            return addEng;
                
       }]);
      


