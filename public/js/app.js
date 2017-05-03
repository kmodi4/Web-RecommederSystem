var app =  angular.module('myApp',['ngRoute','ngCookies','angularUtils.directives.dirPagination','ngProgress','angularCSS','ui.bootstrap']);

app.config(function($routeProvider) {

	$routeProvider.
	when('/',{
           templateUrl : 'templates/login.html',
 	   	      controller  : 'loginCtr'
	}).
  when('/about',{
           templateUrl : 'templates/about.html',
            controller  : 'aboutCtr'
  }).
  when('/home',{
    resolve:{
      "check":function($rootScope,$location){
        console.log("Auth is "+$rootScope.loggedin);
        if(!$rootScope.loggedin){
          $location.path('/');
        }
        
      }
    },
       templateUrl : 'templates/home.html',
       controller  : 'homeCtr'
  }).
  when('/addbook',{
       templateUrl : 'templates/addbook.html',
       controller  : 'addbookCtr'
  }).
   when('/recommend',{
       templateUrl : 'templates/recommend.html',
       controller  : 'recommendCtr'
  }).
  when('/bookdetails',{
       templateUrl : 'templates/bookdetails.html',
       controller  : 'bookdetailsCtr',
       css         : 'libs/rating.css'
        
  }). 
	otherwise({
        redirectTo:'/'
	});
});

app.controller('MainCtr',function($scope,$rootScope,$location,authfact,$templateCache){
   
   $rootScope.activeMenu = 'Home';
   $scope.logout = function(){
      $rootScope.loggedin = false;
       $templateCache.remove('/');
    authfact.setCookie($rootScope.loggedin);
  
    $location.path('/');
   }
   $rootScope.server = "karan.com:3000";    //182.70.114.121:8100  //192.168.0.125:8100 // 10.0.0.18
});

app.controller('aboutCtr', function($scope){
  $scope.message = "About us";
});



