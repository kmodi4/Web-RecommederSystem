var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema

var counters = require('../model/counters');

var sell_bookSchema = new Schema({
  Username: String,
  user_id:Number,
  book_id:Number,
  isbn: { type: String},
  title: { type: String},
  author: String,
  edition: String,
  condition: String,
  publisher: String,
  pages: Number,
  originalprice: Number,
  yourprice: Number,
  desc: String,
  genre:String,
  imgUrl:String,
  rating:Number,
  topn:[String]
  
},{ collection : 'sell_book' });

sell_bookSchema.pre('save',function(next){
       var newbook = this;
       counters.findOneAndUpdate({_id: 'UserID'}, {$inc: { seq: 1} }, function(error, counter)   {
          if(error)
              return next(error);
          newbook.book_id = counter.seq;
          next();
        });
});

var book = mongoose.model('sell_book', sell_bookSchema);

module.exports = book;