require('mongoose');
var Position = require('../model/Position');

async function addNewPos(longtitude, latitude, id) {
    return new Position({ user: id, loc: { coordinates: [longtitude, latitude] } }).save();
}

function getPositionById(_id) {
    return Position.findOne({_id} );   /// NOT SURE IF WORKS, NEEDS TESTING
}

// DOES NOT WORK !? TBD
function getPositionByLongLat(longtitude, latitude) {
    return Position.findOne({ loc: { coordinates: [longtitude, latitude] } }).populate('user').exec();   /// NOT SURE IF WORKS, NEEDS TESTING
}

function getAllPositions() {
    return Position.find({}).exec();
}

module.exports = {
    addNewPos,
    getPositionById,
    getAllPositions,
    getPositionByLongLat,
}