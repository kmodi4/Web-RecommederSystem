/**
 * Created by KARAN on 13-08-2016. 
 */
var express = require('express');
var mongoose = require('mongoose');
var request = require('request'); 
var    fs   = require('fs');
var PythonShell = require('python-shell');

//mongoose.Promise = global.Promise;
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://127.0.0.1:27017/testdb');

var book = require('../model/schema');
var regs = require('../model/registration');
var sell_book = require('../model/sell_books');
var imgs = require('../model/images');
var ratings = require('../model/rating');
var userPreferences = require('../model/userPreferences');
var implicitRatings = require('../model/implicitRatings');

var router = express.Router();


router.get('/getAllBooks',function (req,res) {
      
     sell_book.find({},function(err,bks){
          if (err) throw err;

       res.json(bks);
       res.end();
     });
     
});


router.post('/getBook',function(req,res){
              
       var username = req.body[0].username;
       var title    = req.body[0].title;

       sell_book.find({"Username":username,"title":title},function(err,bks){
          if (err) throw err;

       res.json(bks);
       res.end();
     });
      
});

router.get('/getUser/:id',function(req,res){
       var search = {"Username":req.params.id};
       var result = {};
       regs.findOne(search,function(err,rest){
             if(err){
               result.success = false;
               result.msg = "User not found!!!";
               
             }
             else{
                 result.success = true;
                 result.msg = "User found!!!";
                 result.Username = rest.Username;
                 result.Name     = rest.Name;
                 result.EmailID  = rest.EmailID;
                 result.Phoneno  = rest.Phoneno;

             }
             res.json(result);
             res.end();
        });

      
});

router.post('/getUserBooks',function(req,res){
        var username = req.body[0].username;
        sell_book.find({"Username":username},function(err,bks){
          if (err) throw err;

         res.json(bks);
         res.end();
     });
      
});

router.put('/updateBook',function(req,res){
          var username = req.body.username;
          var title    = req.body.title;
          var yourprice= req.body.yourprice;
          var search = {"Username":username,
                        "title":title}
          var result = {};              
        sell_book.update(search,{$set:{"yourprice":yourprice}},function(err,bks){
             if(err) throw err;
              
             result.message = "Price Updated"; 
             res.json(result);
             res.end();
        });

});

router.put('/updateRating',function(req,res){
          var username = req.body.username;
          var title    = req.body.title;
          var rating= req.body.rating;
          var search = {"Username":username,
                        "title":title}
          var result = {};              
        sell_book.update(search,{$set:{"rating":rating}},function(err,bks){
             if(err) {
                result.msg = "Update Failed!!!"; 
                result.success = false;
             }
             else{ 
             result.msg = "Rating Updated"; 
             result.success = true;
            }
             res.json(result);
             res.end();
        });

});

router.post('/rateBook',function(req,res){
            
           var userRating = new ratings(req.body);
           var result = {}; 
           var search = {"user_id":req.body.user_id,"b_id":req.body.b_id};
           ratings.update(search,{$set:req.body},{upsert:true},function(err){
                 if(err){
                    result.msg = "Unable to rate book";
                    result.success = false;
                 }
                 else{
                    result.msg = "Rated Succesfully";
                    result.success = true;

                    regs.findOneAndUpdate({"user_id":req.body.user_id},{$pull:{rated:{"b_id":req.body.b_id}}},function(err,op){
                        regs.findOneAndUpdate({"user_id":req.body.user_id},{$push:{rated:{"b_id":req.body.b_id,"rating":req.body.rating}}},{new: true},function(err,op){
                          console.log(op.rated);
                          res.json(result);
                          res.end();
                        });
                    });
                 }
           });

           
            
});

router.put('/getRating',function(req,res){
  var search = {"Username":req.body.Username,"rated.b_id":req.body.b_id};
     regs.findOne(search,{_id:0,'rated.$':1},function(err,result){
           if(err){
            throw err;
           }
           res.json(result);
           res.end();
     });
});


