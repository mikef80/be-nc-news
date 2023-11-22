const db = require("../../db/connection");

exports.insertCommentByArticleId = (article_id, { username, body }) => {
  return db.query(`
  INSERT INTO comments
    (article_id, author, body)
  VALUES
    ()`);
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
