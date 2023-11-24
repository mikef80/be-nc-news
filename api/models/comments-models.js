const db = require("../../db/connection");

exports.insertCommentByArticleId = (article_id, { username, body }) => {
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  return db
    .query(
      `INSERT INTO comments
          (article_id, author, body)
        VALUES
          ($1, $2, $3)
        RETURNING *;`,
      [article_id, username, body]
    )
    .then((body) => {
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

exports.removeCommentById = (comment_id) => {
  return db
    .query(
      `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;
  `,
      [comment_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      }
    });
};

exports.updateCommentById = (comment_id, inc_votes) => {
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`,
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows[0];
    });
};
