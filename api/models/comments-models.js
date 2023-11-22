const db = require("../../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [article_id])
    .then((results) => {
      if (!results.rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return results.rows;
    });
};
