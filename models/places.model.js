const mongoose = require('mongoose');

const placesSchema = new mongoose.Schema({
  name: { // "name"
    type: String,
    required: false,
  },
  location: { // location code os aemet.json
    type: String,
    required: false,
  },
  googlePlaceLink: { // "url"
    type: String,
    required: false,
  },
  rating: { // "user_ratings_total"
    type: Number,
    required: false,
  },
  activity: { // "types"
    type: String,
    required: false,
  },
  photo: { // "photos"
    type: String,
     required: false,
     default: '../public/images/logo.png'
  },
  levelPrice: { // algunos no tienen...
    type: String,
    required: false
  }
})

const Place = mongoose.model('Place', placesSchema);
module.exports = Place;
