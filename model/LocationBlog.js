var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationBlogSchema = new Schema({
    info: { type: String, required: true },
    pos: {
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true },

    },
    // Not Embedding
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likedBy: [Schema.Types.ObjectId],
    created: {type: Date, default: Date.now}    
})

locationBlogSchema.virtual('slug').get(function(){
    return "/locationblog/"+this._id;
})

locationBlogSchema.virtual('likedByCount').get(function(){
    return this.likedBy.length;
})

module.exports = mongoose.model('LocationBlog', locationBlogSchema);