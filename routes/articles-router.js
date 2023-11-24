const {
  getAllArticles,
  getArticleById,
  patchArticle,
} = require("../api/controllers/articles-controllers");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../api/controllers/comments-controllers");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getAllArticles);

articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
