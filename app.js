const express = require("express");
const { getTopics } = require("./api/controllers/topics-controllers");
const {
  getArticleById,
  getAllArticles,
  patchArticle,
} = require("./api/controllers/articles-controllers");
const { getEndpoints } = require("./api/controllers/endpoints-controllers");
const { handleCustomErrors, handlePSQLErrors } = require("./api/errors");
const {
  postCommentByArticleId,
  getCommentsByArticleId,
  deleteCommentById,
} = require("./api/controllers/comments-controllers");
const { getAllUsers } = require("./api/controllers/users-controllers");

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

// ERROR HANDLERS
app.use(handleCustomErrors);
app.use(handlePSQLErrors);

module.exports = app;
