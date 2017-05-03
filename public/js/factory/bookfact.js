
'use strict';

angular.module('myApp')
       .factory('bookfetch', ['$http','$rootScope', function($http,$rootScope){
       	   var bookfetch = {};
                bookfetch.getAllBooks = function(){           	
                    return $http.get('http://'+$rootScope.server+'/api/getAllBooks');
                  }

                bookfetch.getImages = function(){
                    return $http.get('http://'+$rootScope.server+'/api/getImages');
                }

                bookfetch.getisbndetail = function(isbn){
                   return $http.get('https://www.googleapis.com/books/v1/volumes?q=isbn:'+isbn);
                }

                bookfetch.getdataset = function(){
                   return $http.get('http://'+$rootScope.server+'/api/getdataset');
                }

                 bookfetch.classify = function(){
                   return $http.get('http://'+$rootScope.server+'/api/classify');
                }

                bookfetch.postdetail = function(book){
                    var parameter = book;
                    return  $http({
                    method  : 'POST',
                    url     : 'http://'+$rootScope.server+'/api/addBook', 
                    data    :  parameter,  // pass in data as strings
                    headers : { 'Content-Type': 'application/json' } 
                     // set the headers so angular passing info as form data (not request payload)
                    });
                    
                }

                bookfetch.movedata = function(){
                    return $http.get('http://'+$rootScope.server+'/api/move');
                }

                bookfetch.getbook = function(book){
                   var parameter = angular.toJson(book);
                   console.log(parameter);
                    return  $http({
                    method  : 'POST',
                    url     : 'http://'+$rootScope.server+'/api/getBook', 
                    data    :  parameter,  // pass in data as strings
                    headers : { 'Content-Type': 'application/json' } 
                     // set the headers so angular passing info as form data (not request payload)
                    });
                }

                bookfetch.topN = function(book){
                  var parameter = angular.toJson(book);
                   
                    return  $http({
                    method  : 'POST',
                    url     : 'http://'+$rootScope.server+'/api/topN', 
                    data    :  parameter,  // pass in data as strings
                    headers : { 'Content-Type': 'application/json' } 
                     // set the headers so angular passing info as form data (not request payload)
                    });
                }

                bookfetch.knn = function(){
                    return $http.get('http://'+$rootScope.server+'/api/knn');
                }

                bookfetch.mlnb = function(){
                    return $http.get('http://'+$rootScope.server+'/api/mlnb');
                }



                bookfetch.getUserBook = function(User){
                    var parameter = User;
                   
                    return  $http({
                    method  : 'POST',
                    url     : 'http://'+$rootScope.server+'/api/getUserBooks', 
                    data    :  parameter,  // pass in data as strings
                    headers : { 'Content-Type': 'application/json' } 
                     // set the headers so angular passing info as form data (not request payload)
                    });
                }

                bookfetch.updateBook = function(book){
                    var parameter = book;
                   
                    return  $http({
                    method  : 'POST',
                    url     : 'http://'+$rootScope.server+'/api/updatebook', 
                    data    :  parameter,  // pass in data as strings
                    headers : { 'Content-Type': 'application/json' } 
                     // set the headers so angular passing info as form data (not request payload)
                    });
                }

                bookfetch.rateBook = function(data){
                    var parameter = data;
                     console.log(data);
                      return  $http({
                      method  : 'POST',
                      url     : 'http://'+$rootScope.server+'/api/rateBook', 
                      data    :  parameter,  // pass in data as strings
                      headers : { 'Content-Type': 'application/json' } 
                       // set the headers so angular passing info as form data (not request payload)
                      });
                }

                bookfetch.getRating =  function(data){
                  var parameter = data;
                     console.log(data);
                      return  $http({
                      method  : 'PUT',
                      url     : 'http://'+$rootScope.server+'/api/getRating', 
                      data    :  parameter,  // pass in data as strings
                      headers : { 'Content-Type': 'application/json' } 
                       // set the headers so angular passing info as form data (not request payload)
                      });
                }

                bookfetch.implicit_mf = function(data){
                  var parameter = data;
                     
                      return  $http({
                      method  : 'PUT',
                      url     : 'http://'+$rootScope.server+'/api/matrixFactorization', 
                      data    :  parameter,  // pass in data as strings
                      headers : { 'Content-Type': 'application/json' } 
                       // set the headers so angular passing info as form data (not request payload)
                      });
                }  
            
            return bookfetch;
                
       }]);
      


