const data = require('../data/aemet-locations.json')

module.exports.search = (req, res, next) => {
    res.json(data);
  }