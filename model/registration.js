var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema

/*var CounterSchema = Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});
var counter = mongoose.model('counters', CounterSchema);*/


var RegSchema = new Schema({
  Name: String,
  Username: String,
  EmailID  : String,
  Password: String,
  Phoneno : String 
},{ collection : 'Regs' });

/*RegSchema.pre('save', function(next) {
    var doc = this;
    counter.findByIdAndUpdate({_id: 'UserId'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        doc.userid = counter.seq;
        next();
    });
});*/

// the schema is useless so far
// we need to create a model using it
var Regs = mongoose.model('Regs', RegSchema);

// make this available to our users in our Node applications
module.exports = Regs;