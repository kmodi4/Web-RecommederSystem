(function(){
'use strict';

angular.module('myApp')
       .factory('authfact', ['$cookieStore', function($cookieStore){
       	   var authfact = {};
             authfact.setCookie = function(token){
                  $cookieStore.put('cookieToken',token);
             }

             authfact.getCookie = function(){
             	 authfact.authToken = $cookieStore.get('cookieToken');
             	   return authfact.authToken;
             }

             authfact.setUser = function(user){
                   $cookieStore.put('cookieUser',user);
             }

             authfact.getUser = function(){
                   authfact.authUser = $cookieStore.get('cookieUser');
                     return authfact.authUser;
             }

             authfact.removeUser = function(){
                   $cookieStore.remove('cookieUser');
                    $cookieStore.remove('tid');
                     $cookieStore.remove('status');
             }

              authfact.setTicketinfo = function(tid,status){
                   $cookieStore.put('tid',tid);
                   $cookieStore.put('status',status);
             }

             authfact.getTicketID = function(){
                   authfact.tid = $cookieStore.get('tid');
                     return authfact.tid;
             }

              authfact.getStatus = function(){
                  
                   authfact.status = $cookieStore.get('status');
                     return authfact.status;
             }



            



             return authfact;
       }]);


})();