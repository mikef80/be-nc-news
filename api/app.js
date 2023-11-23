const express = require("express");
const { getTopics } = require("./controllers/topics-controllers");
const {
  getArticleById,
  getAllArticles,
  patchArticle,
} = require("./controllers/articles-controllers");
const { getEndpoints } = require("./controllers/endpoints-controllers");
const { handleCustomErrors, handlePSQLErrors } = require("./errors");
const { getCommentsByArticleId } = require("./controllers/comments-controllers");

const app = express();

app.use(express.json())

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api", getEndpoints);

app.patch('/api/articles/:article_id',patchArticle)

app.use(handleCustomErrors);
app.use(handlePSQLErrors);

module.exports = app;
