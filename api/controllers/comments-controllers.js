const { insertCommentByArticleId } = require("../models/comments-models");

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;
  insertCommentByArticleId(article_id, comment);
};
