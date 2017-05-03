(function(){
'use strict';

angular.module('myApp')
 .controller('loginCtr',  function($scope,$location,$rootScope,loginfact,authfact,idfact){
    $rootScope.loggedin = false;
    $scope.isloaded = false;
    $scope.user = {};

     $scope.check = function(){
        console.log($scope.user.name);
        loginfact.postlogin($scope.user)
         .success(function(data){
             console.log(data);   
                if(data.success){
                    $rootScope.user = $scope.user.name;
                            authfact.setCookie(true);
                            authfact.setUser($scope.user.name);
                            idfact.setid(data.user_id,$scope.user.name);

                   $location.path('/home');
                }
                else{
                  alert(data.msg);
                }
               
         })
         .error(function(data){
               console.log(data);
         });   
     };
    
});

 })();
