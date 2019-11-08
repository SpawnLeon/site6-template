const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = (env, options) => {
  const webpackMode = options.mode;
  return {
    mode: webpackMode || 'development',
    entry: {
      "app": "./src/app.js",
    },
    devtool: webpackMode === 'production' ? 'source-map' : false,
    output: {
      filename: '[name].js',
      //path: path.resolve(__dirname, './dist')
      path: path.resolve('/mnt/share/murom-mebel.bsdev/www/local/templates/mebel/', './')
    },
    devServer: {
      overlay: true,
      //contentBase: path.join(__dirname, 'dist'),
      contentBase: path.join('/mnt/share/murom-mebel.bsdev/www/local/templates/mebel/', './'),
      compress: true,
      port: 9001,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: "css-loader",
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: "sass-loader",
              options: {
                implementation: require("sass")
              }
            }
          ]
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.(woff|woff2|ttf|otf|eot)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: 'fonts',
                name: '/[name].[ext]'
              }
            }
          ]
        },
        // {
        //   test: /\.(html)$/,
        //   use: [
        //     {
        //       loader: 'file-loader',
        //       options: {
        //         outputPath: 'html',
        //         name: '[name].[ext]'
        //       }
        //     },
        //     {
        //       loader: 'extract-loader',
        //     },
        //     {
        //       loader: 'html-loader',
        //       options: {
        //         interpolate: true,
        //         minimize: true,
        //         removeComments: true,
        //         collapseWhitespace: false
        //       }
        //     },
        //   ],
        // },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: './images',
                name: '[folder]/[name].[ext]'
              }
            }
          ]
        },

      ]
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true, // Must be set to true if using source-maps in production
          terserOptions: {
            // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
            extractComments: false,
            ecma: 8,
            mangle: {
              safari10: true
            }
          }
        }),
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "template_styles.css",
      }),
      new CopyPlugin([
        // {from: 'src/assets', to: 'assets'},
        // {from: 'src/example_images', to: 'example_images'},
        {from: 'src/images', to: 'images'}
      ]),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      }),
      new VueLoaderPlugin(),
    ],
  }
};