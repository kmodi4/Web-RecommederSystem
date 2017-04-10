(function(){
'use strict';

angular.module('myApp')
       .factory('idfact', function($cookieStore){
          var idfact = {};
             idfact.setid = function(id){
                  idfact.userid  = id;
                   $cookieStore.put('cookieUser_ID',id);

             }

             idfact.getid = function(){
                  idfact.userid = $cookieStore.get('cookieUser_ID');
             	return idfact.userid;
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