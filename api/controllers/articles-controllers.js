const { selectArticleById } = require("../models/articles-models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      console.log({article});
      res.status(200).send({ article });
    })
    .catch(next);
};
