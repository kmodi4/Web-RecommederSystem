(function(){
'use strict';

angular.module('myApp')
 .controller('recommendCtr',  function($scope,bookfetch){
    
     $scope.getAllBooks = function(){
     bookfetch.getdataset()
                        .success(function(data){
                           $scope.response = data;
                            alert("data received");
                          
                        })
                        .error(function(data){
                            alert("Error");
                       });  
    };

    $scope.classify = function(){
        console.log("Test");
        bookfetch.classify()
                 .success(function(data){
                      console.log(data);
                 })
                 .error(function(data){
                      alert("Error");
                 });
    };

    $scope.move = function(){
        bookfetch.movedata()
                 .success(function(data){
                     console.log(data);
                 })
                 .error(function(data){
                      alert("Error");
                 });
    };

    $scope.knn = function(){
         bookfetch.knn()
                 .success(function(data){
                     console.log(data);
                 })
                 .error(function(data){
                      alert("Error");
                 });
    };

     $scope.mlnb = function(){
         bookfetch.mlnb()
                 .success(function(data){
                     console.log(data);
                 })
                 .error(function(data){
                      alert("Error");
                 });
    };
  

});


 })();
