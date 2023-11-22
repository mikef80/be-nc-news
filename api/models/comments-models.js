const db = require("../../db/connection");

exports.insertCommentByArticleId = (article_id, { username, body }) => {
  return db.query(`
  INSERT INTO comments
    (article_id, author, body)
  VALUES
    ()`);
};
