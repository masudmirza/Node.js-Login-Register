require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyAccessToken = (req, res, next) => {
    const token = req.cookies['access_token'];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
        if (err) {
            console.log(err);
            res.redirect('/login');
        } else {
            console.log(decodedToken);
            next();
        }
    })
}

const verifyRefreshToken = (req, res, next) => {
    const token = req.cookies['refresh_token'];
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decodedToken) => {
        if (err) {
            console.log(err);
            res.redirect('/login');
        } else {
            console.log(decodedToken);
            next();
        }
    })
}


module.exports = { 
    verifyAccessToken,
    verifyRefreshToken
};