router.post('/implicitRatings',function(req,res){
      var search = {"user_id":req.body.user_id,"b_id":req.body.b_id};
        //console.log(search);
        implicitRatings.findOneAndUpdate(search,{$set:search,$inc:{"counts":1}},{upsert:true},function(err,result){
              if(err)
                throw err
              //console.log(result);
              res.json(result);
              res.end();
        });
});

router.put('/matrixFactorization',function(req,res){
  
         regs.find().distinct('user_id',function(error,users){
              sell_book.find().distinct('book_id',function(err,books){
                  implicitRatings.find({},function(e,ratings){
                        var data= {"users":users,"books":books,"ratings":ratings,"target":req.body.user_id};
                        console.log('Start implicit_mf service...');
                        var pyshell = new PythonShell('./python/implicit_mf.py');
             
                        pyshell.send(JSON.stringify(data));
                        pyshell.on('message', function (message) {
                            topN = JSON.parse(message);
                            console.log(topN);
                             findTopN_CF(topN,function(result){
                                 jdata = {"topN":result};
                                  res.json(jdata);
                                  res.end();
                             });
                                                
                        });

                        // end the input stream and allow the process to exit
                        pyshell.end(function (err) {
                            if (err){
                                throw err;
                            };
                            console.log('Finished MF');
                        });
                        
                  });
              });
         });
});

router.put('/test_mf',function(req,res){
  
         regs.find().distinct('user_id',function(error,users){
              sell_book.find().distinct('book_id',function(err,books){
                  implicitRatings.find({},function(e,ratings){
                        var data= {"users":users,"books":books,"ratings":ratings,"target":req.body.user_id};
                        console.log('Start implicit_mf service...');
                        var pyshell = new PythonShell('./python/implicit_mf.py');
             
                        pyshell.send(JSON.stringify(data));
                        pyshell.on('message', function (message) {
                            console.log(message);
                             
                             });
                                                

                        // end the input stream and allow the process to exit
                        pyshell.end(function (err) {
                            if (err){
                                throw err;
                            };
                            console.log('Finished');
                        });
                        res.end("done");

                        });
                        
                  });
              });
});


function findTopN_CF(topN,callback){
        
      var numRunningQueries = 0;
      var result = [];
      
         (function next(index){           //recursion to maintain Order in asyncrnous Calls
              if(index==topN.length){
                callback(result);
                return;
              }
             
              var search  = {"book_id":topN[index]};
               
              sell_book.findOne(search,function(err,bks){
                     
                     result.push(bks);
                     next(index+1);
                     
              });

         })(0);
};

router.get('/ALS_thread',function(req,res){
         regs.find().distinct('user_id',function(error,users){
              sell_book.find().distinct('book_id',function(err,books){
                  implicitRatings.find({},function(e,ratings){
                        var data= {"users":users,"books":books,"ratings":ratings,"target":2001};
                        console.log('Start implicit_mf service...');
                        var pyshell = new PythonShell('./python/implicit_thread_mf.py');
             
                        pyshell.send(JSON.stringify(data));
                        pyshell.on('message', function (message) {
                            //topN = JSON.parse(message);
                            console.log(message);
                              //res.json(topN);
                              res.end("done");
                                                
                        });

                        // end the input stream and allow the process to exit
                        pyshell.end(function (err) {
                            if (err){
                                throw err;
                            };
                            console.log('Finished ALS');
                        });
                  });
              });
         });
});

router.post('/getUserID',function(req,res){
        var newuser = new regs(req.body); 
        newuser.save(function(err,result){
               res.json(result);
               res.end();
        });
});


router.put('/deletebook',function(req,res){
      
      var search = {"Username":req.body.username,"title":req.body.title};
      var result = {};
      console.log(search);
      sell_book.findOneAndRemove(search,function(err){
          if(err){
              result.msg = "Error in removing";
              result.success = 0;
          }
          else{
            result.msg = "Removed Succesfully";
            result.success = 1;
            imgs.findOneAndRemove(search,function(err){
            });

          }
          res.json(result);
          res.end();
      }); 

      
})


