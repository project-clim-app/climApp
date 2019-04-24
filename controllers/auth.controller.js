const mongoose         = require('mongoose');
const User             = require('../models/user.model');
const passport         = require('passport');
const GoogleStrategy   = require('passport-google-oauth2').Strategy;


module.exports.register = (req, res, next) => {
  res.render('auth/register');
}

module.exports.doRegister = (req, res, next) => {

  function renderWithErrors(errors) {
    res.render('auth/register', {
      user: req.body,
      errors: errors
    })
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        renderWithErrors({ email: 'Email already registered'})
      } else {
        user = new User(req.body);
        return user.save()
          .then(uuser => res.redirect('/login'))
      }
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        renderWithErrors(error.errors)
      } else {
        next(error);
      }
    });
}

module.exports.login = (req, res, next) => {
  res.render('auth/login');
}

module.exports.loginWithIDPCallback = (req, res, next) => {
  const { idp } = req.params;
  passport.authenticate(`${idp}-auth`, (error, user) => {
    if (error) {
      next(error);
    } else {
      req.login(user, (error) => {
        if(error) {
          next(error)
        } else {
          res.redirect('/users/list');
        }
      })
    }
  })(req, res, next);
}

module.exports.profile = (req, res, next) => {
  res.render('auth/profile')
}

module.exports.doProfile = (req, res, next) => {
  if(!req.body.password) {
    delete req.body.password;
  }

  if (req.file) {
    req.body.avatarURL = req.file.secure_url; // ----------------------revisar esto --------------------------
  }

  const user = req.user;
  Object.assign(user, req.body);
  user.save()
    .then(user => res.redirect('/profile'))
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render('auth/profile', {
          user: req.body,
          errors: error.errors
        })
      } else {
        next(error);
      }
    });
}

module.exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/login');
}