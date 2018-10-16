var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// Use as an example for embedding...
var jobSchema = new Schema({
    type: String,
    company: String,
    companyUrl: String 
})

var userSchema = new Schema({
    userName: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    firstName: String,
    lastName: String,
    email: {type: String, required: true},
    created: {type: Date, default: Date.now},
    lastUpdated: Date,
    //observe embedding
    job : [jobSchema],

})

userSchema.pre('save', function(next){
    this.password = "hash_me_plz" + this.password;
    this.lastUpdated = new Date();
    next();
})

userSchema.pre('update', function(next){
    this.update({}, {$set : {lastUpdated: new Date()}});
    next();
})


module.exports = mongoose.model('User',userSchema);