var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var counters = require('../model/counters');

var RegSchema = new Schema({
  Name: String,
  Username: String,
  EmailID  : String,
  Password: String,
  Phoneno : String,
  user_id:Number,
  rated:[] 
},{ collection : 'Regs' });

RegSchema.pre('save',function(next){
       var newuser = this;
       counters.findOneAndUpdate({_id: 'UserID'}, {$inc: { user_seq: 1} }, function(error, counter)   {
          if(error)
              return next(error);
          
          newuser.user_id = counter.user_seq;
          next();
        });
});


var Regs = mongoose.model('Regs', RegSchema);

// make this available to our users in our Node applications
module.exports = Regs;