const db = require("../../db/connection");

exports.selectsAllUsers = () => {
  return db.query(`SELECT *  FROM users;`).then((result) => {
    if (!result.rows.length) {
      return Promise.reject({ status: 404, msg: "users not found" });
    }

    return result.rows;
  });
};
