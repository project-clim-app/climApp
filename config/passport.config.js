const User             = require('../models/user.model');
const passport         = require('passport');
const LocalStrategy    = require('passport-local').Strategy;
const GoogleStrategy   = require('passport-google-oauth2').Strategy;
//const FacebookStrategy = require('passport-facebook').Strategy;
 
passport.serializeUser((user, next) => {
  next(null, user.id);
})

passport.deserializeUser((id, next) => {
  User.findById(id)
    .then(user => next(null, user))
    .catch(next)
})

passport.use('local-auth', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, next) => {
  User.findOne({ email: email})
    .then(user => {
      if (!user) {
        next(null, null, { password: 'Invalid email or password' })
      } else {
        return user.checkPassword(password)
          .then(match => {
            if (!match) {
              next(null, null, { password: 'Invalid email or password' })
            } else {
              next(null, user);
            }
          })
      }
    }) 
}));

passport.use('google-auth', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID, // ------------------------------ FALTA CONFIGURAR ---------------------------------
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,  // ------------------------------ FALTA CONFIGURAR ---------------------------------
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/authenticate/google/cb'  // ------------------------------ FALTA CONFIGURAR ---------------------------------
}, authenticateOAuthUser));


  // documentación de passport http://www.passportjs.org/packages/passport-google-oauth2/
    // var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

    // passport.use(new GoogleStrategy({
    //   clientID:     GOOGLE_CLIENT_ID,
    //   clientSecret: GOOGLE_CLIENT_SECRET,
    //   callbackURL: "http://yourdormain:3000/auth/google/callback",
    //   passReqToCallback   : true
    // },
    // function(request, accessToken, refreshToken, profile, done) {
    //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //     return done(err, user);
    //   });
    // }
    // ));

  // documentación de google API https://developers.google.com/identity/sign-in/web/sign-in

function authenticateOAuthUser(accessToken, refreshToken, profile, next) {
  const provider = `${profile.provider}Id`;
  const socialId = profile.id;
  const name = profile.displayName;
  const email = profile.emails ? profile.emails[0].value : undefined;
  const avatarURL = profile.picture || profile.photos && profile.photos[0].value;
  User.findOne({
    $or: [
      { email: email },
      { [`social.${provider}`]: socialId }
    ]
  })
    .then(user => {
      if (user) {
        next(null, user);
      } else if (!user) {
        user = new User({
          name: name,
          email: email,
          password: Math.random().toString(35), // Be carefully only for dev purposes, Math.random seed is predictable!!
          social: {
            [provider]: socialId
          },
          avatarURL: avatarURL
        })
        return user.save()
          .then(user => next(null, user))
      }
    })
    .catch(error => next(error))
}