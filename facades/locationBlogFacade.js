require('mongoose');
var LocationBlog = require('../model/LocationBlog');

function getAllLocationBlogs() {
  return LocationBlog.find({}).exec();
}

function getLocationBlogById(_id) {
  return LocationBlog.findById(_id);
}

function getLocationBlogByPos(longtitude, latitude) {
  return LocationBlog.findOne({ pos: { longtitude, latitude } }).exec();
}

function addLocationBlog(info, longtitude, latitude, user) {
  return new LocationBlog({ info, pos: { longtitude, latitude }, author: user._id }).save();
}

function updateLocationBlog(locationBlog) {
  return LocationBlog.findByIdAndUpdate(locationBlog._id, locationBlog, { new: true }).exec();
}

function addLikeToBlog(locationBlog, user) {
  //User cannot like the same blog twice hence checking if the blog has been liked by user already
  var checkIfAlreadyLiked = locationBlog.likedBy.filter((userId) => userId == user._id);
  
  //if not liked, then add the like
  if (checkIfAlreadyLiked.length < 1) {
    locationBlog.likedBy.push(user._id);
    return LocationBlog.findByIdAndUpdate(locationBlog._id, locationBlog, { new: true }).exec();
  }

  //Throw Error if user has already liked the blog
  throw new Error("The user har already liked this blog!");
}

function deleteLocationBlog(_id){
  return LocationBlog.findByIdAndDelete(_id).exec();
}
module.exports = {
  addLocationBlog,
  getLocationBlogByPos,
  getAllLocationBlogs,
  updateLocationBlog,
  addLikeToBlog,
  getLocationBlogById,
  deleteLocationBlog,

}