router.post('/register',function(req,res){
          var result = {};
          var newuser = new regs(req.body);
          
        newuser.save(function(err){
            if(err) {
              result.msg = "try with different UserName";
              result.success = false;
            }
            else{
              result.msg = "Registered Successfully";
              result.success = true;
            }
            
            res.json(result);
            res.end();
        });

});

router.post('/authenticate',function(req,res){
         var name = req.body.name;
         var pass = req.body.pass;
         var search = {Username:name};
         var result = {};
          
         regs.findOne(search,function(err,rest){
             if(err){
               result.success = false;
               result.msg = "Username not found!!!";
               
             }
             else{
                if(rest){
                   if(rest.Password===pass){
                     result.Name = rest.Name;
                     result.EmailId = rest.EmailID;
                     result.Phoneno = rest.Phoneno;
                     result.user_id = rest.user_id;
                     result.success = true;
                     result.msg = "Authenticated Successfully";
                      console.log(result);
                   }
                   else{
                    result.success = false;
                    result.msg = "InCorrect Passsword";
                   }
                }
                 else{
                   result.success = false;
                   result.msg = "Authentication Failed";
                 }
                 
               }
               
              res.json(result);
              res.end();
             
         });
                       
});



router.post('/topN',function(req,res){

        var title = req.body[0].title;
        var found = false;
        sell_book.findOne({"title":title},function(err,bks){
          
             if("topn" in bks && bks.topn.length>0){
               found = true;
               findTopN(title,found,bks.topn,function(result){
                       res.json(result);
                        res.end();
                        return;
                  });              
             }

            if(!found){ 

              sell_book.find({},{_id:0,title:1},function(err,bks){
                if (err) throw err;
                var data = {};
                var topN = [];
                data.Alltitles = bks;
                data.Mytitle   = title;
                console.log("starting python service...");   
           
                var pyshell = new PythonShell('./python/topN.py');
             
                pyshell.send(JSON.stringify(data));
                pyshell.on('message', function (message) {
                    topN = JSON.parse(message);
                    if(topN.length>1){
                      findTopN(title,found,topN,function(result){
                           res.json(result);
                            res.end();
                      });
                    }
                    else{
                      sell_book.findOne({"title":title},{_id:0,genre:1},function(err,book){
                          
                            sell_book.find({"genre":book.genre},function(err,similar){
                              for(var i=0;i<similar.length;i++){
                                
                                  topN.push(similar[i].title)
                              }
                              if(topN.indexOf(title)!=-1){
                                topN.pop(topN.indexOf(title))
                              }
                              found = false;
                              
                               findTopN(title,found,topN,function(result){
                                     res.json(result);
                                      res.end();
                                }); 
                            });
                      });
                      console.log("genre TopN");
                    }                     
                });

                // end the input stream and allow the process to exit
                pyshell.end(function (err) {
                    if (err){
                        throw err;
                    };
                    console.log('Finished TopN');
                });
            
              });

          }   //if ends

    });

       
     
});

function findTopN(title,found,topN,callback){

      var numRunningQueries = 0;
      var result = [];
      
         (function next(index){           //recursion to maintain Order in asyncrnous Calls
              if(index==topN.length){
                if(!found){
                                  sell_book.update({"title":title},{"$set":{"topn":topN}},{multi: true},function(err,r){
                                        console.log("TopN Edited...");
                                        console.log("TopN length:"+topN.length);
                                        callback(result);
                                        
                                  });
                            }
                else{                  
                  callback(result);
                } 
                return;
              }
             
              var search = {"title":topN[index]};
               
              sell_book.findOne(search,function(err,bks){
                     
                     result.push(bks);
                     next(index+1);
                     
              });

         })(0);


};

