const path = require('path')

module.exports = {
    entry: {
        auth: './auth/auth.js',
        rdb: './rdb/rdb.js',
        storage: './storage/storage.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    devtool: 'source-map'
}