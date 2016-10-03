var utils = require('loader-utils'),
    assign = require('object-assign'),
    parse = require('./parser'),
    path = require('path'),
    selectorPath = require.resolve('./selector'),
    source = require('tosource');

var defaultLang = {
    style: 'css',
    script: 'js'
};

module.exports = function(content) {
    this.cacheable();

    var defaultLoaders = {
        css: 'css-loader',
        js: 'babel-loader?presets[]=es2015&plugins[]=transform-runtime&comments=false'
    };

    var context = this,
        query = utils.parseQuery(this.query),
        options = this.options.ractive || {},
        file = {
            path: this.resourcePath,
            name: path.basename(this.resourcePath)
        };

    var loaders = assign({}, defaultLoaders, options.loaders);

    var parts = parse(content);
    var output = ["var __component__ = {}, __sub__ = {}, __Ractive__ = require('ractive')"];

    // add require for script
    if(parts.script) {
        output.push("__component__ = " + (getRequire("script")));

        output.push("if(__component__.__esModule) __component__ = __component__.default");
    }

    // add require for template
    if(parts.template) {
        output.push("__component__.template = " + source(parts.template, null, ''));
    }

    // add require for style
    if(parts.css) {
        output.push("__component__.css = " + (getRequire("style")) + ".toString()");
    }

    // add components
    if(parts.imports.length) {
        output.push("__sub__ = {" +  (
            parts.imports.map(getImportKeyValuePair).join(",")) + '}');
        output.push("if(!__component__.components) __component__.components = {}");
        output.push("for(var __p__ in __sub__) __component__.components[__p__] = __sub__[__p__];");

        // output.push("__component__.components = {" +  (
        //     parts.imports.map(getImportKeyValuePair).join(",")) + '}');
    }

    if(!query.raw) {
        output.push('module.exports = __Ractive__.extend(__component__)');
        output.push('module.exports.__definition = __component__');
    } else {
        output.push('module.exports = __component__');
    }

    return output.join(';\n') + ';';


    function getRequire(type) {
        return "require(" +
            getRequireString(type) +
        ")";
    }

    function getRequireString(type) {
        return utils.stringifyRequest(context,
            // disable all configuration loaders
            '!!' +
            // get loader string for pre-processors
            getLoaderString(type) +
            // select the corresponding part from the ractive file
            getSelectorString(type) +
            // the url to the actual ractive file
            file.path
        );
    }

    function getLoaderString(type) {
        var lang = defaultLang[type];
        return loaders[lang] + '!';
    }

    function getSelectorString (type) {
        return selectorPath + '?type=' + type + '!';
    }

    function getImportKeyValuePair(imported) {
        return stringify(imported.name) + ": require('" + imported.href + "')";
    }

    function stringify(key) {
        if ( /^[a-zA-Z$_][a-zA-Z$_0-9]*$/.test(key) ) {
            return key;
        }

        return JSON.stringify(key);
    }
};