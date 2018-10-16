// const mongoose = require("mongoose");
// const expect = require("chai").expect;
// const assert = require("chai").assert;
// const connect = require("../dbSetup");
// var User = require('../model/User');
// var Position = require('../model/Position');
// const pf = require('../facades/positionFacade');

// mongoose.models = {};
// mongoose.modelSchemas = {};
// mongoose.connection = {};

// describe("Testing positionFacade", function () {

//     /* Connect to the TEST-DATABASE */
//     before(async function () {
//         this.timeout(require("../settings").MOCHA_TEST_TIMEOUT); // Change default value from 2 sec to 5 else testing does not work
//         await connect(require("../settings").TEST_DB_URI);
//     })

//     var user = {};
//     /* Setup the database in a known state (2 users) before EACH test */
//     beforeEach(async function () {
//         await User.deleteMany({}).exec();
//         await Position.deleteMany({}).exec();
//         //This has to be used instead of suggested Promise.all() function because it would not always be executed in order.
//         user = await new User({ firstName: "Bruce", lastName: "Wayne", userName: "joker", password: "test", email: "bat@man.org" }).save();
//     })

//     it("Should add new position with populated user obj", async function () {
//         let pos = await pf.addNewPos(21, 22, user._id);
//         await pf.getPositionById(pos._id);

//     })

//     after(async function () {
//         mongoose.connection.close();
//     })
// })
