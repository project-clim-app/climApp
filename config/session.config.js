const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const SESSION_MAX_AGE_SECONDS = Number(process.env.SESSION_MAX_AGE_SECONDS) || 60 * 60 * 24 * 7; // VARIABLE EXISTENTE EN .ENV

module.exports = session({
  secret: process.env.SESSION_SECRET, // VARIABLE EXISTENTE EN .ENV
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: process.env.SESSION_SECURE, // VARIABLE EXISTENTE EN .ENV ---------------- REVISAR SI TRUE O FALSE --------------------
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS * 1000 // VARIABLE EXISTENTE EN .ENV
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection, //-------------------------- REVISAR SI ESTA INSTALADO EL MONGOSTORE y CONFIGURADO -----------------------
    ttl: SESSION_MAX_AGE_SECONDS
  })
});

