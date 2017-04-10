(function(){
'use strict';

angular.module('myApp')
 .controller('bookdetailsCtr',  function($scope,bookfetch,idfact,$location,$route){
    $scope.Username = idfact.getBookid().user;
    $scope.isbn     = idfact.getBookid().isbn;
    $scope.title    = idfact.getBookid().title;
    $scope.resp     = {};
    $scope.topN     = [];

    $scope.loadDetails = function(){
        var par = [{"username":$scope.Username,"title":$scope.title}];
        bookfetch.getbook(par)
                 .success(function(data){
                     $scope.resp = data[0];
                     
                 })
                 .error(function(data){
                    $scope.resp = {};
                     alert("Couldn't Load Data");
                    
                 });
    };    

    $scope.TopN_Items = function(){
        var par = [{"title":$scope.title}]
          bookfetch.topN(par)
                   .success(function(data){
                         $scope.topN = data;
                       console.log(data);
                   })
                   .error(function(data){
                     $scope.topN = [];
                       alert("error");
                   });
    } 
    $scope.loadDetails();
    $scope.TopN_Items();

    $scope.itemclick = function(user,isbn,title){
        idfact.setBookid(user,isbn,title);
        console.log("Item click");
         $location.path('/bookdetails');
         $route.reload()
    } 
  

});


 })();
