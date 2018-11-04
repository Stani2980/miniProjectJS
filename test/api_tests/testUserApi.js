var mongoose = require("mongoose");
const expect = require("chai").expect;
const connect = require("../../dbSetup");
const settings = require("../../settings");
var userFacade = require('../../facades/userFacade');
var User = require('../../model/User');
var fetch = require('node-fetch');
const buildHTTP = require('./util').buildHTTP
const handleHttpErrors = require('./util').handleHttpErrors

mongoose.models = {};
mongoose.modelSchemas = {};
mongoose.connection = {};


describe("API : Testing userApi", function () {

    /* Connect to the TEST-DATABASE */
    before(async function () {
        this.timeout(Number(settings.MOCHA_TEST_TIMEOUT)); // Change default value from 2 sec to 5 else testing does not work
        await connect(settings.TEST_DB_URI);
    })


    /* Setup the database in a known state (2 users) before EACH test */
    beforeEach(async function () {
        await User.deleteMany({}).exec();

        //This has to be used instead of suggested Promise.all() function because it would not always be executed in order.
        await User.insertMany([
            new User({ firstName: "Bruce", lastName: "Wayne", userName: "joker", password: "test", email: "bat@man.org" }),
            new User({ firstName: "Joker", lastName: "NoName", userName: "batman", password: "test", email: "jo@ker.org" })
        ], { ordered: true })

    })

    // http://localhost:3000/api/
    var url = settings.API_CALL_URL + 'user';
    
    it("Find all users (Bruce and Joker)", async function () {
        const users = await fetch(url, buildHTTP("GET")).then(handleHttpErrors);
        expect(users.length).to.be.equal(2);
    });

    it("Find Batman Wayne by username", async function () {
        const user = await fetch(url+'/username/joker', buildHTTP("GET")).then(handleHttpErrors);
        expect(user.firstName).to.be.equal("Bruce");
    });

    it("Find `Joker NoName` by ID", async function () {
        let users = await userFacade.getAllUsers();
        let user = await fetch(url+'/'+users[1]._id, buildHTTP("GET")).then(handleHttpErrors);
        expect(user.firstName).to.be.equal("Joker");
    });

    it("Should add Peter Pan", async function () {
        let userToSend = {firstName: "Peter", lastName: "Pan", userName: "peter", password: "test", email: "a@b.dk"};
        const user = await fetch(url,buildHTTP("POST", userToSend)).then(handleHttpErrors);
        expect(user).to.not.be.null;
        expect(user.firstName).to.be.equal("Peter");
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
        await fetch(url+'/'+users[0]._id, buildHTTP("DELETE")).then(handleHttpErrors);
        users = await userFacade.getAllUsers();
        expect(users.length).to.be.equal(1);
    })
    

    /// TEMPORARY TEST
    it("Should login and return user", async function () {
        let userToSend = {firstName: "Peter", lastName: "Pan", userName: "peter", password: "test", email: "a@b.dk"};
        const user = await fetch(url,buildHTTP("POST", userToSend)).then(handleHttpErrors);
        expect(user).to.not.be.null;
        expect(user.firstName).to.be.equal("Peter");
        const res = await userFacade.login('peter', 'test');
        expect(String(user._id)).to.be.equal(String(res._id));
    })

    


    after(async function () {
        mongoose.connection.close();
    })

})