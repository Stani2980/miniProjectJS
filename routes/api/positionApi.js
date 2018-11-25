var positionApi = require('express').Router();
const pf = require('../../facades/positionFacade');
const { gameArea } = require('../../facades/utils/gameArea')
const gf = require('../../facades/gameFacade');
const gju = require('geojson-utils');

//Fast game impl
positionApi.post('/gamearea', async function (req, res, next) {
    let { longitude, latitude } = req.body;
    let players = await gf.getPlayersWithinGameArea(gameArea, longitude, latitude);

    ////// HOTFIX BECAUSE SOMEHOW IT DOES NOT WORK IN ABOVE METHOD
    const currentPlayerPos = { type: 'Point', coordinates: [latitude, longitude] }
    let distances = await players.map(player => {
        if (gju.pointInPolygon(player.loc, gameArea.geometry)) {
            return gju.pointDistance(player.loc, currentPlayerPos);
        }
    });
    gameArea.properties.distances = distances;
    /////////////////////////////////////

    gameArea.properties.playersInArea = players;
    res.json(gameArea);
});

// ********* (NOT THE SAFEST FUNCTIONS IN THE WORLD NEEDS SANITIZING)
//POST add new pos
positionApi.post('/', async function (req, res, next) {
    res.json(await pf.addNewPos(req.body.longitude, req.body.latitude, req.body._id));
})

module.exports = positionApi;