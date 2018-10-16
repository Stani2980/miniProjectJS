var userApi = require('express').Router();
const uf = require('../../facades/userFacade');

//GET all users
userApi.get('/', async function (req, res, next) {
    res.json(await uf.getAllUsers());
})

//GET user by id
userApi.get('/:id', async function (req, res, next) {
    res.json(await uf.findById(req.params.id));
})

//GET user by username
userApi.get('/username/:username', async function (req, res, next) {
    res.json(await uf.findByUsername(req.params.username));
})

//DELETE user by id (returns the removed object)
userApi.delete('/:id', async function (req, res, next) {
    res.json(await uf.deleteUser(req.params.id));
})

// ********* (NOT THE SAFEST FUNCTIONS IN THE WORLD NEEDS SANITIZING)
//UPDATE user  
userApi.put('/', async function (req, res, next) {
    res.json(await uf.updateUser(req.body));
})

//POST add user  
userApi.post('/', async function (req, res, next) {
    const user = req.body;
    res.json(await uf.addUser(user.firstName, user.lastName, user.userName, user.password, user.email));
})
//***************** */



module.exports = userApi;