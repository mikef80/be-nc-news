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
  const { topic } = req.query;

  const articlesPromises = [selectAllArticles(topic)];

  if (topic) {
    articlesPromises.push(checkTopicExists(topic));
  }

  Promise.all(articlesPromises).then((resolvedPromises) => {
    // console.log(resolvedPromises);
    const returnedArticles = resolvedPromises[0];
    const returnedTopics = resolvedPromises[1];

    // topics that exist and have articles have a length in both returned arrays
    // topics that exist but have no associated articles only have a length in the topics array
    // topics that don't exist don't have a length in either array

    // check for topic && length in both
    // check for topic && length in one
    // check for length in other

    
  });

  /* selectAllArticles(topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next); */
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
