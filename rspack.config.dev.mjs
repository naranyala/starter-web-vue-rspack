import { defineConfig } from '@rspack/cli';
import baseConfig from './rspack.config.mjs';

/**
 * Development configuration for Vue 3 + Rspack
 * Extends base config with dev-specific settings
 */
export default defineConfig({
  ...baseConfig,
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  output: {
    ...baseConfig.output,
    publicPath: '/',
    clean: false,
    filename: '[name].js',
    chunkFilename: '[name].js',
    cssFilename: '[name].css',
  },
  optimization: {
    ...baseConfig.optimization,
    splitChunks: false,
  },
  cache: {
    type: 'memory',
  },
  stats: {
    preset: 'normal',
    timings: true,
  },
});
