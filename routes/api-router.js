const { getEndpoints } = require("../api/controllers/endpoints-controllers");
const { handleCustomErrors, handlePSQLErrors,handleServerErrors } = require("../api/errors");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");

const apiRouter = require("express").Router();

apiRouter.get("/", getEndpoints);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

apiRouter.use(handleCustomErrors);
apiRouter.use(handlePSQLErrors);
apiRouter.use(handleServerErrors);

module.exports = apiRouter;
