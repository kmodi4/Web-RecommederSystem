var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var ratingSchema = new Schema({
  user_id: Number,
  b_id: { type: Number},
  rating: { type: Number}
  
});

var ratings = mongoose.model('ratings', ratingSchema);

module.exports = ratings;