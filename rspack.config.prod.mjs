import { defineConfig } from '@rspack/cli';
import baseConfig from './rspack.config.mjs';

/**
 * Production configuration for Vue 3 + Rspack
 * Extends base config with production optimizations
 */
export default defineConfig({
  ...baseConfig,
  mode: 'production',
  devtool: 'source-map',
  output: {
    ...baseConfig.output,
    publicPath: 'auto',
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
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    minimize: true,
  },
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
});
