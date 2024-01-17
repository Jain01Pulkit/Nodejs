const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
    // on client , also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);  // No content to send back
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = userDB.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }
    // Delete refresh token in database
    const otherUsers = userDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = { ...foundUser, refreshToken: '' };
    userDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(userDB.users)
    );
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });   // secure: true - only serves on https
    res.sendStatus(204);
    //create JWTs

    //from require('crypto').randomBytes(64).toString('hex')//

}

module.exports = { handleLogout }