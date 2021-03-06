var mongoose = require("mongoose");
var User = require("../model/User");
const pf = require('../facades/positionFacade')
const bcrypt = require('./utils/bcrypt')


function getAllUsers() {
    return User.find({}).exec();
}

function findByUsername(userName) {
    return User.findOne({ userName }).exec();
}

function findById(_id) {
    return User.findById(_id).exec();
}

async function addUser(firstName, lastName, userName, password, email) {
    return new User({ userName, password, firstName, lastName, email }).save();
}

function updateUser(user) {
    return User.findByIdAndUpdate(user._id, user, { new: true }).exec();
}

function deleteUser(_id) {
    return User.findOneAndRemove(_id);
}

async function loginServersideRender(username, password) {
    const user = await findByUsername(username);
    if (user !== null) {
        const match = await bcrypt.checkLogin(user, password);
        if (match) {
            return user;
        }
    } else {
        let err = new Error('Wrong username or password!');
        err.status = 403;
        throw err;
    }
}

async function login(username, password, longitude, latitude, distance, game) {
    const user = await findByUsername(username);
    if (user !== null) {
        const match = await bcrypt.checkLogin(user, password);
        if (match) {
            await pf.updatePostion(user._id, longitude, latitude);
            return await pf.findFriendsWithinRadius(longitude, latitude, distance, game);
        }
    } else {
        let err = new Error('Wrong username or password!');
        err.status = 403;
        throw err;
    }
}

module.exports = {
    getAllUsers,
    addUser,
    findByUsername,
    findById,
    updateUser,
    deleteUser,
    login,
    loginServersideRender
}