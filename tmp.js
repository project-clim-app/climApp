const weatherService = require('./services/weather.service');

weatherService.getWeather('Acebeda')
  .then(weather => {
    console.log(weather)
    res.render('/views/partials/user/myforecast', {weather})
  })
  .catch(console.log)