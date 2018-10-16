var mongoose = require("mongoose");
const expect = require("chai").expect;
const connect = require("../dbSetup");
var userFacade = require("../facades/userFacade");
var User = require('../model/User');

//https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};
mongoose.connection = {};


describe("Testing userFacade", function () {

  /* Connect to the TEST-DATABASE */
  before(async function () {
    this.timeout(require("../settings").MOCHA_TEST_TIMEOUT); // Change default value from 2 sec to 5 else testing does not work
    await connect(require("../settings").TEST_DB_URI);
  })


  /* Setup the database in a known state (2 users) before EACH test */
  beforeEach(async function () {
    await User.deleteMany({}).exec();
    
    //This has to be used instead of suggested Promise.all() function because it would not always be executed in order.
    await User.insertMany([
      new User({ firstName: "Bruce", lastName: "Wayne", userName: "joker", password: "test", email: "bat@man.org" }),
      new User({ firstName: "Joker", lastName: "NoName", userName: "batman", password: "test", email: "jo@ker.org" })
    ], {ordered:true})

  })

  it("Find all users (Bruce and Joker)", async function () {
    const users = await userFacade.getAllUsers();
    expect(users.length).to.be.equal(2);
  });

  it("Find Batman Wayne by username", async function () {
    const user = await userFacade.findByUsername("joker");
    expect(user.firstName).to.be.equal("Bruce");
  });

  it("Find `Joker NoName` by ID", async function () {
    let users = await userFacade.getAllUsers();
    let user = await userFacade.findById(users[1]._id);
    expect(user.firstName).to.be.equal("Joker");
  });

  it("Should add Peter Pan", async function () {
    const user = await userFacade.addUser("Peter", "Pan", "peter", "test", "a@b.dk");
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
    user = await userFacade.updateUser(user);
    expect(user.firstName).to.be.equal("Harry");
  });

  it("Should remove Bruce Wayne", async function () {
    let users = await userFacade.getAllUsers();
    await userFacade.deleteUser(users[0]._id);
    users = await userFacade.getAllUsers();
    expect(users.length).to.be.equal(1);
  })


  after(async function () {
    mongoose.connection.close();
  })

})