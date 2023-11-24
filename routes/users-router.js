const { getAllUsers } = require("../api/controllers/users-controllers");

const usersRouter = require("express").Router();

usersRouter.get("/", getAllUsers);

module.exports = usersRouter;