var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var ratingSchema = new Schema({
  user_id: Number,
  b_id: { type: Number},
  counts: { type: Number}
  
});

var ratings = mongoose.model('implicitRatings', ratingSchema);

module.exports = ratings;