import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import vue from 'rollup-plugin-vue'
import CleanCSS from 'clean-css';
import fs from 'fs';
import svg from 'rollup-plugin-vue-inline-svg';

const pkg = require('./package.json')

const input = 'src/index.js';

export default [
  {
    input,
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'VueCamera',
      sourcemap: process.env.NODE_ENV === 'dev'
    },
    plugins: [
      resolve(),
      svg(),
      vue({
        compileTemplate: true,
        css: false
      }),
      commonjs(),
      babel({
        exclude: ['node_modules/**'],
        runtimeHelpers: true,
      }),
      uglify()
    ]
  },
  {
    input,
    external: Object.keys(pkg.dependencies || {}),
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: process.env.NODE_ENV === 'dev'
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: process.env.NODE_ENV === 'dev'
      }
    ],
    plugins: [
      svg(),
      vue({
        compileTemplate: true,
        css(styles) {
          fs.writeFileSync(pkg.style, new CleanCSS().minify(styles).styles)
        }
      }),
      babel({
        runtimeHelpers: true,
        exclude: ['node_modules/**']
      }),
    ]
  }
]
