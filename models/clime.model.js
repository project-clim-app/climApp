const mongoose = require('mongoose');

const climeSchema = new mongoose.Schema({
  locationCode: Number,
  locationName: String,
  prevision: [{
    day: Date,
    rain: Number,
    sky: String,
    maxTemp: Number,
    minTemp: Number
  }]
})

const Clime = mongoose.model('Clime', climeSchema);
module.exports = Clime;
