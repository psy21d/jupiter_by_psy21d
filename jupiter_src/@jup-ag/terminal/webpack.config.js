const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const rootDir = path.resolve(__dirname);

module.exports = {
  entry: {
    library: path.resolve(rootDir, 'src/library.tsx')
  },
  output: {
    path: path.resolve(rootDir, 'dist'),
    filename: '[name].js',
    library: {
      name: 'Jupiter',
      type: 'umd',
      export: 'default'
    },
    globalObject: 'window',  // Изменили с 'this' на 'window'
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(rootDir, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            configFile: path.resolve(__dirname, 'tsconfig.json')
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/fonts/[name][ext]'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
      protectWebpackAssets: true,
      cleanOnceBeforeBuildPatterns: ['**/*']
    })
  ],
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  mode: 'production',
  devtool: 'source-map'
};