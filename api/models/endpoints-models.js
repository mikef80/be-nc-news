const endpoints = require('../../endpoints.json')

exports.selectAllEndpoints = () => {
  return new Promise((res) => {
    res(endpoints);
  })
}