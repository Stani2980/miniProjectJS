require('mongoose');
var Position = require('../model/Position');
const gju = require('geojson-utils');

async function addNewPos(lon, lat, id, dateInFuture) {
    const posDetails = { user: id, loc: { coordinates: [lon, lat] } };

    if (dateInFuture) {
        posDetails.created = '2020-01-01T00:00:00.000Z';
    }
    const pos = new Position(posDetails);

    return pos.save();
}

function getPositionById(_id) {
    return Position.findOne({ _id });   /// NOT SURE IF WORKS, NEEDS TESTING
}

function getPositionByUserId(_id) {
    return Position.findOne({ user: _id });
}

function getAllPositions() {
    return Position.find({}).exec();
}

function getAllPositionsWithPopulatedUsers() {
    return Position.find({}).populate('user', 'userName').exec();
}

function updatePostion(userId, longitude, latitude) {
    return Position.findOneAndUpdate({ user: userId }, { created: Date.now(), loc: { type: 'Point', coordinates: [longitude, latitude] } }, { upsert: true, new: true }).exec();
}

async function findFriendsWithinRadius(longitude, latitude, distance) {
    let friendsPos = await Position.find({
        loc:
        {
            $near:
            {
                //search all friends at range
                $geometry: { type: "Point", coordinates: [longitude, latitude] },
                $maxDistance: distance
            }
        }
        //populate only usernames
    }).populate('user', 'userName');

    // remove self from list
    const self = friendsPos.shift();
    //Map all friends with usernames and coordinates
    friendsPos = friendsPos.map((f) => {
        let res = {};
        res.distanceToUser = gju.pointDistance(f.loc, self.loc);
        res.username = f.user.userName;
        res.latitude = f.loc.coordinates[1]
        res.longitude = f.loc.coordinates[0]
        return res;
    })

    return friendsPos;
}

module.exports = {
    addNewPos,
    getPositionById,
    getAllPositions,
    getPositionByUserId,
    updatePostion,
    findFriendsWithinRadius,
    getAllPositionsWithPopulatedUsers,
}