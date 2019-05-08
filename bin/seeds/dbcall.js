require('dotenv').config();
require('../../config/db.config')
const mongoose = require('mongoose');
const Clime    = require('../../models/clime.model')
const service  = require('../../services/weather.service')
const data     = require('../../data/aemet-locations.json')

const codes = Object.values(data)

Clime.deleteMany()
  .then(() => {
    codes.forEach((code, i) => {
      setTimeout(() => {
        saveLoc(code)
      }, i * 10000)
    })
  })

function saveLoc(loc) {
  service.getWeather(loc, false)
    .then(response => {    
      const clime = new Clime({
        locationCode: loc,
        locationName: response[0].name,
        prevision: response.map(el => {
          return {
            day: el.date,
            rain: el.rain,
            sky: el.sky,
            maxTemp: el.temp.max,
            minTemp: el.temp.min
          }
        })
      })

      clime.save()
        .then(() => console.log(clime.locationName + " saved"))
    })
    .catch(console.log)
}