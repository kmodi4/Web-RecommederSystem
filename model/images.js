var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var imgSchema = new Schema({
  Username: String,
  title: { type: String},
  imgUrl: { type: String}
  
});

// the schema is useless so far
// we need to create a model using it
var imgs = mongoose.model('imgs', imgSchema);

// make this available to our users in our Node applications
module.exports = imgs;