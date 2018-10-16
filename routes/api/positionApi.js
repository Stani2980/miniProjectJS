var positionApi = require('express').Router();
const pf = require('../../facades/positionFacade');

//GET Position by id
userApi.get('/:id', async function (req, res, next) {
    res.json(await pf.getPosition(req.params.id));
});

// ********* (NOT THE SAFEST FUNCTIONS IN THE WORLD NEEDS SANITIZING)
//POST add new pos
positionApi.post('/', async function (req, res, next) {
    res.json(await pf.addNewPos(req.body.longtitude, req.body.latitude, req.body._id));
})

module.exports = positionApi;