const express  = require('express')
const router = express.Router()
const { logoutUser } = require('../controllers/controller')

router.get('/', logoutUser)

module.exports = router