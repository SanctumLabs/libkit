/* eslint-disable import/no-commonjs */
module.exports = {
  presets: [
    // FIXME: This should be another preset, but which ones isn't clear now.
    'module:metro-react-native-babel-preset',
    //'@babel/preset-env',
    //'@babel/preset-typescript',
    //'@babel/preset-react'
  ],
  plugins: ['babel-plugin-dev-expression', ['@babel/plugin-proposal-decorators', {legacy: true}]],
};
