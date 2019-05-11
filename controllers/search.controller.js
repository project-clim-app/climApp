const data = require('../data/aemet-locations.json');
const weatherService = require('../services/weather.service');
const passport = require('passport');
const User = require('../models/user.model');
const Places = require('../models/places.model');
// const mongoose       = require('mongoose');
const Clime = require('../models/clime.model')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports.search = (req, res, next) => {
  res.json(data);
}

//   var p1 = Promise.resolve(3);
// var p2 = 1337;
// var p3 = new Promise((resolve, reject) => {
//   setTimeout(resolve, 100, "foo");
// }); 

// Promise.all([p1, p2, p3]).then(values => { 
//   console.log(values); // [3, 1337, "foo"] 
// });

module.exports.oneSearch = (req, res, next) => {
  const location = req.user.location
  weatherService.getWeather(location, false)
    .then(weather => {
      res.render('search', { weather, location })
    })
    .catch(next)
}

module.exports.CompleteSearch = (req, res, next) => {
  const { request, day, rainSearch: rain } = req.body;

  console.log(req.body)

  //const mongoQuery = {$and: [{'prevision':{$elemMatch : { rain }}}, {'prevision':{$elemMatch : {day:{'$gte':new Date(2019,05,10, 0,0,0).toISOString()}}}}]};

  const mongoQuery = {
    "prevision.day": day,
    "prevision.rain": rain
  }

  Clime.find( mongoQuery )
  .then(result => {
    const locations = result.map(x=> x.locationName)

    result.forEach(clime => {
      clime.prevision = clime.prevision.filter(p =>{
        return Number(rain) === p.rain && new Date(day).toDateString() === p.day.toDateString()
      })
    })

    const previsions = result.map(r => r.prevision).reduce((acc, el) =>{
      return [ ...acc, ...el]
    }, [])


    Places.find({ location: { "$in": locations }})
      .then(places => {

        const result = places.map(p => {
          return {
            ...p.toJSON(),
            prevision: previsions.filter(pre => pre.locationName === p.location)
          }
        })

        res.json(result)
      })

  })
  .catch(err => {res.json(err)})
}
