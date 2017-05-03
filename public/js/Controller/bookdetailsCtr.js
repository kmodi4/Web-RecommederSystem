(function(){
'use strict';

angular.module('myApp')
 .controller('bookdetailsCtr',  function($scope,bookfetch,idfact,$location,$route){
    $scope.Username = idfact.getBookid().user;
    $scope.isbn     = idfact.getBookid().isbn;
    $scope.title    = idfact.getBookid().title;

    $scope.resp     = {};
    $scope.topN     = [];
    $scope.implicit_topN = [];

  $scope.rate = 0;
  $scope.max = 5;
  $scope.isReadonly = true;
  var ownBook = true;

  $scope.hoveringOver = function(value) {
    $scope.overStar = value;
    $scope.percent = 100 * (value / $scope.max);
    
  };

  $scope.onRating = function(){
    if(!ownBook){
         $scope.isReadonly = false;
    }
  }

  $scope.$watch('rate',function(oldvalue,newvalue){
       console.log(oldvalue+" "+newvalue);
       if(oldvalue!=newvalue && !$scope.isReadonly){
           var data = {"user_id":idfact.getid().userid,"b_id":$scope.resp.book_id,"rating":$scope.rate}
           bookfetch.rateBook(data)
                    .success(function(data){
                        
                        if(data.success){
                            alert(data.msg);
                        }

                    })
                    .error(function(data){
                           alert("error");
                    });
        }
  });

 
  $scope.ratingStates = [
    {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
    {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
    {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
    {stateOn: 'glyphicon-heart'},
    {stateOff: 'glyphicon-off'}
  ];
  


    $scope.loadDetails = function(){
        var par = [{"username":$scope.Username,"title":$scope.title}];
        bookfetch.getbook(par)
                 .success(function(data){
                     $scope.resp = data[0];
                     $scope.getRating();
                     if($scope.resp.Username!=idfact.getid().username){
                        $scope.isReadonly = false;
                        ownBook = false;
                     }                     
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

    $scope.implicit_mf = function(){
      var par = {"user_id":idfact.getid().userid}
      bookfetch.implicit_mf(par)
               .success(function(data){
                  $scope.implicit_topN = data.topN;

               })
               .error(function(data){
                   console.log("error fetching implict_mf");
               });
    }

    $scope.getRating = function(){
       var par = {"Username":idfact.getid().username,"b_id":$scope.resp.book_id}
       bookfetch.getRating(par)
                .success(function(data){
                  if(data!=null){
                    console.log(data.rated[0]);
                    if(typeof data.rated != "undefined"){
                        $scope.isReadonly = true;
                        
                        if(data.rated[0].b_id==$scope.resp.book_id){
                                $scope.rate = data.rated[0].rating;
                        }
                        
                        
                        
                    }
                    

                  }
                  
                })
                .error(function(data){
                   console.log("error in rating");
                });
    }

    $scope.loadDetails();
    $scope.TopN_Items();
    $scope.implicit_mf();
    

    $scope.itemclick = function(user,isbn,title){
        idfact.setBookid(user,isbn,title);
        console.log("Item click");
         $location.path('/bookdetails');
         $route.reload()
    } 
  

});


 })();
