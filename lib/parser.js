var rcu = require('rcu'),
    Ractive = require('ractive');

Ractive.DEBUG = false;
rcu.init(Ractive);

module.exports = function(content) {
    return rcu.parse(content);
};