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


hbs.registerHelper('switch', function(value, options) {
  this.switch_value = value;
  return options.fn(this);
});

hbs.registerHelper('case', function(value, options) {
  if (value == this.switch_value) {
    return options.fn(this);
  }
});

hbs.registerHelper('default', function(value, options) {
    return true; ///We can add condition if needs
});