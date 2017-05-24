var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var chatgcmSchema = new Schema({
  Username:String,
  reg_id: { type: String}
  
});

var chatgcm = mongoose.model('chatgcm', chatgcmSchema);

module.exports = chatgcm;