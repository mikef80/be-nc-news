const db = require('../../db/connection')

exports.insertCommentByArticleId = ({ username, body }) => {
  return {
    body,
    votes: 0,
    author: username,
    article_id: 9,
    created_at: 1586179020000,
  }
};
