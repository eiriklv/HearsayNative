var url = require('url');

module.exports = function(uri) {
  var result = url.parse(uri || '').hostname;
  return result.indexOf('www.') > -1 ?
    result.slice(4) :
    result;
};
