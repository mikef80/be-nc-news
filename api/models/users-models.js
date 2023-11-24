const db = require("../../db/connection");

exports.selectsAllUsers = () => {
  return db.query(`SELECT *  FROM users;`).then((result) => {
    if (!result.rows.length) {
      return Promise.reject({ status: 404, msg: "users not found" });
    }

    return result.rows;
  });
};

exports.selectUserById = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: "user not found" });
      }
      return result.rows[0];
    });
};
