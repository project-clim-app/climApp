const express = require('express');
const router = express.Router();
const secure = require('../middlewares/secure.mid');
const users = require('../controllers/users.controller');
const search = require('../controllers/search.controller');

// router.get('/', secure.isAuthenticated, users.list);
//router.get('/:id/search', secure.isAuthenticated, users.search);

router.get('/', secure.isAuthenticated, search.oneSearch);


// router.post('/:id/delete', secure.isAuthenticated, secure.checkRole('admin'), users.delete);

module.exports = router;