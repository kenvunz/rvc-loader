# rvc-loader

> Ractive.js component loader for [Webpack](http://webpack.github.io)

## Features
- ES2015 (aka ES6) enabled by default via `<script>` tags. All scripts inside Ractive components
are compiled with [Babel](https://babeljs.io/) using `babel-loader`

- Allow custom loaders for `<script>` and `<style>` blocks

## Usage

[Documentation: using loaders](http://webpack.github.io/docs/using-loaders.html)

## Quick start guide

Install this into your project:

    $ npm install --save rvc-loader

Make all your `.html` files compile down to [Ractive] components by
modifying your `webpack.config.js` file:

```js
/* webpack.config.js */
module.exports = {
    module: {
        loaders: [
            { test: /\.html$/, loader: 'rvc' }
        ]
    },
  ...
};
```

Then use your Ractive components via `require()`:

```
<!-- mycomponent.html -->
<import rel="ractive" href="./subcomponent.html">

<div>Hello {{subject}}!</div>
<subcomponent></subcomponent>

<script>
export default {
  data: { subject: 'World' }
};
</script>

<!-- subcomponent.html -->
Subcomponent are required correctly
```

```js
var Component = require('./mycomponent.html');
new Component({ el: document.body });
```

## Alternate usage

You can also use it without modifying your config. Just explicitly call it on
your `require()` call via a prefix:

```js
var Component = require('rvc!./mycomponent.html');
```

## Webpack Options Reference

#### loaders

- type: `Object`

An object specifying Webpack loaders to use for language blocks inside *.html files.

For example, using `scss-loader` to process the `style` block
```js
/* webpack.config.js */
module.exports = {
    ractive: {
        loaders: {
            css: "css!scss"
        }
    }
  ...
};
```

## License

[MIT](http://opensource.org/licenses/MIT)