const { selectsAllUsers, selectUserById } = require("../models/users-models");

exports.getAllUsers = (req, res, next) => {
  selectsAllUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getUserById = (req, res, next) => {
  const { username } = req.params;
  selectUserById(username).then((user) => {
    res.status(200).send({ user });
  }).catch(next);
};
