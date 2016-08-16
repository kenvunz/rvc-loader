var utils = require('loader-utils'),
    parse = require('./parser');

module.exports = function(content) {
    this.cacheable();
    var query = utils.parseQuery(this.query),
        parts = parse(content),
        part = parts[query.type === 'style'? 'css' : query.type];

    this.callback(null, part);
};
