
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const SALT_WORK_FACTOR = process.env.SALT_WORK_FACTOR
const FIRST_ADMIN_EMAIL = process.env.FIRST_ADMIN_EMAIL 
  
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name needs at last 8 chars'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [EMAIL_PATTERN, 'Invalid email pattern']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password needs at last 8 chars']
  },
  userPreferences: {
    type: String,
    enum: ['low cost', 'smart', 'luxe']
  },
  location: {
    type: String,
    // enum: ['../data/aemet-locations.json'],
    //default: 'guess'
  },
  social: {
    googleId: {
      type: String,
      unique: true
    }
  },
  avatarURL: String
}, { timestamps: true })

userSchema.pre('save', function(next) {
  const user = this;

  if (user.email === FIRST_ADMIN_EMAIL) {
    user.role = 'admin';
  }

  if (user.isModified('password')) {
    bcrypt.genSalt(SALT_WORK_FACTOR) // -------------------- FALTA DECLARAR ESTA VARIABLE ---------------------------------------
      .then(salt => {
        return bcrypt.hash(user.password, salt)
          .then(hash => {
            user.password = hash;
            next();
          });
      })
      .catch(error => next(error));
  } else {
    next();
  }
});

userSchema.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);
module.exports = User;