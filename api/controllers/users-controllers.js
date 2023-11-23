const { selectsAllUsers } = require("../models/users-models");

exports.getAllUsers = () => {
  console.log("users controller");
  selectsAllUsers();
};
