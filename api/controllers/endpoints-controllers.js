const { selectAllEndpoints } = require("../models/endpoints-models");

exports.getEndpoints = (req, res, next) => {
  selectAllEndpoints().then((endpoints) => {
    res.status(200).send({endpoints});
  });
};
