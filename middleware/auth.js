require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const accessToken = req.cookies['access_token']
    const refreshToken = req.cookies['refresh_token']

    if (accessToken) {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.log(err);
                res.redirect('/login')
            } else {
                req.user = decoded.user
                next()
            }
        })
    } else {
        if (refreshToken) {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    console.log(err);
                    res.redirect('/login')
                } else {
                    req.user = decoded.user
                    next()
                }
            })
        } else {
            res.redirect('/login')
        }
    }
}