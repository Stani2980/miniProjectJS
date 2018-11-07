var mongoose = require("mongoose");
const expect = require("chai").expect;
const connect = require("../../dbSetup");
const settings = require("../../settings");
var userFacade = require('../../facades/userFacade');
var User = require('../../model/User');
var Position = require('../../model/Position');
var fetch = require('node-fetch');
const buildHTTP = require('./util').buildHTTP;
const handleHttpErrors = require('./util').handleHttpErrors;
const pf = require('../../facades/positionFacade');

mongoose.models = {};
mongoose.modelSchemas = {};
mongoose.connection = {};


describe("API : Testing userApi", function () {

    /* Connect to the TEST-DATABASE */
    this.timeout(Number(settings.MOCHA_TEST_TIMEOUT)); // Change default value from 2 sec to 5 else testing does not work
    before(async function () {
        await connect(settings.TEST_DB_URI);
    })

    users = []
    /* Setup the database in a known state (2 users) before EACH test */
    beforeEach(async function () {
        await User.deleteMany({}).exec();
        await Position.deleteMany({}).exec();
        //This has to be used instead of suggested Promise.all() function because it would not always be executed in order.
        // THIS METHOD DOES NOT TRIGGER .save() hooks in Schema
        users = await User.insertMany([
            new User({ firstName: "Bruce", lastName: "Wayne", userName: "joker", password: "test1", email: "bat@man.org" }),
            new User({ firstName: "Joker", lastName: "NoName", userName: "batman", password: "test2", email: "jo@ker.org" })
        ], { ordered: true })

    })

    // http://localhost:3000/api/
    var url = settings.API_CALL_URL + 'user';

    it("Find all users (Bruce and Joker)", async function () {
        const users = await fetch(url, buildHTTP("GET")).then(handleHttpErrors);
        expect(users.length).to.be.equal(2);
    });

    it("Find Batman Wayne by username", async function () {
        const user = await fetch(url + '/username/joker', buildHTTP("GET")).then(handleHttpErrors);
        expect(user.firstName).to.be.equal("Bruce");
    });

    it("Find `Joker NoName` by ID", async function () {
        let users = await userFacade.getAllUsers();
        let user = await fetch(url + '/' + users[1]._id, buildHTTP("GET")).then(handleHttpErrors);
        expect(user.firstName).to.be.equal("Joker");
    });

    it("Should add Peter Pan", async function () {
        let userToSend = { firstName: "Test", lastName: "Pan", userName: "test", password: "test", email: "a@b.dk" };
        const user = await fetch(url, buildHTTP("POST", userToSend)).then(handleHttpErrors);
        expect(user).to.not.be.null;
        expect(user.firstName).to.be.equal("Test");
        const users = await userFacade.getAllUsers();
        expect(users.length).to.be.equal(3);
    });

    it("Should change Bruce Wayne name to Harry Potter", async function () {
        const users = await userFacade.getAllUsers();
        let user = users[0];
        user.firstName = "Harry";
        user.lastName = "Potter";
        user = await fetch(url, buildHTTP("PUT", user)).then(handleHttpErrors);
        expect(user.firstName).to.be.equal("Harry");
    });

    it("Should remove Bruce Wayne", async function () {
        let users = await userFacade.getAllUsers();
        await fetch(url + '/' + users[0]._id, buildHTTP("DELETE")).then(handleHttpErrors);
        users = await userFacade.getAllUsers();
        expect(users.length).to.be.equal(1);
    })


    it("Should login and return friend joker who is close", async function () {
        //Add two positions for the existing users
        await pf.addNewPos(10, 12, users[0]._id)
        await pf.addNewPos(20, 20, users[1]._id)
        /// Need to add user here because InsertMany() does not trigger save() hooks in Schema
        await new User({ firstName: "Peter", lastName: "pan", userName: "peter", password: "test", email: "a@b.dk" }).save()
        //Body for login
        let userToSend = { username: "peter", password: "test", latitude: 11, longitude: 13, distance: 1000000 }
        const friends = await fetch(`${url}/login`, buildHTTP("POST", userToSend)).then(handleHttpErrors);
        console.log(friends)
        expect(friends).to.not.be.null;
        expect(friends[0].username).to.be.equal('joker')
    })

    after(async function () {
        mongoose.connection.close();
    })

})