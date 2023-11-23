const express = require("express");
const { getTopics } = require("./controllers/topics-controllers");
const {
  getArticleById,
  getAllArticles,
  patchArticle,
} = require("./controllers/articles-controllers");
const { getEndpoints } = require("./controllers/endpoints-controllers");
const { handleCustomErrors, handlePSQLErrors } = require("./errors");
const {
  postCommentByArticleId,
  getCommentsByArticleId,
  deleteCommentById,
} = require("./controllers/comments-controllers");
const { getAllUsers } = require("./controllers/users-controllers");

const app = express();

app.use(express.json());

// GET
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get('/api/users',getAllUsers)
app.get("/api", getEndpoints);

// POST
app.post("/api/articles/:article_id/comments", postCommentByArticleId);

// PATCH
app.patch("/api/articles/:article_id", patchArticle);

// DELETE
app.delete("/api/comments/:comment_id", deleteCommentById);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);

module.exports = app;
