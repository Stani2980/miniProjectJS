var mongoose = require("mongoose");
var User = require("../model/User");

function getAllUsers() {
    return User.find({}).exec();
}

function findByUsername(userName) {
    return User.findOne({ userName }).exec();
}

function findById(_id) {
    return User.findById(_id).exec();
}

function addUser(firstName, lastName, userName, password, email) {
    return new User({ userName, password, firstName, lastName, email }).save();
}

function updateUser(user) {
    return User.findByIdAndUpdate(user._id, user, { new: true }).exec();
}

function deleteUser(_id) {
    return User.findOneAndRemove(_id);
}

module.exports = {
    getAllUsers: getAllUsers,
    addUser: addUser,
    findByUsername: findByUsername,
    findById: findById,
    updateUser: updateUser,
    deleteUser,

}