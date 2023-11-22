const db = require("../../db/connection");
const format = require("pg-format");

exports.insertCommentByArticleId = (article_id, { username, body }) => {
  const sqlStatement = format(
    `
  INSERT INTO comments
    (article_id, author, body)
  VALUES
    (%s, %L, %L)
  RETURNING *;`,
    article_id,
    username,
    body
  );

  return db.query(sqlStatement).then((body) => {
    if (!body.rows.length) {
      return Promise.reject({ status: 404, msg: "not found" });
    }
    return body.rows[0];
  });
};

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
