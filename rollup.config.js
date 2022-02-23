const path = require('path');
const rollupTypescript = require('rollup-plugin-typescript2');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const { uglify } = require('rollup-plugin-uglify');

/**
 * @type import('rollup').RollupOptions
 */
const option = {
  input: path.resolve(__dirname, 'src', 'index.ts'),
  output: {
    file: path.resolve(__dirname, 'dist', 'index.js'),
    format: 'cjs',
  },
  external: [
    'fs',
    'child_process',
    'path',
    'readline',
    'events',
    'stream',
    'crypto',
    'http',
  ],
  plugins: [
    resolve(),
    commonjs(),
    rollupTypescript({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      useTsconfigDeclarationDir: true,
    }),
    uglify(),
  ],
};

module.exports = option;
