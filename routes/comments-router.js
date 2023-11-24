const {
  deleteCommentById,
  patchCommentById,
} = require("../api/controllers/comments-controllers");

const commentsRouter = require("express").Router();

commentsRouter.delete("/:comment_id", deleteCommentById);

commentsRouter.patch("/:comment_id", patchCommentById);

module.exports = commentsRouter;
