const { insertCommentByArticleId } = require("../models/comments-models");

exports.postCommentByArticleId = (req, res, next) => {
  const comment = req.body;
  insertCommentByArticleId(comment);
};
