const express  = require('express');
const router   = express.Router();
const auth     = require('../controllers/auth.controller');
const secure   = require('../middlewares/secure.mid');
const passport = require('passport');
const storage  = require('../config/storage.config');

router.get('/register', auth.register);
router.post('/register', auth.doRegister);
router.get('/login', auth.login);
router.get('/logout', auth.logout);

router.get('/profile', secure.isAuthenticated, auth.profile);
router.post('/profile', storage.single('avatar'), auth.doProfile);
router.post('/profile', secure.isAuthenticated, storage.single('avatar'), auth.doProfile);

// router.post('/profile', secure.isAuthenticated, auth.update)


router.get('/authenticate/google', passport.authenticate('google-auth', { scope: ['openid', 'profile', 'email'] }))
// router.get('/authenticate/facebook', passport.authenticate('facebook-auth', { scope: ['email']}))
router.get('/authenticate/:idp/cb', auth.loginWithIDPCallback)

module.exports = router;