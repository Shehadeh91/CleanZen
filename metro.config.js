const { getDefaultConfig } = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

// Extend the existing assetExts to support SQLite databases
config.resolver.assetExts.push('db');

// This configuration ensures Hermes bytecode is handled correctly
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
};

module.exports = config;