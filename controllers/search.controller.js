const data = require('../data/aemet-locations.json');
const weatherService = require('../services/weather.service');

module.exports.search = (req, res, next) => {
    res.json(data);
  }

  module.exports.oneSearch = (req, res, next) => {
    const location = req.user.location
    weatherService.getWeather(location, false)
      .then(weather => {
        res.render('misc/home', {weather, location})
      })
      .catch(next)
  }