var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var counterschema = new Schema({
  _id:String,
  seq:Number,
  user_seq:Number
},{ collection : 'counters' });


var counters = mongoose.model('counters', counterschema);

// make this available to our users in our Node applications
module.exports = counters;