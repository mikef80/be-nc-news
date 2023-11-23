const db = require("../../db/connection");
const format = require("pg-format");

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      return rows[0];
    });
};

exports.selectAllArticles = (topic) => {
  let sql = `SELECT a.article_id, a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url, CAST(COUNT(c.comment_id) AS INT) AS comment_count 
  FROM articles a
  LEFT JOIN comments c
  ON c.article_id = a.article_id`;

  if (topic) {
    sql += format(` WHERE a.topic = %L`, topic);
  }

  sql += ` GROUP BY a.article_id
  ORDER BY a.created_at DESC;`;

  return db.query(sql).then((results) => {
    // console.log(results);
    if (!results.rows.length) {
      if (topic) {
        return [];
        /* return Promise.reject({ status: 404, msg: "topic not found" }); */
      } 

      return Promise.reject({ status: 404, msg: "articles not found" });
    }

    return results.rows;
  });
};

exports.updateArticle = (article_id, { inc_votes }) => {
  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
    `,
      [inc_votes, article_id]
    )
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }

      return result.rows[0];
    });
};
