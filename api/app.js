const express = require("express");
const { getTopics } = require("./controllers/topics-controllers");
const { getArticleById } = require("./controllers/articles-controllers");
const { getEndpoints } = require("./controllers/endpoints-controllers");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);
app.get('/api', getEndpoints)


module.exports = app;