function knn(desc,callback){
       
       console.log("starting python KNN Classifier...");   
     
       var pyshell = new PythonShell('./python/knn.py');
       
       pyshell.send(desc);
       pyshell.on('message', function (message) {
            callback(message);
            console.log(message);

        });

      // end the input stream and allow the process to exit
      pyshell.end(function (err) {
          if (err){
              throw err;
          };
          console.log('Finished KNN');
      });
               
        
};

router.get('/knn',function(req,res){
     var str = "abstract data type plays major role. such as stack,queue";
      knn(str,function(result){
            res.send(result);
            res.end();
      });
});

router.get('/mlnb',function(req,res){
      
       console.log("starting python MLNB Classifier...");   
     
       var pyshell = new PythonShell('./python/mlnb.py');
       var str = "abstract data type plays major role. such as stack,queue";
       pyshell.send(str);
       pyshell.on('message', function (message) {
            console.log(message);
            res.send(message)
            res.end();
        });

      // end the input stream and allow the process to exit
      pyshell.end(function (err) {
          if (err){
              throw err;
          };

          console.log('Finished MLNB');
      });
      
});

function classify(callback){
        sell_book.find({},{_id:0,title:1,book_id:1,desc:1,genre:1},function(err,bks){
          if (err) throw err;
       console.log("starting python service...");   
     
       var pyshell = new PythonShell('./python/classify.py');
       
       pyshell.send(JSON.stringify(bks));
       pyshell.on('message', function (message) {
            console.log(message);  
             callback(message);      
        });

        // end the input stream and allow the process to exit
        pyshell.end(function (err) {
            if (err){
                throw err;
            };

            console.log('Finished classify');
        });
        sell_book.update({},{$unset:{topn:1}},{multi:true},function(err,op){
              console.log("Removed All Topn")
        });
      
       
    });
}; 

router.get('/classify',function(req,res){
        
    classify(function(result){
         res.send(result);
         res.end();
    });

});

router.post('/userPreference',function(req,res){
        var search = {"user_id":req.body.user_id,"prefer.genre":req.body.genre};
        console.log(search);
        userPreferences.findOneAndUpdate(search,{$inc:{"prefer.$.rating":0.1}},{new:true},function(err,result){
              console.log(result);
              res.json(result);
              res.end();
        });
});

router.get('/preferences',function(req,res){
     sell_book.aggregate([{"$group":{"_id":"$genre"}}],function(er,data){
      prefer = [];
      for(var i=0;i<data.length;i++){
           var p = {"genre":data[i]._id,"rating":0};
           prefer.push(p);
      }
        regs.find({},{_id:0,user_id:1},function(err,bks){
            var running = 0;
              for(var i=0;i<bks.length;i++){
                var data = {"user_id":bks[i].user_id,"prefer":prefer};
                var  newuserPreferences = new userPreferences(data);
                running++;
                newuserPreferences.save(function(error){
                     if(error)
                      throw error;
                    running--;
                    if(running==0){
                       res.send("Done");
                       res.end();
                    }
                });
              } 
        });

      });  
});

router.get('/utility_matrix',function(req,res){
       var data = {}
       regs.find({},{_id:0,user_id:1},function(err,users){
            sell_book.find({},{_id:0,book_id:1},function(er,books){
              ratings.find({},{_id:0,user_id:1,b_id:1,rating:1},function(e,ratings){

                  data = {"users":users,"books":books,"ratings":ratings}
                  console.log("starting python service...");   
     
                   var pyshell = new PythonShell('./python/utility_matrix.py');
                   pyshell.send(JSON.stringify(data));

                   pyshell.on('message', function (message) {
                        console.log(message);                 
                    });

                    // end the input stream and allow the process to exit
                    pyshell.end(function (err) {
                        if (err){
                            throw err;
                        };
                        console.log('Finished ui_matrix');
                    });
                    res.send("Done");
                    res.end();
                });    
            });
       });
});

