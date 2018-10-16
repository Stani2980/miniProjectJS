var locationBlogApi = require('express').Router();
var lbf = require('../../facades/locationBlogFacade');

//GET all blogs
locationBlogApi.get('/', async function (req, res, next) {
    res.json(await lbf.getAllLocationBlogs());
})

//GET by id
locationBlogApi.get('/:id', async function (req, res, next) {
    res.json(await lbf.getLocationBlogById(req.params.id));
})

//GET by pos
locationBlogApi.get('/position/', async function (req, res, next) {
    res.json(await lbf.getLocationBlogByPos(req.body.longtitude, req.body.latitude));
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
locationBlogApi.put('/like', async function (req, res, next) {
    res.json(await lbf.addLikeToBlog(req.body));
})


/****************************** */


module.exports = locationBlogApi;