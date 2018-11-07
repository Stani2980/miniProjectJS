var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const SECONDS = 1;
var EXPIRES = 60 * SECONDS;

var positionSchema = new Schema({
    //Make sure that next line reflects your User-model
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    created: { type: Date, expires: EXPIRES, default: Date.now() },
    loc: {
        "type": { type: String, enum: "Point", default: "Point" },
        coordinates: { type: [Number] }
    }
})
positionSchema.index({ loc: "2dsphere" }, { "background": true });

module.exports = mongoose.model("Position", positionSchema);
