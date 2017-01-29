'use strict';
// for webpack
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CleanWebpackPlugin = require("clean-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackShellPlugin = require('webpack-shell-plugin');
var CompressionPlugin = require("compression-webpack-plugin");


module.exports = {
	entry: {
		bundle: "./source/js/application.js"
	},
	output: {
		path: path.join(__dirname, 'public'),
		filename: "js/bundle-[hash].js"
	},
	resolve: {
		root: path.join(__dirname)
	},
	watch: false,
	module: {
		loaders: [
			{
				test: /\.js(x)?$/,
				exclude: [/node_modules/, /public/],
				loader: 'babel-loader',
				query: {
					presets:[ 'es2015', 'react', 'stage-2' ]
				}
			},
			{
				test: /\.css$/,
				loader: "style-loader!css-loader!autoprefixer-loader",
				exclude: [/node_modules/, /public/]
			},
			{
				test: /\.less$/,
				loader: ExtractTextPlugin.extract(
					"style-loader",
					"css-loader!autoprefixer-loader!less-loader",
					{ publicPath: '../' }
				),
				exclude: [/node_modules/, /public/]
			},
			{
				test: /\.(svg|ttf|eot|woff|woff2)$/,
				loader: 'file?name=fonts/[name].[ext]',
				exclude: [/node_modules/, /public/]
			},
			{
				test: /\.(png|jpg|gif)$/,
				loader: 'file?name=img/[name].[ext]',
				exclude: [/node_modules/, /public/]
			},
			{
				test: /\.json$/,
				loader: "json-loader",
				exclude: [/node_modules/, /public/]
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
			}
		}),


		new CompressionPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.js$|\.html$/,
			threshold: 10240,
			minRatio: 0.8
		}),

		new CleanWebpackPlugin(
			[path.join('public')], {
			root: __dirname
		}),

		new CopyWebpackPlugin([
			{ from: `./source/json/manifest.json`, to: 'manifest.json' },
			{ from: './source/img/icon/app-icon.png', to: 'img/icon/app-icon.png' },
			{ from: './source/img/icon/app-icon-96.png', to: 'img/icon/app-icon-96.png' },
			{ from: './source/img/icon/app-icon-128.png', to: 'img/icon/app-icon-128.png' },
			{ from: './source/img/icon/app-icon-144.png', to: 'img/icon/app-icon-144.png' },
			{ from: './source/img/icon/app-icon-192.png', to: 'img/icon/app-icon-192.png' },
			{ from: './source/img/icon/app-icon-256.png', to: 'img/icon/app-icon-256.png' },
			{ from: './source/img/favicon.ico', to: 'img/favicon.ico' }
		]),

		new HtmlWebpackPlugin({
			template: 'source/html/index.tpl.html',
			inject: 'body',
			filename: 'index.html'
		}),

		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			sourceMap: false,
			mangle: false,
			ascii_only: false,
			output: {
				comments: false
			},
			compressor: {
				drop_debugger: true,
				drop_console: true,
				warnings: false
			}
		}),

		new ExtractTextPlugin("./css/styles-[hash].css"),

		new WebpackShellPlugin({
			onBuildEnd:['gulp generate-service-worker']
		})
	]
}