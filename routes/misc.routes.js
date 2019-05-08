const express = require('express');
const router = express.Router();
const misc = require('../controllers/misc.controller');
const search = require('../controllers/search.controller');
const secure = require('../middlewares/secure.mid');


router.get('/', secure.isAuthenticated, misc.home);
router.get('/', misc.home);
router.post('/userSearch', secure.isAuthenticated, search.CompleteSearch)

module.exports = router;