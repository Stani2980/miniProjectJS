var userApi = require('express').Router();
const uf = require('../../facades/userFacade');
const { Expo } = require('expo-server-sdk');


//GET all users
userApi.get('/', async function (req, res, next) {
    res.json(await uf.getAllUsers());
})

//GET user by id
userApi.get('/:id', async function (req, res, next) {
    res.json(await uf.findById(req.params.id).catch(next));
})

//GET user by username
userApi.get('/username/:username', async function (req, res, next) {
    res.json(await uf.findByUsername(req.params.username).catch(next));
})

//DELETE user by id (returns the removed object)
userApi.delete('/:id', async function (req, res, next) {
    res.json(await uf.deleteUser(req.params.id).catch(next));
})

// ********* (NOT THE SAFEST FUNCTIONS IN THE WORLD NEEDS SANITIZING)
//UPDATE user  
userApi.put('/', async function (req, res, next) {
    res.json(await uf.updateUser(req.body).catch(next));
})

//POST add user  
userApi.post('/', async function (req, res, next) {
    const user = req.body;
    res.json(await uf.addUser(user.firstName, user.lastName, user.userName, user.password, user.email).catch(next));
})

userApi.post('/login', async function (req, res, next) {
    const { username, password, latitude, longitude, distance } = req.body;
    // distance to km instead of meters
    const friends = await uf.login(username, password, longitude, latitude, (distance * 1000)).catch(next);

    // notify other users
    const newUser = req.body;
    handleNotifications(newUser);

    if (friends) {
        res.json(friends);
    }
})
//***************** */
var users = [];
function handleNotifications(newUser) {
    console.log("User logged in: ", newUser.username);
    const index = users.findIndex(u => u.username === newUser.username);
    if (index >= 0) {  //Remove user if he already exists
        users.splice(index, 1);
    }
    if (users.length > 0) {
        notifyUsers(users, newUser);
    }
    users.push(newUser);
}

async function notifyUsers(users, newUser) {
    let expo = new Expo();
    // Create the messages that you want to send to clients
    let messages = [];
    for (let user of users) {
        if (!Expo.isExpoPushToken(user.pushToken)) {
            console.error(`Push token ${user.pushToken} is not a valid Expo push token`);
            continue;
        }
        messages.push({
            to: user.pushToken,
            sound: 'default',
            body: 'new User logged in',
            data: newUser,
        })
    }
    console.log("messages to send", messages.length)
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];

    for (let chunk of chunks) {
        try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log("Ticket: ", ticketChunk)
            tickets.push(...ticketChunk);
        } catch (error) {
            console.error(error);
        }
    };
}
module.exports = userApi;