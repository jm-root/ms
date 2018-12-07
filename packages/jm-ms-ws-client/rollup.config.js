const { join } = require('path')
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
      file: join(cwd, 'dist/jm-ms-ws-client.js'),
      format: 'umd',
      name: 'jm-ms-ws-client',
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
  input: join(cwd, 'lib/browser/index.js'),
  output: [
    {
      file: join(cwd, 'dist/browser.js'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: join(cwd, 'dist/jm-ms-ws-client.browser.js'),
      format: 'umd',
      name: 'jm-ms-ws-client',
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

const mdlConfig = {
  input: join(cwd, 'lib/mdl/index.js'),
  output: [
    {
      file: join(cwd, 'dist/module.js'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: join(cwd, 'dist/module.browser.js'),
      format: 'umd',
      name: 'module',
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

const esmMdlConfig = Object.assign({}, baseConfig, {
  output: Object.assign({}, baseConfig.output, {
    sourcemap: true,
    format: 'es',
    file: join(cwd, 'dist/module.esm.js')
  })
})

function rollup () {
  const target = process.env.TARGET

  if (target === 'umd') {
    return [baseConfig, browserConfig, mdlConfig]
  } else if (target === 'esm') {
    return [esmConfig, esmBrowserConfig, esmMdlConfig]
  } else {
    return [baseConfig, browserConfig, esmConfig, esmBrowserConfig, mdlConfig, esmMdlConfig]
  }
}

module.exports = rollup()
