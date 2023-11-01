const webpack = require('webpack');
const path = require('path');
const packageJson = require('./package.json');

// variables
const isProduction = process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV === 'production';
const sourcePath = path.join(__dirname, './src');
const outPath = path.join(__dirname, './build');

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  context: sourcePath,
  entry: {
    app: './index.tsx'
  },
  output: {
    path: outPath,
    filename: isProduction ? '[contenthash].js' : '[id][fullhash].js',
    chunkFilename: isProduction ? '[name].[contenthash].js' : '[name].[fullhash].js'
  },
  target: 'browserslist',
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json", ".jsx", ".less", ".css"],
    mainFields: ['module', 'browser', 'main'],
    alias: {
      app: path.resolve(__dirname, 'src/')
    }
  },
  module: {
    rules: [
      // .ts, .tsx
      {
        test: /\.tsx?$/,
        use: [
          !isProduction && {
            loader: 'babel-loader',
            options: { plugins: ['react-hot-loader/babel'] }
          },
          'ts-loader'
        ].filter(Boolean)
      },
      // css
      {
        test: /\.(less|css)$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          { loader: "css-loader" },
          { loader: "less-loader" }
        ]
      },
      // static assets
      // { test: /\.html$/, use: 'html-loader' }, // we don't need no stinkin HTML loader, this a SPA bitch!!
      { test: /\.(a?png|svg)$/, use: 'url-loader?limit=10000' },
      {
        test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2|ico)$/,
        use: 'file-loader'
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: true
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG: false
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: isProduction ? '[name].[contenthash].css' : '[name].[fullhash].css'
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: "./public/favicon.ico",
      minify: isProduction,
      scriptLoading: 'blocking',
      meta: {
        title: packageJson.name,
        description: packageJson.description,
        keywords: Array.isArray(packageJson.keywords) ? packageJson.keywords.join(',') : undefined
      }
    })
  ],
  devServer: {
    static: {
      directory: path.join(sourcePath, 'public'),
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        secure: false,
        // changeOrigin: true,
      }
     // '/api': {
     //    target: 'http://localhost:5000/api',
     //    // pathRewrite: { '^/api': '' },
     //    changeOrigin: true,
     //    // router: () => 'http://localhost:5000',
     //    secure: false,
     //    logLevel: 'debug' /*optional*/
     // }
    }
},
  devtool: isProduction ? 'hidden-source-map' : 'cheap-module-source-map'
};
