const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ModuleDependencyWarning = require('webpack/lib/ModuleDependencyWarning')

class IgnoreNotFoundExportPlugin {
  apply(compiler) {
    const messageRegExp = /export '.*'( \(reexported as '.*'\))? was not found in/
    function doneHook(stats) {
      stats.compilation.warnings = stats.compilation.warnings.filter(warn =>
        warn instanceof ModuleDependencyWarning && messageRegExp.test(warn.message) ? false : true,
      )
    }
    compiler.hooks
      ? compiler.hooks.done.tap('IgnoreNotFoundExportPlugin', doneHook)
      : compiler.plugin('done', doneHook)
  }
}

module.exports = {
  mode: 'development',
  entry: './src/debug.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
      // {
      //   test: /\.css$/i,
      //   use: ['style-loader', 'css-loader'],
      // },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname),
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({ title: 'Development', template: 'debug.html' }),
    new IgnoreNotFoundExportPlugin(),
  ],
  devServer: {
    contentBase: __dirname,
    compress: false,
    port: 8080,
  },
}
