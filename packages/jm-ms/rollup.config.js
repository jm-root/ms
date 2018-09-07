const {join} = require('path')
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const cwd = __dirname

const baseConfig = {
  input: join(cwd, 'lib/index.js'),
  output: [
    {
      file: join(cwd, 'dist/index.js'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: join(cwd, 'dist/jm-ms.js'),
      format: 'umd',
      name: 'jm-ms',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [
    commonjs(),
    resolve({
      preferBuiltins: false,
      modulesOnly: true
    }),
    babel({
      babelrc: false,
      presets: [
        ['@babel/preset-env', {
          modules: false
        }]
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        'babel-plugin-transform-async-to-promises'
      ]
    })
  ]
}

const browserConfig = {
  input: join(cwd, 'lib/browser.js'),
  output: [
    {
      file: join(cwd, 'dist/browser.js'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: join(cwd, 'dist/jm-ms.browser.js'),
      format: 'umd',
      name: 'jm-ms',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [
    commonjs(),
    resolve({
      preferBuiltins: false,
      modulesOnly: true
    }),
    babel({
      babelrc: false,
      presets: [
        ['@babel/preset-env', {
          modules: false
        }]
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        'babel-plugin-transform-async-to-promises'
      ]
    })
  ]
}

const esmConfig = Object.assign({}, baseConfig, {
  output: Object.assign({}, baseConfig.output, {
    sourcemap: true,
    format: 'es',
    file: join(cwd, 'dist/index.esm.js')
  })
})

const esmBrowserConfig = Object.assign({}, baseConfig, {
  output: Object.assign({}, baseConfig.output, {
    sourcemap: true,
    format: 'es',
    file: join(cwd, 'dist/browser.esm.js')
  })
})

function rollup () {
  const target = process.env.TARGET

  if (target === 'umd') {
    return [baseConfig, browserConfig]
  } else if (target === 'esm') {
    return [esmConfig, esmBrowserConfig]
  } else {
    return [baseConfig, browserConfig, esmConfig, esmBrowserConfig]
  }
}

module.exports = rollup()
