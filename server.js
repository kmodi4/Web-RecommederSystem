/**
 * Created by KARAN on 13-08-2016.
 */

var express = require('express');
var path = require('path');
//var ISBNDB = require('isbndb');
//ISBNDB.initialize("NAQP8CD5");

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
var apiRoute = require('./routes/apiRouter');

app.use(express.static(__dirname+'/public'));
app.use('/api',apiRoute);


app.all('/*',function (req,res) {
   // res.sendFile(__dirname+'/public/index.html');
    console.log('All');
    /*ISBNDB.Books.get("9780743294065", function(responseBody){
  // .... successful response callback
}, function(errorResponse){
  // .... error callback
});*/
    res
        .status( 200 )
        .set( { 'content-type': 'text/html; charset=utf-8' } )
        .sendFile(__dirname+'/public/index.html' );
});

app.listen(3000);
console.log("Server running at 3000 port");