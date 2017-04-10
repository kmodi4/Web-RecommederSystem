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

var router = express.Router();

router.get('/getAllBooks',function (req,res) {
      
     sell_book.find({},function(err,bks){
          if (err) throw err;

       //console.log(bks);
       res.json(bks);
       res.end();
     });

     
});

router.get('/getImages',function (req,res) {
      
     imgs.find({},function(err,bks){
          if (err) throw err;

       //console.log(bks);
       res.json(bks);
       res.end();
     });

     
});

router.post('/getBook',function(req,res){
       
       
       var username = req.body[0].username;
       var title    = req.body[0].title;

       //console.log(username+"   "+title);

       sell_book.find({"Username":username,"title":title},function(err,bks){
          if (err) throw err;

       //console.log(bks);
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
             console.log(result);
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

router.put('/deletebook',function(req,res){
      console.log(req);
      /*var username = req.params.user_id;
      var title = username.substr(username.indexOf("_")+1);
      username =  username.substr(0,username.indexOf("_"));*/
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
              result.msg = "Registertion Failed";
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

router.get('/move',function(req,res){
      imgs.find({},function(err,images){
           
        for(var i=0;i<images.length;i++){
          var search  = {"Username":images[i].Username,"title":images[i].title};
          sell_book.update(search,{$set:{"imgUrl":images[i].imgUrl}},function(err,bks){
                  
          });
        }
           
            res.send("done");
            res.end();
      });
       
});

router.post('/topN',function(req,res){
    
        //var name = req.body[0].username;
        //var pass = req.body[0].isbn;
        var title = req.body[0].title;
        sell_book.find({},{_id:0,title:1},function(err,bks){
          if (err) throw err;
          var data = {};
          var topN = [];
         data.Alltitles = bks;
         data.Mytitle   = title;
        console.log("starting python service...");   
     
       var pyshell = new PythonShell('./python/topN.py');
       //var result = [{"name":"karan"},{"name":"jay"},{"name":"ramesh"}];
       pyshell.send(JSON.stringify(data));
       pyshell.on('message', function (message) {
            topN = JSON.parse(message);
            //console.log(topN); 
            var resultItems = [];
            var numRunningQueries = 0
           for(var i=0;i<topN.length;i++){
                ++numRunningQueries;
               var search = {"title":topN[i]};

               sell_book.findOne(search,function(err,topbooks){
                        --numRunningQueries;
                        resultItems.push(topbooks);
                        //console.log(resultItems)
                        if(numRunningQueries==0){
                          res.json(resultItems)
                          res.end(); 
                        }
               });
               
            }
               
            });


      // end the input stream and allow the process to exit
      pyshell.end(function (err) {
          if (err){
              throw err;
          };
          console.log('Finished');
      });

       //res.json(bks);
       
     });
     
});

router.get('/knn',function(req,res){
      sell_book.find({},{_id:0,title:1,genre:1},function(err,bks){
          if (err) throw err;
       console.log("starting python KNN Classifier...");   
     
       var pyshell = new PythonShell('./python/knn.py');
       //var result = [{"name":"karan"},{"name":"jay"},{"name":"ramesh"}];
       pyshell.send(JSON.stringify(bks));
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
      res.json(bks)
      res.end();

       
     });
});

router.get('/mlnb',function(req,res){
      sell_book.find({},{_id:0,title:1,genre:1},function(err,bks){
          if (err) throw err;
       console.log("starting python MLNB Classifier...");   
     
       var pyshell = new PythonShell('./python/mlnb.py');
       //var result = [{"name":"karan"},{"name":"jay"},{"name":"ramesh"}];
       pyshell.send(JSON.stringify(bks));
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
      res.json(bks)
      res.end();

       
     });
});

router.get('/classify',function(req,res){
      sell_book.find({},{_id:0,title:1,desc:1,genre:1},function(err,bks){
          if (err) throw err;
       console.log("starting python service...");   
     
       var pyshell = new PythonShell('./python/classify.py');
       //var result = [{"name":"karan"},{"name":"jay"},{"name":"ramesh"}];
       pyshell.send(JSON.stringify(bks));
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
      res.json(bks)
      res.end();

       
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
              console.log(search);
              
              
              sell_book.findOne(search,function(err,bks){
                     
                     result.push(bks);
                     next(index+1);
                     
              });

         })(0);
});

router.get('/',function (req,res) {
    res.send('api page');
    res.end();
    console.log("Api page");
});

router.get('/update',function (req,res) {
    
});

router.post('/addBook',function(req,res){
    
     //console.log(req.body);
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
                //console.log(err);
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
        }
        else{
          console.log("Book Saved Successfully");
          result.message = "Book Uploaded Successfully";
          result.success = 1;
       }
      });

      newImg.save(function(err){
        if ( err ) throw err;
        console.log("img Saved Successfully");
      });

     
     res.json(result); 
     res.end();
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