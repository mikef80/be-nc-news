const {
  deleteCommentById,
} = require("../api/controllers/comments-controllers");

const commentsRouter = require("express").Router();

commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;
