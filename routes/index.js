var express = require('express');
var router = express.Router();
const uf = require('../facades/userFacade')
const bf = require('../facades/locationBlogFacade')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/login', function (req, res, next) {
  res.render('login');
})

router.post('/login', async function (req, res, next) {
  const { username, password } = req.body;
  let user = {};
  try {
    user = await uf.loginServersideRender(username, password);
  } catch (error) {
    res.render('error', { error: error })
  }
  const locationBlogs = await bf.getAllLocationBlogs();
  res.render('blogs', { user, locationBlogs })
})

router.post('/like', async function (req, res, next) {
  const { userId, blogId } = req.body;
  const blog = await bf.getLocationBlogById(blogId);
  try {
    await bf.addLikeToBlog(blog, userId);
  } catch (error) {
    res.render('error', { error });
  }
  const locationBlogs = await bf.getAllLocationBlogs();
  // super hotfix
  const user = await uf.findById(userId);
  res.render('blogs', { user, locationBlogs })
})

router.get('/register', async function (req, res, next) {
  res.render('register');
});

router.post('/register', async function (req, res, next) {
  const { firstname, lastname, username, password, email } = req.body;
  await uf.addUser(firstname, lastname, username, password, email);
  res.render('login');
});

module.exports = router;
