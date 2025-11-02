// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable Hermes bytecode compilation (faster startup, smaller bundles)
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_classnames: true, // Required for React components
    keep_fnames: true, // Required for debugging
    mangle: {
      keep_classnames: true,
      keep_fnames: true,
    },
  },
  // Enable experimental import/export optimization
  unstable_allowRequireContext: true,
};

// Enable caching for faster rebuilds
config.cacheStores = [
  ...config.cacheStores || [],
];

// Optimize resolver for faster module resolution
config.resolver = {
  ...config.resolver,
  // Add source extensions for better resolution
  sourceExts: [...(config.resolver?.sourceExts || []), 'jsx', 'js', 'ts', 'tsx', 'json'],
};

module.exports = config;
