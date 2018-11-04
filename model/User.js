var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('../facades/utils/bcrypt')

// Use as an example for embedding...
var jobSchema = new Schema({
    type: String,
    company: String,
    companyUrl: String
})

var userSchema = new Schema({
    userName: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    email: { type: String, required: true },
    created: { type: Date, default: Date.now },
    lastUpdated: Date,
    //observe embedding
    job: [jobSchema],

})

userSchema.pre('save', async function (next) {
    // Hash password
    this.password = await bcrypt.hashPassword(this.password);
    this.lastUpdated = new Date();
    next();
})

userSchema.pre('update', function (next) {
    this.update({}, { $set: { lastUpdated: new Date() } });
    next();
})


module.exports = mongoose.model('User', userSchema);