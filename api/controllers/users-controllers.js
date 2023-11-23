const { selectsAllUsers } = require("../models/users-models");

exports.getAllUsers = (req, res, next) => {
  selectsAllUsers().then((users) => {
    res.status(200).send({ users });
  });
};
