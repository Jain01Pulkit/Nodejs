                                                        //FILE SYSTEM
// const userDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// }

// const jwt = require('jsonwebtoken');

// const handleRefreshToken = (req, res) => {
//     const cookies = req.cookies;
//     if (!cookies?.jwt) return res.sendStatus(401);
//     console.log(cookies.jwt);
//     const refreshToken = cookies.jwt;

//     const foundUser = userDB.users.find(person => person.refreshToken === refreshToken);
//     if (!foundUser) return res.sendStatus(403); //Forbidden
//     //evaluate JWTs
//     jwt.verify(
//         refreshToken,
//         process.env.REFRESH_TOKEN_SECRET,
//         (err, decoded) => {
//             if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
//             const roles = Object.values(foundUser.roles);
//             const accessToken = jwt.sign(
//                 {
//                     "UserInfo": {
//                         "username": decoded.username,
//                         "roles": roles
//                     }
//                 },
//                 process.env.ACCESS_TOKEN_SECRET,
//                 {
//                     expiresIn: '30s'
//                 }
//             );
//             res.json({ accessToken })
//         }
//     );
//     //create JWTs

//     //from require('crypto').randomBytes(64).toString('hex')//

// }

// module.exports = { handleRefreshToken }

                                                            //MONGODB SYSTEM
                                
const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async(req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({refreshToken}).exec();
    if (!foundUser) return res.sendStatus(403); //Forbidden
    //evaluate JWTs
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '30s'
                }
            );
            res.json({ accessToken })
        }
    );
    //create JWTs

    //from require('crypto').randomBytes(64).toString('hex')//

}

module.exports = { handleRefreshToken }