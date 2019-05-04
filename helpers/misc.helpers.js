const hbs = require('hbs');
const locations = require('../data/aemet-locations.json');

hbs.registerHelper('isActive', (path, exp, exact, options) => {
  if (exact) {
    if (path === exp) {
      return options.fn(this);
    }
  } else {
    if (path.contains(exp)) {
      return options.fn(this);
    }
  }
  return options.inverse(this);
})

hbs.registerHelper('locationName', (code) => {
  return Object.keys(locations).find(name => locations[name] == code) 
})