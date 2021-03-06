require("./dbSetup")();

var User = require("./model/User.js");
var LocationBlog = require("./model/LocationBlog.js");
var Position = require("./model/Position.js");

//Utility Function to create users
function userCreate(firstName, lastName, userName, password, email, type, company, companyUrl) {
    let job = [{ type, company, companyUrl }, { type, company, companyUrl }];

    const user = new User({ userName, password, firstName, lastName, email, job })

    return user.save();
}

//Utility Function to create Positions
function positionCreator(lon, lat, userId, dateInFuture) {
    const posDetail = { user: userId, loc: { coordinates: [lon, lat] } };

    if (dateInFuture) {
        posDetail.created = '2022-09-25T20:40:21.899Z';
    }
    const pos = new Position(posDetail);

    return pos.save();
}

///Utility Function to create LocationBlogs
function locationBlogCreator(info, author, longitude, latitude) {
    var LocationBlogDetail = { info, pos: { longitude, latitude }, author };
    var blog = new LocationBlog(LocationBlogDetail);
    return blog.save();
}

// Here we will setup users
async function createUsers() {
    await User.deleteMany({});
    await Position.deleteMany({});
    await LocationBlog.deleteMany({});

    var users = await Promise.all([
        userCreate('Batman', 'Wayne', 'Batmobile', 'Joker123', 'bat@man.com', 'superhero', 'freelance', 'batman.com'),
        userCreate('Robin', 'Wayne', 'RobinBike', 'red123', 'ro@bin.com', 'superhero', 'freelance', 'robin.com'),
        userCreate('Catwoman', 'noName', 'Whip', 'Batman', 'cat@woman.com', 'antihero', 'freelance', 'catwoman.com'),
        userCreate('Joker', '?', 'IloveBat', 'safePwd', 'Joke@r.com', 'villian', 'freelance', 'joker.com'),
        userCreate('tester', 'testsson', 'test', 'test', 'test@tst.com', '...', '...', 'url.com'),
    ]).catch(err => console.log(err));

    // console.log("expect 4 : " + users.length)
    // console.log("batman : " + users[0]._id)

    var pos = await Promise.all([
        positionCreator(12.5246000, 55.9569280, users[0]._id, true),
        positionCreator(12.5236057, 55.9568280, users[1]._id, true),
        positionCreator(12.5246002, 55.9579000, users[2]._id, true),
        positionCreator(12.5251001, 55.9549000, users[3]._id, true)
    ]).catch(err => console.log(err));

    var blogs = await Promise.all([
        locationBlogCreator("Cool Place", users[0]._id, 26, 28),
        locationBlogCreator("Another Cool Place", users[0]._id, 56, 56),
        locationBlogCreator("Yet Another Cool Place", users[0]._id, 28, 56),
        locationBlogCreator("The coolest Place", users[3]._id, 34, 56),
    ]).catch(err => console.log("Error blogs : ", err))

    //Check the virtuals
    console.log("Slug for a Cool Place", blogs[0].slug);

    //Add a few likes for "a Cool Place"
    blogs[0].likedBy.push(users[1]._id); //Like by Robin
    blogs[0].likedBy.push(users[2]._id); //Like by Catwoman
    blogs[1].likedBy.push(users[2]._id); //Like by Catwoman
    blogs[2].likedBy.push(users[4]._id); //Like by test
    console.log("Likes for a Cool Place", blogs[0].likedByCount);
}

createUsers();
