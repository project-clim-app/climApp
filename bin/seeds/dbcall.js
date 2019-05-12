require('dotenv').config();
require('../../config/db.config')
const mongoose = require('mongoose');
const Clime = require('../../models/clime.model')
const service = require('../../services/weather.service')
const data = require('../../data/aemet-locations.json')

const codes = Object.values(data)

Clime.deleteMany()
  .then(() => {
    codes.forEach((code, i) => {
      setTimeout(() => {
        saveLoc(code)
      }, i * 4000)
    })
  })

function saveLoc(loc) {
  service.getWeather(loc, false)
    .then(response => {
      console.log(response)

        const clime = new Clime({
          locationCode: loc,
          locationName: response[0].name,
          prevision: response.map(el => {
            return {
              locationCode: loc,
              locationName: response[0].name,
              day: el.date,
              rain: raining(el.rain),
              sky: el.sky,
              maxTemp: el.temp.max,
              minTemp: el.temp.min
            }
            function raining(rain) {
              var rainOk = "";
              switch (rain) {
                case 0:
                case 5:
                case 10:
                case 15:
                  return rainOk = 0
                  break;
                case 20:
                case 25:
                case 30:
                case 35:
                case 40:
                case 45:
                case 50:
                  return rainOk = 1
                  break;
                case 55:
                case 60:
                case 65:
                case 70:
                case 75:
                case 80:
                  return rainOk = 2
                  break;
                case 85:
                case 90:
                case 95:
                case 100:
                  return rainOk = 3
                  break;
              }
              return rainOk;
            }
          })
        })

        clime.save()
          .then(() => console.log(clime.locationName + " saved"))
      })
    .catch(console.log)
}