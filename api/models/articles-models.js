const db = require("../../db/connection");
const format = require("pg-format");

exports.selectArticleById = (article_id) => {
  let sql = `SELECT a.article_id,a.body, a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url, CAST(COUNT(c.comment_id) AS INT) AS comment_count 
  FROM articles a
  LEFT JOIN comments c
  ON c.article_id = a.article_id
  WHERE a.article_id = $1
  GROUP BY a.article_id
  ORDER BY a.created_at DESC;`;

  return db.query(sql, [article_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "article not found" });
    }
    return rows[0];
  });
};

exports.selectAllArticles = (topic, sort_by = "created_at", order = "desc") => {
  // deal with someone adding ?sort_by= and adding no value
  if (!sort_by.length) {
    sort_by = "created_at";
  }

  // define acceptable input values
  const acceptedSortByValues = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
  ];
  const acceptedOrderValues = ["desc", "asc"];

  // return error if unacceptable sort_by or order values passed
  if (
    (sort_by &&
      sort_by.length > 0 &&
      !acceptedSortByValues.includes(sort_by)) ||
    (order && order.length > 0 && !acceptedOrderValues.includes(order))
  ) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  // sql statement construction
  let sql = `SELECT a.article_id, a.title, a.topic,a.body, a.author, a.created_at, a.votes, a.article_img_url, CAST(COUNT(c.comment_id) AS INT) AS comment_count 
  FROM articles a
  LEFT JOIN comments c
  ON c.article_id = a.article_id`;

  if (topic) {
    sql += format(` WHERE a.topic = %L`, topic);
  }

  sql += format(` GROUP BY a.article_id ORDER BY %I `, sort_by) + order;

  // end of sql statement construction

  return db.query(sql).then((results) => {
    if (!results.rows.length) {
      if (topic) {
        return [];
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
