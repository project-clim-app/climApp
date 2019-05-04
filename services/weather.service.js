const axios = require('axios');
require('dotenv').config();
const API_KEY = process.env.AEMET_API_KEY;
const locationCodes = require('../data/aemet-locations.json');
var _ = require('lodash');

const http = axios.create({
  baseURL: 'https://opendata.aemet.es/opendata/api',
  headers: {
    Accept: 'application/json',
    api_key: API_KEY
  }
});

module.exports.getWeather = (location, asName = true) => {
  const code = (asName) ? locationCodes[location] : location;
  return http.get(`/prediccion/especifica/municipio/diaria/${code}`)
    .then(res => {
      if (res.data.estado === 404) {
        throw new Error('Location not found')
      } else {
        return axios.get(res.data.datos);
      }
    })
    .then(res => {
      console.log(res.data)
      const data = res.data[0] || { prediccion: { dia: [] }};
      return data.prediccion.dia.map((info) => {
        const cielo = info.estadoCielo.find(element => element.descripcion);
        return {
          date: info.fecha,
          rain: info.probPrecipitacion[0].value,
          temp: {
            max: info.temperatura.maxima,
            min: info.temperatura.minima
          },
          sky: cielo.descripcion
        }
      })
    })
}