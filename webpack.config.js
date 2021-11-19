const path = require('path')

module.exports = {
    entry: {
        auth: './auth/auth.js',
        message: './message/message.js',
        storage: './storage/storage.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    devtool: 'eval-source-map'
}