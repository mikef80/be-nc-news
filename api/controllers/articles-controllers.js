const { selectArticleById } = require("../models/articles-models");

exports.getArticleById = (req, res, next) => {
  selectArticleById()
    .then((article) => {
      
      res.status(200).send({ article });
    });
};
