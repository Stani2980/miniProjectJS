var locationBlogApi = require('express').Router();
var lbf = require('../../facades/locationBlogFacade');

//GET all blogs
locationBlogApi.get('/', async function (req, res, next) {
    res.json(await lbf.getAllLocationBlogs());
})

//GET by id
locationBlogApi.get('/:id', async function (req, res, next) {
    res.json(await lbf.getLocationBlogById(req.params.id).catch(next));
})

//GET by pos
locationBlogApi.get('/position/:longitude/:latitude', async function (req, res, next) {
    res.json(await lbf.getLocationBlogByPos(req.params.longitude, req.params.latitude));
})

//DELETE position (returns deleted obj)
locationBlogApi.delete('/:id', async function (req, res, next) {
    res.json(await lbf.deleteLocationBlog(req.params.id));
})


/********************** Unsafe functions (Sanitization needed)*/
//POST add location
locationBlogApi.post('/', async function (req, res, next) {
    res.json(await lbf.addLocationBlog(req.body));
})

//PUT Update locationblog
locationBlogApi.put('/', async function (req, res, next) {
    res.json(await lbf.updateLocationBlog(req.body));
})

//THIS COULD BE CREATED WITH PATCH INSTEAD OF PUT ( TBD )
//PUT Add like to user (Throws Error if already liked)
locationBlogApi.put('/like/:userId', async function (req, res, next) {
    res.json(await lbf.addLikeToBlog(req.body, req.params.userId).catch(next));
})
/****************************** */


module.exports = locationBlogApi;