router.put('/recentBooks',function(req,res){
      var numRunningQueries = 0;
      var result = [];
      
         (function next(index){           //recursion to maintain Order in asyncrnous Calls
              if(index==req.body.length){
                res.json(result);
                res.end();
                return;
              }
              var title = req.body[index].title;
              var username = req.body[index].username;
              var search  = {"title":title,"Username":username};
               
              sell_book.findOne(search,function(err,bks){
                     
                     result.push(bks);
                     next(index+1);
                     
              });

         })(0);
});

router.get('/adduserID',function(req,res){
      var numRunningQueries = 0;
      var result = [];

      sell_book.find({},function(err,bks){

        regs.find({},function(err,users){
              (function next(index){           //recursion to maintain Order in asyncrnous Calls
              if(index==bks.length){
                res.end("done");
                console.log("done");
                return;
              }
              var title = bks[index].title;
              var username = bks[index].Username;
              var u_id = 2000;
              for(var i=0;i<users.length;i++){

                 if(username==users[i].Username){
                     u_id = users[i].user_id;
                     
                     break;
                 }
              }
              var search  = {"title":title,"Username":username};

              sell_book.findOneAndUpdate(search,{$set:{user_id:u_id}},function(err,bks){
                     next(index+1);                    
              });

         })(0);  
        });
                     
      });
         
});

router.get('/',function (req,res) {
    res.send('api page');
    res.end();
    console.log("Api page");
});

router.get('/update',function (req,res) {
    
});

router.post('/addBook',function(req,res){
    
     var msg = "Added Succesfully";

      var dir     = "./public/images/";
      var imgname = req.body.Username+"_"+req.body.isbn+".png";
      var url = "http://karan.com:3000/images/"+imgname;
      var result = {};

        var newbook = sell_book({
          Username : req.body.Username,
          isbn     : req.body.isbn,
          title    : req.body.title,
          author   : req.body.author,
          edition  : req.body.edition,
          condition: req.body.condition,
          publisher: req.body.publisher,
          pages    : req.body.pages,
          originalprice:req.body.originalprice,
          yourprice: req.body.yourprice,
          desc     : req.body.desc,
          genre    : req.body.genre,
          imgUrl   : url
          
        });
       

        if(req.body.fromgoogle){
            request(req.body.imgUrl, {encoding: 'binary'}, function(error, response, body) {
              fs.writeFile(dir+imgname, body, 'binary', function (err) {});
            });
           
        }
        else{
          var buff = new Buffer(req.body.base64, 'base64');
          fs.writeFile(dir+imgname, buff, function(err) {
               if(err) 
                  throw err;
                
              });
        }

        var newImg = imgs({
           Username : req.body.Username,
           title    : req.body.title,
           imgUrl   : "http://karan.com:3000/images/"+imgname
        });

      //Saving the model instance to the DB
      newbook.save(function(err){
        if ( err ){
            result.message = "Book Upload failed";
          result.success = 0;
          res.json(result); 
               res.end();
        }
        else{
          console.log("Book Saved Successfully");
          result.message = "Book Uploaded Successfully";
          result.success = 1;

          newImg.save(function(err){
            if ( err ) throw err;
            console.log("img Saved Successfully");
               
               res.json(result); 
               res.end();

          });

          classify(function(opt){ 
            
            knn(req.body.desc,function(op){
              op = op.replace(/[\n\r]+/g, '');
              var search = {"Username":req.body.Username,"title":req.body.title};
              sell_book.update(search,{$set:{"genre":op}},function(err,modify){
                  console.log("Genre updated");
              });

            });

          });

         


        }

      });

      

     
});

router.post('/addUser',function(req,res){
     
     console.log(req.body);
     var msg = "";
        var newbook = book({
          title: req.body.title,
          genre: req.body.genre,
          publisher: req.body.publisher
        });
     
     res.send(msg);
     res.end();
});

module.exports = router;

//