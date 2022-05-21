const express  = require('express');
const router = express.Router();
const { loginUser, forgotPassword, resetPassword } = require('../controllers/controller')
const { validatePassword } = require('../middleware/users');

router.post('/user', loginUser);

router.get('/forgot-password', (req, res) => {
    res.render('forgot-password', {
        title: 'Forgot-password'
    });
});

router.post('/forgot-password/email', forgotPassword);

router.get('/reset-password/:token', (req, res) => {
    res.render('reset-password', {
        title: 'Reset-password'
    });
});

router.post('/reset-password/:token', validatePassword, resetPassword);

module.exports = router;