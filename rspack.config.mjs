import { defineConfig } from '@rspack/cli';
import { VueLoaderPlugin } from 'rspack-vue-loader';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const HtmlRspackPluginModule = require('@rspack/plugin-html');
const HtmlRspackPlugin = HtmlRspackPluginModule.default || HtmlRspackPluginModule;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Rspack configuration for Vue 3 Single-File Components
 * Official integration: https://rspack.dev/guide/tech/vue
 */
export default defineConfig({
  entry: {
    index: './src/main.ts',
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.js', '.vue', '.json', '.css'],
  },

  plugins: [
    new VueLoaderPlugin(),
    new HtmlRspackPlugin({
      template: './index.html',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'rspack-vue-loader',
        options: {
          // Required for most features to work properly
          experimentalInlineMatchResource: true,
        },
      },
      {
        test: /\.css$/,
        type: 'css',
      },
      {
        test: /\.module\.css$/,
        type: 'css',
        generator: {
          localIdentName: '[local]',
        },
      },
      {
        test: /\.ts$/,
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
            },
          },
        },
        type: 'javascript/auto',
      },
    ],
  },

  experiments: {
    css: true,
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'auto',
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].js',
    cssFilename: 'css/[name].[contenthash:8].css',
    clean: true,
  },

  server: {
    port: 3000,
    strictPort: true,
    open: true,
    hot: true,
  },

  devServer: {
    historyApiFallback: true,
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
        },
      },
    },
  },

  stats: {
    preset: 'normal',
  },

  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [import.meta.url],
    },
  },
});
