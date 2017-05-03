var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userPreferenceSchema = new Schema({
  user_id: Number,
  prefer: []
  
});

var userPreferences = mongoose.model('userPreferences', userPreferenceSchema);

module.exports = userPreferences;