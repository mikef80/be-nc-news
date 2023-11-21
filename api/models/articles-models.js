const db = require("../../db/connection");

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((results) => {
      if (!results.rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return results.rows[0];
    });
};

exports.selectAllArticles = () => {
  return db
    .query(
      `SELECT a.article_id, a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url, CAST(COUNT(c.comment_id) AS INT) AS comment_count 
      FROM articles a
      LEFT JOIN comments c
      ON c.article_id = a.article_id
      GROUP BY a.article_id
      ORDER BY a.created_at DESC;`
    )
    .then((results) => {
      if (!results.rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }

      return results.rows;
    });
};
