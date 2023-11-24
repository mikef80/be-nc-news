const {
  getAllUsers,
  getUserById,
} = require("../api/controllers/users-controllers");

const usersRouter = require("express").Router();

// usersRouter.get("/", getAllUsers);

usersRouter.route("/").get(getAllUsers);

usersRouter.route("/:username").get(getUserById);

module.exports = usersRouter;
