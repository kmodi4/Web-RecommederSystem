(function(){
'use strict';

angular.module('myApp')
       .factory('idfact', function($cookieStore){
          var idfact = {};
             idfact.setid = function(id,username){
                  idfact.userid  = id;
                  idfact.username = username;
                   $cookieStore.put('cookieUser_ID',idfact);

             }

             idfact.getid = function(){
                  return $cookieStore.get('cookieUser_ID');
             	
             }

             idfact.setBookid = function(user,isbn,title){
                    idfact.user  = user; 
                    idfact.isbn  = isbn;
                    idfact.title = title;
                    $cookieStore.put('cookieBook_ID',idfact);
             }

             idfact.getBookid = function(){
                  return $cookieStore.get('cookieBook_ID');
             }

             return idfact;
       });


})();