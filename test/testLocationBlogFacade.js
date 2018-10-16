const mongoose = require("mongoose");
const expect = require("chai").expect;
const assert = require("chai").assert;
const connect = require("../dbSetup");
const LocationBlog = require('../model/LocationBlog'); // Use this import method in test, cause it cashes the known Schemas (if new Schema it will not know it the smart way)
const User = require('../model/User');
const lbf = require('../facades/locationBlogFacade');

//https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};
mongoose.connection = {};


describe("Testing locationBlogFacade", function () {

  /* Connect to the TEST-DATABASE */
  before(async function () {
    this.timeout(require("../settings").MOCHA_TEST_TIMEOUT); // Change default value from 2 sec to 5 else testing does not work
    await connect(require("../settings").TEST_DB_URI);
  })

  var locationBlogs = [];
  var user;
  /* Setup the database in a known state (2 users) before EACH test */
  beforeEach(async function () {
    //Delete db data for testing
    await LocationBlog.deleteMany({}).exec();
    await User.deleteMany({}).exec();

    //Add a user to be owner of Location Blogs
    user = await new User({ firstName: "Bruce", lastName: "Wayne", userName: "joker", password: "test", email: "bat@man.org" }).save();
    //Add some blogs
    locationBlogs = await Promise.all(
      [lbf.addLocationBlog("Cool Place", 26, 28, user._id),
      lbf.addLocationBlog("Another Cool Place", 56, 56, user._id),
      lbf.addLocationBlog("Yet Another Cool Place", 28, 56, user._id)
      ]).catch(err => console.log("ERROR : " + err));

  });

  it("Find all LocationBlogs for user Bruce Wayne (Cool Place, Another Cool Place, Yet Another Cool Place)", async function () {
    let blogs = await lbf.getAllLocationBlogs();
    expect(blogs.length).to.be.equal(3);
  })

  it("Find (Another Cool Place) by positon with (longtitude, latitude)", async function () {
    let blog = await lbf.getLocationBlogByPos(56, 56);
    expect(String(blog.author)).to.be.equal(String(user._id));
  });

  it("Update Cool Place to Place", async function () {
    let blogToUpdate = locationBlogs[0];
    blogToUpdate.info = 'Place';
    let blog = await lbf.updateLocationBlog(blogToUpdate);
    expect(String(blog.info)).to.be.equal('Place');
  });

  it("Give Like to Blog", async function (){
    let blog = await lbf.addLikeToBlog(locationBlogs[0], user);
    expect(String(user._id)).to.be.equal(String(blog.likedBy[0]));
  })
  
  it("Get Error when User likes same post twice", async function(){
    await lbf.addLikeToBlog(locationBlogs[0], user);
    expect(() => lbf.addLikeToBlog(locationBlogs[0], user)).to.throw(Error);
    
  })

  it("Delete a LocationBlog by id so only two are left", async function () {
    await lbf.deleteLocationBlog(locationBlogs[0]._id);
    let blogs = await lbf.getAllLocationBlogs();
    expect(blogs.length).to.be.equal(2);
  })

  after(function () {
    mongoose.connection.close();
  })
})