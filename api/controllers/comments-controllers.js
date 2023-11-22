const { selectArticleById } = require("../models/articles-models");
const { selectCommentsByArticleId } = require("../models/comments-models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  
  const commentPromises = [
    selectCommentsByArticleId(article_id), // fine
    selectArticleById(article_id),
  ];

  Promise.all(commentPromises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};
