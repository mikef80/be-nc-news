const { selectArticleById } = require("../models/articles-models");
const {
  insertCommentByArticleId,
  selectCommentsByArticleId,
} = require("../models/comments-models");

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;
  insertCommentByArticleId(article_id, comment).then((comment) => {
    res.status(201).send({ comment });
  }).catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  const commentPromises = [
    selectCommentsByArticleId(article_id),
    selectArticleById(article_id),
  ];

  Promise.all(commentPromises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};
