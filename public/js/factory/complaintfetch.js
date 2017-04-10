
'use strict';

angular.module('myApp')
       .factory('notAssignedCalls', ['$http','$rootScope', function($http,$rootScope){
       	   var notAssignedCalls = {};
                notAssignedCalls.postStatus = function(status){
                	//server : 52.36.18.27
                     var parameter = {status:status};
        					return  $http({
        					  method  : 'POST',
        					  url     : 'http://'+$rootScope.server+'/php/NOT_ASSIGNED.php',
        					  data    :  parameter,  // pass in data as strings
        					  headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
                     // set the headers so angular passing info as form data (not request payload)
        				 });
                  }

                  notAssignedCalls.getContract = function(){
                    return $http.get('http://'+$rootScope.server+'/php/fetchSpinnerData.php');
                  }
            return notAssignedCalls;
                
       }])
       .factory('completedCalls', ['$http','$rootScope', function($http,$rootScope){
       	   var completedCalls = {};
                completedCalls.postStatus = function(status){
                	//server : 52.36.18.27
                     var parameter = {status:status};
            					return  $http({
            					  method  : 'POST',
            					  url     : 'http://'+$rootScope.server+'/php/COMPLETED.php',
            					  data    :  parameter,  // pass in data as strings
            					  headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
                         // set the headers so angular passing info as form data (not request payload)
            				 });
                  }

                  completedCalls.getDiscardReason = function(tid){
                      var parameter = {ticketID:tid};
                        return  $http({
                            method  : 'POST',
                            url     : 'http://'+$rootScope.server+'/php/getDiscardedReasonByTicketID.php',
                            data    :  parameter,  // pass in data as strings
                            headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
                             // set the headers so angular passing info as form data (not request payload)
                         });
                  }
            return completedCalls;

       }])
       .factory('totalCalls', ['$http','$rootScope', function($http,$rootScope){
       	    var totalCalls = {};
       	       totalCalls.getcomplaint = function(){
                   return $http.get('http://'+$rootScope.server+'/php/TotalCalls.php');
       	       }

       	       return totalCalls;

       }])
       .factory('requisition', ['$http','$rootScope', function($http,$rootScope){ //getRequisition
          var requisition = {};
               requisition.getreqByid = function(email){
                    var parameter = {cust_emailID:email};
                        return  $http({
                            method  : 'POST',
                            url     : 'http://'+$rootScope.server+'/php/getRequisition.php',
                            data    :  parameter,  // pass in data as strings
                            headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
                             // set the headers so angular passing info as form data (not request payload)
                         });
               }  

               requisition.getAllRequisition = function(status){
                      var parameter = {status:status};
                        return  $http({
                            method  : 'POST',
                            url     : 'http://'+$rootScope.server+'/php/getAllRequisition.php',
                            data    :  parameter,  // pass in data as strings
                            headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
                             // set the headers so angular passing info as form data (not request payload)
                         });
               }

               requisition.postStatus = function(tid){
                      var parameter = {ticketID:tid};
                        return  $http({
                            method  : 'POST',
                            url     : 'http://'+$rootScope.server+'/php/updateRequisitionStatus.php',
                            data    :  parameter,  // pass in data as strings
                            headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
                             // set the headers so angular passing info as form data (not request payload)
                         });
               }

               return requisition;
       }]);
      


