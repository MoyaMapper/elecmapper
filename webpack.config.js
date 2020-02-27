const path = require('path')

// https://webpack.js.org/configuration/target/

module.exports = {
  target: 'electron-main',
  entry: './main.js',
  output: {
    path: path.resolve(__dirname, './build'), // webpack默认会把__dirname设置为/（根目录）
    filename: 'main.js'
  },
  node: {
    __dirname: false // 将__dirname设置为取绝对路径
  }
}