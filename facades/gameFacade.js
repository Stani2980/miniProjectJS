const gju = require('geojson-utils');
const pf = require('./positionFacade');

async function getPlayersWithinGameArea(gameArea, lon, lat) {
    let players = await pf.getAllPositionsWithPopulatedUsers();
    // Important to give lat lon not lon lat.
    const currentPlayerPos = { type: 'Point', coordinates: [lat, lon] }
    const playersInArea = await players.filter(pos => {
        if (gju.pointInPolygon(pos.loc, gameArea.geometry)) {
            pos.distanceToPlayer = gju.pointDistance(pos.loc, currentPlayerPos);
            return pos;
        }
    })
    return playersInArea;
}

module.exports = {
    getPlayersWithinGameArea,

}