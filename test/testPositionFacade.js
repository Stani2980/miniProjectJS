const mongoose = require("mongoose");
const expect = require("chai").expect;
const assert = require("chai").assert;
const connect = require("../dbSetup");
var User = require('../model/User');
var Position = require('../model/Position');
const pf = require('../facades/positionFacade');

mongoose.models = {};
mongoose.modelSchemas = {};
mongoose.connection = {};

describe("Testing positionFacade", function () {

    /* Connect to the TEST-DATABASE */
    before(async function () {
        this.timeout(require("../settings").MOCHA_TEST_TIMEOUT); // Change default value from 2 sec to 5 else testing does not work
        await connect(require("../settings").TEST_DB_URI);
    })

    var users = {};
    /* Setup the database in a known state before EACH test */
    beforeEach(async function () {
        await User.deleteMany({}).exec();
        await Position.deleteMany({}).exec();
        //This has to be used instead of suggested Promise.all() function because it would not always be executed in order.
        users = await User.insertMany([
            new User({ firstName: "Bruce", lastName: "Wayne", userName: "joker", password: "test", email: "bat@man.org" }),
            new User({ firstName: "Joker", lastName: "NoName", userName: "batman", password: "test", email: "jo@ker.org" })
        ], { ordered: true })
    })

    it("Should add new position with populated user obj", async function () {
        let pos = await pf.addNewPos(21, 22, users[0]._id);
        expect(pos.user).to.be.equal(users[0]._id)
    })

    it("Should get position by Position id", async function () {
        let newPos = await pf.addNewPos(20, 20, users[0]._id);
        let pos = await pf.getPositionById(newPos._id);
        expect(String(newPos._id)).to.be.equal(String(pos._id));
    })

    it("Should get position by User id", async function () {
        let newPos = await pf.addNewPos(20, 20, users[0]._id);
        let pos = await pf.getPositionByUserId(users[0]._id);
        expect(String(newPos.user)).to.be.equal(String(pos.user));
    })

    after(async function () {
        mongoose.connection.close();
    })
})
