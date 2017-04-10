(function(){
'use strict';

   
   angular.module('myApp')
          .controller('bookCtr',function($scope,bookfetch,authfact){
              $scope.username = authfact.getUser();

          $scope.getUserBooks = function(){
                var par = [{"username":username}];
          	    bookfetch.getUserBook(par)
          	            .success(function(data){
                           $scope.response = data;
                           $scope.loading = false;
                           $scope.done = true;
                          
          	            })
          	            .error(function(data){
                            $scope.done = true;
                            $scope.loading = false;
          	           });  
            }

          });



 })();   