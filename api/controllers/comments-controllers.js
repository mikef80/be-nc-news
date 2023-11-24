const { selectArticleById } = require("../models/articles-models");
const {
  insertCommentByArticleId,
  selectCommentsByArticleId,
  removeCommentById,
  updateCommentById,
} = require("../models/comments-models");

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;
  insertCommentByArticleId(article_id, comment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
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

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentById(comment_id, inc_votes)
    .then(comment => {
      res.status(200).send({comment})
    }).catch(next);
};
