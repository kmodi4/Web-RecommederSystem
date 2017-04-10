(function(){
'use strict';

   
   angular.module('myApp')
          .controller('bookCtr',function($scope,bookfetch){
          	    $scope.data = ['1','2','3','4','5'];
                $scope.loading = true;
                $scope.done = false;
          	    bookfetch.getdetail()
          	            .success(function(data){
                           $scope.response = data;
                           $scope.loading = false;
                           $scope.done = true;
                          
          	            })
          	            .error(function(data){
                            $scope.done = true;
                            $scope.loading = false;
          	           });  


          });



 })();   