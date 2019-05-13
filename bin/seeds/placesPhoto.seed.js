const mongoose   = require('mongoose');
const placeModel = require('../../models/places.model');
const places     = require('../../data/aranjuez.json');

// console.log(places[0].name)

const placesOk = places.map(item => {
  const Activity = ['Hotel','Casa rural', 'Multiaventura', 'Padel', 'Rutas senderismo'];
  const randomActivity = Activity[Math.floor(Math.random() * Activity.length)];

  const Price = ['low cost','smart', 'luxe'];
  const randomPrice = Price[Math.floor(Math.random() * Price.length)];

  if(item) {
    return {
      name: item.name,
      location: item.address_components[2].short_name,
      googlePlaceLink: item.url,
      rating: item.rating,
      activity: item.type || randomActivity,
      photo: "http://localhost:3000/images/logo.png",
      levelPrice: randomPrice
    }
  }
})

require('../../app.js')

console.log(placesOk)

placeModel.create(placesOk)
  .then(places => console.info(`${places.lenght} new places db added`))
  .catch(error => console.error(error))
  .then(() => mongoose.connection.close())