
'use strict';

angular.module('myApp')
       .factory('compdetailfact', ['$http','$rootScope', function($http,$rootScope){
       	   var compdetailfact = {};
                compdetailfact.getOngoingDetail = function(tid){
                	//server : 52.36.18.27
                     var parameter = {ticketID:tid};
        					  return  $http({
        					  method  : 'POST',
        					  url     : 'http://'+$rootScope.server+'/php/getOngoingComplaintByID.php', 
        					  data    :  parameter,  // pass in data as strings
        					  headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
                     // set the headers so angular passing info as form data (not request payload)
        				    });
                  }

                compdetailfact.getCompleteDetail = function(tid){
                  
                     var parameter = {ticketID:tid};
                     return  $http({
                    method  : 'POST',
                    url     : 'http://'+$rootScope.server+'/php/getCompletedComplaintByID.php',
                    data    :  parameter,  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
                     // set the headers so angular passing info as form data (not request payload)
                   });
                }

                compdetailfact.getImage_audio = function(tid){
                  var parameter = {ticketID:tid};
                     return  $http({
                    method  : 'POST',
                    url     : 'http://'+$rootScope.server+'/php/getImageAudioById.php',
                    data    :  parameter,  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
                     // set the headers so angular passing info as form data (not request payload)
                   });
                }

            return compdetailfact;
                
       }])
       .factory('updateCalldetail', ['$http','$rootScope', function($http,$rootScope){
           var updateCalldetail = {};
           updateCalldetail.postcompliant = function(detail){
                var parameter = detail;
                console.log(parameter);
                     return  $http({
                    method  : 'POST',
                    url     : 'http://'+$rootScope.server+'/php/updateOngoingComplaint.php',
                    data    :  parameter,  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
                     // set the headers so angular passing info as form data (not request payload)
                   });
                }

             updateCalldetail.getStatus = function(tid){
                var parameter = {ticketID:tid};
                console.log(parameter);
                     return  $http({
                    method  : 'POST',
                    url     : 'http://'+$rootScope.server+'/php/getTicketReassignStatus.php',
                    data    :  parameter,  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
                     // set the headers so angular passing info as form data (not request payload)
                   });
             }

               updateCalldetail.getReassignEngData = function(tid){
                var parameter = {ticketID:tid};
                console.log(parameter);
                     return  $http({
                    method  : 'POST',
                    url     : 'http://'+$rootScope.server+'/php/getAllRejectedEnggData.php',
                    data    :  parameter,  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
                     // set the headers so angular passing info as form data (not request payload)
                   });
             }    

            return updateCalldetail;
       }])
       .factory('temp', function(){
         return "testone";
                  
         
       });
      
       


