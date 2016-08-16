var fs = require('fs'),
    path = require('path'),
    webpack = require('webpack'),
    jsdom = require('jsdom'),
    expect = require('chai').expect,
    rimraf = require('rimraf');

describe('ractive-loader', function() {
    var html = '<!DOCTYPE html><html><head></head><body></body></html>',
        output = path.resolve(__dirname, './output'),
        loader = 'expose?RactiveComponent!'+path.resolve(__dirname, '../'),
        globalConfig = {
            output: {
                path: output,
                filename: 'test.build.js'
            },
            module: {
                loaders: [
                    {
                        test: /\.html$/,
                        loader: loader
                    }
                ]
            }
        };

    beforeEach(function(done) {
        rimraf(output, done);
    });

    function getFile(file, cb) {
        fs.readFile(path.resolve(output, file), 'utf-8', function(err, data) {
            expect(err).to.be.not.exist;
            cb(data);
        });
    }

    function test(options, assert) {
        var config = Object.assign({}, globalConfig, options);

        webpack(config, function(err, stats) {
            if (stats.compilation.errors.length) {
                stats.compilation.errors.forEach(function(err) {
                    console.error(err.message);
                });
            }

            expect(stats.compilation.errors).to.be.empty;

            getFile('test.build.js', function (data) {
                jsdom.env({
                    html: html,
                    src: [data],
                    done: function(err, window) {
                        if(err) {
                            console.log(err[0].data.error.stack);
                            expect(err).to.be.null;
                        }
                        assert(window);
                    }
                });
            });
        });
    }

    it('basic', function(done) {
        test({
            entry: './test/fixtures/basic.html'
        }, function(window) {
            var instance = new window.RactiveComponent();
            var html = instance.toHTML();
            expect(html).to.equal('<h2 class="red">Hello from Component A!</h2> <img src="./nope.jpg"> <p>Part</p>');
            expect(instance.get('msg')).to.be.not.null;
            done();
        });
    });
});