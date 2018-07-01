# vue-camera

[![npm](https://img.shields.io/npm/v/vue-camera.svg)](https://www.npmjs.com/package/vue-camera) [![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

> Camera component for Vue.js apps

## Installation

```bash
yarn add vue-camera
```

## Usage

### Bundler (Webpack, Rollup)

```js
import Vue from 'vue'
import VueCamera from 'vue-camera'

// You need a specific loader for CSS files like https://github.com/webpack/css-loader
import 'vue-camera/dist/vue-camera.css'

export default {
  components: {
    VueCamera
  }
}
```

### Browser

```html
<!-- Include after Vue -->
<!-- Local files -->
<link rel="stylesheet" href="vue-camera/dist/vue-camera.css"></link>
<script src="vue-camera/dist/vue-camera.js"></script>

<!-- From CDN -->
<link rel="stylesheet" href="https://unpkg.com/vue-camera/dist/vue-camera.css"></link>
<script src="https://unpkg.com/vue-camera"></script>
```

## Development

### Launch visual tests

```bash
yarn watch
```

### Build

Bundle the js and css of to the `dist` folder:

```bash
yarn build
```


## Publishing

The `prepare` hook will ensure dist files are created before publishing. This
way you don't need to commit them in your repository.

```bash
# Bump the version first
# It'll also commit it and create a tag
npm version
# Push the bumped package and tags
git push --follow-tags
# Ship it 🚀
npm publish
```

## License

[MIT](http://opensource.org/licenses/MIT)
