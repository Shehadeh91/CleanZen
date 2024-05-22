module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-paper/babel',
      'react-native-reanimated/plugin',
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
      }],
    ],
    env: {
      production: {
        plugins: [
          'react-native-paper/babel',
          // Remove expo-router/babel from production plugins
          'react-native-reanimated/plugin',
          ['module:react-native-dotenv', {
            moduleName: '@env',
            path: '.env',
          }],
        ],
      },
    },
  };
};
