exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "42703") {
    res.status(400).send({ msg: "bad request" });
  } else if (err.code === "23503") {
    
    const additionalDetail = err.constraint === 'comments_author_fkey' ? "user" : "article";

    res.status(404).send({ msg: `${additionalDetail} not found` });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
