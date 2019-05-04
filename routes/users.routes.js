const express = require('express');
const router = express.Router();
const secure = require('../middlewares/secure.mid');
const users = require('../controllers/users.controller');

router.get('/', secure.isAuthenticated, users.list);
//router.get('/:id/search', secure.isAuthenticated, users.search);

// router.post('/:id/delete', secure.isAuthenticated, secure.checkRole('admin'), users.delete);

// router.post('/userOptions', secure.isAuthenticated, user.myforecast);

module.exports = router;