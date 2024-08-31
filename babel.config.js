module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
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