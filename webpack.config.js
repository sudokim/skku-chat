const path = require('path');

module.exports = {
  entry: {
    signin: './auth-test/signin.js',
    profile: './profile/profile.js',
    chats: './chats/chats.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  devtool: 'source-map',
};
