import pkg from './package.json';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import graphql from '@rollup/plugin-graphql';

const config = {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  plugins: [
    nodeResolve({
      extensions: ['.ts', '.js'],
    }),
    typescript()
  ]
};

const server = {
  input: 'src/index.server.ts',
  output: [{
    file: pkg.server,
    format: 'cjs',
    sourcemap: true
  }],
  external: [
    '@apollo/client/utilities',
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  plugins: [
    nodeResolve({
      extensions: ['.ts', '.graphql', '.js'],
    }),
    graphql(),
    typescript()
  ]
};

export default [
  config,
  server
];
