const express  = require('express')
const router = express.Router()
const { validateRegister } = require('../middleware/users')
const { addUser, activateAccount } = require('../controllers/controller')

router.post('/user', validateRegister, addUser)
router.get('/email-activate/:token', activateAccount)

module.exports = router