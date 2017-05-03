var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var chatgcmSchema = new Schema({
  Username: Number,
  reg_id: { type: Number}
  
});

var chatgcm = mongoose.model('chatgcm', chatgcmSchema);

module.exports = chatgcm;