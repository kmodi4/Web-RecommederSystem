(function(){
'use strict';

angular.module('myApp')
 .controller('homeCtr',  function($scope,$location,$rootScope,bookfetch,authfact,idfact){
    $scope.user = authfact.getUser();
    $rootScope.loggedin = authfact.getCookie();
    $rootScope.loggedin = false;
    $scope.isloaded = false;
    $scope.user = {};
    $scope.response = [];
    $scope.message= "Welcome User!!!";

    

     $scope.getAllBooks = function(){
     bookfetch.getAllBooks()
                        .success(function(data){
                           $scope.response = data;
                          
                        })
                        .error(function(data){
                            alert("Error");
                       });  
    };
     
    $scope.getAllBookImages = function(){
        bookfetch.getImages()
                 .success(function(data){
                     $scope.response = data;
                 })
                 .error(function(data){
                    $scope.response = [];

                 });
    };

    $scope.getAllBooks(); 

    $scope.itemclick = function(user,isbn,title){
        idfact.setBookid(user,isbn,title);
        console.log("Item click");
         $location.path('/bookdetails');
    } 

}).run(['$rootScope', '$location','authfact', function($rootScope, $location,authfact){
    $rootScope.$on('$routeChangeStart',function(event,next,current){
            
             $rootScope.loggedin = authfact.getCookie();

             if(next.templateUrl == "templates/login.html" && $rootScope.loggedin)   {                  
                var islogout = confirm("Do want to LogOut From this page?");
                 if (!islogout) {
                      event.preventDefault();
                 }
                 else{
                     authfact.setCookie(false);
                     authfact.removeUser();
                 }
               
            }
            else if(!$rootScope.loggedin){
                $location.path('/');

            }
        });
   }]);


 })();
