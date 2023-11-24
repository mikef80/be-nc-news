const {
  selectAllArticles,
  updateArticle,
} = require("../models/articles-models");
const { selectArticleById } = require("../models/articles-models");
const { checkTopicExists } = require("../models/topics-models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { topic, sort_by } = req.query;

  const articlesPromises = [selectAllArticles(topic, sort_by)];

  if (topic) {
    articlesPromises.push(checkTopicExists(topic));
  }

  Promise.all(articlesPromises)
    .then((resolvedPromises) => {
      const returnedArticles = resolvedPromises[0];
      const returnedTopics = resolvedPromises[1];

      if (returnedArticles.length) {
        res.status(200).send({ articles: returnedArticles });
      } else if (returnedTopics.length) {
        res.status(200).send({ articles: [] });
      } else {
        res.status(404).send({ msg: "topic not found" });
      }
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;
  updateArticle(article_id, body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
