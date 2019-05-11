const express = require('express');
const router = express.Router();
const secure = require('../middlewares/secure.mid');
const users = require('../controllers/users.controller');
const search = require('../controllers/search.controller');

router.get('/', secure.isAuthenticated, search.oneSearch);
// router.get('/result', secure.isAuthenticated, result);

module.exports = router;