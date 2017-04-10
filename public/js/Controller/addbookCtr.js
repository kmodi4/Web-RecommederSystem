(function(){
'use strict';

   
angular.module('myApp')
      .controller('addbookCtr',function($scope,authfact,$rootScope,bookfetch,$http,$window,$timeout,$location){

            $scope.onChange = function (e, fileList) {
                  //alert('this is on-change handler!');
            };

  
            $scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
             // alert('this is handler for file reader onload event!');
            };
          	    
          	    $scope.user = {};
                $scope.files = [];
                var uploadedCount = 0;
                $scope.user.Username = authfact.getUser();;
                $scope.user.genre = "Other";
                $scope.result = {};
                 $scope.thumbnail = {
                    dataUrl: 'adsfas'
                };
                var defUrl="http://"+$rootScope.server+"/images/Default-image.png"; 
                $scope.user.imgUrl = defUrl

               

            $scope.fileReaderSupported = window.FileReader != null;
            $scope.photoChanged = function(files){
                if (files != null) {
                    var file = files[0];
                if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                    $timeout(function() {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function(e) {
                            $timeout(function(){
                               $scope.thumbnail.dataUrl = e.target.result;
                               console.log($scope.thumbnail.dataUrl);
                               $scope.user.imgUrl = $scope.thumbnail.dataUrl;
                            });
                        }
                    });
                }
            }
            }; 

                $scope.fetchBookInfo = function(isbn){
                         bookfetch.getisbndetail(isbn)
                                  .success(function(data){
                                      console.log(data);
                                      if(data.totalItems!=0){
                                        $scope.result = data.items[0].volumeInfo;
                                        console.log($scope.result);
                                        $scope.mapData($scope.result);
                                      }
                                      else{
                                        alert("Coudn't find Relevant Data!!!");
                                      }

                                  })
                                  .error(function(data){
                                      alert("Error");
                                  });
                };

                $scope.mapData = function(res){
                     $scope.user.title = res.title;
                     
                     if(typeof res.authors != "undefined")
                      $scope.user.author = res.authors[0];
                     if(typeof res.publisher != "undefined")
                      $scope.user.publisher = res.publisher;
                     if(typeof res.pageCount != "undefined")
                      $scope.user.pages = res.pageCount;
                     if(typeof res.description != "undefined")
                      $scope.user.desc = res.description;
                     if(typeof res.imageLinks != "undefined")
                       $scope.user.imgUrl = res.imageLinks.thumbnail;
                     if(typeof res.categories != "undefined"){
                      $scope.user.categories = res.categories;
                      $scope.user.genre = res.categories[0];
                     }
                     
                };

          $scope.logdata = function(){
            if($scope.file && $scope.user.imgUrl==defUrl){
                     $scope.user.fromgoogle = false;
                     $scope.user.base64 = $scope.file.base64;
            }
            else if($scope.user.imgUrl!=defUrl){
                  $scope.user.fromgoogle = true;
                  $scope.user.imgUrl = $scope.result.imageLinks.thumbnail;
                  //$scope.user.base64 = $scope.file.base64;

            }

            else{
              alert("Select img");
            }
            console.log($scope.user);
          };      

          $scope.postData = function(){

               if($scope.file && $scope.user.imgUrl==$scope.thumbnail.dataUrl){
                     $scope.user.fromgoogle = false;
                     $scope.user.base64 = $scope.file.base64;
                }
                else if($scope.user.imgUrl!=$scope.thumbnail.dataUrl && $scope.user.imgUrl!=defUrl){
                      $scope.user.fromgoogle = true;
                      $scope.user.imgUrl = $scope.result.imageLinks.thumbnail;
                      //$scope.user.base64 = $scope.file.base64;
                }

                else{
                  alert("Select the Cover photo");
                  return;
                }
                 console.log("Test");
                   bookfetch.postdetail($scope.user)
                    .success(function(data){
                        alert(data.message);
                        $location.path('/home');

                    })
                    .error(function(data){
                         alert("error");
                         
                    });
                                  
           };

          });



 })();   