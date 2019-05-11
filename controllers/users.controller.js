const User        = require('../models/user.model');
const createError = require('http-errors');

module.exports.list = (req, res, next) => {
  User.findByIdAndUpdate()
    .then(users => {
      res.render('users/list', { users });
    })
    .catch(error => next(error));
}


