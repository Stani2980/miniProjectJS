const bcrypt = require('bcrypt')
const uf = require('../userFacade')

async function hashPassword(plainPassword) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(plainPassword, salt)
    return hash;
}

async function checkLogin(user, plainPassword) {
    const match = await bcrypt.compare(plainPassword, user.password)
    return match;
}

module.exports = {
    hashPassword,
    checkLogin
}