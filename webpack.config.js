const path = require('path');
const { GenerateSW } = require('workbox-webpack-plugin');
const LoadableWebpackPlugin = require('@loadable/webpack-plugin');
const LoadableBabelPlugin = require('@loadable/babel-plugin');
const babelPresetRazzle = require('./babel');

module.exports = {
  modify(config, { target, dev }, webpack) {
    let { plugins } = config;
    const filename = path.resolve(__dirname, 'build');
    if (
      process.env.AURA_ENV === 'production' &&
      process.env.RUNTIME !== 'LOCAL'
    ) {
      plugins.push(
        new GenerateSW({
          swDest: path.resolve(__dirname + '/build/public/service-worker.js'),
          runtimeCaching: [
            {
              urlPattern: /\.(?:png|jpg|jpeg|webp|svg|gif|mp4)$/,
              handler: `CacheFirst`,
            },
            {
              urlPattern: /\.(?:js)$/,
              handler: `CacheFirst`,
            },
            {
              urlPattern: /\.(?:css)$/,
              handler: `CacheFirst`,
            },
            {
              urlPattern: /\//,
              handler: 'NetworkFirst',
            },
          ],
        }),
      );
    }
    if (target === 'web') {
      plugins.push(
        new LoadableWebpackPlugin({
          outputAsset: false,
          writeToDisk: { filename },
        }),
      );
      config.output.filename = dev
        ? 'static/js/[name].js'
        : 'static/js/[name].[chunkhash:8].js';

      config.node = { fs: 'empty' }; // fix "Cannot find module 'fs'" problem.

      config.optimization = Object.assign({}, config.optimization, {
        runtimeChunk: true,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 30,
          maxAsyncRequests: 30,
          minChunks: 1,
          maxSize: 50000,
          cacheGroups: {
            commons: {
              test: /[\\/]node_modules[\\/]/,
              // cacheGroupKey here is `commons` as the key of the cacheGroup
              name(module, chunks, cacheGroupKey) {
                const moduleFileName = module
                  .identifier()
                  .split('/')
                  .reduceRight(item => item);
                const allChunksNames = chunks.map(item => item.name).join('~');
                return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
              },
              chunks: 'all',
            },
          },
        },
      });
    }
    return config;
  },
  modifyBabelOptions: () => ({
    babelrc: false,
    presets: [babelPresetRazzle],
    plugins: [LoadableBabelPlugin],
  }),
  plugins:
    process.env.NODE_ENV === 'production'
      ? [
          {
            name: 'compression',
            options: {
              brotli: true,
              gzip: true,
              compressionPlugin: {},
              brotliPlugin: {
                asset: '[path].br[query]',
                test: /\.(js|css|html|svg)$/,
              },
            },
          },
        ]
      : [],
};
