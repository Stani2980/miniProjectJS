var mongoose = require("mongoose");
const expect = require("chai").expect;
const fetch = require('node-fetch');
const nock = require('nock');

const connect = require("../../dbSetup");
const settings = require("../../settings");
const buildHTTP = require('./util').buildHTTP;
const handleHttpErrors = require('./util').handleHttpErrors;
const lbf = require('../../facades/locationBlogFacade');

mongoose.models = {};
mongoose.modelSchemas = {};
mongoose.connection = {};


describe("API : Testing LocationBlog api", function () {

    /* Change timeout value and connect to test db.*/
    before(async function () {
        this.timeout(Number(settings.MOCHA_TEST_TIMEOUT)); // Change default value from 2 sec to 5 else testing does not work
        await connect(settings.TEST_DB_URI);
    })


    /* Setup the database in a known state 1 user 3 locations before EACH test */
    // beforeEach(async function () {
    //     //Delete db data for testing
    //     await User.deleteMany({}).exec();
    //     await LocationBlog.deleteMany({}).exec();

    //     //Add a user to be owner of Location Blogs
    //     user = await new User({ firstName: "Bruce", lastName: "Wayne", userName: "joker", password: "test", email: "bat@man.org" }).save();
    //     //Add some blogs
    //     locationBlogs = await Promise.all(
    //         [lbf.addLocationBlog("Cool Place", 26, 28, user._id),
    //         lbf.addLocationBlog("Another Cool Place", 56, 56, user._id),
    //         lbf.addLocationBlog("Yet Another Cool Place", 28, 56, user._id)
    //         ]).catch(err => console.log("ERROR : " + err));

    // });

    // beforeEach using nock
    var locationBlogsResp = [];
    var userResp = {};
    beforeEach(function () {
        userResp = { "_id": "5bd173795478b80ecc5f1152", "firstName": "Bruce", "lastName": "Wayne", "userName": "joker", "password": "test", "email": "bat@man.org" };
        locationBlogsResp = [
            { "pos": { "longitude": 26, "latitude": 28 }, "likedBy": [], "_id": "5bd1770cf0a68d4664a89744", "info": "Cool Place", "author": "5bd173785478b80ecc5f1142", "created": "2018-10-25T07:55:56.990Z", "__v": 0 },
            { "pos": { "longitude": 56, "latitude": 56 }, "likedBy": [], "_id": "5bd173785478b80ecc5f1144", "info": "Another Cool Place", "author": "5bd173795478b80ecc5f1152", "created": "2018-10-25T07:40:40.654Z", "__v": 0 },
            { "pos": { "longitude": 28, "latitude": 56 }, "likedBy": [], "_id": "5bd173785478b80ecc5f1145", "info": "Yet Another Cool Place", "author": "5bd173785478b80ecc5f1142", "created": "2018-10-25T07:40:40.655Z", "__v": 0 }
        ];
    })

    // http://localhost:3000/api/
    var url = settings.API_CALL_URL + 'locationBlog';

    it("Find all LocationBlogs for user Bruce Wayne (Cool Place, Another Cool Place, Yet Another Cool Place)", async function () {
        nock(url)
            .get('')
            .reply(200, locationBlogsResp)

        let blogs = await fetch(url, buildHTTP("GET")).then(handleHttpErrors);
        expect(blogs.length).to.be.equal(3);
    })

    it("Find (Another Cool Place) by positon with (longitude, latitude)", async function () {
        nock(url + '/56/56')
            .get('')
            .reply(200, locationBlogsResp[1])
        let blog = await fetch(url + '/56/56', buildHTTP('GET')).then(handleHttpErrors);
        expect(String(blog.author)).to.be.equal(String(userResp._id));
    });

    it("Update Cool Place to Place", async function () {
        let blogToUpdate = locationBlogsResp[0];
        blogToUpdate.info = 'Place';
        nock(url)
            .put('')
            .reply(200, blogToUpdate)
        let blog = await fetch(url, buildHTTP('PUT', blogToUpdate)).then(handleHttpErrors);
        expect(String(blog.info)).to.be.equal('Place');
    });

    it("Give Like to Blog", async function () {
        //ADD like for nock resp
        locationBlogsResp[0].likedBy.push(userResp._id)
        nock(url)
            .put('/like/5bd173795478b80ecc5f1152')
            .reply(200, locationBlogsResp[0])
        let blog = await fetch(`${url}/like/5bd173795478b80ecc5f1152`, buildHTTP('PUT', locationBlogsResp[0])).then(handleHttpErrors);
        expect(String(userResp._id)).to.be.equal(String(blog.likedBy[0]));
    })


    it("Delete a LocationBlog by id so only two are left", async function () {
        nock(url)
            .delete('/5bd173795478b80ecc5f1152')
            .reply(200, locationBlogsResp.shift())
            
        await fetch(`${url}/5bd173795478b80ecc5f1152`, buildHTTP('DELETE')).then(handleHttpErrors)
        expect(locationBlogsResp.length).to.be.equal(2);
    })


    after(async function () {
        mongoose.connection.close();
        //Turns of the nock module, so other test can work.
        nock.cleanAll();
        nock.enableNetConnect();
    })

})