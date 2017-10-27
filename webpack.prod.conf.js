/*
 * 生产环境配置
 * @Author: 56 
 * @Date: 2017-10-27 10:44:17 
 * @Last Modified by: 56
 * @Last Modified time: 2017-10-27 11:45:09
 */
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
	// 输出配置
	devtool: 'source-map', // 生成单独 sourcemap

	// 使用的 loader 加载器
	module: {
		rules: [
			{
				test: /\.css$/,
				// 配置css的抽取器、加载器。
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
			},
			{
				test: /(\.sass|\.scss)$/,
				// 配置sass的抽取器 加载器
				// 从右向左提取 !可表示右边输出做左边输入
				loader: ExtractTextPlugin.extract('css-loader!sass-loader'),
			},
		],
	},

	// 插件配置
	plugins: [
		new webpack.BannerPlugin('56的代码'),
		new webpack.optimize.OccurrenceOrderPlugin(), // 为组件分配ID
		new ExtractTextPlugin('static/css/[name].[contenthash].css'), // 给每个css 单独生成对应的路径
		new OptimizeCSSPlugin({ cssProcessorOptions: { safe: true } }), // css 代码压缩
		new webpack.optimize.UglifyJsPlugin({ extract: true }), // js代码压缩
		new HtmlWebpackPlugin({
			filename: 'index.html', // 输出的html名
			template: 'index.pug', // 指定的html模板
			inject: true,
			minify: {
				removeComments: true, // 移除注释
				collapseWhitespace: true, // 删除空白
				removeAttributeQuotes: true, // 删除属性引号
			},
		}), // 生成html
	],
})
