var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var sell_bookSchema = new Schema({
  Username: String,
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
  imgUrl:String
  
},{ collection : 'sell_book' });

// the schema is useless so far
// we need to create a model using it
var book = mongoose.model('sell_book', sell_bookSchema);

// make this available to our users in our Node applications
module.exports = book;